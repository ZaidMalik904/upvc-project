import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Project } from '@/lib/models';

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const params = await context.params;
    await Project.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
