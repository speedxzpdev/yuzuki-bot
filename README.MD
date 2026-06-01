<img src="src/assets/img/readme.jpg"  style="border-radius: 50%; object-fit: cover;"
width=400
height=400
align="center"></img>
<h1 align="center">Yuzuki💙</h1>

![node](https://img.shields.io/badge/Licença-mit-blue?style=for-the-badge)
![version](https://img.shields.io/badge/Versão-1.0.0-orange?style=for-the-badge)
![fork](https://img.shields.io/github/forks/speedxzpdev/yuzuki-bot?style=for-the-badge&color=red&label=Forks)

A Yuzuki é uma bot focada em baixar videos do tiktok usando diretamente o [Tikwm](https://tikwm.com/).

<h1 align="center">Como Contribuir</h1>
Esse projeto é livre para alterações no código.

<h1 align="center">Como Instalar</h1>

## Requisitos:
```bash
NODE= >= 24
TYPESCRIPT= >= 6.0.0
NPM= >= 11.0.0
```

## Instalação:
```bash
git clone https://github.com/speedxzpdev/yuzuki-bot.git
npm install
```

Após isso, olhe o **.env.example** para criar suas variáveis de ambiente.

<h1 align="center">Como Criar Comandos</h1>
Entre em src/bot/commands. Cada arquivo dentro dessa pasta será considerado um comando e irá precisar da interface de comando chamada atráves de um aliase.

### Exemplo:

```typescript
import type Command from "@commands";
import { Telegraf, Markup, Input } from "telegraf";
import path from "path";

const start: Command = {
    name: "start",
    description: "Veja mais sobre o bot",
    usage: "/start",
    category: "help",
    run: async (ctx) => {
        try {
        const text: string = `💙​ Olá ${ctx.from.first_name}! Me chamo Yuzuki, e consigo baixar videos pra você. Basta usar o nome do comando junto do link, EX: */tiktok https://www.tiktok.com/xxx*`

        const buttons = Markup.inlineKeyboard([
            Markup.button.url("😾Github", "https://github.com/speedxzpdev/yuzuki-bot"),
        ]);

        const imagePath = path.join(process.cwd(), "/src/assets/img/start.jpg")

        await ctx.replyWithPhoto(Input.fromLocalFile(imagePath), {
            parse_mode: "Markdown",
            caption: text,
            ...buttons
        })
    } catch (error) {
        console.error(error);
        
    }
    }
}

export default start
```

<h1 align="center">Como rodar</h1>

```bash
npm start
```

A Yuzuki é meu primeiro projeto em typescript então aceito críticas construtivas!