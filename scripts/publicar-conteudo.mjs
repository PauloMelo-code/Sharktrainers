/**
 * Publica no banco o conteúdo de scripts/conteudo-inicial.json que ainda não
 * está lá.
 *
 *   node scripts/publicar-conteudo.mjs
 *   node scripts/publicar-conteudo.mjs --simular    mostra o que faria, sem gravar
 *
 * Diferente da carga inicial (scripts/migrar.mjs), que só age num banco vazio,
 * este comando serve para acrescentar conteúdo novo a um site que já está no ar.
 *
 * Ele compara pelo id e **só insere o que falta**. Nunca altera nem apaga o que
 * já existe: se a Vanessa editou uma vaga pelo painel, a edição fica de pé; se
 * ela apagou uma vaga de propósito, este comando a traz de volta — por isso ele
 * é manual, e não roda sozinho a cada publicação.
 *
 * Rodar de novo sem novidade no arquivo não faz nada.
 *
 * Só usa dependências de produção: sem drizzle-kit e sem tsx.
 */
import { readFile } from "node:fs/promises";

import postgres from "postgres";

const url = process.env.DATABASE_URL;

if (!url) {
  console.error("DATABASE_URL não definida.");
  process.exit(1);
}

const simular = process.argv.slice(2).includes("--simular");

const conteudo = JSON.parse(
  await readFile(new URL("./conteudo-inicial.json", import.meta.url), "utf8"),
);

const cliente = postgres(url, { max: 1, onnotice: () => {} });

/** Ids que já estão no banco, para não tentar gravar duas vezes. */
async function idsExistentes(tabela) {
  const linhas = await cliente`select id from ${cliente(tabela)}`;
  return new Set(linhas.map((linha) => linha.id));
}

const inserir = {
  vagas: (v) => cliente`
    insert into vagas (id, cargo, cidades, destaques, telefone, descricao, status, fixada, arte, foto, publicada_em)
    values (${v.id}, ${v.cargo}, ${v.cidades}, ${v.destaques}, ${v.telefone}, ${v.descricao},
            ${v.status}, ${v.fixada}, ${v.arte}, ${v.foto}, ${v.publicada_em}::timestamptz)
  `,
  artigos: (a) => cliente`
    insert into artigos (id, icone, titulo, resumo, link, tags, categoria, capa, status, publicado_em)
    values (${a.id}, ${a.icone}, ${a.titulo}, ${a.resumo}, ${a.link}, ${a.tags},
            ${a.categoria}, ${a.capa}, ${a.status}, ${a.publicado_em}::timestamptz)
  `,
  parceiros: (p) => cliente`
    insert into parceiros (id, titulo, tipo, descricao, link, cta, ordem)
    values (${p.id}, ${p.titulo}, ${p.tipo}, ${p.descricao}, ${p.link}, ${p.cta}, ${p.ordem})
  `,
};

/** Como identificar cada item no resumo impresso no fim. */
const rotulo = {
  vagas: (v) => `${v.cargo} — ${JSON.parse(v.cidades).join(", ")}`,
  artigos: (a) => a.titulo,
  parceiros: (p) => p.titulo,
};

try {
  let total = 0;

  for (const tabela of ["vagas", "artigos", "parceiros"]) {
    const existentes = await idsExistentes(tabela);
    const faltando = conteudo[tabela].filter((item) => !existentes.has(item.id));

    if (faltando.length === 0) {
      console.log(`${tabela}: nada novo.`);
      continue;
    }

    for (const item of faltando) {
      if (!simular) await inserir[tabela](item);
      console.log(`${simular ? "[simulação] " : ""}${tabela}: + ${rotulo[tabela](item)}`);
    }

    total += faltando.length;
  }

  console.log(
    total === 0
      ? "\nO banco já está em dia com o arquivo de conteúdo."
      : `\n${total} ${total === 1 ? "item publicado" : "itens publicados"}${simular ? " (simulação: nada foi gravado)" : "."}`,
  );
} catch (erro) {
  console.error("Falha ao publicar o conteúdo:", erro);
  process.exit(1);
} finally {
  await cliente.end();
}
