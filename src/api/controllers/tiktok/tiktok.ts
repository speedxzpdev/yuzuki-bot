import axios, { type AxiosInstance } from "axios";
import FormData from "form-data";

function format_count(value: number): string {

    if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(1) + "M"
    }
    if (value >= 1_000) {
        return (value / 1_000).toFixed(1) + "K"
    }
    return value.toString();
}

function normalizeStat(data: any): any {
    const stats = ["play_count", "comment_count", "download_count", "digg_count"];

    for (const stat of stats) {
        if (typeof data[stat] === "number") {
            data[stat] = format_count(data[stat]);
        }
    }
    return data
}

function normalizePath(data: any, baseUrl: string): Promise<any> {
    const fields = ['play', 'wmplay', 'hdplay', 'music', 'cover'];

    for (const field of fields) {
        if(!data[field]) continue;

        data[field] = baseUrl + data[field];
    }

    return data;
}



export default async function tiktokController(req: any, reply: any) {
    const { videoUrl } = req.body || {};
    try {

        if (!videoUrl) {
            return reply.status(400).send({ error: "URL do vídeo é obrigatória." });
        }

        const apiUrl = "https://www.tikwm.com/";

        

        const form: FormData = new FormData();

        form.append("url", videoUrl);
        form.append("count", "12");
        form.append("cursor", "0");
        form.append("web", "1");
        form.append("hd", "1");

        const api: AxiosInstance = axios.create({
            baseURL: apiUrl + "api/",
            timeout: 10000,
            headers: {
                ...form.getHeaders(),
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "x-requested-with": "XMLHttpRequest"
            },
        });

        const response = await api.post("/", form);

        const data = response.data.data;

        normalizeStat(data);
        normalizePath(data, apiUrl);

        return reply.status(200).send(data);
    } catch (err) {
        console.error(err);
        return reply.status(500).send({ error: "Erro ao processar a requisição." });
        
    }
}