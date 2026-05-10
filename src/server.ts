import multipart from "@fastify/multipart";
import Fastify from "fastify";
import { fileRoutes } from "./routes/file-routes.js";

const app = Fastify({
  logger: true,
});

app.get("/", function (request, reply) {
  reply.send({ status: "O servidor esta funcionando" });
});

app.register(multipart);

await app.register(fileRoutes);
await app.listen({ port: 3333 });
