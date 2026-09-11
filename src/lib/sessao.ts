import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const COOKIE_SESSAO = "shark_sessao";
const DURACAO_HORAS = 12;

function chave() {
  const segredo = process.env.SESSION_SECRET;
  if (!segredo || segredo.length < 16) {
    throw new Error(
      "SESSION_SECRET ausente ou muito curta. Gere uma com: openssl rand -base64 32",
    );
  }
  return new TextEncoder().encode(segredo);
}

export type Sessao = { id: string; usuario: string; nome: string };

export async function assinarSessao(sessao: Sessao) {
  return new SignJWT({ ...sessao })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DURACAO_HORAS}h`)
    .sign(chave());
}

/** Valida o token. Devolve null quando está ausente, expirado ou adulterado. */
export async function verificarSessao(token: string | undefined): Promise<Sessao | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, chave(), { algorithms: ["HS256"] });
    if (!payload.id || !payload.usuario) return null;
    return {
      id: String(payload.id),
      usuario: String(payload.usuario),
      nome: String(payload.nome ?? payload.usuario),
    };
  } catch {
    return null;
  }
}

export async function abrirSessao(sessao: Sessao) {
  const token = await assinarSessao(sessao);
  const armazem = await cookies();
  armazem.set(COOKIE_SESSAO, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DURACAO_HORAS * 60 * 60,
  });
}

export async function encerrarSessao() {
  const armazem = await cookies();
  armazem.delete(COOKIE_SESSAO);
}

/** Sessão atual, para uso nas páginas e actions do painel. */
export async function sessaoAtual(): Promise<Sessao | null> {
  const armazem = await cookies();
  return verificarSessao(armazem.get(COOKIE_SESSAO)?.value);
}

/** Usado nas actions: interrompe a operação se ninguém estiver logado. */
export async function exigirSessao(): Promise<Sessao> {
  const sessao = await sessaoAtual();
  if (!sessao) throw new Error("Sessão expirada. Entre no painel novamente.");
  return sessao;
}
