import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Settings } from '@/lib/models';

export async function GET() {
  try {
    await connectToDatabase();
    const settings = await Settings.findOne();
    if (settings) {
      return NextResponse.json({
        name: settings.name,
        logoUrl: settings.logoUrl,
        email: settings.email,
        phone: settings.phone,
        address: settings.address,
        gstNumber: settings.gstNumber,
        footerText: settings.footerText,
        signatureUrl: settings.signatureUrl,
        currencySymbol: settings.currencySymbol
      });
    }
    return NextResponse.json({
      name: '', logoUrl: '/logo.png', email: '', phone: '', address: '', 
      gstNumber: '', footerText: '', signatureUrl: '', currencySymbol: '₹'
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      name: '', logoUrl: '/logo.png', email: '', phone: '', address: '', 
      gstNumber: '', footerText: '', signatureUrl: '', currencySymbol: '₹'
    });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    
    // We only ever have one settings object, so just update the first one or create it.
    const existing = await Settings.findOne();
    
    if (existing) {
      existing.name = data.name || '';
      existing.logoUrl = data.logoUrl || '';
      existing.email = data.email || '';
      existing.phone = data.phone || '';
      existing.address = data.address || '';
      existing.gstNumber = data.gstNumber || '';
      existing.footerText = data.footerText || '';
      existing.signatureUrl = data.signatureUrl || '';
      existing.currencySymbol = data.currencySymbol || '₹';
      await existing.save();
    } else {
      const newSettings = new Settings({
        name: data.name || '',
        logoUrl: data.logoUrl || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        gstNumber: data.gstNumber || '',
        footerText: data.footerText || '',
        signatureUrl: data.signatureUrl || '',
        currencySymbol: data.currencySymbol || '₹'
      });
      await newSettings.save();
    }
    
    return NextResponse.json({ message: 'Settings saved' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
