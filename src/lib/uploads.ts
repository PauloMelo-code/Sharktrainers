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
