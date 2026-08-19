import '@testing-library/jest-dom'

// lib/api/client.ts throws at import time if this is unset - it would
// otherwise break any test that transitively imports it (via the hooks)
// without explicitly mocking it out first.
process.env.NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

// Minimal mock for next/link used in unit tests
const React = require('react')
jest.mock('next/link', () => {
  return ({ children, href }: any) => React.createElement('a', { href }, children)
})
