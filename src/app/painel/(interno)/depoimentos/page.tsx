import { excluirDepoimento } from "@/actions/painel";
import { FormularioDepoimento } from "@/components/painel/FormularioDepoimento";
import { listarDepoimentos } from "@/lib/dados";

export const dynamic = "force-dynamic";

export default async function PainelDepoimentos() {
  const depoimentos = await listarDepoimentos();

  return (
    <>
      <h1 className="painel-titulo">Depoimentos</h1>
      <p className="painel-intro" style={{ marginBottom: 18 }}>
        Depoimentos exibidos na página pública e na Home (os dois primeiros pela ordem).
      </p>

      <FormularioDepoimento />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 14,
        }}
      >
        {depoimentos.map((depoimento) => (
          <div
            key={depoimento.id}
            className="painel-caixa"
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            <div className="rotulo" style={{ fontSize: 11, margin: 0 }}>
              {depoimento.tipo}
            </div>
            <p
              className="resumo-duas-linhas"
              style={{ WebkitLineClamp: 3, fontSize: 14, flex: 1 }}
            >
              {depoimento.texto}
            </p>
            <div style={{ font: "700 14px var(--fonte)" }}>
              {depoimento.nome}{" "}
              <span style={{ fontWeight: 400, color: "var(--cinza)" }}>· {depoimento.cargo}</span>
            </div>
            <form action={excluirDepoimento}>
              <input type="hidden" name="id" value={depoimento.id} />
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
