"use client"
import { FormEvent, useState } from 'react'
import ApartmentCard from './ApartmentCard'
import useApartments from '../../hooks/useApartments'

const PAGE_SIZE = 12

export default function ApartmentList() {
  // `searchInput` is what the user is typing; `submittedQuery` is what's
  // actually sent to the API. Kept separate on purpose so the query only
  // re-fires on submit (Enter / the Search button), not on every keystroke.
  const [searchInput, setSearchInput] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, error } = useApartments({
    q: submittedQuery || undefined,
    limit: PAGE_SIZE,
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmittedQuery(searchInput.trim())
  }

  function handleClear() {
    setSearchInput('')
    setSubmittedQuery('')
  }

  const items = data?.pages.flatMap(page => page.items) ?? []
  const showEmptyState = !isLoading && items.length === 0

  return (
    <div>
      <form className="search-row" onSubmit={handleSubmit} role="search">
        <div className="search-bar">
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            // Belt-and-suspenders: a plain <form onSubmit> already submits
            // natively on Enter, but that native "implicit submission"
            // behavior isn't reliably triggered by every input-automation
            // pipeline (real users are unaffected either way), so commit
            // explicitly on Enter too rather than depending on it silently.
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                setSubmittedQuery(searchInput.trim())
              }
            }}
            placeholder="Search by unit name, unit number or project"
            className="input search-input"
            aria-label="Search apartments"
            autoFocus
          />
          <button type="submit" className="btn search-btn">Search</button>
          {submittedQuery ? (
            <button type="button" className="btn btn-secondary" onClick={handleClear}>
              Clear
            </button>
          ) : null}
        </div>
        {submittedQuery ? (
          <p className="muted search-summary">
            Showing results for “{submittedQuery}”
          </p>
        ) : null}
      </form>

      {isLoading ? (
        <div className="grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card skeleton" aria-hidden="true">
              <div className="skeleton-thumb" />
              <div className="skeleton-line" style={{ width: '70%' }} />
              <div className="skeleton-line" style={{ width: '45%' }} />
              <div className="skeleton-line" style={{ width: '30%' }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="state-message state-error">Something went wrong loading apartments. Please try again.</p>
      ) : showEmptyState ? (
        <p className="state-message">
          {submittedQuery ? `No apartments match “${submittedQuery}”.` : 'No apartments found.'}
        </p>
      ) : (
        <>
          <div className="grid">
            {items.map(apartment => (
              <ApartmentCard
                key={apartment.id}
                id={apartment.id}
                unitName={apartment.unitName}
                unitNumber={apartment.unitNumber}
                project={apartment.project}
                price={apartment.price}
                imageUrl={apartment.imageUrl}
              />
            ))}
          </div>

          {hasNextPage ? (
            <div className="load-more-row">
              <button
                className="btn"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? 'Loading…' : 'Load more'}
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
