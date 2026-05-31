import { Telegraf, Markup, Input } from "telegraf";
import path from "path";

function registerStart(bot: Telegraf) {
    bot.start(async (ctx) => {
    try {
        const text: string = `💙​ Olá ${ctx.from.first_name}! Me chamo Yuzuki, e consigo baixar videos pra você. Basta usar o nome do comando junto do link, EX: */tiktok https://www.tiktok.com/xxx*`

        const buttons = Markup.inlineKeyboard([
            Markup.button.url("😾Github", "https://github.com/speedxzpdev/yuzuki-bot"),
        ]);

        const imagePath = path.join(process.cwd(), "/src/assets/img/start.jpg")

        await ctx.replyWithPhoto(Input.fromLocalFile(imagePath), {
            parse_mode: "Markdown",
            caption: text,
            ...buttons
        })
    } catch (error) {
        console.error(error);
        
    }
    
});
    
}

export default registerStart;