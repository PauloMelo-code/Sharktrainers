import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Currículos e fotos enviadas ficam FORA da pasta public: são dados pessoais.
 * Quem entrega o arquivo é a rota autenticada /api/painel/curriculos/[id]/arquivo.
 */
const PASTA = process.env.UPLOADS_DIR ?? "./uploads";

export const TAMANHO_MAXIMO_CURRICULO = 8 * 1024 * 1024; // 8 MB

export const TIPOS_CURRICULO: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
};

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

export type ArquivoSalvo = {
  arquivoNome: string;
  arquivoPath: string;
  arquivoTipo: string;
};

/** Mensagem de erro quando o arquivo não serve; null quando está tudo certo. */
export function validarCurriculo(arquivo: File | null): string | null {
  if (!arquivo || arquivo.size === 0) return "Envie seu currículo em PDF ou DOC";
  if (arquivo.size > TAMANHO_MAXIMO_CURRICULO) return "Arquivo acima de 8 MB";

  const extensao = path.extname(arquivo.name).toLowerCase();
  const extensoesAceitas = Object.values(TIPOS_CURRICULO);
  const tipoAceito = arquivo.type in TIPOS_CURRICULO;

  if (!tipoAceito && !extensoesAceitas.includes(extensao)) {
    return "Formato não aceito. Envie PDF, DOC ou DOCX";
  }
  return null;
}

export async function salvarCurriculo(arquivo: File): Promise<ArquivoSalvo> {
  await mkdir(pastaUploads(), { recursive: true });

  const extensao = path.extname(arquivo.name).toLowerCase() || TIPOS_CURRICULO[arquivo.type] || "";
  const nomeInterno = `${randomUUID()}${extensao}`;
  const bytes = Buffer.from(await arquivo.arrayBuffer());
  await writeFile(caminhoSeguro(nomeInterno), bytes);

  return {
    arquivoNome: path.basename(arquivo.name),
    arquivoPath: nomeInterno,
    arquivoTipo: arquivo.type || "application/octet-stream",
  };
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

/** Salva uma imagem (foto de vaga ou capa de artigo) em public/uploads. */
export async function salvarImagemPublica(arquivo: File, prefixo: string): Promise<string | null> {
  if (!arquivo || arquivo.size === 0) return null;
  if (!arquivo.type.startsWith("image/")) return null;
  if (arquivo.size > 12 * 1024 * 1024) return null;

  const destino = path.resolve(process.cwd(), "public", "uploads");
  await mkdir(destino, { recursive: true });

  const extensao = path.extname(arquivo.name).toLowerCase() || ".jpg";
  const nome = `${prefixo}-${randomUUID()}${extensao}`;
  await writeFile(path.join(destino, nome), Buffer.from(await arquivo.arrayBuffer()));
  return `/uploads/${nome}`;
}
