import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    await query('DELETE FROM clients WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Client deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const data = await req.json();
    await query(
      `UPDATE clients SET name=?, company_name=?, email=?, phone=?, alt_phone=?, gst_number=?, address=? WHERE id=?`,
      [
        data.name || '', 
        data.companyName || '', 
        data.email || '', 
        data.phone || '', 
        data.altPhone || '', 
        data.gstNumber || '', 
        data.address || '',
        params.id
      ]
    );
    return NextResponse.json({ message: 'Client updated' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}
