import { Service } from "fastify-decorators";
import { randomUUID } from "node:crypto";
import fs, { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import {
  StorageProvider,
  type FileMetaData,
  type UploadFile,
} from "./storage.js";

@Service()
export class LocalStorage extends StorageProvider {
  async upload(file: UploadFile): Promise<FileMetaData> {
    const id = randomUUID();
    await pipeline(file.stream, createWriteStream(`./uploads/${id}`));

    return { id, name: file.name, size: file.size };
  }
  async delete(id: string): Promise<void> {
    const filePath = `./uploads/${id}`;
    await fs.promises.unlink(filePath);
  }
}
