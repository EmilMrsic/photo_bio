import { NextResponse } from "next/server"

// Public API routes that don't require authentication
const PUBLIC_API_ROUTES = [
  "/api/prefetch-provider",  // Called during login before auth
]

export function middleware(req: Request) {
  const url = new URL(req.url)
  const pathname = url.pathname

  // Skip authentication check for public routes
  if (PUBLIC_API_ROUTES.some(route => pathname === route)) {
    return NextResponse.next()
  }

  const expected = process.env.API_ACCESS_TOKEN
  const got = req.headers.get("authorization") || ""

  const ok = Boolean(expected) && got.startsWith("Bearer ") && got.slice(7).trim() === expected

  const isApi = pathname.startsWith("/api/")
  if (isApi && !ok) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"]
}
