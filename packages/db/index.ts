import { z } from "zod";
import "dotenv/config";

const DATABASE_URL = Bun.env.DATABASE_URL;




console.log("Environment variables loaded:", { DATABASE_URL });

export { DATABASE_URL };
