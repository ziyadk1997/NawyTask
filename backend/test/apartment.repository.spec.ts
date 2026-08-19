import { buildApartmentWhere } from '../src/infrastructure/db/prisma-apartment.repository';

describe('buildApartmentWhere', () => {
  it('returns an empty where clause when no filter is given', () => {
    expect(buildApartmentWhere()).toEqual({});
    expect(buildApartmentWhere({})).toEqual({});
  });

  it('builds a single case-insensitive contains clause for one field', () => {
    expect(buildApartmentWhere({ unitName: 'Sky' })).toEqual({
      AND: [{ unitName: { contains: 'Sky', mode: 'insensitive' } }],
    });
  });

  it('combines multiple exact fields with AND, not OR', () => {
    const where = buildApartmentWhere({ unitName: 'Sky', project: 'Tower' });

    expect(where).toEqual({
      AND: [
        { unitName: { contains: 'Sky', mode: 'insensitive' } },
        { project: { contains: 'Tower', mode: 'insensitive' } },
      ],
    });
    // regression guard: this used to be a top-level OR, which meant
    // unitName=X&project=Y matched apartments with EITHER field instead of
    // narrowing to apartments named X within project Y.
    expect(where).not.toHaveProperty('OR');
  });

  it('OR-matches q across all three fields', () => {
    expect(buildApartmentWhere({ q: 'sky view' })).toEqual({
      AND: [
        {
          OR: [
            { unitName: { contains: 'sky view', mode: 'insensitive' } },
            { unitNumber: { contains: 'sky view', mode: 'insensitive' } },
            { project: { contains: 'sky view', mode: 'insensitive' } },
          ],
        },
      ],
    });
  });

  it('combines q (OR across fields) with an exact field filter using AND', () => {
    const where = buildApartmentWhere({ project: 'Tower', q: 'sky' });

    expect(where).toEqual({
      AND: [
        { project: { contains: 'Tower', mode: 'insensitive' } },
        {
          OR: [
            { unitName: { contains: 'sky', mode: 'insensitive' } },
            { unitNumber: { contains: 'sky', mode: 'insensitive' } },
            { project: { contains: 'sky', mode: 'insensitive' } },
          ],
        },
      ],
    });
  });
});
