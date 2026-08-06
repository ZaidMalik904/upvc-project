import { NextResponse } from 'next/server';
import { submissionSchema } from '@/lib/validation';
import { saveSubmission } from '@/lib/database-workflow';
import { generateSubmissionPDF } from '@/lib/pdf';
import { sendSubmissionEmail } from '@/lib/email';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validate request
    const validatedData = submissionSchema.parse(body);

    // 2. Save data into SQL
    const submissionId = await saveSubmission(validatedData);

    // 3. Generate PDF Buffer
    const pdfBuffer = await generateSubmissionPDF(validatedData);

    // 4. Send email with PDF attachment
    const emailResult = await sendSubmissionEmail(validatedData.email, validatedData.name, pdfBuffer);

    // 5. Return success response
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully. Check your email for the PDF report.',
      id: submissionId,
      emailSent: emailResult.success
    });
  } catch (error: any) {
    console.error('Submission API Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: (error as any).errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}
