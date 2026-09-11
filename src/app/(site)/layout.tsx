import { Cabecalho } from "@/components/Cabecalho";
import { BotaoWhatsApp, Rodape } from "@/components/Rodape";

export default function LayoutSite({ children }: { children: React.ReactNode }) {
  return (
    <div className="pagina">
      <a href="#conteudo" className="pular-para-conteudo">
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <main id="conteudo" className="conteudo">
        {children}
      </main>
      <Rodape />
      <BotaoWhatsApp />
    </div>
  );
}
