import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const clients = await query('SELECT * FROM clients ORDER BY created_at DESC');
    return NextResponse.json(clients);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const result: any = await query(
      `INSERT INTO clients (name, company_name, email, phone, alt_phone, gst_number, address) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name || '', 
        data.companyName || '', 
        data.email || '', 
        data.phone || '', 
        data.altPhone || '', 
        data.gstNumber || '', 
        data.address || ''
      ]
    );
    
    return NextResponse.json({ message: 'Client created', id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}
