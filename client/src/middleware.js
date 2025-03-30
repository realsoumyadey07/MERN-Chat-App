import { NextResponse } from "next/server";

export function middleware(request) {
  const cookies = request.cookies;
  const access_token = cookies.get("access_token")?.value;
  console.log("middleware ran");

  const publicPaths = ["/authentication"];

  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  if (request.nextUrl.pathname === "/") {
    return NextResponse.next();
  }

  if (isPublicPath) {
    if (access_token) {
      return NextResponse.redirect(new URL("/conversations", request.url));
    }
  } else {
    if (!access_token) {
      return NextResponse.redirect(new URL("/authentication", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
