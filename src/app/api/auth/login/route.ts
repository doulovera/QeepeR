import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, createSessionCookie } from "@/lib/firebase/admin";

interface Body {
  idToken: string
}

export async function POST(request: NextRequest) {
  const body: Body = await request.json()

  if (!body.idToken) {
    return new Response('idToken is required', { status: 400 })
  }

  const { idToken } = body

  const expiresIn  = 60 * 60 * 24 * 5 * 1000 // 5 days

  const sessionCookie = await createSessionCookie(idToken, expiresIn)

  cookies().set(COOKIE_NAME, sessionCookie, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: true,
  })

  return NextResponse.json({
    success: true,
    message: 'Logged in successfully',
  })
}
