import Link from 'next/link'

export default function Home() {
  // No <main> here: the root layout already renders one around {children},
  // and nesting a second <main> landmark inside it is invalid/confusing for
  // assistive tech even though browsers render it fine.
  return (
    <section className="hero">
      <div className="container hero-inner">
        <h1 className="hero-title">Find your next apartment</h1>
        <p className="hero-subtitle">Browse available units across every project, then dive into the details.</p>
        <Link href="/apartments" className="btn btn-lg">View Listings</Link>
      </div>
    </section>
  )
}
