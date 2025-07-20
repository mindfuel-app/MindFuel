import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const publicRoutes = [
  "/",
  "/signin",
  "/signup",
  "/reestablecer-contrasena",
  "/reestablecer-contrasena/",           // opcional, por seguridad
  "/reestablecercontrasena/[token]",    // no matchea dinámicas directamente, lo solucionamos con .startsWith() abajo
  "/favicon.ico",
];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // permitir rutas públicas o dinámicas bajo /reestablecercontrasena/
  if (
    publicRoutes.some((p) => pathname === p) ||
    pathname.startsWith("/reestablecercontrasena")
  ) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/signin", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
