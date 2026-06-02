import type Command from "@commands";
import { Markup } from "telegraf";
import api from "@api"

const tiktok: Command = {
    name: "tiktok",
    description: "Baixa videos do tiktok!",
    usage: "/tiktok https://www.tiktok.com/xxxx",
    category: "download",
    run: async (ctx) => {
        try {

            if(!ctx.message || !("text" in ctx.message)) return
            const args: string[] = ctx.message.text.split(" ").slice(1);

            if (!args.length || !args[0]) {
                await ctx.reply("Envie um link válido. Exemplo: /tiktok <link>", {
                    reply_parameters: { message_id: ctx.message.message_id }
                });
                return;
            }

            const msg_temp = await ctx.reply("Baixando vídeo...", {
                reply_parameters: { message_id: ctx.message.message_id }
            });

            const tiktokUrl: string = args[0];

            const { data } = await api.post("/download/tiktok", { videoUrl: tiktokUrl });

            const buttons = Markup.inlineKeyboard([
                Markup.button.url("💙Perfil", "https://www.tiktok.com/@" + data?.author?.unique_id)
            ])
            const info = `*💙Download By Yuzuki*\n\n*Criador*: ${data?.author?.nickname}\n*Curtidas:* ${data?.likesCount}\n*Vizualizações:* ${data?.playCount}\n*Comentários:* ${data?.commentCount}\nMusica: ${data?.musicInfo?.title || "Não disponível"}`;
            
            

            await ctx.replyWithVideo(data.play, {
                caption: info,
                ...buttons,
                parse_mode: "Markdown",
                reply_parameters: {
                    message_id: ctx.message.message_id
                }
            });

            const infoMusic = `*Nome:* ${data?.musicInfo?.title || "Não disponível"}\n*Álbum:* ${data?.musicInfo?.album || "Não disponível"}\n*Artista:* ${data?.musicInfo?.author || "Não disponível"}`;
            
            await ctx.replyWithAudio(data.music, {
                caption: infoMusic,
                title: data?.musicInfo?.title || "Música do TikTok",
                performer: data?.musicInfo?.author || "Desconecido",
                parse_mode: "Markdown",
                reply_parameters: {
                    message_id: ctx.message.message_id
                },
            });

            await ctx.telegram.deleteMessage(ctx.chat.id, msg_temp.message_id);

        } catch (error) {
            await ctx.reply("Erro ao baixar o vídeo. Verifique o link e tente novamente.", { reply_parameters: { message_id: ctx.message.message_id }});
            console.error(error);
        }
    }
}

export default tiktok