"use client"
import { useInfiniteQuery } from '@tanstack/react-query'
import api, { ApartmentsListResponse } from '../lib/api/client'

export type ApartmentsQueryParams = {
  unitName?: string
  unitNumber?: string
  project?: string
  /** Free-text search, OR-matched across unitName/unitNumber/project. */
  q?: string
  limit?: number
}

/**
 * Cursor-paginated apartment listing, accumulating pages as the caller
 * fetches more (via `fetchNextPage`) - not a single-page fetch. Using
 * `useInfiniteQuery` here instead of hand-rolled `cursor` state means each
 * "page" the API returns is appended to `data.pages` automatically, and a
 * changed `params` (e.g. a new search) starts a fresh query from page one
 * without needing to manually reset any cursor.
 */
export default function useApartments(params: ApartmentsQueryParams = {}) {
  return useInfiniteQuery<ApartmentsListResponse, Error>({
    queryKey: ['apartments', params],
    queryFn: async ({ pageParam }) => {
      const res = await api.get('/apartments', { params: { ...params, cursor: pageParam } })
      return res.data as ApartmentsListResponse
    },
    initialPageParam: null as string | null,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
  })
}
