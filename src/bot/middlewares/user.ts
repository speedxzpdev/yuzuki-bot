import { user } from "src/database/models/user.js";
import { dbHelpers } from "src/utils/dbHelpers.js";
import type { Context, MiddlewareFn } from "telegraf";

export const auth: MiddlewareFn<Context> = async (ctx, next) => {
    const from = ctx.from

    if(!from) return;

    const userExist = await dbHelpers.find({object: "user_id", value: from.id }, user)

    if(userExist) {
        await next();
        return;
    }

    await dbHelpers.updateAndCreate({object: "user_id", value: from.id}, user, [
        { op: "$set", fieldName: "user_id", value: from.id },

        { op: "$set", fieldName: "name", value: from.first_name }
    ] );

    await ctx.reply("Acabei de anotar seu nome no meu bloquinho de notas! Para ver suas informações use /profile hehe💙", { reply_parameters: { message_id: ctx.message?.message_id ?? 0 } })

    await next();
};
