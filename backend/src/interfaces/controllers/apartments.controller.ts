import express from 'express';
import { ApartmentService } from '../../application/apartment.service';
import { PrismaApartmentRepository } from '../../infrastructure/db/prisma-apartment.repository';
import { AppError } from '../../middlewares/error.handler';
import { CreateApartmentInput } from '../../domain/apartment.repository';
import { CreateApartmentSchema } from '../dtos/create-apartment.dto';

/**
 * @openapi
 * /apartments:
 *   get:
 *     summary: List apartments
 *     description: |
 *       `unitName`, `unitNumber` and `project` are exact-field, case-insensitive
 *       partial matches, combined with AND when more than one is given
 *       (e.g. `unitName=X&project=Y` returns apartments named X *within*
 *       project Y). `q` is a free-text search OR-matched across all three
 *       fields, combined with AND against any exact fields also supplied.
 *     parameters:
 *       - in: query
 *         name: unitName
 *         schema:
 *           type: string
 *         description: Case-insensitive partial match on unit name.
 *       - in: query
 *         name: unitNumber
 *         schema:
 *           type: string
 *         description: Case-insensitive partial match on unit number.
 *       - in: query
 *         name: project
 *         schema:
 *           type: string
 *         description: Case-insensitive partial match on project name.
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Free-text search, OR-matched across unitName/unitNumber/project.
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *     responses:
 *       200:
 *         description: A list of apartments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Apartment'
 *                 nextCursor:
 *                   type: string
 *                   nullable: true
 *   post:
 *     summary: Create an apartment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateApartmentInput'
 *     responses:
 *       201:
 *         description: Apartment created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Apartment'
 *       400:
 *         description: Invalid apartment payload
 *
 * /apartments/{id}:
 *   get:
 *     summary: Get an apartment by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Apartment found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Apartment'
 *       404:
 *         description: Apartment not found
 *
 * components:
 *   schemas:
 *     Apartment:
 *       type: object
 *       required:
 *         - id
 *         - unitName
 *         - unitNumber
 *         - project
 *         - price
 *         - bedrooms
 *         - bathrooms
 *         - areaSqm
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *         unitName:
 *           type: string
 *         unitNumber:
 *           type: string
 *         project:
 *           type: string
 *         price:
 *           type: string
 *         bedrooms:
 *           type: integer
 *         bathrooms:
 *           type: integer
 *         areaSqm:
 *           type: number
 *         description:
 *           type: string
 *           nullable: true
 *         imageUrl:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateApartmentInput:
 *       type: object
 *       required:
 *         - unitName
 *         - unitNumber
 *         - project
 *         - price
 *         - bedrooms
 *         - bathrooms
 *         - areaSqm
 *       properties:
 *         unitName:
 *           type: string
 *         unitNumber:
 *           type: string
 *         project:
 *           type: string
 *         price:
 *           type: number
 *           minimum: 0
 *         bedrooms:
 *           type: integer
 *           minimum: 0
 *         bathrooms:
 *           type: integer
 *           minimum: 0
 *         areaSqm:
 *           type: number
 *           minimum: 0
 *         description:
 *           type: string
 *         imageUrl:
 *           type: string
 */

export function createApartmentsRouter(service?: ApartmentService): express.Router {
  const router = express.Router();
  const svc = service ?? new ApartmentService(new PrismaApartmentRepository());

  router.get('/', async (req, res, next) => {
    try {
      const { unitName, unitNumber, project, q, cursor, limit } = req.query;
      const filter: Record<string, string> = {};

      if (typeof unitName === 'string' && unitName.trim()) filter.unitName = unitName.trim();
      if (typeof unitNumber === 'string' && unitNumber.trim()) filter.unitNumber = unitNumber.trim();
      if (typeof project === 'string' && project.trim()) filter.project = project.trim();
      if (typeof q === 'string' && q.trim()) filter.q = q.trim();

      const normalizedLimit = typeof limit === 'string' ? Number(limit) : typeof limit === 'number' ? limit : 20;
      const result = await svc.list(filter, typeof cursor === 'string' ? cursor : null, normalizedLimit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const apartment = await svc.getById(req.params.id);
      if (!apartment) {
        return next(new AppError('Apartment not found', 404, 'not_found'));
      }
      res.json(apartment);
    } catch (err) {
      next(err);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const parsed = CreateApartmentSchema.safeParse(req.body);
      if (!parsed.success) {
        return next(new AppError('Invalid apartment payload', 400, 'validation_error', parsed.error.flatten()));
      }

      const created = await svc.create(parsed.data as CreateApartmentInput);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
