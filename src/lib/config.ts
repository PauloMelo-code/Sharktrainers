/** Dados de contato e identidade da marca, usados em várias telas. */
export const MARCA = {
  nome: "Shark Trainers",
  descricao: "Soluções Comerciais",
  whatsappNumero: "5511978398648",
  whatsappExibicao: "(11) 97839-8648",
  /** Telefone como aparece nas artes de vaga. */
  telefoneArte: "(011) 97839.8648",
  email: "cvshark@icloud.com",
  instagram: "https://www.instagram.com/sharktrainersopticas",
  instagramHandle: "@sharktrainersopticas",
  instagramSeguidores: "39,9 mil seguidores",
  sindioptica: "https://www.sindioptica-sp.com.br",
} as const;

/** Monta um link de WhatsApp com mensagem pronta. */
export function linkWhatsApp(mensagem: string, numero = MARCA.whatsappNumero) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

/** Link de compartilhamento (abre a lista de contatos do WhatsApp). */
export function compartilharWhatsApp(mensagem: string) {
  return `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
}

export const MENSAGEM_HOME =
  "Olá! Vim pelo site da Shark Trainers e quero mais informações sobre os serviços Headhunters.";

export const CARGOS = [
  "Vendedor(a)",
  "Gerente",
  "Optometrista",
  "Consultor(a) Óptico",
  "Outro",
] as const;

export const TEMPOS_EXPERIENCIA = [
  "Menos de 1 ano",
  "1 a 3 anos",
  "3 a 5 anos",
  "5 a 10 anos",
  "Mais de 10 anos",
] as const;

export const STATUS_CURRICULO = ["novo", "em análise", "contatado", "arquivado"] as const;
export const STATUS_ANUNCIO = ["pendente", "em contato", "publicado", "recusado"] as const;
export const CATEGORIAS_ARTIGO = ["Vendas", "Gestão", "Atendimento", "Carreira", "Mercado"] as const;

/** Ícones próprios usados nos artigos (nada de emoji no site). */
export const ICONES_ARTIGO = [
  { valor: "artigo", rotulo: "Artigo" },
  { valor: "chuva", rotulo: "Clima / sazonal" },
  { valor: "bussola", rotulo: "Direção / rota" },
  { valor: "rota", rotulo: "Planejamento" },
  { valor: "parceria", rotulo: "Parceria" },
  { valor: "alvo", rotulo: "Meta" },
  { valor: "oculos", rotulo: "Óculos" },
  { valor: "grafico", rotulo: "Indicadores" },
] as const;

/**
 * Logos da faixa "Clientes em todo o Brasil".
 *
 * Só entram aqui empresas que contrataram a Shark. Instituições e associações
 * parceiras (Abióptica, Senac) ficam no Marketplace, não nesta faixa.
 *
 * Todos aparecem em quadros do mesmo tamanho, e o `formato` diz como a imagem
 * se encaixa no quadro:
 *
 *   "selo"  — imagem quadrada, como foto de perfil. Preenche o quadro inteiro,
 *             inclusive o fundo colorido, se tiver.
 *   "marca" — logo escrito na horizontal, com fundo transparente. Fica
 *             centralizado no quadro, com uma folga em volta.
 *
 * Para incluir um cliente novo: coloque o arquivo em `public/assets/clientes/`
 * e acrescente uma linha abaixo com o nome do arquivo e o formato.
 */
export const CLIENTES = [
  { nome: "Óticas Carol", arquivo: "oticas-carol.jpg", formato: "selo" },
  { nome: "Chilli Beans", arquivo: "chilli-beans.png", formato: "marca" },
  { nome: "Mercadão dos Óculos", arquivo: "mercadao.png", formato: "marca" },
  { nome: "CNA", arquivo: "cna.jpg", formato: "selo" },
  { nome: "Ótica Visão d'Todos", arquivo: "visao-dtodos.jpg", formato: "selo" },
  { nome: "Óculos Mania", arquivo: "oculos-mania.jpg", formato: "selo" },
  { nome: "Óticas Portal", arquivo: "oticas-portal.jpg", formato: "selo" },
  { nome: "ARIA Ótica", arquivo: "aria.jpg", formato: "selo" },
  { nome: "Óticas Ferri", arquivo: "oticas-ferri.jpg", formato: "selo" },
  { nome: "QOculos", arquivo: "qoculos.jpg", formato: "selo" },
  { nome: "Oculum Ótica", arquivo: "oculum.jpg", formato: "selo" },
  { nome: "Coifeodonto", arquivo: "coifeodonto.jpg", formato: "selo" },
  { nome: "Ortho Pride", arquivo: "ortho-pride.jpg", formato: "selo" },
] as const;
