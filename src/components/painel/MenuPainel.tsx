"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const SECOES_PAINEL = [
  { href: "/painel", rotulo: "Início" },
  { href: "/painel/vagas", rotulo: "Vagas" },
  { href: "/painel/artigos", rotulo: "Artigos" },
  { href: "/painel/curriculos", rotulo: "Currículos" },
  { href: "/painel/anuncios", rotulo: "Pedidos de anúncio" },
  { href: "/painel/depoimentos", rotulo: "Depoimentos" },
  { href: "/painel/marketplace", rotulo: "Marketplace" },
  { href: "/painel/contatos", rotulo: "Contatos" },
  { href: "/painel/conta", rotulo: "Minha conta" },
] as const;

export function MenuPainel() {
  const caminho = usePathname();

  return (
    <nav className="painel-menu" aria-label="Seções do painel">
      {SECOES_PAINEL.map((secao) => {
        const ativo =
          secao.href === "/painel" ? caminho === "/painel" : caminho.startsWith(secao.href);
        return (
          <Link key={secao.href} href={secao.href} aria-current={ativo ? "page" : undefined}>
            {secao.rotulo}
          </Link>
        );
      })}
    </nav>
  );
}
