# Contexto da Aplicacao Yuzuki

## Visao Geral

Yuzuki e um projeto TypeScript que combina bot de Telegram, API Fastify e um frontend React dedicado para testar as rotas existentes. O objetivo principal e baixar videos do TikTok usando a TikWM, retornando video, audio, autor, musica e estatisticas normalizadas.

## Backend

- Entrada principal: `src/index.ts`.
- Servidor HTTP: `src/api/app.ts`.
- Porta padrao: `3000`, configuravel por `PORT`.
- Host de bind: `0.0.0.0`.
- Rate limit global: 100 requisicoes por minuto.
- DNS: o projeto usa `dns.setDefaultResultOrder("ipv4first")` para priorizar IPv4.

### Rotas

- `GET /api`: health check simples, retorna `{ "hello": "world" }`.
- `GET /api/commands`: retorna comandos carregados pelo `CommandLoader`.
- `POST /api/download/tiktok`: recebe `{ "videoUrl": string }`, consulta TikWM e retorna dados normalizados.

Em producao, o Fastify serve `frontend/dist` na raiz do mesmo subdominio. API e frontend compartilham a variavel `PORT`; hosts com uma unica porta devem usar `PORT=80`.

### Contrato de `POST /api/download/tiktok`

Entrada:

```json
{
  "videoUrl": "https://www.tiktok.com/@usuario/video/123"
}
```

Saida normalizada:

```json
{
  "id": "string",
  "author": {},
  "title": "string",
  "playCount": "string",
  "commentCount": "string",
  "likesCount": "string",
  "downloadCount": "string",
  "hdPLay": "string",
  "play": "string",
  "music": "string",
  "musicInfo": {}
}
```

Observacao: o campo `hdPLay` esta escrito com `PL` maiusculo no controller atual. Preservar esse nome em clientes ate que o backend seja migrado com compatibilidade.

## Bot

- Inicializacao: `src/bot/bot.ts`.
- Loader de comandos: `src/bot/utils/loadComands.ts`.
- Interface de comando: `src/bot/interfaces/command.ts`.
- Servico HTTP usado pelo bot: `src/bot/services/api.ts`, configurado por `BACKEND_URL`.

Comandos atuais:

- `/start`: envia imagem e texto de apresentacao.
- `/tiktok <link>`: chama `POST /download/tiktok`, envia o video e depois o audio no Telegram.

O loader registra comandos a partir dos arquivos `.js` compilados em `dist`, por isso o fluxo normal passa por `npm start`.

## Servicos

- Redis: `src/services/redis.ts`.
- `REDIS_URI` e obrigatoria na inicializacao porque o modulo lança erro se a variavel nao existir.
- Cache TikTok: prefixo `tiktok_cache:`, TTL de 30 minutos.
- MongoDB: `src/services/mongoDB.ts` existe, mas esta vazio no estado atual.

## Frontend

- Pasta dedicada: `frontend/`.
- Framework: React com Vite.
- Variavel: `VITE_API_URL`, padrao `/api`.
- Em desenvolvimento, `frontend/vite.config.js` faz proxy de `/api` para `http://localhost:3000`, evitando CORS.

Telas/funcoes:

- Status da API via `GET /api`.
- Lista de comandos via `GET /api/commands`.
- Formulario para testar `POST /api/download/tiktok`.
- Preview de video, links de video/audio/perfil e detalhes da resposta.

## Variaveis de Ambiente

Backend:

- `PORT`
- `TOKEN_BOT`
- `BACKEND_URL`
- `REDIS_URI`
- `DATABASE_URI`

Frontend:

- `VITE_API_URL`
- `VITE_TELEGRAM_URL`: URL publica do bot, usada pelos CTAs da home.

## Diretrizes de Interface

- A home do frontend deve apresentar a Yuzuki antes do painel de API e ter CTA para o Telegram usando `VITE_TELEGRAM_URL`.
- Estilo visual: base preta ou quase preta, contrastes em azul, superficies discretas e acabamento moderno.
- Usar raios contidos (ate 8px), icones Lucide e estados de foco/hover acessiveis.
- Evitar gradientes, cartoes excessivos e elementos decorativos sem funcao.

## Pontos de Atencao

- O working tree ja tinha alteracoes antes desta organizacao: `.env.example`, `src/index.ts`, remocao de `src/services/postgres.ts` e criacao de `src/services/mongoDB.ts`.
- `package.json` ainda contem dependencias de PostgreSQL mesmo com a migracao aparente para MongoDB.
- `src/api/controllers/commandList.ts` importa `cp` de `fs`, mas nao usa.
- A API nao registra CORS. O frontend resolve isso em dev usando proxy do Vite.
