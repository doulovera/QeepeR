import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, createSessionCookie } from "@/lib/firebase/admin";

export async function POST(request: NextRequest) {
  cookies().set(COOKIE_NAME, "", { maxAge: 0 });
  
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  })
}
