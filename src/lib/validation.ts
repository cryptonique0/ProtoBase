import { z } from 'zod';
import { IdeaCategory } from '../types/idea.types';

/**
 * Zod schema for idea submission form validation
 */
export const ideaSubmissionSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(500, 'Description must be less than 500 characters')
    .trim(),
  
  problem: z
    .string()
    .min(20, 'Problem statement must be at least 20 characters')
    .max(500, 'Problem statement must be less than 500 characters')
    .trim(),
  
  targetUsers: z
    .string()
    .min(10, 'Target users must be at least 10 characters')
    .max(300, 'Target users must be less than 300 characters')
    .trim(),
  
  category: z.nativeEnum(IdeaCategory, {
    errorMap: () => ({ message: 'Please select a category' }),
  }),
  
  tags: z
    .array(z.string().trim().min(1))
    .max(5, 'Maximum 5 tags allowed')
    .optional()
    .default([]),
});

export type IdeaSubmissionFormData = z.infer<typeof ideaSubmissionSchema>;
