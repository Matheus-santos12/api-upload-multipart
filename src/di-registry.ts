import { injectablesHolder } from "fastify-decorators";
import { LocalStorage } from "./storage/local-storage.js";
import { S3Storage } from "./storage/s3-storage.js";
import { StorageProvider } from "./storage/storage.js";

export function registerDependencies(): void {
  if (process.env.STORAGE === "s3") {
    injectablesHolder.injectService(StorageProvider, S3Storage);
  } else {
    injectablesHolder.injectService(StorageProvider, LocalStorage);
  }
}
