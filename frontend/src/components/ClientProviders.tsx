"use client"
import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function ClientProviders({ children }: { children: ReactNode }) {
  // Created inside the component (not at module scope) so each request/tab
  // gets its own cache. A module-scope QueryClient is a well-known Next.js +
  // React Query footgun: on the server, module state is shared across
  // concurrent requests, which can leak one visitor's cached data into
  // another's response.
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
