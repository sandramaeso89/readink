import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal'

describe('Modal', () => {
  it('no renderiza contenido cuando isOpen es false', () => {
    render(
      <Modal isOpen={false} title="Detalle" onClose={() => {}}>
        <p>Contenido modal</p>
      </Modal>,
    )

    expect(screen.queryByText('Contenido modal')).not.toBeInTheDocument()
  })

  it('renderiza y ejecuta onClose al pulsar Cerrar', () => {
    const handleClose = vi.fn()

    render(
      <Modal isOpen title="Detalle" onClose={handleClose}>
        <p>Contenido modal</p>
      </Modal>,
    )

    expect(screen.getByText('Contenido modal')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
