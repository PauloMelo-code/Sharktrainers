import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guia de estilo",
  description: "Cores, tipografia, botões e elementos gráficos da identidade Shark Trainers.",
};

const CORES = [
  { nome: "Amarelo principal", valor: "#F4C01C", uso: "botões, destaques" },
  { nome: "Amarelo claro", valor: "#F8D86C", uso: "hover, fundos suaves" },
  { nome: "Preto", valor: "#000000", uso: "títulos, blocos" },
  { nome: "Off-white", valor: "#F8F8F8", uso: "fundo geral" },
  { nome: "Cinza médio", valor: "#505050", uso: "texto secundário" },
  { nome: "Vinho", valor: "#8B1A3A", uso: "palavras-chave, rótulos" },
];

export default function GuiaPage() {
  return (
    <section className="guia">
      <div>
        <div className="rotulo">Guia de estilo</div>
        <h1 className="titulo-pagina" style={{ margin: 0 }}>
          Identidade Shark Trainers
        </h1>
      </div>

      <div>
        <h2>Cores</h2>
        <div className="grade-cores">
          {CORES.map((cor) => (
            <div key={cor.valor} className="amostra-cor">
              <div
                className="cor"
                style={{
                  background: cor.valor,
                  borderBottom: cor.valor === "#F8F8F8" ? "1px solid var(--borda)" : undefined,
                }}
              />
              <div className="legenda">
                {cor.nome}
                <small>
                  {cor.valor} · {cor.uso}
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2>Tipografia</h2>
        <div className="painel-guia" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div
              style={{
                font: "800 56px/1 var(--fonte-titulo)",
                textTransform: "uppercase",
              }}
            >
              Barlow Condensed 800
            </div>
            <div className="texto-pequeno" style={{ marginTop: 6, fontSize: 13 }}>
              Títulos H1–H2, caixa alta, entrelinha 1.0
            </div>
          </div>
          <div>
            <div className="titulo-card">Barlow Condensed 22px</div>
            <div className="texto-pequeno" style={{ marginTop: 6, fontSize: 13 }}>
              Títulos de card
            </div>
          </div>
          <div className="rotulo" style={{ margin: 0 }}>
            Rótulo de seção · Barlow 700 12px
          </div>
          <div className="texto" style={{ margin: 0 }}>
            Barlow 400 16–18px para corpo de texto, cinza médio sobre off-white. Entrelinha 1.55.
          </div>
          <div>
            <div
              style={{
                font: "700 36px/1.15 var(--fonte-arte)",
                color: "#fff",
                background: "#000",
                display: "inline-block",
                padding: "10px 20px",
                borderRadius: 8,
                textTransform: "uppercase",
              }}
            >
              Playfair Display
            </div>
            <div className="texto-pequeno" style={{ marginTop: 6, fontSize: 13 }}>
              Somente na arte de vaga (cargo e cidades)
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2>Botões</h2>
        <div className="painel-guia painel-guia-flex">
          <span className="btn btn-primario btn-pequeno">Primário</span>
          <span
            className="btn btn-pequeno"
            style={{ background: "var(--amarelo-claro)", color: "var(--preto)" }}
          >
            Primário · hover
          </span>
          <span className="btn btn-secundario btn-pequeno">Secundário</span>
          <span className="btn btn-contorno btn-pequeno">Contorno</span>
          <span
            className="btn btn-pequeno"
            style={{ background: "var(--borda)", color: "var(--cinza-claro)" }}
          >
            Desabilitado
          </span>
          <span
            className="btn btn-pequeno"
            style={{ background: "var(--whatsapp)", color: "#fff" }}
          >
            WhatsApp
          </span>
        </div>
      </div>

      <div>
        <h2>Campos de formulário</h2>
        <div className="painel-guia painel-guia-grade">
          <div>
            <span className="rotulo-campo">Padrão</span>
            <div className="exemplo-campo" style={{ color: "var(--cinza-claro)" }}>
              Placeholder
            </div>
          </div>
          <div>
            <span className="rotulo-campo">Foco</span>
            <div
              className="exemplo-campo"
              style={{
                borderColor: "var(--amarelo)",
                boxShadow: "0 0 0 3px var(--amarelo-claro)",
              }}
            >
              Digitando…
            </div>
          </div>
          <div>
            <span className="rotulo-campo">Erro</span>
            <div className="exemplo-campo" style={{ borderColor: "var(--vinho)" }}>
              valor inválido
            </div>
            <div className="erro-campo">Campo obrigatório</div>
          </div>
          <div>
            <span className="rotulo-campo">Preenchido</span>
            <div className="exemplo-campo" style={{ background: "var(--offwhite)" }}>
              Vanessa D&apos;Amato
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2>Elementos gráficos</h2>
        <div className="painel-guia painel-guia-flex" style={{ gap: 32 }}>
          <div className="losango" style={{ width: 56, height: 56 }}>
            <span style={{ font: "800 22px var(--fonte-titulo)" }}>1</span>
          </div>
          <div
            className="chanfrada"
            style={{
              background: "var(--preto)",
              color: "#fff",
              padding: "18px 22px",
              font: "700 14px var(--fonte)",
              ["--chanfro" as string]: "14px",
            }}
          >
            Bloco com cantos chanfrados
          </div>
          <span className="selo selo-destaque">Destaque</span>
          <span className="selo selo-encerrada">Vaga encerrada</span>
          <span className="chip">Chip de destaque</span>
          <span className="tag">#hashtag</span>
        </div>
      </div>
    </section>
  );
}
