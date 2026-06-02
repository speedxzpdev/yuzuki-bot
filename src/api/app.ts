import fastify from "fastify";
import registerDownloadRoutes from "./routes/download.js";
import rateLimit from "@fastify/rate-limit";
import getCommands from "./controllers/commandList.js";

const app = fastify();

(async () => {
    await app.register(rateLimit, {
        max: 100,
        timeWindow: "1 minute"
    });
});

app.addHook("onSend", async (_, reply, payload) => {
    reply.header("Content-Type", "application/json; charset=utf-8");
    return JSON.stringify(JSON.parse(payload as string), null, 2);
});

app.get("/", async (request, reply) => {
    return { hello: "world" };
});

app.register(registerDownloadRoutes, {
    prefix: "/download"
});

app.get("/commands", getCommands);


export default app;