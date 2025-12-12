import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios, { AxiosError } from "axios";

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

    // Get token from httpOnly cookie
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

    // Make request using axios
    try {
      const response = await axios({
        url: `${API_BASE_URL}${endpoint}`,
        method: method as any,
        headers,
        data: requestBody,
        validateStatus: () => true, // Don't throw on any status
      });

      // Return response with original status
      return NextResponse.json(response.data, { status: response.status });
    } catch (axiosError) {
      const error = axiosError as AxiosError;

      return NextResponse.json(
        { message: error.message, error: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}
