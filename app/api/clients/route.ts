import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Client } from '@/lib/models';

export async function GET() {
  try {
    await connectToDatabase();
    const clients = await Client.find().sort({ createdAt: -1 });
    
    // Format for frontend
    const formattedClients = clients.map(c => ({
      ...c.toObject(),
      id: c._id.toString()
    }));
    
    return NextResponse.json(formattedClients);
  } catch (error) {
    console.error(error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    
    const newClient = new Client({
      name: data.name || '', 
      companyName: data.companyName || '', 
      email: data.email || '', 
      phone: data.phone || '', 
      altPhone: data.altPhone || '', 
      gstNumber: data.gstNumber || '', 
      address: data.address || ''
    });
    
    await newClient.save();
    
    return NextResponse.json({ message: 'Client created', id: newClient._id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}
