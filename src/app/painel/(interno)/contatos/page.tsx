import { excluirMensagem, marcarMensagemLida } from "@/actions/painel";
import { listarMensagens } from "@/lib/painel";

export const dynamic = "force-dynamic";

export default async function PainelContatos() {
  const mensagens = await listarMensagens();

  return (
    <>
      <h1 className="painel-titulo">Contatos</h1>
      <p className="painel-intro" style={{ marginBottom: 18 }}>
        Mensagens enviadas pelo formulário de contato do site.
      </p>

      {mensagens.length === 0 ? (
        <div className="vazio-painel">Nenhuma mensagem recebida ainda.</div>
      ) : (
        <div className="lista-painel">
          {mensagens.map((mensagem) => (
            <div
              key={mensagem.id}
              className={`item-painel${mensagem.lida ? " apagado" : ""}`}
              style={{ alignItems: "flex-start" }}
            >
              <div style={{ flex: "1 1 240px", minWidth: 0 }}>
                <div style={{ font: "700 15px var(--fonte)" }}>
                  {mensagem.nome}{" "}
                  <span style={{ fontWeight: 400, color: "var(--cinza)" }}>
                    · {mensagem.contato}
                  </span>
                </div>
                <p style={{ font: "400 14px/1.5 var(--fonte)", margin: "6px 0 0" }}>
                  {mensagem.mensagem}
                </p>
              </div>

              <span style={{ font: "400 12px var(--fonte)", color: "var(--cinza-claro)" }}>
                {mensagem.dataLabel}
              </span>

              <div className="acoes">
                <form action={marcarMensagemLida}>
                  <input type="hidden" name="id" value={mensagem.id} />
                  <button type="submit" className="botao-painel">
                    {mensagem.lida ? "Marcar como nova" : "Marcar como lida"}
                  </button>
                </form>
                <form action={excluirMensagem}>
                  <input type="hidden" name="id" value={mensagem.id} />
                  <button type="submit" className="botao-painel botao-painel-perigo">
                    Excluir
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
