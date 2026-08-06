import { z } from 'zod';

export const submissionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ValidatedSubmissionData = z.infer<typeof submissionSchema>;
