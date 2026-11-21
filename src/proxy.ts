import { type NextRequest, NextResponse } from "next/server";
import { canManageCms } from "./features/cms/admin/access";

export function proxy(request: NextRequest) {
  if (canManageCms(request.headers)) return NextResponse.next();
  if (!process.env.B_PLATFORM_ADMIN_PASSWORD) {
    return new Response("CMS admin access has not been configured.", { status: 503 });
  }

  return new Response("CMS administrator credentials are required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="B Platform CMS", charset="UTF-8"', "Cache-Control": "no-store" },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
