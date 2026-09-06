import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisUri = process.env.REDIS_URI;

if (!redisUri) {
    throw new Error("REDIS_URI não está definido nas variáveis de ambiente.");
}

const redis = new Redis(redisUri);

redis.on("connect", () => {
    console.log("Redis: CONNECT");
});

redis.on("ready", () => {
    console.log("Redis: READY");
});

redis.on("close", () => {
    console.log("Redis: CLOSE");
});

redis.on("reconnecting", () => {
    console.log("Redis: RECONNECTING");
});

redis.on("error", (err) => {
    console.error("Redis: ERROR", err);
});

export default redis;