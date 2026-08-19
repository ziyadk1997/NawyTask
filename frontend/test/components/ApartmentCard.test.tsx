import React from 'react'
import { render, screen } from '@testing-library/react'
import ApartmentCard from '../../src/components/apartment/ApartmentCard'

describe('ApartmentCard', () => {
  it('renders title, project, formatted price and a link to the details page', () => {
    render(<ApartmentCard id="1" unitName="Unit A" unitNumber="101" project="Project X" price="1000" />)

    expect(screen.getByText('Unit A — 101')).toBeInTheDocument()
    expect(screen.getByText('Project X')).toBeInTheDocument()
    expect(screen.getByText('$1,000')).toBeInTheDocument()
    const link = screen.getByRole('link') as HTMLAnchorElement
    expect(link).toHaveAttribute('href', '/apartments/1')
  })

  it('renders a thumbnail image when imageUrl is provided', () => {
    render(
      <ApartmentCard id="1" unitName="Unit A" unitNumber="101" project="Project X" price="1000" imageUrl="https://example.com/a.jpg" />
    )

    const img = screen.getByRole('img', { name: 'Unit A thumbnail' }) as HTMLImageElement
    expect(img).toHaveAttribute('src', 'https://example.com/a.jpg')
  })

  it('renders a placeholder instead of an image when imageUrl is missing', () => {
    render(<ApartmentCard id="1" unitName="Unit A" unitNumber="101" project="Project X" price="1000" />)

    expect(screen.getByText('No image')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('falls back to the raw price string if it is not numeric', () => {
    render(<ApartmentCard id="1" unitName="Unit A" unitNumber="101" project="Project X" price="ask" />)

    expect(screen.getByText('ask')).toBeInTheDocument()
  })
})
