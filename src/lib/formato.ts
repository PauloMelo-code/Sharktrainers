/** Formata como no protótipo: "9 set 2026". */
export function formatarData(data: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  })
    .format(data)
    .replace(/\./g, "");
}

/** "Vanessa D'Amato" → "VD" (usado nos avatares de depoimento e currículo). */
export function iniciais(nome: string): string {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .map((parte) => parte[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** "Tubarão SC" → "SC". Usado no filtro por estado. */
export function ufDaCidade(cidade: string): string {
  const encontrado = cidade.trim().match(/([A-Z]{2})$/);
  return encontrado ? encontrado[1] : "";
}

/** Data de um <input type="date"> (YYYY-MM-DD) para Date ao meio-dia local. */
export function dataDeInput(valor: string): Date {
  return new Date(`${valor}T12:00:00`);
}

/** Date para o formato aceito por <input type="date">. */
export function inputDeData(data: Date): string {
  return data.toISOString().slice(0, 10);
}
