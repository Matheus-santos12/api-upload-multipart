import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Service } from "fastify-decorators";
import { randomUUID } from "node:crypto";
import type { Readable } from "node:stream";
import {
  StorageProvider,
  type FileMetaData,
  type UploadFile,
} from "./storage.js";

@Service()
export class S3Storage extends StorageProvider {
  cliente = new S3Client({ region: process.env.AWS_REGION ?? "us-east-1" });
  async upload(file: UploadFile): Promise<FileMetaData> {
    const id = randomUUID();
    await this.cliente.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: id,
        Body: file.stream as Readable,
      }),
    );

    return { id, name: file.name, size: file.size };
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
