import nodemailer from 'nodemailer';

export async function sendSubmissionEmail(userEmail: string, userName: string, pdfBuffer: Buffer) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.warn('GMAIL_USER or GMAIL_APP_PASSWORD is missing. Email skipped.');
    return { success: false, error: 'Missing Gmail credentials' };
  }

  try {
    // Create a transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: `"Company Team" <${user}>`,
      to: userEmail,
      subject: 'Your Submission Report - Company Name',
      html: `
        <h2>Hello ${userName},</h2>
        <p>Thank you for your submission. Please find attached a copy of your report for your records.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>Company Team</strong></p>
      `,
      attachments: [
        {
          filename: 'submission-report.pdf',
          content: pdfBuffer,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, data: info.messageId };
  } catch (error: any) {
    console.error('Failed to send email with Nodemailer:', error);
    return { success: false, error: error.message };
  }
}

export async function sendQuotationEmail(userEmail: string, userName: string, pdfBuffer: Buffer, projectName: string) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.warn('GMAIL_USER or GMAIL_APP_PASSWORD is missing. Email skipped.');
    return { success: false, error: 'Missing Gmail credentials' };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: `"ADL UPVC Team" <${user}>`,
      to: userEmail,
      subject: `Your Project Quotation - ${projectName}`,
      html: `
        <h2>Hello ${userName},</h2>
        <p>Thank you for choosing ADL UPVC Doors & Windows. Please find attached the quotation for your project <strong>${projectName}</strong>.</p>
        <p>If you have any questions or would like to proceed, feel free to reply to this email.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>ADL UPVC Team</strong></p>
      `,
      attachments: [
        {
          filename: `Quotation-${projectName.replace(/\s+/g, '-')}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, data: info.messageId };
  } catch (error: any) {
    console.error('Failed to send quotation email:', error);
    return { success: false, error: error.message };
  }
}
