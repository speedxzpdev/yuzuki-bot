import fs from "fs/promises";
import path from "path"
import type Command from "../interfaces/command.js";
import { Telegraf } from "telegraf";
import { pathToFileURL } from "url";


class CommandLoader {
    private commands = new Map<string, Command>();
    private isLoad: boolean = false;

    constructor(private bot: Telegraf) {}

    /**
     * carrega os comandos
     */
    public async load(dir: string): Promise<void> {
        console.log("Carregando comandos...");
        
        const files = await fs.readdir(dir);

        for (const file of files) {
            const pathFull = path.join(dir, file);

            const stat = await fs.stat(pathFull);

            if(stat.isDirectory()) {
                await this.load(pathFull)
                continue;
            }

            if(!file.endsWith(".js")) continue;

            const module = await import(pathToFileURL(pathFull).href);

            const command: Command = module.default as Command;

            if (!command) {
                console.warn(`arquivo: ${file} faltando export, ignorado`);
                continue;
            }

            if (!command.name || !command.description || !command.category || !command.usage) {
                console.warn(`arquivo: ${file} faltando estrutura. Ignorado`);
                continue;
                
            }

            this.commands.set(command.name, command);

            await this.bot.command(command.name, (ctx) => command.run(ctx));


        }



        this.isLoad = true;
        console.log(`${this.commands.size} comandos carregados!`);
        
    }

    /**
     * getCommand
     */
    public getAllCommand() {
        if(!this.isLoad) {
            console.warn("Os comandos não foram iniciados.");
            return [];
        }

        return Array.from(this.commands.values());
    }

    /**
     * registerCommands
     */
    public async registerCommands() {
        try {
        await this.bot.telegram.setMyCommands(Array.from(this.commands.values()).filter(c => {
            return c.category !== "owner"
        }).map(cmd => ({
                command: cmd.name,
                description: cmd.description
            })));
        } catch (err) {
            console.error("erro ao registrar comandos", err);
        }
    }



}

export default CommandLoader;