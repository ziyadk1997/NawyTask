import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ApartmentDetails from '../../src/app/apartments/[id]/page'

jest.mock('../../src/lib/api/client', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}))

import api from '../../src/lib/api/client'
const mockedGet = (api as unknown as { get: jest.Mock }).get

// Regression coverage for a real bug: this page used to destructure `params`
// directly as a prop (`{ params }: { params: { id: string } }`), but in this
// Next.js version `params` is delivered asynchronously even to Client
// Component pages. That silently produced `id === undefined` and the page
// always rendered "Apartment not found", for every apartment, regardless of
// whether it actually existed. `useParams()` is the fix.
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'abc-123' }),
}))

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>)
}

beforeEach(() => {
  mockedGet.mockReset()
})

describe('ApartmentDetails page', () => {
  it('requests the apartment using the id read via useParams()', async () => {
    mockedGet.mockResolvedValue({
      data: {
        id: 'abc-123',
        unitName: 'Sky View',
        unitNumber: '101',
        project: 'Sky Tower',
        price: '1500000',
        bedrooms: 2,
        bathrooms: 2,
        areaSqm: 95,
        description: 'Bright apartment',
        imageUrl: null,
      },
    })

    renderWithClient(<ApartmentDetails />)

    await waitFor(() => expect(mockedGet).toHaveBeenCalledWith('/apartments/abc-123'))
    expect(await screen.findByText('Sky View — 101')).toBeInTheDocument()
    expect(screen.queryByText('Apartment not found.')).not.toBeInTheDocument()
  })

  it('shows a not-found message (not a generic error) on a 404 response', async () => {
    mockedGet.mockRejectedValue({ isAxiosError: true, response: { status: 404 } })

    renderWithClient(<ApartmentDetails />)

    expect(await screen.findByText('Apartment not found.')).toBeInTheDocument()
    expect(screen.queryByText(/Something went wrong/)).not.toBeInTheDocument()
  })

  it('shows a generic error message on a non-404 failure', async () => {
    mockedGet.mockRejectedValue({ isAxiosError: true, response: { status: 500 } })

    renderWithClient(<ApartmentDetails />)

    expect(await screen.findByText(/Something went wrong/)).toBeInTheDocument()
    expect(screen.queryByText('Apartment not found.')).not.toBeInTheDocument()
  })
})
