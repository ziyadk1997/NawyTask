import express from 'express'
import request from 'supertest'
import { createApartmentsRouter } from '../src/interfaces/controllers/apartments.controller'
import { ApartmentService } from '../src/application/apartment.service'
import { errorHandler } from '../src/middlewares/error.handler'

function buildApp(mockService: Partial<ApartmentService>) {
  const app = express()
  app.use(express.json())
  app.use('/api/v1/apartments', createApartmentsRouter(mockService as ApartmentService))
  // Mirrors main.ts: the router only calls next(err) on failure, the actual
  // JSON error shape comes from this middleware, so it has to be mounted
  // here too or every error-path assertion below would be testing Express's
  // default (non-JSON) error page instead of our own.
  app.use(errorHandler)
  return app
}

const sampleApartment = {
  id: '1',
  unitName: 'A',
  unitNumber: '1',
  project: 'P',
  price: '10',
  bedrooms: 1,
  bathrooms: 1,
  areaSqm: 50,
  description: null,
  imageUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

// supertest/express serializes Dates to ISO strings over the wire.
const sampleApartmentJson = { ...sampleApartment, createdAt: sampleApartment.createdAt.toISOString(), updatedAt: sampleApartment.updatedAt.toISOString() }

describe('Apartments Controller', () => {
  describe('GET /', () => {
    it('returns the paginated payload from the service', async () => {
      const mockService = { list: jest.fn().mockResolvedValue({ items: [sampleApartment], nextCursor: null }) }
      const app = buildApp(mockService)

      const res = await request(app).get('/api/v1/apartments')

      expect(res.status).toBe(200)
      expect(res.body).toEqual({ items: [sampleApartmentJson], nextCursor: null })
    })

    it('forwards unitName, unitNumber, project, q, cursor and limit to the service', async () => {
      const mockService = { list: jest.fn().mockResolvedValue({ items: [], nextCursor: null }) }
      const app = buildApp(mockService)

      await request(app).get('/api/v1/apartments').query({
        unitName: 'Sky',
        unitNumber: '101',
        project: 'Tower',
        q: 'sky view',
        cursor: 'cursor-1',
        limit: '5',
      })

      expect(mockService.list).toHaveBeenCalledWith(
        { unitName: 'Sky', unitNumber: '101', project: 'Tower', q: 'sky view' },
        'cursor-1',
        5,
      )
    })

    it('omits blank/whitespace-only filter params instead of passing them through', async () => {
      const mockService = { list: jest.fn().mockResolvedValue({ items: [], nextCursor: null }) }
      const app = buildApp(mockService)

      await request(app).get('/api/v1/apartments').query({ unitName: '   ', project: '' })

      expect(mockService.list).toHaveBeenCalledWith({}, null, 20)
    })

    it('propagates service errors (e.g. invalid limit) as an error response', async () => {
      const { AppError } = require('../src/middlewares/error.handler')
      const mockService = { list: jest.fn().mockRejectedValue(new AppError('Limit must be greater than 0', 400, 'invalid_limit')) }
      const app = buildApp(mockService)

      const res = await request(app).get('/api/v1/apartments').query({ limit: '0' })

      expect(res.status).toBe(400)
      expect(res.body.error).toBe('invalid_limit')
    })
  })

  describe('GET /:id', () => {
    it('returns 200 with the apartment when found', async () => {
      const mockService = { getById: jest.fn().mockResolvedValue(sampleApartment) }
      const app = buildApp(mockService)

      const res = await request(app).get('/api/v1/apartments/1')

      expect(res.status).toBe(200)
      expect(mockService.getById).toHaveBeenCalledWith('1')
      expect(res.body.id).toBe('1')
    })

    it('returns 404 when the apartment does not exist', async () => {
      const mockService = { getById: jest.fn().mockResolvedValue(null) }
      const app = buildApp(mockService)

      const res = await request(app).get('/api/v1/apartments/missing')

      expect(res.status).toBe(404)
      expect(res.body.error).toBe('not_found')
    })
  })

  describe('POST /', () => {
    it('validates input and returns 201', async () => {
      const mockService = { create: jest.fn().mockResolvedValue({ id: '2' }) }
      const app = buildApp(mockService)

      const payload = {
        unitName: 'Test', unitNumber: '200', project: 'Proj', price: '100', bedrooms: 2, bathrooms: 1, areaSqm: 70
      }

      const res = await request(app).post('/api/v1/apartments').send(payload)
      expect(res.status).toBe(201)
      expect(mockService.create).toHaveBeenCalled()
    })

    it('rejects invalid apartment payloads', async () => {
      const mockService = { create: jest.fn() }
      const app = buildApp(mockService)

      const payload = {
        unitName: '', unitNumber: '200', project: 'Proj', price: '100', bedrooms: 2, bathrooms: 1, areaSqm: 70
      }

      const res = await request(app).post('/api/v1/apartments').send(payload)
      expect(res.status).toBe(400)
      expect(mockService.create).not.toHaveBeenCalled()
    })
  })
})
