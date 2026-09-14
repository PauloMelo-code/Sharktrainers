import Link from "next/link";

import { CardArtigo } from "@/components/CardArtigo";
import { CardVaga } from "@/components/CardVaga";
import { CLIENTES, MENSAGEM_HOME, linkWhatsApp } from "@/lib/config";
import {
  CREDENCIAIS,
  PASSOS,
  listarArtigos,
  listarDepoimentos,
  vagasDestaque,
} from "@/lib/dados";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [vagas, artigos, depoimentos] = await Promise.all([
    vagasDestaque(3),
    listarArtigos(),
    listarDepoimentos(),
  ]);

  return (
    <>
      <section className="hero">
        <div className="hero-texto">
          <div className="rotulo" style={{ marginBottom: 18 }}>
            Headhunters do varejo óptico e joalheiro
          </div>
          <h1 className="titulo-hero">
            Encontre o perfil de candidato óptico através dos nossos serviços{" "}
            <span className="destaque-escuro">Headhunters</span>.
          </h1>
          <p className="texto-grande">Envie sua mensagem para maiores informações.</p>
          <div className="acoes">
            <a
              href={linkWhatsApp(MENSAGEM_HOME)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primario"
            >
              Enviar Mensagem
            </a>
            <Link href="/empregos" className="btn btn-contorno">
              Ver vagas abertas
            </Link>
          </div>
        </div>
        <div className="hero-imagem">
          <img src="/assets/hero.jpg" alt="Profissionais de ótica mostrando um par de óculos" />
        </div>
      </section>

      <section className="faixa-clientes">
        <div className="container">
          <span className="rotulo">Clientes em todo o Brasil</span>
          <div className="logos-clientes">
            {CLIENTES.map((cliente) => (
              <img
                key={cliente.arquivo}
                className={`logo-${cliente.formato}`}
                src={`/assets/clientes/${cliente.arquivo}`}
                alt={cliente.nome}
                title={cliente.nome}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container secao">
        <div className="cabecalho-secao">
          <div>
            <div className="rotulo">Canal de Empregos Óptica</div>
            <h2 className="titulo-secao">Vagas recentes</h2>
          </div>
          <Link href="/empregos" className="link-secao">
            Ver todas as vagas →
          </Link>
        </div>
        <div className="grade-vagas">
          {vagas.map((vaga) => (
            <CardVaga key={vaga.id} vaga={vaga} />
          ))}
        </div>
      </section>

      <section className="secao-branca">
        <div className="container secao">
          <div className="rotulo">Como funciona</div>
          <h2 className="titulo-secao" style={{ marginBottom: 36 }}>
            Headhunting em três passos
          </h2>
          <div className="grade-passos">
            {PASSOS.map((passo) => (
              <div key={passo.numero} className="passo">
                <div className="losango">
                  <span>{passo.numero}</span>
                </div>
                <div>
                  <div className="titulo-card" style={{ marginBottom: 8 }}>
                    {passo.titulo}
                  </div>
                  <p className="texto-pequeno">{passo.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="duas-colunas">
        <div className="bloco-preto chanfrada">
          <div className="rotulo rotulo-claro">Porque nos escolher?</div>
          <h2 className="titulo-bloco" style={{ fontSize: 40, marginBottom: 18 }}>
            Temos 20 anos de experiência
          </h2>
          <p>Somos bons para o seu negócio, já que entendemos dele como ninguém!</p>
          <p>
            Contamos com o crivo de especialistas em óticas e joalherias de mais de 20 anos de
            atuação!
          </p>
          <p style={{ marginBottom: 26 }}>
            Nossa paixão faz com que tenhamos destaque no setor e resultados assertivos.
          </p>
          <Link href="/contato" className="btn btn-primario btn-pequeno">
            Entrar em Contato
          </Link>
        </div>
        <div className="lista-textos">
          <div>
            <h3>Nossa missão</h3>
            <p>
              Criar relacionamentos além de transações comerciais com empregadores. Servir de
              suporte e de ponte para ascensão de carreira dos candidatos cadastrados em nosso banco
              de talentos.
            </p>
          </div>
          <div>
            <h3>Nossos valores</h3>
            <p>
              Conscientizar o setor óptico sobre a importância de profissionais qualificados e em
              constante desenvolvimento, para oferecer consultoria de qualidade aos pacientes com
              necessidades visuais.
            </p>
          </div>
          <div>
            <h3>Nossa visão</h3>
            <p>
              Ter junto a Shark Trainers os melhores parceiros empregadores, instituições,
              sindicatos e associações voltados ao setor óptico e joalheiro. Ser a maior rede
              headhunters do setor óptico e joalheiro do Brasil!
            </p>
          </div>
        </div>
      </section>

      <section className="secao-branca">
        <div className="container secao sobre">
          <img src="/assets/vanessa.jpg" alt="Vanessa D'Amato" className="retrato" />
          <div style={{ flex: "1 1 400px", minWidth: 0 }}>
            <div className="rotulo">Sobre nós</div>
            <h2
              className="titulo-secao"
              style={{ fontSize: 34, lineHeight: 1.05, marginBottom: 14 }}
            >
              Somos a Shark Trainers, a única agência especializada em headhunters para ópticas e
              joalheria, tendo na direção Vanessa D&apos;Amato
            </h2>
            <ul className="credenciais">
              {CREDENCIAIS.map((credencial) => (
                <li key={credencial}>{credencial}</li>
              ))}
            </ul>
            <p style={{ font: "600 16px/1.5 var(--fonte)", margin: 0 }}>
              Damos garantia da contratação do time de vendas!
            </p>
          </div>
        </div>
      </section>

      <section className="container secao">
        <div className="rotulo">Depoimentos</div>
        <h2 className="titulo-secao" style={{ marginBottom: 30 }}>
          Quem já contratou e foi contratado
        </h2>
        <div className="grade-depoimentos">
          {depoimentos.slice(0, 2).map((depoimento) => (
            <div key={depoimento.id} className="card-depoimento">
              <div className="aspas">“</div>
              <p>{depoimento.texto}</p>
              <div className="pessoa">
                <div className="avatar avatar-pequeno">{depoimento.iniciais}</div>
                <div>
                  <div className="nome">{depoimento.nome}</div>
                  <div className="cargo">{depoimento.cargo}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="secao-branca">
        <div className="container secao">
          <div className="cabecalho-secao">
            <div>
              <div className="rotulo">Mapeamento de Vendas</div>
              <h2 className="titulo-secao">Últimos artigos</h2>
            </div>
            <Link href="/artigos" className="link-secao">
              Ver mural completo →
            </Link>
          </div>
          <div className="grade-artigos">
            {artigos.slice(0, 3).map((artigo) => (
              <CardArtigo key={artigo.id} artigo={artigo} fundoClaro />
            ))}
          </div>
        </div>
      </section>

      <section className="container secao">
        <div className="chamada-final chanfrada">
          <div style={{ flex: "1 1 360px" }}>
            <h2>Tenha um upgrade em sua carreira</h2>
            <p>Setor óptico e joalheiro: cadastre seu currículo no nosso banco de talentos.</p>
          </div>
          <Link href="/curriculo" className="btn btn-secundario" style={{ padding: "18px 30px" }}>
            Cadastre seu currículo
          </Link>
        </div>
      </section>
    </>
  );
}
