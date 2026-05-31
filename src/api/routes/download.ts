import type { FastifyInstance } from "fastify";
import tiktokController from "../controllers/tiktok/tiktok.js";
import rateLimit from "@fastify/rate-limit";

function registerDownloadRoutes(app: FastifyInstance) {
    app.post("/tiktok", {
        config: {
            rateLimit: {
                max: 20,
                timeWindow: "1 minute"
            }
        },
    }, tiktokController);
}

export default registerDownloadRoutes;