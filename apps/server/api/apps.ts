import { Hono } from "hono";
import {
  createApp,
  createAppInteraction,
  createCategory,
  createUserAppInteraction,
  createUserAppReward,
  deleteApp,
  deleteAppInteraction,
  getApp,
  getAppInteraction,
  getApps,
  getCategories,
  getCategory,
  getFeaturedApps,
  isOwnApp,
  isSubmited,
  updateApp,
  updateAppInteraction,
} from "../lib/apps";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { authMiddleware, protectedMiddleware } from "../lib/auth";
import { AppBindings } from "../types";
import { db } from "@mini/db/connection";
import { adminApiMiddleware } from "./middleware/admin-api";

const appsRouter = new Hono<AppBindings>();

const appSchema = z.object({
  categoryId: z.string(),
  slug: z.string(),
  appName: z.string(),
  appLogo: z.string().optional(),
  appUrl: z.string(),
  bannerImage: z.string().optional(),
  appDescription: z.string(),
  appBadgeLabel: z.string(),
});

const interactionSchema = z.object({
  actionTitle: z.string().nullable(),
  title: z.string(),
  description: z.string(),
  interactionUrl: z.string(),
  verificationType: z.enum(["api", "manual", "none"]),
  rewardId: z.string(),
});

export const idSchema = z.object({
  id: z.uuid(),
});

const updateAppSchema = appSchema.partial();

const createCategorySchema = z.object({
  name: z.string().min(1),
});

appsRouter.get("/", async (c) => {
  const apps = await getApps();
  return c.json({
    message: "Apps fetched successfully",
    data: apps,
    success: true,
  });
});

appsRouter.get("/featured", async (c) => {
  const apps = await getFeaturedApps();
  return c.json({
    message: "Featured apps fetched successfully",
    data: apps,
    success: true,
  });
});

appsRouter.post(
  "/",
  zValidator("json", appSchema),
  authMiddleware,
  async (c) => {
    const input = c.req.valid("json");
    const { userId } = c.get("jwtPayload");
    const category = await getCategory(input.categoryId);
    if (!category) {
      return c.json(
        { message: "Category not found", data: null, success: false },
        404
      );
    }
    const app = await createApp({ ...input, userId, appLogo: input.appLogo ?? "", bannerImage: input.bannerImage ?? "", categoryName:category.name });
    if (!app) {
      return c.json(
        { message: "Failed to create app", data: null, success: false },
        500
      );
    }
    return c.json({
      message: "App Created Successfully",
      data: {
        ...app,
      },
      success: true,
    });
  }
);

appsRouter.put(
  "/:id",
  zValidator("param", idSchema),
  zValidator("json", updateAppSchema),
  authMiddleware,
  async (c) => {
    const { id } = c.req.valid("param");
    const updateData = c.req.valid("json");
    const { userId } = c.get("jwtPayload");
    const app = await getApp(id);
    if (!app) {
      return c.json(
        { message: "App not found", data: null, success: false },
        404
      );
    }
    const ownApp = await isOwnApp(id, userId);
    if (!ownApp) {
      return c.json(
        {
          message: "You are not authorized to update this app",
          data: null,
          success: false,
        },
        403
      );
    }
    const filteredData = Object.fromEntries(
      Object.entries({ ...updateData, userId }).filter(
        ([_, value]) => value != null
      )
    );
    const updatedApp = await updateApp(id, filteredData);
    if (!app) {
      return c.json(
        { message: "Failed to update app", data: null, success: false },
        500
      );
    }
    return c.json({
      data: updatedApp,
      message: "App updated successfully",
      success: true,
    });
  }
);

appsRouter.delete(
  "/:id",
  zValidator("param", idSchema),
  authMiddleware,
  async (c) => {
    const { userId } = c.get("jwtPayload");
    const { id } = c.req.valid("param");
    const app = await getApp(id);
    if (!app) {
      return c.json(
        { message: "App not found", data: null, success: false },
        404
      );
    }
    const ownApp = await isOwnApp(id, userId);
    if (!ownApp) {
      return c.json(
        {
          message: "You are not authorized to delete this app",
          data: null,
          success: false,
        },
        403
      );
    }
    const deletedApp = await deleteApp(id);
    if (!deletedApp) {
      return c.json(
        { message: "Failed to delete app", data: null, success: false },
        500
      );
    }
    return c.json({
      message: "App deleted successfully",
      data: deletedApp,
      success: true,
    });
  }
);

