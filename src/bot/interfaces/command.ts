import { type Context } from "telegraf";

type Category = "download" | "help" | "user" | "owner"


export default interface CommandBuilder {
    name: string,
    category: Category,
    usage: string,
    description: string,
    run: (ctx: Context) => Promise<void>

}