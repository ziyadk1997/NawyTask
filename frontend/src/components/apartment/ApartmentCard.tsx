import Link from 'next/link'

type Props = {
  id: string
  unitName: string
  unitNumber: string
  project: string
  price: string
  imageUrl?: string | null
}

function formatPrice(price: string) {
  const n = Number(price)
  if (Number.isNaN(n)) return price
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function ApartmentCard({ id, unitName, unitNumber, project, price, imageUrl }: Props) {
  return (
    <Link href={`/apartments/${id}`} className="card-link">
      <div className="card apartment-card">
        <div className="apartment-card-thumb">
          {imageUrl ? (
            <img src={imageUrl} alt={`${unitName} thumbnail`} loading="lazy" />
          ) : (
            <span className="apartment-card-thumb-placeholder">No image</span>
          )}
        </div>
        <div className="apartment-card-body">
          <h3 className="title">{unitName} — {unitNumber}</h3>
          <p className="muted">{project}</p>
          <p className="apartment-card-price">{formatPrice(price)}</p>
        </div>
      </div>
    </Link>
  )
}
