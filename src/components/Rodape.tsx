import Link from "next/link";

import { MARCA, MENSAGEM_HOME, linkWhatsApp } from "@/lib/config";
import { MENU_RODAPE } from "@/lib/navegacao";

export function Rodape() {
  const ano = new Date().getFullYear();

  return (
    <footer className="rodape">
      <div className="rodape-grade">
        <div>
          <div className="rodape-marca">
            <img src="/assets/logo-t.png" alt="Shark Trainers" />
          </div>
          <p>
            A única e exclusiva agência headhunters do setor óptico e joalheiro. Clientes em todo o
            território nacional.
          </p>
        </div>

        <div>
          <div className="rodape-titulo">Navegação</div>
          <div className="rodape-lista">
            {MENU_RODAPE.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.rotulo}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="rodape-titulo">Contato</div>
          <div className="rodape-lista">
            <a href={linkWhatsApp(MENSAGEM_HOME)} target="_blank" rel="noopener noreferrer">
              WhatsApp {MARCA.whatsappExibicao}
            </a>
            <a href={`mailto:${MARCA.email}`}>{MARCA.email}</a>
            <a href={MARCA.instagram} target="_blank" rel="noopener noreferrer">
              {MARCA.instagramHandle}
            </a>
          </div>
        </div>

        <div>
          <div className="rodape-chamada">
            Tenha um upgrade em sua carreira no setor óptico e joalheiro
          </div>
          <Link href="/curriculo" className="btn btn-primario btn-pequeno">
            Cadastre seu currículo
          </Link>
        </div>
      </div>

      <div className="rodape-base">
        <span>Copyright © Shark Trainers {ano}. Todos os direitos reservados.</span>
        <span>
          <Link href="/guia">Guia de estilo</Link>
          <Link href="/painel">Área restrita</Link>
        </span>
      </div>
    </footer>
  );
}

export function BotaoWhatsApp() {
  return (
    <a
      href={linkWhatsApp(MENSAGEM_HOME)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="whatsapp-flutuante"
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
      </svg>
    </a>
  );
}
