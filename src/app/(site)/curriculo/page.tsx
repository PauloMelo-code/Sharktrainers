import type { Metadata } from "next";

import { FormularioCurriculo } from "@/components/FormularioCurriculo";
import { CARGOS } from "@/lib/config";
import { buscarVaga } from "@/lib/dados";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cadastrar Currículo",
  description:
    "Entre no banco de talentos do setor óptico. Seus dados são apresentados apenas a óticas com vagas compatíveis com o seu perfil e cidade.",
};

/** Escolhe a opção do seletor mais próxima do cargo da vaga. */
function cargoSugerido(cargoDaVaga: string): string {
  const alvo = cargoDaVaga.toLowerCase();
  const encontrado = CARGOS.find((cargo) => {
    const raiz = cargo.split("(")[0].toLowerCase().trim();
    return raiz.length > 2 && alvo.includes(raiz);
  });
  return encontrado ?? "Outro";
}

type Props = { searchParams: Promise<{ vaga?: string }> };

export default async function CurriculoPage({ searchParams }: Props) {
  const { vaga: vagaId } = await searchParams;
  const vaga = vagaId ? await buscarVaga(vagaId) : null;

  return (
    <section className="duas-colunas-form">
      <div className="coluna-texto">
        <div className="rotulo">Cadastrar Currículo</div>
        <h1 className="titulo-pagina">Entre no banco de talentos do setor óptico</h1>
        <p className="texto">
          Seus dados ficam com a Shark Trainers e são apresentados apenas às óticas com vagas
          compatíveis com o seu perfil e cidade.
        </p>
        {vaga && (
          <div className="destaque-vaga">
            Você está se candidatando à vaga{" "}
            <strong>
              {vaga.cargo} · {vaga.cidadesTexto}
            </strong>
            . O cargo já foi preenchido ao lado.
          </div>
        )}
      </div>

      <div className="coluna-form">
        <FormularioCurriculo
          vagaId={vaga?.id}
          cargoSugerido={vaga ? cargoSugerido(vaga.cargo) : undefined}
        />
      </div>
    </section>
  );
}
