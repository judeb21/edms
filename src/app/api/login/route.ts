import { NextResponse } from 'next/server';
import { signJWT } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Example validation (replace with your real user lookup)
  if (email === 'admin@example.com' && password === 'Test@123') {
    const token = await signJWT({ email });

    const response = NextResponse.json({ email, role: 'admin' });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return response;
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
