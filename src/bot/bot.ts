import { Telegraf, Context } from "telegraf";
import commandTiktok from "../bot/commands/tiktok.js";



interface BotContext extends Context {
    session?: {
        userId: number;
    };
}


const bot = new Telegraf<BotContext>(process.env.TOKEN_BOT!);
try {
// registra comandos ANTES de lançar
commandTiktok(bot);
bot.start(async (ctx) => {
    try {
        await ctx.reply("Oi!");
    } catch (error) {
        console.error(error);
        
    }
    
});

    console.log("comandos carregados!");
} catch(error) {
    console.error("erro ao carregar comandos", error);
    
}



export default bot;