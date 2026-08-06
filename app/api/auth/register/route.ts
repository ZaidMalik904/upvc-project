import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUsers = await query<any[]>('SELECT id FROM admins WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // In a real app, hash the password! For this demo based on user requirement, we store as is or simple hash.
    const passwordHash = password; 

    await query(
      'INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, passwordHash]
    );

    return NextResponse.json({ message: 'Registration successful' }, { status: 201 });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
