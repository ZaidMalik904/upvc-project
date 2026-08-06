import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const users = await query<any[]>('SELECT id, name, email, password_hash FROM admins WHERE email = ?', [email]);
    if (users.length === 0) {
      return NextResponse.json({ error: 'Account not found. Please Register First.' }, { status: 404 });
    }

    const user = users[0];
    
    // In a real app, compare hashes. We are comparing plain text per user requirement.
    if (user.password_hash !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Success
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
