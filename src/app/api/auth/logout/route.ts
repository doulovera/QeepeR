import { deleteCookieSession } from "@/data/services/session-service";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await deleteCookieSession()
  
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  })
}
