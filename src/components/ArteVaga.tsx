import { MARCA } from "@/lib/config";

type Props = {
  cargo: string;
  cidades: string[];
  destaques: string[];
  telefone?: string;
  /** Foto de fundo (data URL ou caminho público). */
  foto?: string | null;
};

/**
 * Arte 1080×1600 no padrão da marca, montada em HTML.
 * Usada quando a vaga não tem imagem pronta e na pré-visualização do painel.
 * As medidas usam cqw (container query units) para a arte escalar em qualquer
 * largura mantendo exatamente a mesma proporção do card baixado em PNG.
 */
export function ArteVaga({ cargo, cidades, destaques, telefone, foto }: Props) {
  const estiloFundo = foto
    ? { backgroundImage: `url(${foto})`, backgroundColor: "#000" }
    : undefined;

  return (
    <div className="arte-gerada" style={estiloFundo}>
      <div className="sombra" />
      <img src="/assets/logo-t.png" alt="" className="logo" />
      <div className="cargo">
        {cargo || "CARGO"}
        {cidades.length > 0 && (
          <>
            <br />
            {cidades.join(" · ")}
          </>
        )}
      </div>
      <div className="destaques">
        {destaques[0] ?? ""}
        <br />
        {destaques[1] ?? ""}
      </div>
      <div className="telefone">{telefone || MARCA.telefoneArte}</div>
    </div>
  );
}
