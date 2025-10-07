import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session }
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;
  const protectedPaths = ["/expeditions", "/map", "/settings"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ["/expeditions/:path*", "/map/:path*", "/settings/:path*"]
};
