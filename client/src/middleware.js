import { NextResponse } from "next/server";

export function middleware(request) {
  const cookies = request.cookies;
  const access_token = cookies.get("access_token")?.value;
  console.log("middleware ran");

  // Define paths that do not require authentication
  const publicPaths = ["/login", "/sign-up", "/authentication"];

  // Check if the current path is public
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  // Allow access to the root path
  if (request.nextUrl.pathname === "/") {
    return NextResponse.next();
  }

  // Redirect logic
  if (isPublicPath) {
    if (access_token) {
      // If the user is logged in and tries to access a public path, redirect to conversations
      return NextResponse.redirect(new URL("/conversations", request.url));
    }
  } else {
    if (!access_token) {
      // If the user is not logged in and tries to access a protected path, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};