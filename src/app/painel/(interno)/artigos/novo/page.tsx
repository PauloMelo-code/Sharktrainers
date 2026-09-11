import { EditorArtigo } from "@/components/painel/EditorArtigo";

export const dynamic = "force-dynamic";

export default function NovoArtigoPage() {
  return (
    <>
      <h1 className="painel-titulo">Artigos</h1>
      <EditorArtigo />
    </>
  );
}
