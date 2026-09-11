import { atualizarPedido, excluirPedido } from "@/actions/painel";
import { STATUS_ANUNCIO } from "@/lib/config";
import { listarPedidos } from "@/lib/painel";

export const dynamic = "force-dynamic";

const classeStatus: Record<string, string> = {
  pendente: "etiqueta-pendente",
  "em contato": "etiqueta-em-contato",
  publicado: "etiqueta-publicado",
  recusado: "etiqueta-recusado",
};

export default async function PainelAnuncios() {
  const pedidos = await listarPedidos();

  return (
    <>
      <h1 className="painel-titulo">Pedidos de anúncio</h1>
      <p className="painel-intro" style={{ marginBottom: 18 }}>
        Pedidos enviados pelo formulário “Anuncie Aqui”. Abra para mudar o status e anotar.
      </p>

      {pedidos.length === 0 ? (
        <div className="vazio-painel">Nenhum pedido recebido ainda.</div>
      ) : (
        <div className="lista-painel">
          {pedidos.map((pedido) => (
            <details
              key={pedido.id}
              style={{
                background: "var(--branco)",
                border: "1px solid var(--borda)",
                borderRadius: 6,
                overflow: "hidden",
              }}
            >
              <summary
                style={{
                  padding: "14px 16px",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                }}
              >
                <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                  <div
                    style={{
                      font: "800 20px/1.05 var(--fonte-titulo)",
                      textTransform: "uppercase",
                    }}
                  >
                    {pedido.empresa}
                  </div>
                  <div className="subtitulo">
                    {pedido.cargo} · {pedido.cidade} · {pedido.responsavel} · {pedido.whatsapp}
                  </div>
                </div>
                <span style={{ font: "400 12px var(--fonte)", color: "var(--cinza-claro)" }}>
                  {pedido.dataLabel}
                </span>
                <span
                  className={`etiqueta-status ${classeStatus[pedido.status] ?? "etiqueta-status"}`}
                >
                  {pedido.status}
                </span>
              </summary>

              <div
                style={{
                  borderTop: "1px solid #f0f0f0",
                  padding: 16,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                  background: "#fffdf5",
                }}
              >
                <div>
                  <div className="ficha-rotulo">Descrição da vaga</div>
                  <p style={{ font: "400 14px/1.5 var(--fonte)", margin: "0 0 10px" }}>
                    {pedido.descricao || "—"}
                  </p>
                  <div className="ficha-rotulo">E-mail</div>
                  <div style={{ font: "400 14px var(--fonte)", wordBreak: "break-all" }}>
                    {pedido.email || "—"}
                  </div>
                  <div className="ficha-rotulo" style={{ marginTop: 10 }}>
                    WhatsApp
                  </div>
                  <a
                    href={`https://wa.me/55${pedido.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ font: "600 14px var(--fonte)" }}
                  >
                    Falar com {pedido.responsavel}
                  </a>
                </div>

                <form action={atualizarPedido}>
                  <input type="hidden" name="id" value={pedido.id} />
                  <label className="rotulo-campo" htmlFor={`status-${pedido.id}`}>
                    Status
                  </label>
                  <select
                    id={`status-${pedido.id}`}
                    name="status"
                    className="entrada"
                    defaultValue={pedido.status}
                    style={{ marginBottom: 12 }}
                  >
                    {STATUS_ANUNCIO.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <label className="rotulo-campo" htmlFor={`obs-${pedido.id}`}>
                    Observações
                  </label>
                  <textarea
                    id={`obs-${pedido.id}`}
                    name="obs"
                    rows={3}
                    className="entrada"
                    defaultValue={pedido.obs}
                  />

                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    <button type="submit" className="botao-painel botao-painel-escuro">
                      Salvar
                    </button>
                    <button
                      type="submit"
                      formAction={excluirPedido}
                      className="botao-painel botao-painel-perigo"
                    >
                      Excluir
                    </button>
                  </div>
                </form>
              </div>
            </details>
          ))}
        </div>
      )}
    </>
  );
}
