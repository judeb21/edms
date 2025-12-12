// app/api/proxy/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_COOKIE_NAME = "cred-crm-ticket-tok";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      endpoint,
      method = "GET",
      body: requestBody,
      headers: clientHeaders,
    } = body;

    // Get token from httpOnly cookie using next/headers
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

    // Prepare headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...clientHeaders,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Build fetch options
    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    // Only add body for methods that support it
    if (requestBody && method !== "GET" && method !== "HEAD") {
      fetchOptions.body =
        typeof requestBody === "string"
          ? requestBody
          : JSON.stringify(requestBody);
    }

    // Make request to actual API
    const apiResponse = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

    // Get response data
    const contentType = apiResponse.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    let data;
    try {
      data = isJson ? await apiResponse.json() : await apiResponse.text();
    } catch (parseError) {
      data = { message: `${parseError} - Failed to parse response from server` };
    }

    // Always forward the exact status and data from backend
    // This allows client to see error messages
    return NextResponse.json(data, {
      status: apiResponse.status,
      statusText: apiResponse.statusText,
    });

    // const data = isJson ? await apiResponse.json() : await apiResponse.text();
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
