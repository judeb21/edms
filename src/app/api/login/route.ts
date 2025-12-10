import { NextResponse } from "next/server";
import { getSmartUserBaseUrl } from "@/constant/envCalls";
import { AxiosError } from "axios";

const baseUrl = getSmartUserBaseUrl();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Proxy the login request to your backend
    const backendRes = await fetch(`${baseUrl}/authentication/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const contentType = backendRes.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (!backendRes.ok) {
      const errorData: AxiosError = isJson
        ? await backendRes.json()
        : { message: await backendRes.text() };

      return NextResponse.json(errorData, {
        status: backendRes.status,
        statusText: errorData.message,
      });
    }

    const data = await backendRes.json();

    // Pull token from response (customize if needed)
    const token = data?.data?.tokenDetails?.access_token;
    const user = data?.data?.profile;

    if (!token) {
      return new NextResponse("Token not found in response", { status: 400 });
    }

    // Set cookie with token
    const response = NextResponse.json({ success: true, data });

    // Set token in cookie
    response.cookies.set("cred-crm-ticket-tok", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      // domain: ".digitvant.com",
      maxAge: 60 * 60 * 24, // 1 day
    });

    // Set user object in cookies
    response.cookies.set("cred-crm-ticket-auth-user", JSON.stringify(user), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      // domain: ".digitvant.com",
      maxAge: 60 * 60 * 24, // A day
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
