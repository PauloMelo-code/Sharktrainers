import { EditorVaga } from "@/components/painel/EditorVaga";

export const dynamic = "force-dynamic";

export default function NovaVagaPage() {
  return (
    <>
      <h1 className="painel-titulo">Vagas</h1>
      <EditorVaga />
    </>
  );
}
