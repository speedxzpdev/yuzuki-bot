import fs from "fs/promises";
import path from "path"
import bot from "../bot.js";
import type Command from "../interfaces/command.js";
import Telegram, { Telegraf } from "telegraf";


class CommandLoadder {
    private commands = new Map<string, Command>();

    constructor(private bot: Telegraf) {
        this.bot = bot;
    }

    /**
     * carrega os comandos
     */
    public async load(dir: string): Promise<void> {
        const files = await fs.readdir(dir);

        for (const file of files) {
            const pathFull = path.join(dir, file);

            const stat = await fs.stat(pathFull);

            if(stat.isDirectory()) {
                await this.load(pathFull)
                continue;
            }

            const module = await import(pathFull);

            const command: Command = module.default;

            if (!command.name || !command.description || !command.category || !command.usage) {
                console.warn("arquivo faltando estrutura. Ignorado");
                continue;
                
            }

            this.commands.set(command.name, command);

            this.bot.command(command.name, command.run);
        }
    }



}