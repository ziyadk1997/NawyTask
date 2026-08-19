import { Apartment } from './apartment.entity';

export type ApartmentFilter = {
  /** Exact-field filters, combined with AND when more than one is given. */
  unitName?: string;
  unitNumber?: string;
  project?: string;
  /** Free-text search, OR-matched across unitName/unitNumber/project. Combined with AND against the fields above, if any are also set. */
  q?: string;
};

export type CreateApartmentInput = Omit<Apartment, 'id' | 'createdAt' | 'updatedAt'> & {
  price: string;
};

export type PaginatedResult<T> = {
  items: T[];
  nextCursor?: string | null;
};

export interface ApartmentRepository {
  findAll(filter?: ApartmentFilter, cursor?: string | null, limit?: number): Promise<PaginatedResult<Apartment>>;
  findById(id: string): Promise<Apartment | null>;
  create(data: CreateApartmentInput): Promise<Apartment>;
}
