import { ApartmentRepository, ApartmentFilter, CreateApartmentInput } from '../domain/apartment.repository';
import { Apartment } from '../domain/apartment.entity';
import { AppError } from '../middlewares/error.handler';

export const MAX_LIMIT = 100;
export const DEFAULT_LIMIT = 20;

export class ApartmentService {
  constructor(private repo: ApartmentRepository) {}

  async list(filter?: ApartmentFilter, cursor?: string | null, limit: number = DEFAULT_LIMIT) {
    const normalizedLimit = Number(limit);

    if (!Number.isInteger(normalizedLimit) || normalizedLimit <= 0) {
      throw new AppError('Limit must be greater than 0', 400, 'invalid_limit');
    }

    if (normalizedLimit > MAX_LIMIT) {
      throw new AppError(`Limit must not exceed ${MAX_LIMIT}`, 400, 'invalid_limit');
    }

    return this.repo.findAll(filter, cursor ?? null, normalizedLimit);
  }

  async getById(id: string): Promise<Apartment | null> {
    const normalizedId = id?.trim();

    if (!normalizedId) {
      throw new AppError('Apartment id is required', 400, 'invalid_id');
    }

    return this.repo.findById(normalizedId);
  }

  async create(input: CreateApartmentInput): Promise<Apartment> {
    return this.repo.create(input);
  }
}
