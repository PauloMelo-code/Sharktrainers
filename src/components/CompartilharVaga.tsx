"use client";

import { useEffect, useState } from "react";

import { MARCA, compartilharWhatsApp } from "@/lib/config";

type Props = {
  cargo: string;
  cidades: string[];
};

/** Linha "Compartilhar" da página da vaga. O link sai com a URL real da página. */
export function CompartilharVaga({ cargo, cidades }: Props) {
  const [url, setUrl] = useState("");
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(url || window.location.href);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2600);
    } catch {
      // Navegador sem permissão de área de transferência: o link continua visível na barra.
    }
  }

  const mensagem = `Vaga de ${cargo} em ${cidades.join(", ")} — Shark Trainers: ${url}`;

  return (
    <div className="compartilhar">
      <span className="titulo">Compartilhar</span>
      <a
        href={compartilharWhatsApp(mensagem)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-linha"
      >
        WhatsApp
      </a>
      <a href={MARCA.instagram} target="_blank" rel="noopener noreferrer" className="btn-linha">
        Instagram
      </a>
      <button type="button" className="btn-linha" onClick={copiar}>
        {copiado ? "Link copiado ✓" : "Copiar link"}
      </button>
    </div>
  );
}
