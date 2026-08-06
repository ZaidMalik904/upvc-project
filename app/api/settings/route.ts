import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const settings = await query<any[]>('SELECT * FROM settings WHERE id = 1');
    if (settings.length > 0) {
      return NextResponse.json({
        name: settings[0].name,
        logoUrl: settings[0].logo_url,
        email: settings[0].email,
        phone: settings[0].phone,
        address: settings[0].address,
        gstNumber: settings[0].gst_number,
        footerText: settings[0].footer_text,
        signatureUrl: settings[0].signature_url,
        currencySymbol: settings[0].currency_symbol
      });
    }
    return NextResponse.json({
      name: '', logoUrl: '/logo.png', email: '', phone: '', address: '', 
      gstNumber: '', footerText: '', signatureUrl: '', currencySymbol: '₹'
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Check if settings row exists
    const existing = await query<any[]>('SELECT id FROM settings WHERE id = 1');
    
    if (existing.length > 0) {
      await query(
        `UPDATE settings SET name=?, logo_url=?, email=?, phone=?, address=?, gst_number=?, footer_text=?, signature_url=?, currency_symbol=? WHERE id=1`,
        [
          data.name || '', data.logoUrl || '', data.email || '', data.phone || '', 
          data.address || '', data.gstNumber || '', data.footerText || '', 
          data.signatureUrl || '', data.currencySymbol || '₹'
        ]
      );
    } else {
      await query(
        `INSERT INTO settings (id, name, logo_url, email, phone, address, gst_number, footer_text, signature_url, currency_symbol) 
         VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.name || '', data.logoUrl || '', data.email || '', data.phone || '', 
          data.address || '', data.gstNumber || '', data.footerText || '', 
          data.signatureUrl || '', data.currencySymbol || '₹'
        ]
      );
    }
    
    return NextResponse.json({ message: 'Settings saved' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
