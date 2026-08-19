export type Apartment = {
  id: string;
  unitName: string;
  unitNumber: string;
  project: string;
  price: string; // Prisma Decimal mapped to string at transport boundary
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  description?: string | null;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};
