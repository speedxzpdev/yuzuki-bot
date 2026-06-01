import { Telegraf, Context } from "telegraf";
import dotenv from "dotenv";
dotenv.config();
import CommandLoader from "./utils/loadComands.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface BotContext extends Context {
    session?: {
        userId: number;
    };
}


const bot = new Telegraf<BotContext>(process.env.TOKEN_BOT!);
try {
// registra comandos ANTES de lançar
(async () => {
    const commandLoader = new CommandLoader(bot);
    await commandLoader.load(path.join(__dirname, "commands"));

})();
} catch(error) {
    console.error("erro ao carregar comandos", error);
    
}



export default bot;