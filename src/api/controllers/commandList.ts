import { cp } from "fs";
import { commandLoader } from "../../bot/bot.js";

export default function getCommands(req: any, reply: any): void { 
    try {
        const commands = commandLoader.getAllCommand();

        console.log("comandos", commands);
        

        return reply.send({ commands });
    } catch (error) {
        console.error("Erro ao obter comandos:", error);
        return reply.status(500).send({ error: "Erro ao obter comandos." });
    }
}