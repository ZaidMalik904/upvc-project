export interface SubmissionData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  id?: number;
  error?: string;
}
