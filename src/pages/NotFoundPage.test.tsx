import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { NotFoundPage } from './NotFoundPage'

describe('NotFoundPage', () => {
  it('muestra mensaje 404 y link para volver al inicio', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Error 404')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/')
  })
})
