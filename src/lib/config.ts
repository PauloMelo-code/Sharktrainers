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
 * Para incluir um cliente novo: coloque o PNG em `public/assets/clientes/` (fundo
 * transparente) e acrescente uma linha abaixo. A `altura` é ajustada logo a logo
 * porque cada arquivo tem uma proporção diferente — o objetivo é que todos
 * pareçam do mesmo tamanho na tela, não que tenham o mesmo número.
 */
export const CLIENTES = [
  { nome: "Óticas Carol", arquivo: "oticas-carol", altura: "26px" },
  { nome: "Chilli Beans", arquivo: "chilli-beans", altura: "56px" },
  { nome: "Mercadão dos Óculos", arquivo: "mercadao", altura: "62px" },
  { nome: "CNA", arquivo: "cna", altura: "34px" },
] as const;
