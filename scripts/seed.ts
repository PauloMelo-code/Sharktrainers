/**
 * Popula o banco com o conteúdo real já aprovado no protótipo:
 * as 8 vagas das artes enviadas, os 4 artigos da coluna do Sindióptica-SP,
 * depoimentos, parceiros do Marketplace e alguns registros de exemplo no painel.
 *
 * Rode com: npm run db:seed
 * É seguro rodar de novo: cada tabela é limpa antes de ser preenchida.
 */
import "dotenv/config";
import { randomUUID } from "node:crypto";

import bcrypt from "bcryptjs";

import { db } from "../src/db";
import {
  artigos,
  curriculos,
  depoimentos,
  mensagens,
  parceiros,
  pedidosAnuncio,
  usuarios,
  vagas,
} from "../src/db/schema";

const data = (iso: string) => new Date(`${iso}T12:00:00-03:00`);
const lista = (itens: string[]) => JSON.stringify(itens);

async function seed() {
  // Ordem importa: currículos apontam para vagas.
  await db.delete(curriculos);
  await db.delete(vagas);
  await db.delete(artigos);
  await db.delete(depoimentos);
  await db.delete(parceiros);
  await db.delete(pedidosAnuncio);
  await db.delete(mensagens);
  await db.delete(usuarios);

  const usuario = process.env.ADMIN_USER || "vanessa";
  const senha = process.env.ADMIN_PASSWORD || "shark2026";
  await db.insert(usuarios).values({
    id: randomUUID(),
    usuario,
    nome: "Vanessa D'Amato",
    senhaHash: await bcrypt.hash(senha, 12),
  });

  const vagasSeed = [
    {
      id: "v1",
      cargo: "Vendedores",
      cidades: lista(["Tubarão SC", "Gravataí RS"]),
      destaques: lista(["Loja rua projeção 200k", "Ganhos acima da média"]),
      descricao:
        "Rede óptica em expansão busca vendedores com experiência em varejo óptico para lojas de rua com projeção de faturamento de R$ 200 mil/mês.\n\nPerfil consultivo, foco em ticket médio e fidelização. Remuneração fixa + comissão agressiva, benefícios e plano de carreira.",
      status: "ativa",
      fixada: true,
      publicadaEm: data("2026-09-08"),
      arte: "/assets/vaga-sample.jpg",
    },
    {
      id: "v2",
      cargo: "Gerente de Ótica",
      cidades: lista(["Itapevi SP"]),
      destaques: lista(["Loja rua projeção 200k", "Ganhos acima da média"]),
      descricao:
        "Gestão completa de loja de rua com projeção de R$ 200 mil/mês: equipe, indicadores, estoque e relacionamento com laboratório.\n\nExige experiência prévia como gerente no varejo óptico.",
      status: "ativa",
      fixada: false,
      publicadaEm: data("2026-09-08"),
      arte: "/assets/vaga-itapevi.jpg",
    },
    {
      id: "v3",
      cargo: "Vendedores Óticos",
      cidades: lista(["Tubarão SC", "Araras SP", "Gravataí RS", "Osasco SP"]),
      destaques: lista(["Vaga CLT + comissões + benefícios", "Estamos selecionando os melhores"]),
      descricao:
        "Estamos selecionando os melhores para compor mais um projeto de sucesso!\n\nVaga CLT + comissões + benefícios. Agende sua seletiva pelo WhatsApp.",
      status: "ativa",
      fixada: false,
      publicadaEm: data("2026-08-19"),
      arte: "/assets/vaga-vendedores-4cidades.jpg",
    },
    {
      id: "v4",
      cargo: "Pesquisadores / Promotoras",
      cidades: lista(["São Paulo SP"]),
      destaques: lista(["Projeto Mulheres 40+", "Vaga CLT + comissões + benefícios"]),
      descricao:
        "Projeto Nunca é Tarde! Sua chance de se inserir no mercado.\n\nVaga para mulheres 40+, CLT + comissões + benefícios. Agende sua seletiva pelo WhatsApp.",
      status: "ativa",
      fixada: false,
      publicadaEm: data("2026-08-19"),
      arte: "/assets/vaga-pesquisadoras.jpg",
    },
    {
      id: "v5",
      cargo: "Vendedores para Óticas",
      cidades: lista(["Tubarão SC"]),
      destaques: lista(["Damos treinamento", "Aqui você ganha mais"]),
      descricao:
        "Nem reis nem palhaços: trabalhe por você! Aqui você ganha mais.\n\nDamos treinamento. Agende sua seletiva pelo WhatsApp.",
      status: "ativa",
      fixada: false,
      publicadaEm: data("2026-08-21"),
      arte: "/assets/vaga-tubarao.jpg",
    },
    {
      id: "v6",
      cargo: "Vendedores para Óticas",
      cidades: lista(["Araras SP"]),
      destaques: lista(["Aqui você ganha mais", "Agende sua seletiva"]),
      descricao:
        "Nem reis nem palhaços: trabalhe por você! Aqui você ganha mais.\n\nAgende sua seletiva pelo WhatsApp.",
      status: "ativa",
      fixada: false,
      publicadaEm: data("2026-08-21"),
      arte: "/assets/vaga-araras.jpg",
    },
    {
      id: "v7",
      cargo: "Promotores 40+",
      cidades: lista(["Osasco SP"]),
      destaques: lista(["Aqui você ganha mais", "Agende sua seletiva"]),
      descricao:
        "Nem reis nem palhaços: trabalhe por você! Aqui você ganha mais.\n\nVaga para promotores 40+. Agende sua seletiva pelo WhatsApp.",
      status: "encerrada",
      fixada: false,
      publicadaEm: data("2026-08-21"),
      arte: "/assets/vaga-osasco.jpg",
    },
    {
      id: "v8",
      cargo: "Optometrista",
      cidades: lista(["Curitiba PR"]),
      destaques: lista(["Consultório equipado", "CLT + comissão"]),
      descricao: "Vaga preenchida em 12 dias pela Shark Trainers.",
      status: "encerrada",
      fixada: false,
      publicadaEm: data("2026-07-22"),
      arte: null,
    },
  ];
  await db.insert(vagas).values(vagasSeed);

  await db.insert(artigos).values([
    {
      id: "a36",
      icone: "chuva",
      titulo: "E agora choveu, as vendas encolheram?",
      resumo:
        "Coluna Mapeamento de Vendas, artigo 36. Choveu, o movimento caiu e a equipe já tem a desculpa pronta. Vanessa mostra como transformar um dia vazio em dia de base: recontato de clientes com receita vencendo, revisão de orçamentos em aberto e treino de abordagem.\n\nA leitura fecha com um roteiro de ligações que qualquer vendedor consegue fazer em uma tarde parada.",
      link: "https://www.sindioptica-sp.com.br/coluna-vanessa-36/",
      tags: lista(["#vendas", "#varejooptico", "#mapeamentodevendas"]),
      categoria: "Vendas",
      publicadoEm: data("2026-09-09"),
      capa: "/assets/artigo-sample.jpg",
      status: "publicado",
    },
    {
      id: "a35",
      icone: "bussola",
      titulo: "Street Marketing: como atrair clientes e aumentar o fluxo na sua óptica",
      resumo:
        'Um cliente guiado jamais perderá o caminho para sua loja. No 35º artigo da coluna, Vanessa mostra como o promotor de rua deixou de ser "quem distribui panfleto" e virou o profissional mais estratégico para gerar fluxo e exames visuais.\n\nPerguntas de abordagem que fazem o cliente refletir sobre a própria visão, mapeamento de bairros, parcerias com sindicatos e associações, campanhas sazonais e um roteiro pronto de telemarketing para o Dia dos Pais.',
      link: "https://www.sindioptica-sp.com.br/coluna-vanessa-35/",
      tags: lista(["#streetmarketing", "#fluxodeloja", "#mapeamentodevendas"]),
      categoria: "Vendas",
      publicadoEm: data("2026-08-05"),
      capa: "/assets/artigo-35.jpg",
      status: "publicado",
    },
    {
      id: "a34",
      icone: "rota",
      titulo: "Recalcule a rota da sua ótica para vender mais no 2º semestre",
      resumo:
        "Recalcule a rota e viva as novas estações. O 34º artigo transforma o calendário em ferramenta de vendas: férias de julho, Dia dos Pais, primavera, Dia das Crianças, Black November e o mês de ouro de dezembro, cada um com campanhas e brindes sugeridos.\n\nVanessa também detalha a venda pelos cinco sentidos, da vitrine ao café servido, e lembra: a experiência supera o desconto, sempre.",
      link: "https://www.sindioptica-sp.com.br/coluna-vanessa-34/",
      tags: lista(["#planejamento", "#experienciadocliente", "#mapeamentodevendas"]),
      categoria: "Gestão",
      publicadoEm: data("2026-07-01"),
      capa: "/assets/artigo-34.jpg",
      status: "publicado",
    },
    {
      id: "a30",
      icone: "parceria",
      titulo: "Networking no mercado óptico e o impacto da Expo Óptica 2026",
      resumo:
        "Do contato à oportunidade. No 30º artigo, Vanessa explica por que o networking é o ativo invisível que move o setor óptico, um ecossistema fechado onde indústria, laboratórios, distribuidores e varejo dependem de relacionamento.\n\nA Expo Óptica 2026 aparece como termômetro do mercado: entre 10 e 30 novos contatos relevantes e 3 a 5 oportunidades reais de negócio por participante.",
      link: "https://www.sindioptica-sp.com.br/coluna-vanessa-30/",
      tags: lista(["#networking", "#expooptica", "#mapeamentodevendas"]),
      categoria: "Mercado",
      publicadoEm: data("2026-03-13"),
      capa: "/assets/artigo-30.jpg",
      status: "publicado",
    },
  ]);

  // Depoimentos de demonstração. A Vanessa vai substituir pelos reais do
  // Instagram no painel (Painel → Depoimentos).
  await db.insert(depoimentos).values([
    {
      id: "d1",
      tipo: "Candidato recolocado",
      nome: "Rafael Menezes",
      cargo: "Gerente de loja · Campinas SP",
      texto:
        "Mandei o currículo numa terça e na sexta já estava em entrevista com a rede. A Vanessa me preparou para a conversa e negociou o pacote. Hoje coordeno duas lojas.",
      ordem: 1,
    },
    {
      id: "d2",
      tipo: "Empresa",
      nome: "Ótica Vista Alegre",
      cargo: "Sócia-proprietária · Santos SP",
      texto:
        "Precisávamos de um time inteiro para a inauguração. A Shark entregou quatro vendedores treinados em três semanas, com garantia. Foi a contratação mais tranquila que já fizemos.",
      ordem: 2,
    },
    {
      id: "d3",
      tipo: "Candidata recolocada",
      nome: "Juliana Prado",
      cargo: "Optometrista · Curitiba PR",
      texto:
        "O canal de vagas é o único que fala a língua do setor. Achei a vaga certa, na minha cidade, e o processo foi direto pelo WhatsApp.",
      ordem: 3,
    },
    {
      id: "d4",
      tipo: "Empresa",
      nome: "Rede Visão Total",
      cargo: "Diretor comercial · Porto Alegre RS",
      texto:
        "Já contratamos gerentes em três estados com a Shark. O filtro deles poupa semanas de entrevistas com candidatos fora do perfil.",
      ordem: 4,
    },
  ]);

  await db.insert(parceiros).values([
    {
      id: "m1",
      titulo: "Ivision",
      tipo: "Tecnologia · Lentes",
      descricao:
        "Para personalizar lentes corretivas de grau, ofereça ao seu cliente a tecnologia de inteligência artificial do Ivision. A Shark é parceira oficial.",
      link: "https://wa.me/5511978398648",
      cta: "Mais informações",
      ordem: 1,
    },
    {
      id: "m2",
      titulo: "Sindióptica-SP",
      tipo: "Sindicato · Associação",
      descricao:
        "Esteja por dentro de tudo que acontece no setor: respaldo jurídico, benefícios, indicadores, suporte e cursos de capacitação.",
      link: "https://www.sindioptica-sp.com.br",
      cta: "Saiba mais",
      ordem: 2,
    },
    {
      id: "m4",
      titulo: "Abióptica",
      tipo: "Associação · Indústria",
      descricao:
        "Principais tendências, indicadores e tecnologias do setor óptico, com suporte para indústrias e redes de franquias do varejo.",
      link: "https://www.abioptica.com.br",
      cta: "Saiba mais",
      ordem: 3,
    },
  ]);

  // Currículos e pedidos de exemplo, só para o painel não abrir vazio.
  // Os arquivos não existem em disco: o painel avisa quando o arquivo sumiu.
  await db.insert(curriculos).values([
    {
      id: "c1",
      nome: "Mariana Costa",
      email: "mariana.costa@email.com",
      telefone: "(11) 98877-1122",
      cidade: "São Paulo SP",
      cargo: "Gerente",
      anos: "5 a 10 anos",
      salario: "R$ 6.500",
      mensagem: "Gerente há 6 anos em rede de shopping, equipe de 10.",
      arquivoNome: "mariana-costa-cv.pdf",
      arquivoPath: "exemplo-mariana-costa.pdf",
      arquivoTipo: "application/pdf",
      status: "novo",
      vagaId: "v2",
      criadoEm: data("2026-09-10"),
    },
    {
      id: "c2",
      nome: "Pedro Alves",
      email: "pedro.alves@email.com",
      telefone: "(48) 99911-2233",
      cidade: "Tubarão SC",
      cargo: "Vendedor(a)",
      anos: "3 a 5 anos",
      mensagem: "Vendedor em ótica de rua, forte em lentes multifocais.",
      arquivoNome: "pedro-alves.pdf",
      arquivoPath: "exemplo-pedro-alves.pdf",
      arquivoTipo: "application/pdf",
      status: "em análise",
      obs: "Bom para a vaga de Tubarão. Ligar quinta.",
      vagaId: "v1",
      criadoEm: data("2026-09-09"),
    },
    {
      id: "c3",
      nome: "Camila Duarte",
      email: "camila.d@email.com",
      telefone: "(41) 98765-4321",
      cidade: "Curitiba PR",
      cargo: "Optometrista",
      anos: "1 a 3 anos",
      salario: "R$ 4.800",
      linkedin: "linkedin.com/in/camiladuarte",
      arquivoNome: "camila-duarte.docx",
      arquivoPath: "exemplo-camila-duarte.docx",
      arquivoTipo: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      status: "contatado",
      obs: "Entrevista marcada 12/09.",
      vagaId: "v3",
      criadoEm: data("2026-09-07"),
    },
    {
      id: "c4",
      nome: "Lucas Ferreira",
      email: "lucas.f@email.com",
      telefone: "(31) 99123-4567",
      cidade: "Belo Horizonte MG",
      cargo: "Consultor(a) Óptico",
      anos: "Mais de 10 anos",
      salario: "R$ 5.000",
      mensagem: "Consultor de lentes premium, ex-gerente.",
      arquivoNome: "lucas-ferreira.pdf",
      arquivoPath: "exemplo-lucas-ferreira.pdf",
      arquivoTipo: "application/pdf",
      status: "novo",
      criadoEm: data("2026-09-06"),
    },
    {
      id: "c5",
      nome: "Ana Beatriz Lima",
      email: "anab@email.com",
      telefone: "(21) 97777-8888",
      cidade: "Rio de Janeiro RJ",
      cargo: "Vendedor(a)",
      anos: "Menos de 1 ano",
      arquivoNome: "ana-lima.pdf",
      arquivoPath: "exemplo-ana-lima.pdf",
      arquivoTipo: "application/pdf",
      status: "arquivado",
      obs: "Sem experiência no setor.",
      criadoEm: data("2026-08-30"),
    },
  ]);

  await db.insert(pedidosAnuncio).values([
    {
      id: "p1",
      empresa: "Ótica Horizonte",
      responsavel: "Marcos Teixeira",
      whatsapp: "(19) 99888-7766",
      email: "marcos@oticahorizonte.com.br",
      cidade: "Campinas SP",
      cargo: "Gerente",
      descricao: "Gerente para loja nova em shopping, abertura em outubro.",
      status: "pendente",
      criadoEm: data("2026-09-10"),
    },
    {
      id: "p2",
      empresa: "Visão & Cia",
      responsavel: "Renata Souza",
      whatsapp: "(62) 98111-2222",
      cidade: "Goiânia GO",
      cargo: "Vendedor(a)",
      descricao: "2 vendedores com experiência em multifocais.",
      status: "em contato",
      obs: "Enviar proposta plano Destaque.",
      criadoEm: data("2026-09-08"),
    },
    {
      id: "p3",
      empresa: "Ótica Central",
      responsavel: "João Pedro",
      whatsapp: "(71) 99555-4444",
      email: "joao@oticacentral.com",
      cidade: "Salvador BA",
      cargo: "Optometrista",
      status: "publicado",
      criadoEm: data("2026-08-30"),
    },
  ]);

  await db.insert(mensagens).values([
    {
      id: "k1",
      nome: "Fernanda Rocha",
      contato: "(11) 96666-1234",
      mensagem: "Quero saber sobre o treinamento de equipe para 3 lojas.",
      criadoEm: data("2026-09-09"),
    },
    {
      id: "k2",
      nome: "Diego Martins",
      contato: "diego@email.com",
      mensagem: "Vocês atendem joalheria em Recife?",
      criadoEm: data("2026-09-05"),
    },
  ]);

  console.log("Banco populado.");
  console.log(`Painel: usuário "${usuario}" / senha "${senha}" (troque depois de entrar).`);
}

seed()
  .then(() => process.exit(0))
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  });
