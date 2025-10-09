import { NextResponse } from "next/server"

export function middleware(req: Request) {
  const expected = process.env.API_ACCESS_TOKEN
  const got = req.headers.get("authorization") || ""

  const ok = Boolean(expected) && got.startsWith("Bearer ") && got.slice(7).trim() === expected

  const isApi = req.url.includes("/api/")
  if (isApi && !ok) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"]
}
