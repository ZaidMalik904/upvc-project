import connectToDatabase from './mongodb';
import { Submission } from './models';
import { ValidatedSubmissionData } from './validation';

export async function saveSubmission(data: ValidatedSubmissionData): Promise<string> {
  await connectToDatabase();
  
  const newSubmission = new Submission({
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company || null,
    message: data.message || ''
  });
  
  await newSubmission.save();
  return newSubmission._id.toString();
}
