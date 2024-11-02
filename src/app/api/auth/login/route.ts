import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/data/actions/auth-actions";
import { logger } from "@/data/services/logger";

interface Body {
  idToken: string
}

export async function POST(request: NextRequest) {
  try {
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
  } catch (error) {
    await logger('error', (error as Error).message)
    return NextResponse.json(
      {
        success: false,
        message: (error as Error).message
      },
      { status: 500 }
    )
  }
}
