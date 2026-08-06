import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Project, Settings } from '@/lib/models';
import { generateProjectPDF } from '@/lib/pdf';
import { sendQuotationEmail } from '@/lib/email';

export async function GET() {
  try {
    await connectToDatabase();
    
    // populate('clientId') pulls in the related Client document
    const projects = await Project.find().populate('clientId').sort({ createdAt: -1 });
    
    const fullProjects = projects.map(p => {
      const pObj = p.toObject();
      return {
        id: p._id.toString(),
        projectName: p.projectName,
        projectDate: p.projectDate,
        status: p.status,
        totalAmount: p.totalAmount,
        createdAt: p.createdAt,
        client: pObj.clientId ? {
          ...pObj.clientId,
          id: pObj.clientId._id.toString()
        } : null,
        products: pObj.products.map((prod: any) => ({
          ...prod,
          id: prod._id?.toString() || Math.random().toString()
        }))
      };
    });

    return NextResponse.json(fullProjects);
  } catch (error) {
    console.error(error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const clientId = data.client?.id;
    
    const newProject = new Project({
      clientId,
      projectName: data.projectName || '',
      projectDate: data.projectDate || null,
      status: data.status || 'Pending',
      totalAmount: data.totalAmount || 0,
      discountPercent: data.discountPercent || 0,
      taxPercent: data.taxPercent || 8,
      totalArea: data.totalArea || 0,
      ratePerSqFt: data.ratePerSqFt || 500,
      products: data.products || []
    });
    
    await newProject.save();
    
    const newProjectId = newProject._id.toString();

    // Attempt to generate PDF and send email asynchronously
    if (data.client?.email) {
      try {
        const settings = await Settings.findOne() || {};
        
        let pdfBuffer;
        if (data.pdfBase64) {
          const base64Data = data.pdfBase64.includes(',') ? data.pdfBase64.split(',')[1] : data.pdfBase64;
          pdfBuffer = Buffer.from(base64Data, 'base64');
        } else {
          pdfBuffer = await generateProjectPDF(data, settings);
        }

        await sendQuotationEmail(data.client.email, data.client.name || 'Valued Client', pdfBuffer, data.projectName || newProjectId);
        console.log(`Quotation emailed to ${data.client.email}`);
      } catch (emailErr) {
        console.error('Failed to generate or send PDF email:', emailErr);
      }
    }

    return NextResponse.json({ message: 'Project created', id: newProjectId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
