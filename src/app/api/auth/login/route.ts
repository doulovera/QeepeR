import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/data/actions/auth-actions";

interface Body {
  idToken: string
}

export async function POST(request: NextRequest) {
  const body: Body = await request.json()

  if (!body.idToken) {
    return new Response('idToken is required', { status: 400 })
  }

  const { idToken } = body

  await createSession(idToken)

  return NextResponse.json({
    success: true,
    message: 'Logged in successfully',
  })
}