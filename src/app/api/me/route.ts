// app/api/me/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const user = (await cookies()).get("cred-crm-ticket-auth-user");
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const parsed = JSON.parse(user.value);
    return NextResponse.json({ user: parsed });
  } catch {
    return NextResponse.json({ user: null }, { status: 400 });
  }
}
