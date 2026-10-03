import { bot, commandLoader } from '../bot.js';


function commandHandler(): void {
bot.on("message", async (ctx) => {
    const message = ctx.message;

    const content =
        "text" in message
        ? message.text
        : "caption" in message
        ? message.caption
        : undefined; 

    if (!content) return;
    
    if(content.startsWith("/")) {
        const commandName = content.replaceAll("/", "");

        const command = commandLoader.getCommands(commandName);

        if(!command) {
            ctx.reply("Não encontrei esse comando!")
            return
        }

        command.run(ctx)
    }
});

}

export default commandHandler;