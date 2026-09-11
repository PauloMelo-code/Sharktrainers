import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <div className="pagina">
      <main
        className="conteudo container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          paddingBlock: 100,
          gap: 16,
        }}
      >
        <img src="/assets/logo-t.png" alt="Shark Trainers" style={{ height: 120 }} />
        <h1 className="titulo-pagina" style={{ margin: 0 }}>
          Página não encontrada
        </h1>
        <p className="texto" style={{ maxWidth: 460 }}>
          O endereço não existe ou a vaga que você procurava saiu do ar. Veja as vagas abertas no
          canal de empregos.
        </p>
        <div className="acoes" style={{ justifyContent: "center" }}>
          <Link href="/" className="btn btn-primario">
            Voltar para a home
          </Link>
          <Link href="/empregos" className="btn btn-contorno">
            Ver vagas abertas
          </Link>
        </div>
      </main>
    </div>
  );
}
