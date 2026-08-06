import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Client, Project } from '@/lib/models';

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const params = await context.params;
    await Client.findByIdAndDelete(params.id);
    
    // Simulate cascade delete for MongoDB
    await Project.deleteMany({ clientId: params.id });
    
    return NextResponse.json({ message: 'Client deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const params = await context.params;
    const data = await req.json();
    
    await Client.findByIdAndUpdate(params.id, {
      name: data.name || '', 
      companyName: data.companyName || '', 
      email: data.email || '', 
      phone: data.phone || '', 
      altPhone: data.altPhone || '', 
      gstNumber: data.gstNumber || '', 
      address: data.address || ''
    });
    
    return NextResponse.json({ message: 'Client updated' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}
