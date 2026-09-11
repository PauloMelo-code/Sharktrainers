import Link from "next/link";

import { ArteVaga } from "@/components/ArteVaga";
import type { VagaDecorada } from "@/lib/dados";

export function CardVaga({ vaga }: { vaga: VagaDecorada }) {
  return (
    <Link
      href={`/vaga/${vaga.id}`}
      className={`card-vaga${vaga.encerrada ? " card-vaga-encerrada" : ""}`}
    >
      <div className="card-vaga-topo">
        {vaga.arte ? (
          <img src={vaga.arte} alt={`Arte da vaga de ${vaga.cargo}`} className="arte-imagem" />
        ) : (
          <ArteVaga
            cargo={vaga.cargo}
            cidades={vaga.cidades}
            destaques={vaga.destaques}
            telefone={vaga.telefone}
            foto={vaga.foto}
          />
        )}
        {vaga.fixadaNoTopo && <span className="selo selo-destaque selo-canto">Destaque</span>}
        {vaga.encerrada && <span className="selo selo-encerrada selo-canto">Vaga encerrada</span>}
      </div>
      <div className="card-vaga-corpo">
        <div className="titulo-card">{vaga.cargo}</div>
        <div className="card-vaga-cidades">{vaga.cidadesTexto}</div>
        <div className="card-vaga-data">{vaga.dataLabel}</div>
      </div>
    </Link>
  );
}
