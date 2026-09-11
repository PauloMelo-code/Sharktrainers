import Link from "next/link";

import { sair } from "@/actions/painel";
import { MenuPainel } from "@/components/painel/MenuPainel";
import { sessaoAtual } from "@/lib/sessao";

export const dynamic = "force-dynamic";

export default async function LayoutInterno({ children }: { children: React.ReactNode }) {
  const sessao = await sessaoAtual();

  return (
    <div className="painel">
      <div className="painel-topo">
        <div className="marca">
          <div className="caixa-logo">
            <img src="/assets/logo-t.png" alt="" />
          </div>
          <span className="etiqueta">Painel</span>
        </div>
        <div className="acoes">
          {sessao && (
            <span style={{ font: "500 13px var(--fonte)", color: "#b5b5b5" }}>{sessao.nome}</span>
          )}
          <Link href="/" className="link-topo" target="_blank">
            Ver site ↗
          </Link>
          <form action={sair}>
            <button type="submit" className="painel-sair">
              Sair
            </button>
          </form>
        </div>
      </div>

      <div className="painel-corpo">
        <MenuPainel />
        <div className="painel-conteudo">{children}</div>
      </div>
    </div>
  );
}
