import fastify from "fastify";
import registerDownloadRoutes from "./routes/download.js";
import rateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import getCommands from "./controllers/commandList.js";
import path from "node:path";

const app = fastify();

(async () => {
    await app.register(rateLimit, {
        max: 100,
        timeWindow: "1 minute"
    });
});

app.addHook("onSend", async (_, reply, payload) => {
    const contentType = String(reply.getHeader("content-type") || "");

    if (!contentType.includes("application/json") || typeof payload !== "string") {
        return payload;
    }

    try {
        return JSON.stringify(JSON.parse(payload), null, 2);
    } catch {
        return payload;
    }
});

app.register(fastifyStatic, {
    root: path.join(process.cwd(), "frontend", "dist"),
    prefix: "/"
});

const healthCheck = async () => {
    return { hello: "world" };
};

app.register(registerDownloadRoutes, {
    prefix: "/download"
});

app.get("/commands", getCommands);
app.get("/api", healthCheck);
app.get("/api/commands", getCommands);

app.register(registerDownloadRoutes, {
    prefix: "/api/download"
});

app.setNotFoundHandler((request, reply) => {
    if (request.url.startsWith("/api/")) {
        return reply.status(404).send({ error: "Rota da API nao encontrada." });
    }

    if (request.method === "GET" && request.headers.accept?.includes("text/html")) {
        return reply.sendFile("index.html");
    }

    return reply.status(404).send({ error: "Rota nao encontrada." });
});


export default app;
