import axios from 'axios'

export type Apartment = {
  id: string
  unitName: string
  unitNumber: string
  project: string
  price: string
  bedrooms: number
  bathrooms: number
  areaSqm: number
  description: string | null
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

export type ApartmentsListResponse = {
  items: Apartment[]
  nextCursor?: string | null
}

const base = process.env.NEXT_PUBLIC_API_URL

if (!base) {
  throw new Error('Missing required environment variable: NEXT_PUBLIC_API_URL')
}

const api = axios.create({ baseURL: base })

export default api
