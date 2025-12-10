import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // List all cookies you want to remove
  const cookiesToDelete = ["cred-crm-ticket-tok", "cred-crm-ticket-auth-user"];

  cookiesToDelete.forEach((cookie) => {
    response.cookies.set(cookie, "", { expires: new Date(0), path: "/" });
  });

  response.cookies.set("cred-crm-ticket-tok", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    // domain: ".digitvant.com",
    maxAge: 0,
  });

  response.cookies.set("cred-crm-ticket-auth-user", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    // domain: ".digitvant.com",
    maxAge: 0,
  });

  return response;
}
