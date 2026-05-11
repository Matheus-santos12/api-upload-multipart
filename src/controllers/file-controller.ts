import type { FastifyReply, FastifyRequest } from "fastify";
import { Controller, DELETE, Inject, POST } from "fastify-decorators";
import type { FileMetaData } from "../storage/storage.js";
import { StorageProvider } from "../storage/storage.js";

@Controller("/upload")
export default class FileController {
  @Inject(StorageProvider)
  storage!: StorageProvider;

  metaData: FileMetaData[] = [];

  @POST("/")
  async upload(request: FastifyRequest, reply: FastifyReply) {
    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ message: "Nenhum arquivo foi enviado" });
    }
    const file = { name: data.filename, size: 0, stream: data.file };
    const result = await this.storage.upload(file);
    this.metaData.push(result);
    reply.status(201).send(result);
  }

  @DELETE("/:id")
  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as {
      id: string;
    };
    const record = this.metaData.find((item) => item.id === id);
    if (!record)
      return reply.status(404).send({ message: "Arquivo não encontrado" });
    await this.storage.delete(id);
    reply.status(204).send();
  }
}
