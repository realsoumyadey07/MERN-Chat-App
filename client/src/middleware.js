import { NextResponse } from "next/server";

export function middleware(request) {
  const cookies = request.cookies;
  const access_token = cookies.get("access_token")?.value;
  console.log("middleware ran");
  const loggedinUserNotAccessPath =
    request.nextUrl.pathname == "/login" ||
    request.nextUrl.pathname == "/sign-up";
  if (loggedinUserNotAccessPath) {
    if (access_token) {
      return NextResponse.redirect(new URL("/conversations", request.url));
    }
  } else {
    if (!access_token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

export const config = {
  matcher: ["/conversations/:conversationId*", "/groups"],
};
