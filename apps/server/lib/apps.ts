import { partnerApplications, partnerInteraction, reward, userAppInteraction, userAppReward } from "@mini/db/schema"
import { eq, db, Tx } from "@mini/db/connection"

export const getApps = async (tx?: Tx) => {
  const executer = tx ? tx : db
  const apps = await executer.select().from(partnerApplications)
  return apps
}


export const getFeaturedApps = async (tx?: Tx) => {
  const executer = tx ? tx : db
  const apps = await executer.select().from(partnerApplications).where(eq(partnerApplications.categoryName, 'Featured'))
  return apps
}

export const getApp = async (id: string, tx?: Tx) => {
  const executer = tx ? tx : db
  const app = await executer.query.partnerApplications.findFirst({
    where: eq(partnerApplications.id, id),
    with: {
     interactions: true,
    }
  })
  return app
}

export const createApp = async (app: typeof partnerApplications.$inferInsert, tx?: Tx) => {
  const executer = tx ? tx : db
  const [newApp] = await executer.insert(partnerApplications).values(app).returning()
  return newApp
}

export const updateApp = async (id: string, app: Partial<typeof partnerApplications.$inferInsert>, tx?: Tx) => {
  const executer = tx ? tx : db
  const filteredApp = Object.fromEntries(
    Object.entries(app).filter(([_, value]) => value != null)
  );
  const updatedApp = await executer.update(partnerApplications).set(filteredApp).where(eq(partnerApplications.id, id))
  return updatedApp
}

export const isOwnApp = async (id: string, userId: string, tx?: Tx) => {
  const executer = tx ? tx : db
  const app = await executer.select().from(partnerApplications).where(eq(partnerApplications.id, id))
  if(!app[0]) {
    return false
  }
  return app[0].userId === userId
}

export const deleteApp = async (id: string, tx?: Tx) => {
  const executer = tx ? tx : db
  const deletedApp = await executer.delete(partnerApplications).where(eq(partnerApplications.id, id))
  return deletedApp
}

export const getAppInteractions = async (id: string, tx?: Tx) => {
  const executer = tx ? tx : db
  const interactions = await executer.select().from(partnerInteraction).where(eq(partnerInteraction.partnerApplicationId, id))
  return interactions
}


export const getAppInteraction = async (id: string, tx?: Tx) => {
  const executer = tx ? tx : db
  const interaction = await executer.query.partnerInteraction.findFirst({
    where: eq(partnerInteraction.id, id),
    with: {
      partnerApplication: true
    }
  })
  return interaction
}

export const createAppInteraction = async (interaction: typeof partnerInteraction.$inferInsert, tx?: Tx) => {
  const executer = tx ? tx : db
  const   [newInteraction] = await executer.insert(partnerInteraction).values(interaction).returning()
  return newInteraction
}

export const updateAppInteraction = async (id: string, interaction: typeof partnerInteraction.$inferInsert, tx?: Tx) => {
  const executer = tx ? tx : db
  const updatedInteraction = await executer.update(partnerInteraction).set(interaction).where(eq(partnerInteraction.id, id))
  return updatedInteraction
}

export const deleteAppInteraction = async (id: string, tx?: Tx) => {
  const executer = tx ? tx : db
 const deletedInteraction = await executer.delete(partnerInteraction).where(eq(partnerInteraction.id, id))
  return deletedInteraction
}

export const getUserAppInteraction = async (userId: string, tx?: Tx) => {
  const executer = tx ? tx : db
  const interactions = await executer.select().from(userAppInteraction).where(eq(userAppInteraction.userId, userId))
  return interactions
}

export const createUserAppInteraction = async (interaction: typeof userAppInteraction.$inferInsert, tx?: Tx) => {
  const executer = tx ? tx : db
  const [newInteraction] = await executer.insert(userAppInteraction).values(interaction).returning()
  return newInteraction
}


export const createAppReward = async (input: typeof reward.$inferInsert, tx?: Tx) => {
  const executer = tx ? tx : db
  const [newReward] = await executer.insert(reward).values(input).returning()
  return newReward
}


export const createUserAppReward = async (input: typeof userAppReward.$inferInsert, tx?: Tx) => {
  const executer = tx ? tx : db
  const [newUserAppReward] = await executer.insert(userAppReward).values(input).returning()
  return newUserAppReward
}

export const getReward = async (id: string, tx?: Tx) => {
  const executer = tx ? tx : db
  const result = await executer.query.reward.findFirst({
    where: eq(reward.id, id),
  })
  return result
}