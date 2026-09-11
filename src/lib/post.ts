/**
 * Separa um post colado do Instagram/WhatsApp em título, resumo, link e tags.
 * Regras: a primeira linha vira o título, linhas com http viram o link,
 * #hashtags viram tags e emojis são descartados (o site usa ícones próprios).
 */
export type PostSeparado = {
  titulo: string;
  resumo: string;
  link: string;
  tags: string;
};

export function separarPost(bruto: string): PostSeparado {
  const linhas = bruto
    .split("\n")
    .map((linha) => linha.trim())
    .filter(Boolean);

  const link = bruto.match(/https?:\/\/\S+/)?.[0] ?? "";
  const tags = (bruto.match(/#[\wÀ-ÿ]+/g) ?? []).join(" ");

  const primeira = linhas[0] ?? "";
  const titulo = primeira
    .replace(/^(\p{Extended_Pictographic}(?:️)?)\s*/u, "")
    .replace(/^[“"]|[”"]$/g, "")
    .trim();

  const resumo = linhas
    .slice(1)
    .filter(
      (linha) =>
        !/https?:\/\//.test(linha) && !/^#/.test(linha) && !/^leia a mat/i.test(linha),
    )
    .join("\n\n");

  return { titulo, resumo, link, tags };
}
