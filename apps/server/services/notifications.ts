import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging, Message, MulticastMessage } from 'firebase-admin/messaging';
import { db } from '@mini/db/connection';
import { notification, notificationToken } from '@mini/db/schema';
import { eq } from 'drizzle-orm';

export interface CreateNotificationData {
  userId: number;
  title: string;
  message: string;
  data?: Record<string, any>;
}

export interface SendNotificationData {
  userId: number;
  title: string;
  message: string;
  data?: Record<string, any>;
  imageUrl?: string;
  clickAction?: string;
}

export interface NotificationPayload {
  notification: {
    title: string;
    body: string;
    imageUrl?: string;
    clickAction?: string;
  };
  data?: Record<string, string>;
}

class NotificationService {
  private messaging;

  constructor() {
    if (getApps().length === 0) {
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };

      if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
        initializeApp({
          credential: cert(serviceAccount),
        });
      } else {
        console.warn('Firebase credentials not found. Notifications will not work.');
      }
    }

    this.messaging = getMessaging();
  }

  /**
   * Create a notification in the database
   */
  async createNotification(data: CreateNotificationData) {
    try {
      const [newNotification] = await db
        .insert(notification)
        .values({
          userId: data.userId,
          title: data.title,
          message: data.message,
        })
        .returning();

      return newNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  }

  /**
   * Store a user's FCM token
   */
  async storeNotificationToken(userId: number, token: string) {
    try {
      // Check if token already exists for this user
      const existingToken = await db
        .select()
        .from(notificationToken)
        .where(eq(notificationToken.userId, userId))
        .limit(1);

      if (existingToken.length > 0) {
        // Update existing token
        const [updatedToken] = await db
          .update(notificationToken)
          .set({ token, updatedAt: new Date() })
          .where(eq(notificationToken.userId, userId))
          .returning();
        return updatedToken;
      } else {
        // Insert new token
        const [newToken] = await db
          .insert(notificationToken)
          .values({
            userId,
            token,
          })
          .returning();
        return newToken;
      }
    } catch (error) {
      console.error('Error storing notification token:', error);
      throw new Error('Failed to store notification token');
    }
  }

  /**
   * Remove a user's FCM token
   */
  async removeNotificationToken(userId: number) {
    try {
      await db
        .delete(notificationToken)
        .where(eq(notificationToken.userId, userId));
      
      return true;
    } catch (error) {
      console.error('Error removing notification token:', error);
      throw new Error('Failed to remove notification token');
    }
  }

  /**
   * Send a push notification to a specific user
   */
  async sendNotificationToUser(data: SendNotificationData) {
    try {
      // Get user's FCM token
      const userToken = await db
        .select()
        .from(notificationToken)
        .where(eq(notificationToken.userId, data.userId))
        .limit(1);

      if (userToken.length === 0) {
        throw new Error('User has no notification token registered');
      }

      const token = userToken[0]?.token;
      if (!token) {
        throw new Error('User has no valid notification token');
      }

      // Create notification payload
      const message: Message = {
        token,
        notification: {
          title: data.title,
          body: data.message,
          imageUrl: data.imageUrl,
        },
        data: data.data ? 
          Object.fromEntries(
            Object.entries(data.data).map(([key, value]) => [key, String(value)])
          ) : undefined,
        webpush: {
          notification: {
            clickAction: data.clickAction,
          },
        },
      };

      // Send push notification via Firebase
      const result = await this.messaging.send(message);

      // Create notification record in database
      await this.createNotification({
        userId: data.userId,
        title: data.title,
        message: data.message,
        data: data.data,
      });

      return result;
    } catch (error) {
      console.error('Error sending notification to user:', error);
      throw new Error('Failed to send notification');
    }
  }

  /**
   * Send push notification to multiple users
   */
  async sendNotificationToUsers(userIds: number[], data: Omit<SendNotificationData, 'userId'>) {
    try {
      if (userIds.length === 0) {
        return [];
      }

      if (userIds.length === 1) {
        // Single user - use the individual method
        return await this.sendNotificationToUser({
          userId: userIds[0]!,
          ...data,
        });
      }

      // For multiple users, handle them individually
      const results = [];
      
      for (const userId of userIds) {
        try {
          const result = await this.sendNotificationToUser({
            userId,
            ...data,
          });
          results.push({ userId, success: true, result });
        } catch (error) {
          console.error(`Failed to send notification to user ${userId}:`, error);
          results.push({ userId, success: false, error: (error as Error).message });
        }
      }

      return results;
    } catch (error) {
      console.error('Error sending notifications to users:', error);
      throw new Error('Failed to send notifications to users');
    }
  }

  /**
   * Send push notification to all users
   */
  async sendNotificationToAllUsers(data: Omit<SendNotificationData, 'userId'>) {
    try {
      // Get all users with notification tokens
      const userTokens = await db
        .select({ userId: notificationToken.userId })
        .from(notificationToken);

      const userIds = userTokens
        .map((ut) => ut.userId)
        .filter((id): id is number => id !== null);
      
      return await this.sendNotificationToUsers(userIds, data);
    } catch (error) {
      console.error('Error sending notification to all users:', error);
      throw new Error('Failed to send notification to all users');
    }
  }

  /**
   * Get user's notification history
   */
  async getUserNotifications(userId: number, limit: number = 50, offset: number = 0) {
    try {
      const notifications = await db
        .select()
        .from(notification)
        .where(eq(notification.userId, userId))
        .orderBy(notification.createdAt)
        .limit(limit)
        .offset(offset);

      return notifications;
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw new Error('Failed to get user notifications');
    }
  }

  /**
   * Delete old notifications (cleanup)
   */
  async deleteOldNotifications(daysOld: number = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const deletedNotifications = await db
        .delete(notification)
        .where(eq(notification.createdAt, cutoffDate))
        .returning();

      return deletedNotifications;
    } catch (error) {
      console.error('Error deleting old notifications:', error);
      throw new Error('Failed to delete old notifications');
    }
  }
}

export const notificationService = new NotificationService();
