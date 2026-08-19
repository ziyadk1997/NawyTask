import { z } from 'zod';

export const CreateApartmentSchema = z.object({
  unitName: z.string().min(1),
  unitNumber: z.string().min(1),
  project: z.string().min(1),
  price: z.coerce.number().positive().transform((value) => value.toString()),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().int().nonnegative(),
  areaSqm: z.number().positive(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export type CreateApartmentDto = z.infer<typeof CreateApartmentSchema>;
