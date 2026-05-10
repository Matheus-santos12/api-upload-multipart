import type { FastifyInstance } from "fastify";
import { LocalStorage } from "../storage/local-storage.js";
import type { FileMetaData } from "../storage/storage.js";

const metaData: FileMetaData[] = [];
const storage = new LocalStorage();

export async function fileRoutes(app: FastifyInstance) {
  app.post("/upload", async (request, reply) => {
    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ message: "Nenhum arquivo foi enviado" });
    }
    const file = { name: data.filename, size: 0, stream: data.file };
    const result = await storage.upload(file);
    metaData.push(result);
    reply.status(201).send(result);
  });

  app.delete("/upload/:id", async (request, reply) => {
    const { id } = request.params as {
      id: string;
    };
    const record = metaData.find((item) => item.id === id);
    if (!record)
      return reply.status(404).send({ message: "Arquivo não encontrado" });
    await storage.delete(id);
    reply.status(204).send();
  });
}
