import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Service } from "fastify-decorators";
import { randomUUID } from "node:crypto";
import type { Readable } from "node:stream";
import { buffer } from "node:stream/consumers";
import {
  StorageProvider,
  type FileMetaData,
  type UploadFile,
} from "./storage.js";
@Service()
export class S3Storage extends StorageProvider {
  cliente = new S3Client({ region: process.env.AWS_REGION ?? "us-east-2" });
  async upload(file: UploadFile): Promise<FileMetaData> {
    const id = randomUUID();
    const fileBuffer = await buffer(file.stream as Readable);
    await this.cliente.send(
      new PutObjectCommand({
        ContentLength: fileBuffer.length,
        Bucket: process.env.AWS_BUCKET,
        Key: id,
        Body: fileBuffer,
      }),
    );

    return {
      id,
      name: file.name,
      size: file.size,
      url: `https://api-upload-multipart-matheus.s3.us-east-2.amazonaws.com/${id}`,
    };
  }

  async delete(id: string) {
    await this.cliente.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: id,
      }),
    );
  }
}
