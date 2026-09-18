import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArteVaga } from "@/components/ArteVaga";
import { CompartilharVaga } from "@/components/CompartilharVaga";
import { buscarVaga } from "@/lib/dados";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vaga = await buscarVaga(id);
  if (!vaga) return { title: "Vaga não encontrada" };
  return {
    title: `${vaga.cargo} — ${vaga.cidadesTexto}`,
    description: vaga.descricao.slice(0, 160),
    openGraph: vaga.arte ? { images: [vaga.arte] } : undefined,
  };
}

export default async function VagaPage({ params }: Props) {
  const { id } = await params;
  const vaga = await buscarVaga(id);
  if (!vaga) notFound();

  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 20px 72px" }}>
      <Link href="/empregos" className="link-voltar">
        ← Todas as vagas
      </Link>

      <div className="vaga-detalhe">
        <div className="vaga-arte">
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
          {vaga.encerrada && (
            <div className="vaga-encerrada-tarja">
              <span>Vaga encerrada</span>
            </div>
          )}
        </div>

        <div className="vaga-info">
          <div className="vaga-status">
            <span className={`selo ${vaga.encerrada ? "selo-encerrada" : "selo-destaque"}`}>
              {vaga.statusLabel}
            </span>
            <span className="data">Publicada em {vaga.dataLabel}</span>
          </div>

          <h1 className="vaga-cargo">{vaga.cargo}</h1>
          <div className="vaga-cidades">{vaga.cidadesTexto}</div>

          {vaga.destaques.length > 0 && (
            <div className="chips">
              {vaga.destaques.map((destaque) => (
                <span key={destaque} className="chip">
                  {destaque}
                </span>
              ))}
            </div>
          )}

          <p className="vaga-descricao">{vaga.descricao}</p>

          {vaga.aberta ? (
            <div className="acoes" style={{ marginBottom: 24 }}>
              <a
                href={vaga.linkCandidatura}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primario"
              >
                Quero me candidatar
              </a>
              <Link href={`/curriculo?vaga=${vaga.id}`} className="btn btn-secundario">
                Cadastrar meu currículo
              </Link>
            </div>
          ) : (
            <div className="aviso">
              Esta vaga já foi preenchida pela Shark Trainers.{" "}
              <Link href="/curriculo" style={{ fontWeight: 700 }}>
                Cadastre seu currículo
              </Link>{" "}
              para ser indicado nas próximas.
            </div>
          )}

          <CompartilharVaga cargo={vaga.cargo} cidades={vaga.cidades} />
        </div>
      </div>
    </section>
  );
}
