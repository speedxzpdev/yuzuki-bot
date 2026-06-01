import { type Context } from "telegraf";
import { type Update } from "telegraf/types"

type Category = "download" | "help" | "user" | "owner"


export default interface CommandBuilder {
    name: string,
    category: Category,
    usage: string,
    description: string,
    run: (ctx: Context<Update.MessageUpdate>) => Promise<void> | void

}