import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ApartmentList from '../../src/components/apartment/ApartmentList'

// Mock the API client module itself (not just the hook) so we can assert on
// the actual request params sent, without needing a real backend or an
// un-mocked `lib/api/client.ts` (which throws if NEXT_PUBLIC_API_URL isn't
// set at import time).
jest.mock('../../src/lib/api/client', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}))

import api from '../../src/lib/api/client'
const mockedGet = (api as unknown as { get: jest.Mock }).get

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>)
}

beforeEach(() => {
  mockedGet.mockReset()
  mockedGet.mockResolvedValue({ data: { items: [], nextCursor: null } })
})

describe('ApartmentList search', () => {
  it('loads the unfiltered list on mount', async () => {
    renderWithClient(<ApartmentList />)

    await waitFor(() => expect(mockedGet).toHaveBeenCalledTimes(1))
    expect(mockedGet).toHaveBeenCalledWith('/apartments', {
      params: { q: undefined, cursor: null, limit: 12 },
    })
  })

  it('does not refetch while typing - only on submit', async () => {
    renderWithClient(<ApartmentList />)
    await waitFor(() => expect(mockedGet).toHaveBeenCalledTimes(1))

    const input = screen.getByLabelText('Search apartments')
    fireEvent.change(input, { target: { value: 's' } })
    fireEvent.change(input, { target: { value: 'sk' } })
    fireEvent.change(input, { target: { value: 'sky' } })

    // still just the initial mount call - no request per keystroke
    expect(mockedGet).toHaveBeenCalledTimes(1)

    fireEvent.submit(screen.getByRole('search'))

    await waitFor(() => expect(mockedGet).toHaveBeenCalledTimes(2))
    expect(mockedGet).toHaveBeenLastCalledWith('/apartments', {
      params: { q: 'sky', cursor: null, limit: 12 },
    })
  })

  it('also submits on pressing Enter in the search field', async () => {
    renderWithClient(<ApartmentList />)
    await waitFor(() => expect(mockedGet).toHaveBeenCalledTimes(1))

    const input = screen.getByLabelText('Search apartments')
    fireEvent.change(input, { target: { value: 'tower' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    fireEvent.submit(screen.getByRole('search'))

    await waitFor(() => expect(mockedGet).toHaveBeenCalledTimes(2))
    expect(mockedGet).toHaveBeenLastCalledWith('/apartments', {
      params: { q: 'tower', cursor: null, limit: 12 },
    })
  })

  it('shows a query-aware empty state and clears back to the full list', async () => {
    renderWithClient(<ApartmentList />)
    await waitFor(() => expect(mockedGet).toHaveBeenCalledTimes(1))

    fireEvent.change(screen.getByLabelText('Search apartments'), { target: { value: 'nowhere' } })
    fireEvent.submit(screen.getByRole('search'))

    expect(await screen.findByText('No apartments match “nowhere”.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))

    await waitFor(() => expect(mockedGet).toHaveBeenLastCalledWith('/apartments', {
      params: { q: undefined, cursor: null, limit: 12 },
    }))
  })

  it('appends the next page to the existing results instead of replacing them', async () => {
    const pageOneItem = { id: '1', unitName: 'Apartment One', unitNumber: '1', project: 'P', price: '10', imageUrl: null }
    const pageTwoItem = { id: '2', unitName: 'Apartment Two', unitNumber: '2', project: 'P', price: '20', imageUrl: null }
    mockedGet.mockResolvedValueOnce({ data: { items: [pageOneItem], nextCursor: 'next-1' } })
    renderWithClient(<ApartmentList />)

    expect(await screen.findByText('Apartment One — 1')).toBeInTheDocument()

    mockedGet.mockResolvedValueOnce({ data: { items: [pageTwoItem], nextCursor: null } })
    fireEvent.click(screen.getByRole('button', { name: 'Load more' }))

    await waitFor(() => expect(mockedGet).toHaveBeenLastCalledWith('/apartments', {
      params: { q: undefined, cursor: 'next-1', limit: 12 },
    }))
    // both pages' items should be visible now, not just the latest page -
    // this is the "Load more" contract, not "next page"
    expect(await screen.findByText('Apartment Two — 2')).toBeInTheDocument()
    expect(screen.getByText('Apartment One — 1')).toBeInTheDocument()
    // no more pages left, so the button itself should be gone
    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument()
  })

  it('resets the cursor when the query changes', async () => {
    mockedGet.mockResolvedValueOnce({ data: { items: [{ id: '1', unitName: 'A', unitNumber: '1', project: 'P', price: '10', imageUrl: null }], nextCursor: 'next-1' } })
    renderWithClient(<ApartmentList />)

    const loadMore = await screen.findByRole('button', { name: 'Load more' })
    mockedGet.mockResolvedValueOnce({ data: { items: [], nextCursor: null } })
    fireEvent.click(loadMore)

    await waitFor(() => expect(mockedGet).toHaveBeenLastCalledWith('/apartments', {
      params: { q: undefined, cursor: 'next-1', limit: 12 },
    }))

    mockedGet.mockResolvedValueOnce({ data: { items: [], nextCursor: null } })
    fireEvent.change(screen.getByLabelText('Search apartments'), { target: { value: 'sky' } })
    fireEvent.submit(screen.getByRole('search'))

    await waitFor(() => expect(mockedGet).toHaveBeenLastCalledWith('/apartments', {
      params: { q: 'sky', cursor: null, limit: 12 },
    }))
  })
})
