/**
 * Tipos e valores iniciais compartilhados pelos formulários.
 *
 * Ficam fora dos arquivos "use server" de propósito: um módulo de Server
 * Actions só pode exportar funções assíncronas, então constantes exportadas
 * de lá chegam como `undefined` no cliente.
 */

/** Resposta dos formulários públicos: erros por campo e valores digitados. */
export type EstadoFormulario = {
  ok: boolean;
  erros: Record<string, string>;
  valores: Record<string, string>;
  /** Preenchido quando o envio deu certo, para a tela de confirmação. */
  resumo?: Record<string, string>;
};

export const ESTADO_INICIAL: EstadoFormulario = { ok: false, erros: {}, valores: {} };

/** Resposta das ações do painel. */
export type EstadoPainel = { erro?: string; ok?: boolean };

export const ESTADO_PAINEL_INICIAL: EstadoPainel = {};
