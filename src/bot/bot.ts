import { Telegraf, Context } from "telegraf";
import dotenv from "dotenv";
dotenv.config();
import commandTiktok from "../bot/commands/tiktok.js";
import commandStart from "../bot/commands/start.js";



interface BotContext extends Context {
    session?: {
        userId: number;
    };
}


const bot = new Telegraf<BotContext>(process.env.TOKEN_BOT!);
try {
// registra comandos ANTES de lançar
commandTiktok(bot);
commandStart(bot)


    console.log("comandos carregados!");
} catch(error) {
    console.error("erro ao carregar comandos", error);
    
}



export default bot;