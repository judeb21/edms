import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_COOKIE_NAME = "cred-crm-ticket-tok";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract metadata
    const endpoint = formData.get("_endpoint") as string;
    const method = formData.get("_method") as string || "POST";
    
    // Remove metadata from FormData
    formData.delete("_endpoint");
    formData.delete("_method");

    // Get auth token
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Forward to backend
    const backendUrl = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(backendUrl, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type - let fetch handle it for FormData
      },
      body: formData,
    });

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Multipart proxy error:", error);
    return NextResponse.json(
      { message: "Multipart proxy request failed", error: String(error) },
      { status: 500 }
    );
  }
}