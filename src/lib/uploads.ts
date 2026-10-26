import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Currículos ficam FORA da pasta public: são dados pessoais. Quem entrega o
 * arquivo é a rota autenticada /api/painel/curriculos/[id]/arquivo.
 *
 * O formulário público não recebe mais anexo de currículo, então nada novo é
 * gravado aqui. A leitura e a exclusão continuam porque os currículos enviados
 * antes dessa mudança seguem no painel.
 */
const PASTA = process.env.UPLOADS_DIR ?? "./uploads";

export function pastaUploads() {
  // turbopackIgnore evita que o bundler tente rastrear a pasta inteira do
  // projeto só porque o caminho vem de variável de ambiente.
  return path.resolve(/* turbopackIgnore: true */ process.cwd(), PASTA);
}

/** Impede que um nome manipulado escape da pasta de uploads. */
export function caminhoSeguro(nomeArquivo: string) {
  const base = path.basename(nomeArquivo);
  return path.join(pastaUploads(), base);
}

/** Lê um currículo do disco. Devolve null quando o arquivo não existe mais. */
export async function lerArquivo(arquivoPath: string) {
  try {
    return await readFile(caminhoSeguro(arquivoPath));
  } catch {
    return null;
  }
}

export async function apagarArquivo(arquivoPath: string) {
  try {
    await unlink(caminhoSeguro(arquivoPath));
  } catch {
    // Arquivo já não existe: nada a fazer.
  }
}

/**
 * Fotos de vaga e capas de artigo. Ficam no volume, numa subpasta separada
 * dos currículos, e saem pela rota pública /imagens/[arquivo].
 *
 * Não podem ir para public/: em produção o Next só entrega o que já estava lá
 * quando o servidor subiu, e a pasta some a cada publicação.
 */
const TIPOS_IMAGEM: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

function pastaImagens() {
  return path.join(pastaUploads(), "imagens");
}

export async function salvarImagemPublica(arquivo: File, prefixo: string): Promise<string | null> {
  if (!arquivo || arquivo.size === 0) return null;
  if (arquivo.size > 12 * 1024 * 1024) return null;

  // A extensão vem do tipo, não do nome: SVG e afins ficam de fora.
  const tipo = arquivo.type === "image/jpg" ? "image/jpeg" : arquivo.type;
  const extensao = Object.keys(TIPOS_IMAGEM).find((ext) => TIPOS_IMAGEM[ext] === tipo);
  if (!extensao) return null;

  await mkdir(pastaImagens(), { recursive: true });
  const nome = `${prefixo}-${randomUUID()}${extensao}`;
  await writeFile(path.join(pastaImagens(), nome), Buffer.from(await arquivo.arrayBuffer()));
  return `/imagens/${nome}`;
}

/**
 * Lê uma imagem pública. Procura também em public/uploads, onde ficavam as
 * enviadas antes da mudança e que ainda estejam no disco.
 */
export async function lerImagemPublica(nomeArquivo: string) {
  const nome = path.basename(nomeArquivo);
  const tipo = TIPOS_IMAGEM[path.extname(nome).toLowerCase().replace(".jpeg", ".jpg")];
  if (!tipo) return null;

  for (const pasta of [pastaImagens(), path.resolve(process.cwd(), "public", "uploads")]) {
    try {
      return { conteudo: await readFile(path.join(pasta, nome)), tipo };
    } catch {
      // Tenta a próxima pasta.
    }
  }
  return null;
}
