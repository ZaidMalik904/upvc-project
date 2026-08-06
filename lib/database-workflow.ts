import { query } from './db';
import { ValidatedSubmissionData } from './validation';

export async function saveSubmission(data: ValidatedSubmissionData): Promise<number> {
  // Ensure the table exists dynamically
  await query(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      company VARCHAR(150),
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const sql = `
    INSERT INTO submissions (name, email, phone, company, message)
    VALUES (?, ?, ?, ?, ?)
  `;
  // @ts-ignore
  const result: any = await query(sql, [data.name, data.email, data.phone, data.company || null, data.message]);
  return result.insertId;
}
