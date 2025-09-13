import { Hono } from "hono";
import {
  createApp,
  createAppInteraction,
  createCategory,
  createUserAppInteraction,
  createUserAppReward,
  deleteApp,
  getApp,
  getAppInteraction,
  getApps,
  getCategories,
  getFeaturedApps,
  isOwnApp,
  updateApp,
} from "../lib/apps";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { authMiddleware } from "../lib/auth";
import { AppBindings } from "../types";
import { db } from "@mini/db/connection";
import { adminApiMiddleware } from "./middleware/admin-api";

const appsRouter = new Hono<AppBindings>();

const appSchema = z.object({
  categoryId: z.string(),
  slug: z.string(),
  appName: z.string(),
  appLogo: z.string(),
  appUrl: z.string(),
  appDescription: z.string(),
  appBadgeLabel: z.string(),
});

const interactionSchema = z.object({
  interactionUrl: z.string(),
  verficationType: z.enum(["auto", "api", "manual", "none"]),
  rewardId: z.string(),
  appId: z.string(),
});

export const idSchema = z.object({
  id: z.uuid(),
});

const updateAppSchema = appSchema.partial().extend({
  id: z.string(),
  categoryId: z.number(),
});

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
    const app = await createApp({ ...input, userId });
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
  zValidator("json", updateAppSchema),
  authMiddleware,
  async (c) => {
    const input = c.req.valid("json");
    const { userId } = c.get("jwtPayload");
    const { id, ...updateData } = input;
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
      interactionUrl: interaction.interactionUrl,
      verficationType: interaction.verficationType,
      appId: id,
      partnerApplicationId: id,
      rewardId: interaction.rewardId,
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
  zValidator("json", interactionSchema.omit({ appId: true })),
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
     let result = null;
     if(interaction.verficationType === "none") {
       result = await db.transaction(async(tx) => {
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
       })
     }

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
