"use client"
import { useQuery } from '@tanstack/react-query'
import api, { Apartment } from '../lib/api/client'

export default function useApartment(id: string) {
  return useQuery<Apartment, Error>({
    queryKey: ['apartment', id],
    queryFn: async () => {
      const res = await api.get(`/apartments/${id}`)
      return res.data as Apartment
    },
    enabled: !!id,
  })
}
