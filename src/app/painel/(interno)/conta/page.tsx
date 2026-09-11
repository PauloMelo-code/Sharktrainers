import { FormularioSenha } from "@/components/painel/FormularioSenha";
import { sessaoAtual } from "@/lib/sessao";

export const dynamic = "force-dynamic";

export default async function PainelConta() {
  const sessao = await sessaoAtual();

  return (
    <>
      <h1 className="painel-titulo">Minha conta</h1>
      <p className="painel-intro" style={{ marginBottom: 18 }}>
        Você está logada como <strong>{sessao?.usuario}</strong>. Troque a senha inicial assim que
        possível e não compartilhe o acesso: o painel mostra dados pessoais dos candidatos.
      </p>

      <FormularioSenha />
    </>
  );
}
