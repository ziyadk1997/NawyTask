"use client"
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { isAxiosError } from 'axios'
import useApartment from '../../../hooks/useApartment'

function formatPrice(price: string | number) {
  const n = Number(price)
  if (Number.isNaN(n)) return String(price)
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

export default function ApartmentDetails() {
  // Route params are delivered asynchronously to page props in this Next.js
  // version, even for Client Component pages - destructuring a `params`
  // prop directly resolves to a Promise, not `{ id }`. `useParams()` is the
  // supported client-side way to read them synchronously instead.
  const params = useParams<{ id: string }>()
  const id = params.id
  const { data, isLoading, error } = useApartment(id)
  // The API returns a plain 404 for an unknown id, which axios surfaces as a
  // rejected request (not a resolved response with empty data) - treat that
  // specifically as "not found" instead of lumping it into the generic
  // error state below.
  const isNotFound = (isAxiosError(error) && error.response?.status === 404) || (!isLoading && !error && !data)

  if (isLoading) {
    return (
      <div className="container page">
        <div className="detail-grid">
          <div className="skeleton">
            <div className="skeleton-thumb" style={{ height: 320 }} />
          </div>
          <div className="card skeleton">
            <div className="skeleton-line" style={{ width: '60%' }} />
            <div className="skeleton-line" style={{ width: '40%' }} />
            <div className="skeleton-line" style={{ width: '50%' }} />
          </div>
        </div>
      </div>
    )
  }

  if (isNotFound) {
    return (
      <div className="container page">
        <p className="state-message">Apartment not found.</p>
        <Link href="/apartments" className="nav-link">← Back to listings</Link>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="container page">
        <p className="state-message state-error">Something went wrong loading this apartment. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="container page">
      <div className="back-link-row">
        <Link href="/apartments" className="nav-link">← Back to listings</Link>
      </div>

      <div className="detail-grid">
        <div>
          <h1 className="title detail-title">{data.unitName} — {data.unitNumber}</h1>
          <p className="muted detail-project">{data.project}</p>

          {data.imageUrl ? (
            <img src={data.imageUrl} alt={`${data.unitName} image`} className="detail-image" />
          ) : (
            <div className="detail-image detail-image-placeholder">No image</div>
          )}
        </div>

        <aside className="detail-aside">
          <div className="card detail-facts">
            <p><strong>Price</strong><span>{formatPrice(data.price)}</span></p>
            <p><strong>Bedrooms</strong><span>{data.bedrooms}</span></p>
            <p><strong>Bathrooms</strong><span>{data.bathrooms}</span></p>
            <p><strong>Area</strong><span>{data.areaSqm} sqm</span></p>
          </div>

          {data.description ? <p className="muted detail-description">{data.description}</p> : null}
        </aside>
      </div>
    </div>
  )
}
