import { bot } from '../bot.js';
import redis from "@redis"


function commandHandler(): void {
bot.on("text", async (ctx) => {
    const text: string = ctx.message.text;

    if (text.startsWith("/")) {
    }
});

}

export default commandHandler;