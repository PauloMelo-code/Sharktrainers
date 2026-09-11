import { NextResponse, type NextRequest } from "next/server";

import { COOKIE_SESSAO, verificarSessao } from "@/lib/sessao";

/**
 * Tudo sob /painel exige sessão válida, menos a própria tela de login.
 * A verificação é feita aqui para nenhuma página do painel chegar a renderizar
 * sem autenticação.
 */
export async function middleware(requisicao: NextRequest) {
  const { pathname, search } = requisicao.nextUrl;

  const sessao = await verificarSessao(requisicao.cookies.get(COOKIE_SESSAO)?.value);
  const ehLogin = pathname === "/painel/login";

  if (!sessao && !ehLogin) {
    const destino = new URL("/painel/login", requisicao.url);
    if (pathname !== "/painel") destino.searchParams.set("proxima", `${pathname}${search}`);
    return NextResponse.redirect(destino);
  }

  if (sessao && ehLogin) {
    return NextResponse.redirect(new URL("/painel", requisicao.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/painel/:path*", "/api/painel/:path*"],
};
