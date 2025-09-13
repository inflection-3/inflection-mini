import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { uuid } from "zod";

const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${Bun.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
    },
  })


  export const uploadFile = async (file: File, metadata: Record<string, string>) => {
    const key = crypto.randomUUID() + "-" + file.name
    const publicUrl = "https://storage.inflection.network/" + key
    const command = new PutObjectCommand({
      Bucket: Bun.env.R2_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: file.type,
      Metadata: metadata,
      ACL: "public-read"
    })
    const response = await s3.send(command)
    return {
        publicUrl,
        key,
        response
    } 
  }