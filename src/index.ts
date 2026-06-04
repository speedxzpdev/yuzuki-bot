import app from "./api/app.js";
import dotenv from "dotenv";
dotenv.config();
import { bot } from "./bot/bot.js";
import redis from "@redis"
import { sql } from "./services/postgres.js";


async function main() {
    console.log("inicializando api...");

    redis.on("ready", () => {
        console.log("Redis pronto para uso!");
    });

    try {
        await app.listen({ port: parseInt(process.env.PORT || "3000"), host: '0.0.0.0'});
        console.log(`api rodando em http://localhost:${process.env.PORT || "3000"}`);
    } catch (error) {
        console.error("erro ao iniciar api.", error);
        process.exit(1)
    }

    try {
        console.log("iniciando bot...");
        bot.launch();
        console.log("bot rodando!");
    } catch(err) {
        console.error(err);
        process.exit(1)
        
    }
    

}

main();