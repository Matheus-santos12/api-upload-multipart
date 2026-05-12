import multipart from "@fastify/multipart";
import "dotenv/config";
import Fastify from "fastify";
import { bootstrap } from "fastify-decorators";
import FileController from "./controllers/file-controller.js";
import { registerDependencies } from "./di-registry.js";

registerDependencies();

const app = Fastify({
  logger: true,
});

app.get("/", function (request, reply) {
  reply.send({ status: "O servidor esta funcionando" });
});

app.register(multipart);
app.register(bootstrap, { controllers: [FileController] });

await app.listen({ port: 3333 });
