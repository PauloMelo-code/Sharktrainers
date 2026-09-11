import { excluirParceiro } from "@/actions/painel";
import { FormularioParceiro } from "@/components/painel/FormularioParceiro";
import { listarParceiros } from "@/lib/dados";

export const dynamic = "force-dynamic";

export default async function PainelMarketplace() {
  const parceiros = await listarParceiros();

  return (
    <>
      <h1 className="painel-titulo">Marketplace</h1>
      <p className="painel-intro" style={{ marginBottom: 18 }}>
        Parceiros exibidos na página Marketplace, na ordem definida abaixo.
      </p>

      <FormularioParceiro />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 14,
        }}
      >
        {parceiros.map((parceiro) => (
          <div
            key={parceiro.id}
            className="painel-caixa"
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            <div style={{ font: "800 22px/1 var(--fonte-titulo)", textTransform: "uppercase" }}>
              {parceiro.titulo}
            </div>
            <div className="rotulo" style={{ fontSize: 11, margin: 0 }}>
              {parceiro.tipo}
            </div>
            <p className="texto-pequeno" style={{ flex: 1 }}>
              {parceiro.descricao}
            </p>
            <div
              style={{ font: "400 12px var(--fonte)", color: "var(--cinza-claro)", wordBreak: "break-all" }}
            >
              {parceiro.link}
            </div>
            <form action={excluirParceiro}>
              <input type="hidden" name="id" value={parceiro.id} />
              <button type="submit" className="botao-painel botao-painel-perigo">
                Remover
              </button>
            </form>
          </div>
        ))}
      </div>
    </>
  );
}
