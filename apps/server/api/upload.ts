import { Hono } from "hono";
import { AppBindings } from "../types";
import z from "zod";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../lib/auth";
import { uploadFile } from "../services/s3";
import { db } from "@mini/db/connection";
import { isOwnApp } from "../lib/apps";

const upload = new Hono<AppBindings>();

const uploadSchema = z.object({
    rsourceType: z.enum(['appbanner', 'applogo', "userprofile", "userbanner"]),
    resourceId: z.string(),
    file: z.instanceof(File).refine(
      (file) => file.size <= 10 * 1024 * 1024, // 10MB max size
      { message: 'File size must be less than 10MB' }
    ).refine(
      (file) => ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type),
      { message: 'Only JPEG, PNG, and PDF files are allowed' }
    ),
  })

upload.post("/user",   zValidator('form', uploadSchema), authMiddleware, async (c) => {
    const { file } = c.req.valid('form')
    const {id} = c.get('user')
    const isTHisUser = await db.query.users.findFirst({
        where: (users, {eq}) => eq(users.id, id)    })
    if (!isTHisUser) {
        return c.json({ success: false, data: null, messaging: 'User not found' }, 404)
    }
    const metadata: Record<string, string> = {
        fileName: file.name,
        fileSize: file.size.toString(),
        contentType: file.type,
      }
    const { publicUrl, key, response } = await uploadFile(file, metadata);
    return c.json({ publicUrl, key, response });
});


upload.post("/apps",   zValidator('form', uploadSchema), authMiddleware, async (c) => {
    const { file, resourceId } = c.req.valid('form')
    const {id} = c.get('user')
    c
    const isOwner = isOwnApp(resourceId, id)
    if (!isOwner) {
        return c.json({ success: false, data: null, messaging: 'You are not the owner of this app' }, 403)
    }
    const metadata: Record<string, string> = {
        fileName: file.name,
        fileSize: file.size.toString(),
        contentType: file.type,
      }
    const { publicUrl, key, response } = await uploadFile(file, metadata);
    return c.json({ publicUrl, key, response });
});



export default upload;