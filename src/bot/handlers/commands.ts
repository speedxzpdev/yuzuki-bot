import { bot } from '../bot.js';
import redis from "@redis"
import { sql } from "@pg";

function commandHandler(): void {
bot.on("text", async (ctx) => {
    const text: string = ctx.message.text;

    if (text.startsWith("/")) {

        const userCache = await redis.get(`user:${ctx.from.id}`);

        if(userCache === null) {
            const userSql = await sql`SELECT * FROM users WHERE plataform_id = ${ctx.from.id}`;

            if(userSql.length === 0)  {
                const newUser = await sql`INSERT INTO users (plataform_id, username) VALUES (${ctx.from.id}, ${ctx.from.first_name}) RETURNING *`;
                await ctx.reply("Usuário registrado no banco de dados! Agora eu lembro de você mesmo depois de um tempo sem falar comigo!", {
                    reply_parameters: { message_id: ctx.message.message_id }
                });

                await redis.set(`user:${ctx.from.id}`, JSON.stringify(newUser[0]), "EX", 60 * 60 * 24); // expira em 24 horas
            } else {
                await redis.set(`user:${ctx.from.id}`, JSON.stringify(userSql[0]), "EX", 60 * 60 * 24);
            }

        }

    }
});

}

export default commandHandler;