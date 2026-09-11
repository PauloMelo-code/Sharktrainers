/** Itens do menu principal, na ordem aprovada no protótipo. */
export const MENU_PRINCIPAL = [
  { href: "/", rotulo: "Home" },
  { href: "/canal", rotulo: "Canal de Empregos Óptica" },
  { href: "/anuncie", rotulo: "Anuncie Aqui" },
  { href: "/empregos", rotulo: "Empregos" },
  { href: "/curriculo", rotulo: "Cadastrar Currículo" },
] as const;

/** Itens do menu suspenso "Páginas". */
export const MENU_PAGINAS = [
  { href: "/artigos", rotulo: "Artigos" },
  { href: "/depoimentos", rotulo: "Depoimentos" },
  { href: "/marketplace", rotulo: "Marketplace" },
] as const;

/** Rodapé: menu principal + páginas + contato. */
export const MENU_RODAPE = [
  ...MENU_PRINCIPAL,
  ...MENU_PAGINAS,
  { href: "/contato", rotulo: "Contato" },
] as const;

/** Marca o item ativo considerando as rotas filhas (/vaga/x pertence a /empregos). */
export function itemAtivo(href: string, caminho: string): boolean {
  if (href === "/") return caminho === "/";
  if (href === "/empregos") return caminho.startsWith("/empregos") || caminho.startsWith("/vaga");
  if (href === "/artigos") return caminho.startsWith("/artigo");
  return caminho.startsWith(href);
}
