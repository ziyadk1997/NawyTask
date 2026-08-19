import './globals.css'
import ClientProviders from '../components/ClientProviders'

export const metadata = {
  title: 'Nawy — Apartments',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <header className="site-header">
            <div className="container header-inner">
              <div className="site-title">Nawy</div>
              <nav className="site-nav">
                <a href="/" className="nav-link">Home</a>
                <a href="/apartments" className="nav-link">Apartments</a>
              </nav>
            </div>
          </header>

          <main>
            {children}
          </main>

          <footer className="site-footer">
            <div className="container">© {new Date().getFullYear()} Nawy — Demo</div>
          </footer>
        </ClientProviders>
      </body>
    </html>
  )
}
