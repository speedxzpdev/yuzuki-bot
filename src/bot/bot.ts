import { Telegraf, Context } from "telegraf";
import dotenv from "dotenv";
dotenv.config();
import CommandLoader from "./utils/loadComands.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import commandHandler from "./handlers/commands.js";

interface BotContext extends Context {
    session?: {
        userId: number;
    };
}
let bot: Telegraf<BotContext>;
let commandLoader: CommandLoader;

async function mainBot() {

bot = new Telegraf<BotContext>(process.env.TOKEN_BOT!);
commandLoader: CommandLoader;
// registra comandos ANTES de lançar

    commandLoader = new CommandLoader(bot);
    await commandLoader.load(path.join(__dirname, "commands"));
    await commandLoader.registerCommands();



//registra handlers
commandHandler();

}



export { bot, commandLoader, mainBot };