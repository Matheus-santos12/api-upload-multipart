import type { FastifyReply, FastifyRequest } from "fastify";
import { Controller, Inject, POST } from "fastify-decorators";
import { metaData } from "../metadata/file-metadata.js";
import { StorageProvider } from "../storage/storage.js";

@Controller("/upload")
export default class {
  @Inject(StorageProvider)
  storage!: StorageProvider;

  @POST("/")
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ message: "Nenhum arquivo foi enviado" });
    }
    const file = {
      name: data.filename,
      size: data.file.readableLength ?? 0,
      stream: data.file,
    };
    const result = await this.storage.upload(file);
    metaData.push(result);
    reply.status(201).send(result);
  }
}
