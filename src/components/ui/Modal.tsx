import type { ReactNode } from 'react'
import { Button } from './Button'

interface ModalProps {
  // Define si el modal está visible o no.
  isOpen: boolean
  // Título mostrado en la cabecera del modal.
  title: string
  // Contenido interno del modal.
  children: ReactNode
  // Función para cerrar el modal.
  onClose: () => void
}

export function Modal({ isOpen, title, children, onClose }: ModalProps) {
  // Si no está abierto, no pintamos nada.
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/85 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-brand-accent/40 bg-brand-800/95 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm md:p-7">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-brand-accent">{title}</h2>
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