appsRouter.post(
  "/:id/interactions",
  zValidator("json", interactionSchema),
  zValidator("param", idSchema),
  authMiddleware,
  async (c) => {
    const { userId } = c.get("jwtPayload");
    const { id } = c.req.valid("param");
    const owner = await isOwnApp(id, userId);
    if (!owner) {
      return c.json(
        {
          message:
            "You are not authorized to create an interaction for this app",
          data: null,
          success: false,
        },
        403
      );
    }
    const interaction = c.req.valid("json");
    const newInteraction = await createAppInteraction({
      title: interaction.title,
      description: interaction.description,
      interactionUrl: interaction.interactionUrl,
      verficationType: interaction.verificationType,
      appId: id,
      partnerApplicationId: id,
      rewardId: interaction.rewardId,
      actionTitle: interaction.actionTitle,
    });
    if (!newInteraction) {
      return c.json(
        { message: "Failed to create interaction", data: null, success: false },
        500
      );
    }
    return c.json({
      message: "Interaction created successfully",
      data: newInteraction,
      success: true,
    });
  }
);

appsRouter.put(
  "/interactions/:id",
  zValidator("json", interactionSchema.partial()),
  zValidator("param", idSchema),
  authMiddleware,
  async (c) => {
    const { userId } = c.get("jwtPayload");
    const { id } = c.req.valid("param");
    const updateData = c.req.valid("json");
    
    const interaction = await getAppInteraction(id);
    if (!interaction) {
      return c.json(
        { message: "Interaction not found", data: null, success: false },
        404
      );
    }
    
    const owner = await isOwnApp(interaction.appId!, userId);
    if (!owner) {
      return c.json(
        {
          message:
            "You are not authorized to update an interaction for this app",
          data: null,
          success: false,
        },
        403
      );
    }

    // Filter out null/undefined values and ensure required fields
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value != null)
    );

    const updatedInteraction = await updateAppInteraction(id, filteredData as any);
    if (!updatedInteraction) {
      return c.json(
        { message: "Failed to update interaction", data: null, success: false },
        500
      );
    }

    return c.json({
      message: "Interaction updated successfully",
      data: updatedInteraction,
      success: true,
    });
  }
);

appsRouter.post(
  "/interactions/:id/submit",
  zValidator("param", idSchema),
  authMiddleware,
  async (c) => {
    const { userId } = c.get("jwtPayload");
    const { id } = c.req.valid("param");
    const interaction = await getAppInteraction(id);
    if (!interaction) {
      return c.json(
        { message: "Interaction not found", data: null, success: false },
        404
      );
    }
       const result = await db.transaction(async(tx) => {
         const userInteraction = await createUserAppInteraction({
           userId: userId,
           interactionId: interaction.id,
         }, tx);

         const reward = await createUserAppReward({
           userId: userId,
           partnerApplicationId: interaction.appId,
           rewardId: interaction.rewardId,
         }, tx);

         return {
           userInteraction,
           reward,
         }
     });

    return c.json({ message: "Interaction submitted successfully", data: result, success: true });
  }
);

appsRouter.post("/categories", zValidator("json", createCategorySchema), authMiddleware, adminApiMiddleware, async (c) => {
  const input = c.req.valid("json");
  const categories = await createCategory(input);
  return c.json({
    success: true,
    message: "Categories fetched successfully",
    data: categories,
  });
});

appsRouter.get("/categories", async (c) => {
  const categories = await getCategories();
  return c.json({
    success: true,
    message: "Categories fetched successfully",
    data: categories,
  });
});


appsRouter.get("interactions/:id/submited", zValidator("param", idSchema),protectedMiddleware, async (c) => {
  const { id: interactionId } = c.req.valid("param");
  const {id} = c.get("user")
  const submited = await isSubmited(interactionId, id);
  return c.json({
    success: true,
    message: "Interaction submited successfully",
    data: submited ? true : false,
  });
  
});


appsRouter.get("interactions/submited", async (c) => {
  const submited = await db.query.userAppInteraction.findMany() 
  return c.json({
    success: true,
    message: "Interaction submited successfully",
    data: submited,
  });
});


appsRouter.delete("interactions/:id", zValidator("param", idSchema), protectedMiddleware, adminApiMiddleware, async (c) => {
  const user = c.get("user");
  const { id } = c.req.valid("param");
  const interaction = await getAppInteraction(id);
  if (!interaction) {
    return c.json(
      { message: "Interaction not found", data: null, success: false },
      404
    );
  }
  const owner = await isOwnApp(interaction.appId!, user.id);
  if (!owner) {
    return c.json(
      { message: "You are not authorized to delete this interaction", data: null, success: false },
      403
    );
  }
  const deletedInteraction = await deleteAppInteraction(id)
  return c.json({
    data: deletedInteraction,
    success: true,
    message: "Interaction deleted successfully",
  });
});


appsRouter.get("/:id", zValidator("param", idSchema), async (c) => {
  const { id } = c.req.valid("param");
  const app = await getApp(id);
  if (!app) {
    return c.json(
      { message: "App not found", data: null, success: false },
      404
    );
  }
  return c.json({
    message: "App fetched successfully",
    data: app,
    success: true,
  });
});







export type AppType = typeof appsRouter;

export default appsRouter;
