<p align="center">
  <img src="src/assets/img/readme.jpg" width="220" height="220" alt="Yuzuki" style="border-radius: 50%; object-fit: cover;">
</p>

<h1 align="center">Yuzuki</h1>

<p align="center">
  Bot de Telegram e API para baixar videos do TikTok usando a TikWM.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Licenca-MIT-blue?style=for-the-badge" alt="Licenca">
  <img src="https://img.shields.io/badge/Versao-1.0.0-orange?style=for-the-badge" alt="Versao">
  <img src="https://img.shields.io/github/forks/speedxzpdev/yuzuki-bot?style=for-the-badge&color=red&label=Forks" alt="Forks">
</p>

## Sobre

A Yuzuki e uma aplicacao TypeScript com tres partes principais:

- Bot Telegram feito com Telegraf.
- API HTTP feita com Fastify.
- Frontend React dedicado para testar e visualizar as rotas da API.

O fluxo principal recebe um link do TikTok, consulta a API da [TikWM](https://tikwm.com/), normaliza os dados do video e retorna links de midia, autor, musica e estatisticas. A resposta fica em cache no Redis por 30 minutos.

## Estrutura

```text
.
├── frontend/              # Aplicacao React para consumir a API
├── src/
│   ├── api/               # Fastify, rotas e controllers HTTP
│   ├── bot/               # Bot Telegram, comandos e handlers
│   ├── services/          # Clientes externos como Redis e MongoDB
│   └── index.ts           # Inicializacao da API e do bot
├── .env.example           # Exemplo de variaveis de ambiente do backend
├── package.json           # Scripts e dependencias do backend/bot
└── tsconfig.json          # Configuracao TypeScript do backend
```

## Requisitos

- Node.js 24 ou superior.
- npm 11 ou superior.
- Redis acessivel por URL.
- Token de bot criado no BotFather.

## Configuracao

Instale as dependencias do backend:

```bash
npm install
```

Crie um arquivo `.env` a partir do `.env.example`:

```env
PORT=3000
TOKEN_BOT=seu_token_do_bot
BACKEND_URL=http://localhost:3000
REDIS_URI=redis://localhost:6379
DATABASE_URI=
```

`DATABASE_URI` existe para o MongoDB, mas a implementacao atual ainda nao usa esse servico em nenhuma rota.

## Como Rodar

Aplicacao completa (bot, API e frontend na mesma porta):

```bash
npm start
```

O comando compila o TypeScript, gera o frontend React e executa `dist/index.js`. Em producao, o Fastify entrega o frontend na raiz do subdominio e a API fica sob `/api`. Para hosts que liberam somente a porta 80, defina `PORT=80` no `.env`.

Modo watch do TypeScript:

```bash
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Por padrao, o frontend usa proxy do Vite para enviar chamadas `/api` para `http://localhost:3000`. Para apontar para outra API ou definir o bot que sera aberto na home, copie `frontend/.env.example` para `frontend/.env` e ajuste `VITE_API_URL` e `VITE_TELEGRAM_URL`.

## Rotas da API

### `GET /api`

Health check simples.

Resposta:

```json
{
  "hello": "world"
}
```

### `GET /api/commands`

Retorna os comandos carregados pelo bot.

Resposta:

```json
{
  "commands": [
    {
      "name": "tiktok",
      "description": "Baixa videos do tiktok!",
      "usage": "/tiktok https://www.tiktok.com/xxxx",
      "category": "download"
    }
  ]
}
```

Observacao: essa rota depende do `commandLoader` ja ter carregado os comandos durante a inicializacao do bot.

### `POST /api/download/tiktok`

Baixa e normaliza dados de um video do TikTok.

Corpo:

```json
{
  "videoUrl": "https://www.tiktok.com/@usuario/video/123"
}
```

Resposta de sucesso:

```json
{
  "id": "123",
  "author": {
    "unique_id": "usuario",
    "nickname": "Nome"
  },
  "title": "Descricao do video",
  "playCount": "1.2M",
  "commentCount": "10.4K",
  "likesCount": "250.0K",
  "downloadCount": "3.1K",
  "hdPLay": "https://www.tikwm.com/...",
  "play": "https://www.tikwm.com/...",
  "music": "https://www.tikwm.com/...",
  "musicInfo": {
    "title": "Musica",
    "author": "Artista",
    "album": "Album"
  }
}
```

Erros esperados:

- `400`: quando `videoUrl` nao foi enviado.
- `500`: quando a consulta externa ou o processamento falhar.

Rate limits:

- Global: 100 requisicoes por minuto.
- `POST /api/download/tiktok`: 20 requisicoes por minuto.

## Comandos do Bot

Os comandos ficam em `src/bot/commands`. O loader percorre subpastas, importa arquivos compilados `.js` e registra comandos no Telegraf.

Todo comando precisa exportar um objeto no formato:

```ts
import type Command from "@commands";

const command: Command = {
  name: "nome",
  description: "Descricao curta",
  usage: "/nome",
  category: "help",
  run: async (ctx) => {
    await ctx.reply("Executado");
  }
};

export default command;
```

Comandos atuais:

- `/start`: apresenta a Yuzuki.
- `/tiktok <link>`: baixa video e audio de um TikTok.

## Frontend

A pasta `frontend/` contem uma interface React para:

- Checar o status da API.
- Listar comandos retornados por `GET /api/commands`.
- Testar downloads usando `POST /api/download/tiktok`.
- Visualizar video, musica, autor e estatisticas retornadas pelo backend.

Ela possui uma home de apresentacao com atalho para o Telegram configurado por `VITE_TELEGRAM_URL`, alem do painel de desenvolvimento e demonstracao da API. O build e entregue pelo Fastify na mesma porta da API; em desenvolvimento, o Vite encaminha `/api` para `http://localhost:3000`.

## Observacoes de Desenvolvimento

- O backend forca resolucao DNS IPv4 em `src/index.ts` para evitar problemas em hospedagens sem bom suporte IPv6.
- O cache de TikTok usa chaves no formato `tiktok_cache:<videoUrl>` e expira em 30 minutos.
- `src/services/mongoDB.ts` existe, mas esta vazio no estado atual.

## Contribuicao

Contribuicoes sao bem-vindas. Antes de abrir mudancas grandes, rode a compilacao e confira se o bot ainda registra os comandos corretamente.
