import dotenv from "dotenv";
dotenv.config();
import app from "./api/app.js";
import { bot, commandLoader, mainBot } from "./bot/bot.js";
import redis from "@redis"

//DECIDIMOS PRIORIZAR O IPV4 POIS ALGUNS SERVIÇOS DE HOSPEDAGEM NÃO SUPORTAM IPV6, O QUE PODE CAUSAR PROBLEMAS DE CONECTIVIDADE. ALÉM DISSO, O IPV4 É MAIS AMPLAMENTE SUPORTADO E COMPATÍVEL COM A MAIORIA DAS REDES E DISPOSITIVOS. AO FORÇAR O USO DO IPV4, GARANTIMOS UMA EXPERIÊNCIA MAIS ESTÁVEL E CONFIÁVEL PARA OS USUÁRIOS, EVITANDO POSSÍVEIS INTERRUPÇÕES OU ERROS DE CONEXÃO RELACIONADOS AO IPV6.
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");


async function main() {
    console.log("inicializando api...");

    redis.on("ready", () => {
        console.log("Redis pronto para uso!");
    });

    try {
        await app.listen({ port: parseInt(process.env.PORT || "3000"), host: '0.0.0.0'});
        console.log(`api rodando em http://localhost:${process.env.PORT || "3000"}`);
    } catch (error) {
        console.error("erro ao iniciar api.", error);
        process.exit(1)
    }

    try {
        console.log("iniciando bot...");
        await mainBot();
        bot.launch();
        await commandLoader.registerCommands();
        console.log("bot rodando!");
    } catch(err) {
        console.error(err);
        process.exit(1)
        
    }
    

}

main();