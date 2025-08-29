import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const publicPages = ["/", "/auth/signup", "/auth/login", "/auth/forgotPassword", "/auth/resetPassword"];
const protectedPages = ["/expenseForm", "/expenseTable"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const sessionToken = req.cookies.get("sessionToken")?.value;
  const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAuthenticated = sessionToken || nextAuthToken;

  const isPublicPage = publicPages.includes(pathname);
  const isProtectedPage = protectedPages.some(page => pathname === page || pathname.startsWith(`${page}/`));

  if (!isAuthenticated && isProtectedPage) return NextResponse.redirect(new URL("/", req.url));
  if (isAuthenticated && isPublicPage) return NextResponse.redirect(new URL("/expenseForm", req.url));

  return NextResponse.next();
}

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] };
