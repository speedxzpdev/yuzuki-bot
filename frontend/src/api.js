const API_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.error || "Nao foi possivel completar a requisicao.";
    throw new Error(message);
  }

  return data;
}

export function getStatus() {
  return request("");
}

export function getCommands() {
  return request("/commands");
}

export function downloadTiktok(videoUrl) {
  return request("/download/tiktok", {
    method: "POST",
    body: JSON.stringify({ videoUrl })
  });
}
