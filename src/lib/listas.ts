/**
 * Campos de lista (cidades, destaques, tags) ficam no banco como texto JSON.
 * Estes dois helpers são o único lugar do código que faz essa conversão.
 */

export function parseLista(valor: string | null | undefined): string[] {
  if (!valor) return [];
  try {
    const dados = JSON.parse(valor);
    if (!Array.isArray(dados)) return [];
    return dados.map((item) => String(item).trim()).filter(Boolean);
  } catch {
    return [];
  }
}

export function serializaLista(itens: readonly string[]): string {
  return JSON.stringify(itens.map((item) => item.trim()).filter(Boolean));
}

/** Quebra um campo digitado com vírgulas ou quebras de linha em lista. */
export function listaDeTexto(texto: string | null | undefined): string[] {
  if (!texto) return [];
  return texto
    .split(/[,\n]/)
    .map((parte) => parte.trim())
    .filter(Boolean);
}
