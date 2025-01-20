import { NextResponse } from "next/server";

const publicPages = [
  "/",
  "/login",
  "/signup",
  "/forgotpassword",
  "/resetpassword",
];

const protectedPages = [
  "/dashboard",
  // Add other protected pages here if needed
];

export default function middleware(req) {
  const { pathname } = req.nextUrl;
  const authToken = req.cookies.get("sessionToken")?.value;

  // Check if the current page is a public or protected page
  const isPublicPage = publicPages.includes(pathname);
  const isProtectedPage = protectedPages.includes(pathname);

  // If not authenticated and trying to access a protected page, redirect to login
  if (!authToken && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If authenticated and trying to access a public page, redirect to the dashboard
  if (authToken && isPublicPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Continue to the requested page if no redirection is needed
  return NextResponse.next();
}

// Define which paths the middleware should match
export const config = {
  // Apply the middleware to all pages except for certain public assets
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
