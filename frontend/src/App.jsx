import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  Bot,
  CheckCircle2,
  Download,
  ExternalLink,
  Heart,
  ListChecks,
  LoaderCircle,
  Music2,
  Play,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { downloadTiktok, getCommands, getStatus } from "./api.js";

const exampleUrl = "https://www.tiktok.com/@usuario/video/1234567890";
const telegramUrl = import.meta.env.VITE_TELEGRAM_URL || "https://t.me/";

function getProfileUrl(author) {
  if (!author?.unique_id) return null;
  return `https://www.tiktok.com/@${author.unique_id}`;
}

function App() {
  const [status, setStatus] = useState("checking");
  const [commands, setCommands] = useState([]);
  const [commandsState, setCommandsState] = useState("loading");
  const [videoUrl, setVideoUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const profileUrl = useMemo(() => getProfileUrl(result?.author), [result]);

  async function loadApiInfo() {
    setStatus("checking");
    setCommandsState("loading");

    try {
      await getStatus();
      setStatus("online");
    } catch {
      setStatus("offline");
    }

    try {
      const data = await getCommands();
      setCommands(data.commands || []);
      setCommandsState("ready");
    } catch {
      setCommands([]);
      setCommandsState("error");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!videoUrl.trim()) {
      setError("Informe uma URL do TikTok.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await downloadTiktok(videoUrl.trim());
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    loadApiInfo();
  }, []);

  return (
    <main className="app-shell">
      <section className="hero" aria-labelledby="hero-title">
        <nav className="hero-nav" aria-label="Navegacao principal">
          <a className="brand" href="#inicio" aria-label="Yuzuki, inicio">
            <span className="brand-mark"><Bot size={21} /></span>
            <strong>Yuzuki</strong>
          </a>
          <a className="telegram-button nav-telegram" href={telegramUrl} target="_blank" rel="noreferrer">
            <Send size={17} />
            Abrir no Telegram
          </a>
        </nav>

        <div className="hero-content" id="inicio">
          <div className="hero-copy">
            <p className="eyebrow"><Sparkles size={15} /> TikTok downloader para Telegram</p>
            <h1 id="hero-title">Seu conteudo favorito, pronto para compartilhar.</h1>
            <p className="hero-description">
              Envie um link do TikTok para a Yuzuki e receba o video e o audio diretamente no Telegram.
            </p>
            <div className="hero-actions">
              <a className="telegram-button primary" href={telegramUrl} target="_blank" rel="noreferrer">
                <Send size={18} />
                Comecar no Telegram
              </a>
              <a className="text-action" href="#dashboard">Testar a API <span aria-hidden="true">↓</span></a>
            </div>
            <div className="trust-row" aria-label="Recursos da Yuzuki">
              <span><ShieldCheck size={17} /> Rapido e simples</span>
              <span><Heart size={17} /> Video e audio</span>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="visual-frame">
              <img src="/yuzuki.jpg" alt="" />
              <div className="visual-overlay">
                <span className="visual-status"><span /> online agora</span>
                <strong>Yuzuki Bot</strong>
                <small>Baixe sem sair da conversa.</small>
              </div>
            </div>
            <div className="floating-card command-preview"><span>/tiktok</span><strong>Link recebido</strong></div>
            <div className="floating-card result-preview"><CheckCircle2 size={17} /><span>Video pronto</span></div>
          </div>
        </div>
      </section>

      <section className="dashboard-section" id="dashboard" aria-labelledby="dashboard-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Console da API</p>
            <h2 id="dashboard-title">Teste o downloader</h2>
          </div>
          <p>Consulte o estado do bot, os comandos ativos e o resultado da rota do TikTok.</p>
        </div>

        <section className="workspace">
        <aside className="sidebar">
          <div className="status-panel">
            <div className="panel-title">
              <Activity size={18} />
              <span>Status</span>
              <button className="icon-button" onClick={loadApiInfo} title="Atualizar">
                <RefreshCw size={16} />
              </button>
            </div>
            <div className={`status-pill ${status}`}>
              <span />
              {status === "online" && "API online"}
              {status === "offline" && "API offline"}
              {status === "checking" && "Verificando"}
            </div>
          </div>

          <div className="status-panel grow">
            <div className="panel-title">
              <ListChecks size={18} />
              <span>Comandos</span>
            </div>

            {commandsState === "loading" && <p className="muted">Carregando comandos...</p>}
            {commandsState === "error" && <p className="muted">Nao foi possivel carregar.</p>}
            {commandsState === "ready" && commands.length === 0 && (
              <p className="muted">Nenhum comando carregado.</p>
            )}

            <div className="command-list">
              {commands.map((command) => (
                <article className="command-item" key={command.name}>
                  <div>
                    <strong>/{command.name}</strong>
                    <span>{command.category}</span>
                  </div>
                  <p>{command.description}</p>
                  <code>{command.usage}</code>
                </article>
              ))}
            </div>
          </div>
        </aside>

        <section className="content">
          <div className="topbar">
            <div>
              <h3>Baixar TikTok</h3>
              <p>Teste a rota `POST /api/download/tiktok` e visualize a resposta normalizada.</p>
            </div>
          </div>

          <form className="download-form" onSubmit={handleSubmit}>
            <label htmlFor="videoUrl">URL do TikTok</label>
            <div className="input-row">
              <Search size={20} />
              <input
                id="videoUrl"
                type="url"
                placeholder={exampleUrl}
                value={videoUrl}
                onChange={(event) => setVideoUrl(event.target.value)}
              />
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <LoaderCircle className="spin" size={18} /> : <Download size={18} />}
                <span>{isSubmitting ? "Processando" : "Baixar"}</span>
              </button>
            </div>
          </form>

          {error && <div className="alert">{error}</div>}

          {!result && !error && (
            <section className="empty-state">
              <Play size={34} />
              <h2>Aguardando um link</h2>
              <p>Quando a API responder, o video, audio, autor e estatisticas aparecem aqui.</p>
            </section>
          )}

          {result && (
            <section className="result-grid">
              <article className="media-panel">
                <div className="video-frame">
                  <video src={result.play || result.hdPLay} poster={result.cover} controls />
                </div>
                <div className="media-actions">
                  {result.play && (
                    <a href={result.play} target="_blank" rel="noreferrer">
                      <ArrowDownToLine size={17} />
                      Video
                    </a>
                  )}
                  {result.music && (
                    <a href={result.music} target="_blank" rel="noreferrer">
                      <Music2 size={17} />
                      Audio
                    </a>
                  )}
                  {profileUrl && (
                    <a href={profileUrl} target="_blank" rel="noreferrer">
                      <ExternalLink size={17} />
                      Perfil
                    </a>
                  )}
                </div>
              </article>

              <article className="details-panel">
                <div className="success-label">
                  <CheckCircle2 size={18} />
                  Resposta recebida
                </div>

                <h2>{result.title || "Video sem descricao"}</h2>

                <div className="author-block">
                  <strong>{result.author?.nickname || "Autor desconhecido"}</strong>
                  {result.author?.unique_id && <span>@{result.author.unique_id}</span>}
                </div>

                <div className="stats-grid">
                  <div>
                    <span>Visualizacoes</span>
                    <strong>{result.playCount || "-"}</strong>
                  </div>
                  <div>
                    <span>Curtidas</span>
                    <strong>{result.likesCount || "-"}</strong>
                  </div>
                  <div>
                    <span>Comentarios</span>
                    <strong>{result.commentCount || "-"}</strong>
                  </div>
                  <div>
                    <span>Downloads</span>
                    <strong>{result.downloadCount || "-"}</strong>
                  </div>
                </div>

                {result.musicInfo && (
                  <div className="music-card">
                    <Music2 size={19} />
                    <div>
                      <strong>{result.musicInfo.title || "Musica do TikTok"}</strong>
                      <span>{result.musicInfo.author || "Artista desconhecido"}</span>
                    </div>
                  </div>
                )}
              </article>
            </section>
          )}
        </section>
      </section>
      </section>
    </main>
  );
}

export default App;
