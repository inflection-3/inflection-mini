import { defineConfig } from "@rcmade/hono-docs";

export default defineConfig({
  tsConfigPath: "./tsconfig.json",
  openApi: {
    openapi: "3.0.0",
    info: { 
      title: "Inflective API", 
      version: "1.0.0",
      description: "API for Inflective platform - app management, rewards, and user interactions"
    },
    servers: [{ url: "http://localhost:3000/api" }],
  },
  outputs: {
    openApiJson: "./openapi/openapi.json",
  },
  apis: [
    {
      name: "Inflective API",
      apiPrefix: "/",
      appTypePath: "api/index.ts",
      api: [
        // Home routes
        { api: "/", method: "get", tag: ["Home"] },
        { api: "/test", method: "get", tag: ["Home"] },
        
        // Authentication routes
        { api: "/auth/login", method: "post", tag: ["Authentication"] },
        { api: "/auth/refresh-token", method: "post", tag: ["Authentication"] },
        
        // Apps routes
        { api: "/apps", method: "get", tag: ["Apps"] },
        { api: "/apps/featured", method: "get", tag: ["Apps"] },
        { api: "/apps", method: "post", tag: ["Apps"] },
        { api: "/apps/:id", method: "get", tag: ["Apps"] },
        { api: "/apps/:id", method: "put", tag: ["Apps"] },
        { api: "/apps/:id", method: "delete", tag: ["Apps"] },
        { api: "/apps/:id/interactions", method: "post", tag: ["App Interactions"] },
        { api: "/apps/interactions/:id", method: "put", tag: ["App Interactions"] },
        { api: "/apps/interactions/:id/submit", method: "post", tag: ["App Interactions"] },
        
        // Reward routes
        { api: "/reward/:id", method: "get", tag: ["Rewards"] },
        { api: "/reward", method: "post", tag: ["Rewards"] },
        
        // User routes
        { api: "/user/me", method: "get", tag: ["User Profile"] },
        { api: "/user/me", method: "put", tag: ["User Profile"] },
        { api: "/user/me/notification-token", method: "post", tag: ["User Notifications"] },
        { api: "/user/me/notifications", method: "get", tag: ["User Notifications"] },
        { api: "/user/:id/rewards", method: "get", tag: ["User Data"] },
        { api: "/user/:id/apps", method: "get", tag: ["User Data"] },
        { api: "/user/:id/transactions", method: "get", tag: ["User Data"] },
      ],
    },
  ],
});