import { ApartmentService, MAX_LIMIT } from '../src/application/apartment.service';
import { Apartment } from '../src/domain/apartment.entity';
import { ApartmentRepository, PaginatedResult } from '../src/domain/apartment.repository';

function mockRepo(overrides: Partial<ApartmentRepository> = {}): jest.Mocked<ApartmentRepository> {
  return {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    ...overrides,
  } as jest.Mocked<ApartmentRepository>;
}

describe('ApartmentService', () => {
  const now = new Date();
  const sample: Apartment = {
    id: '1',
    unitName: 'Apt A',
    unitNumber: '101',
    project: 'Proj',
    price: '100.00',
    bedrooms: 2,
    bathrooms: 1,
    areaSqm: 75.5,
    description: 'desc',
    imageUrl: null,
    createdAt: now,
    updatedAt: now,
  };
  const page: PaginatedResult<Apartment> = { items: [sample], nextCursor: null };

  it('list() returns the paginated result from the repository', async () => {
    const repo = mockRepo({ findAll: jest.fn().mockResolvedValue(page) });
    const s = new ApartmentService(repo);

    const res = await s.list();

    expect(repo.findAll).toHaveBeenCalledWith(undefined, null, 20);
    expect(res).toEqual(page);
  });

  it('list() forwards filter, cursor and limit through to the repository unchanged', async () => {
    const repo = mockRepo({ findAll: jest.fn().mockResolvedValue(page) });
    const s = new ApartmentService(repo);

    await s.list({ project: 'Proj', q: 'sky' }, 'cursor-1', 5);

    expect(repo.findAll).toHaveBeenCalledWith({ project: 'Proj', q: 'sky' }, 'cursor-1', 5);
  });

  it('list() defaults a null/undefined cursor to null', async () => {
    const repo = mockRepo({ findAll: jest.fn().mockResolvedValue(page) });
    const s = new ApartmentService(repo);

    await s.list(undefined, undefined, 20);

    expect(repo.findAll).toHaveBeenCalledWith(undefined, null, 20);
  });

  it('list() rejects invalid limit values', async () => {
    const repo = mockRepo();
    const s = new ApartmentService(repo);

    await expect(s.list(undefined, null, 0)).rejects.toThrow('Limit must be greater than 0');
    await expect(s.list(undefined, null, -1)).rejects.toThrow('Limit must be greater than 0');
    await expect(s.list(undefined, null, 1.5)).rejects.toThrow('Limit must be greater than 0');
    expect(repo.findAll).not.toHaveBeenCalled();
  });

  it('list() rejects a limit above MAX_LIMIT', async () => {
    const repo = mockRepo();
    const s = new ApartmentService(repo);

    await expect(s.list(undefined, null, MAX_LIMIT + 1)).rejects.toThrow(`Limit must not exceed ${MAX_LIMIT}`);
    expect(repo.findAll).not.toHaveBeenCalled();
  });

  it('list() accepts a limit exactly at MAX_LIMIT', async () => {
    const repo = mockRepo({ findAll: jest.fn().mockResolvedValue(page) });
    const s = new ApartmentService(repo);

    await s.list(undefined, null, MAX_LIMIT);

    expect(repo.findAll).toHaveBeenCalledWith(undefined, null, MAX_LIMIT);
  });

  it('getById() returns item when found', async () => {
    const repo = mockRepo({ findById: jest.fn().mockResolvedValue(sample) });
    const s = new ApartmentService(repo);
    const res = await s.getById('1');
    expect(repo.findById).toHaveBeenCalledWith('1');
    expect(res).toEqual(sample);
  });

  it('getById() returns null when not found', async () => {
    const repo = mockRepo({ findById: jest.fn().mockResolvedValue(null) });
    const s = new ApartmentService(repo);
    const res = await s.getById('nope');
    expect(res).toBeNull();
  });

  it('getById() rejects blank ids', async () => {
    const repo = mockRepo();
    const s = new ApartmentService(repo);

    await expect(s.getById('')).rejects.toThrow('Apartment id is required');
    await expect(s.getById('   ')).rejects.toThrow('Apartment id is required');
    expect(repo.findById).not.toHaveBeenCalled();
  });

  it('create() calls repository.create and returns created value', async () => {
    const input = { ...sample, id: undefined } as any;
    const created = { ...sample, id: '2' };
    const repo = mockRepo({ create: jest.fn().mockResolvedValue(created) });
    const s = new ApartmentService(repo);
    const res = await s.create(input);
    expect(repo.create).toHaveBeenCalledWith(input);
    expect(res).toEqual(created);
  });
});
