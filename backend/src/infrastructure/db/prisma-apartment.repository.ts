import { Prisma } from '@prisma/client';
import prisma from './prisma.service';
import { Apartment } from '../../domain/apartment.entity';
import { ApartmentRepository, ApartmentFilter, CreateApartmentInput, PaginatedResult } from '../../domain/apartment.repository';

/**
 * Builds the Prisma `where` clause for apartment filtering.
 *
 * Semantics:
 * - `unitName` / `unitNumber` / `project` are exact-field, case-insensitive
 *   partial matches, combined with AND when more than one is supplied
 *   (e.g. `unitName=X&project=Y` -> apartments named X *within* project Y).
 * - `q` is a free-text search, OR-matched across all three fields (e.g. the
 *   single search box on the frontend). If both `q` and one of the exact
 *   fields are supplied, they're combined with AND.
 *
 * Exported (pure, no I/O) so the filter logic can be unit tested without a
 * database.
 */
export function buildApartmentWhere(filter?: ApartmentFilter): Prisma.ApartmentWhereInput {
  const and: Prisma.ApartmentWhereInput[] = [];

  if (filter?.unitName) and.push({ unitName: { contains: filter.unitName, mode: 'insensitive' } });
  if (filter?.unitNumber) and.push({ unitNumber: { contains: filter.unitNumber, mode: 'insensitive' } });
  if (filter?.project) and.push({ project: { contains: filter.project, mode: 'insensitive' } });

  if (filter?.q) {
    and.push({
      OR: [
        { unitName: { contains: filter.q, mode: 'insensitive' } },
        { unitNumber: { contains: filter.q, mode: 'insensitive' } },
        { project: { contains: filter.q, mode: 'insensitive' } },
      ],
    });
  }

  return and.length ? { AND: and } : {};
}

function toApartment(r: {
  id: string;
  unitName: string;
  unitNumber: string;
  project: string;
  price: Prisma.Decimal;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Apartment {
  return {
    id: r.id,
    unitName: r.unitName,
    unitNumber: r.unitNumber,
    project: r.project,
    price: r.price.toString(),
    bedrooms: r.bedrooms,
    bathrooms: r.bathrooms,
    areaSqm: r.areaSqm,
    description: r.description,
    imageUrl: r.imageUrl,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export class PrismaApartmentRepository implements ApartmentRepository {
  async findAll(filter?: ApartmentFilter, cursor?: string | null, limit = 20): Promise<PaginatedResult<Apartment>> {
    const where = buildApartmentWhere(filter);

    const take = limit + 1;
    // `id` is a stable tiebreaker: `createdAt` alone isn't guaranteed unique
    // (e.g. rows seeded in the same transaction can share a timestamp), and
    // cursor pagination needs a deterministic total order to avoid skipping
    // or repeating rows at page boundaries.
    const query: Prisma.ApartmentFindManyArgs = {
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take,
    };

    if (cursor) {
      query.skip = 1;
      query.cursor = { id: cursor };
    }

    const rows = await prisma.apartment.findMany(query);

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;

    const items: Apartment[] = page.map(toApartment);
    const nextCursor = hasMore ? page[page.length - 1]?.id ?? null : null;

    return { items, nextCursor };
  }

  async findById(id: string): Promise<Apartment | null> {
    const r = await prisma.apartment.findUnique({ where: { id } });
    return r ? toApartment(r) : null;
  }

  async create(data: CreateApartmentInput): Promise<Apartment> {
    const r = await prisma.apartment.create({
      data: {
        unitName: data.unitName,
        unitNumber: data.unitNumber,
        project: data.project,
        price: new Prisma.Decimal(data.price),
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        areaSqm: data.areaSqm,
        description: data.description ?? null,
        imageUrl: data.imageUrl ?? null,
      },
    });

    return toApartment(r);
  }
}
