import { Redis } from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redisUri = process.env.REDIS_URI;

if (!redisUri) {
throw new Error("REDIS_URI não está definido nas variáveis de ambiente.");
}

const redis = new Redis(redisUri, {
    maxRetriesPerRequest: 1,
    tls: {
        rejectUnauthorized: false,
    }
});

redis.on("connect", () => {
    console.log("Conectado ao Redis com sucesso!");
});

redis.on("error", (err) => {
    console.error("Erro na conexão com o Redis:", err);
});

export default redis;