import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface Body {
  url: string
}

export async function POST(request: NextRequest) {
  const body: Body = await request.json()

  if (!body.url) {
    return new Response('url is required', { status: 400 })
  }

  const { url } = body

  return NextResponse.json({
    "success": true,
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 27 27\" shape-rendering=\"crispEdges\"><path fill=\"#ffffff\" d=\"M0 0h27v27H0z\"/><path stroke=\"#000000\" d=\"M1 1.5h7m4 0h3m4 0h7M1 2.5h1m5 0h1m2 0h2m1 0h5m1 0h1m5 0h1M1 3.5h1m1 0h3m1 0h1m1 0h5m2 0h1m2 0h1m1 0h3m1 0h1M1 4.5h1m1 0h3m1 0h1m1 0h2m2 0h4m2 0h1m1 0h3m1 0h1M1 5.5h1m1 0h3m1 0h1m1 0h5m3 0h1m1 0h1m1 0h3m1 0h1M1 6.5h1m5 0h1m1 0h2m3 0h1m1 0h1m2 0h1m5 0h1M1 7.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M9 8.5h1m2 0h1m2 0h1M1 9.5h1m1 0h5m2 0h8m1 0h5M1 10.5h1m6 0h1m2 0h2m1 0h1m2 0h1m2 0h1m3 0h1M1 11.5h2m1 0h1m2 0h2m4 0h6m3 0h1m1 0h2M1 12.5h4m1 0h1m2 0h4m2 0h4m1 0h1m4 0h1M1 13.5h1m1 0h1m1 0h3m3 0h6m1 0h2m1 0h1m1 0h3M1 14.5h4m4 0h1m4 0h1m2 0h2m1 0h1m1 0h1m1 0h1M1 15.5h1m1 0h11m1 0h2m1 0h5m1 0h2M1 16.5h1m6 0h1m1 0h1m1 0h1m2 0h1m1 0h5m3 0h1M1 17.5h1m2 0h2m1 0h4m1 0h1m3 0h6m1 0h1M9 18.5h3m1 0h2m2 0h1m3 0h2M1 19.5h7m2 0h2m2 0h2m1 0h1m1 0h1m1 0h1m1 0h3M1 20.5h1m5 0h1m1 0h1m1 0h1m1 0h2m2 0h1m3 0h2m1 0h2M1 21.5h1m1 0h3m1 0h1m1 0h1m3 0h1m1 0h7m1 0h3M1 22.5h1m1 0h3m1 0h1m1 0h3m5 0h3m1 0h5M1 23.5h1m1 0h3m1 0h1m1 0h1m2 0h2m3 0h1m4 0h2m1 0h1M1 24.5h1m5 0h1m2 0h3m2 0h4m1 0h3m2 0h1M1 25.5h7m1 0h2m1 0h1m6 0h7\"/></svg>\n"
  })
}
