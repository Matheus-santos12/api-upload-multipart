import type { FastifyReply, FastifyRequest } from "fastify";
import { Controller, DELETE, Inject } from "fastify-decorators";
import { metaData } from "../metadata/file-metadata.js";
import { StorageProvider } from "../storage/storage.js";

@Controller("/upload")
export default class {
  @Inject(StorageProvider)
  storage!: StorageProvider;

  @DELETE("/:id")
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as {
      id: string;
    };
    const record = metaData.find((item) => item.id === id);
    if (!record)
      return reply.status(404).send({ message: "Arquivo não encontrado" });
    await this.storage.delete(id);
    reply.status(204).send();
  }
}
