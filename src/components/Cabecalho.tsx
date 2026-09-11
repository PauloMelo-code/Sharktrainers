"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { MENU_PAGINAS, MENU_PRINCIPAL, itemAtivo } from "@/lib/navegacao";

export function Cabecalho() {
  const caminho = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);
  const [paginasAberto, setPaginasAberto] = useState(false);
  const paginasRef = useRef<HTMLDivElement>(null);

  // Fecha os menus a cada navegação.
  useEffect(() => {
    setMenuAberto(false);
    setPaginasAberto(false);
  }, [caminho]);

  // Menu suspenso fecha ao clicar fora ou apertar Esc.
  useEffect(() => {
    if (!paginasAberto) return;
    const cliqueFora = (evento: MouseEvent) => {
      if (!paginasRef.current?.contains(evento.target as Node)) setPaginasAberto(false);
    };
    const tecla = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setPaginasAberto(false);
    };
    document.addEventListener("mousedown", cliqueFora);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("mousedown", cliqueFora);
      document.removeEventListener("keydown", tecla);
    };
  }, [paginasAberto]);

  // Trava a rolagem do site atrás do menu mobile.
  useEffect(() => {
    document.body.style.overflow = menuAberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAberto]);

  const marcaAtiva = (href: string) => (itemAtivo(href, caminho) ? "page" : undefined);

  return (
    <>
      <header className="cabecalho">
        <div className="cabecalho-interno">
          <Link href="/" className="marca" aria-label="Shark Trainers, página inicial">
            <img src="/assets/logo-t.png" alt="Shark Trainers — Soluções Comerciais" />
          </Link>

          <nav className="menu-desktop" aria-label="Menu principal">
            {MENU_PRINCIPAL.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="menu-link"
                aria-current={marcaAtiva(item.href)}
              >
                {item.rotulo}
              </Link>
            ))}
            <div className="menu-paginas" ref={paginasRef}>
              <button
                type="button"
                className="menu-botao"
                onClick={() => setPaginasAberto((aberto) => !aberto)}
                aria-expanded={paginasAberto}
                aria-haspopup="true"
              >
                Páginas <span className="seta">▼</span>
              </button>
              {paginasAberto && (
                <div className="menu-suspenso">
                  {MENU_PAGINAS.map((item) => (
                    <Link key={item.href} href={item.href}>
                      {item.rotulo}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
          <div className="menu-espaco" />

          <button
            type="button"
            className="hamburguer"
            aria-label="Abrir menu"
            aria-expanded={menuAberto}
            onClick={() => setMenuAberto(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {menuAberto && (
        <div className="menu-mobile" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="menu-mobile-topo">
            <img src="/assets/logo-t.png" alt="Shark Trainers" />
          </div>
          <button
            type="button"
            className="menu-mobile-fechar"
            aria-label="Fechar menu"
            onClick={() => setMenuAberto(false)}
          >
            ×
          </button>
          <nav aria-label="Menu principal">
            {MENU_PRINCIPAL.map((item) => (
              <Link key={item.href} href={item.href} aria-current={marcaAtiva(item.href)}>
                {item.rotulo}
              </Link>
            ))}
            <div className="subtitulo">Páginas</div>
            {MENU_PAGINAS.map((item, indice) => (
              <Link
                key={item.href}
                href={item.href}
                className={`subitem${indice === MENU_PAGINAS.length - 1 ? " subitem-ultimo" : ""}`}
              >
                {item.rotulo}
              </Link>
            ))}
            <Link href="/contato">Contato</Link>
            <Link href="/curriculo" className="botao-cv">
              Cadastrar Currículo
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
