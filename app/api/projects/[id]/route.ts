import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    // Rely on CASCADE to delete project_products automatically
    await query('DELETE FROM projects WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
