import type { ReactNode } from 'react'

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

export function Modal({ isOpen, title, children, onClose }: Readonly<ModalProps>) {
  // Si no está abierto, no pintamos nada.
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-4xl rounded-lg border border-[var(--ri-border)] bg-[var(--ri-surface-alt)] p-6 shadow-2xl shadow-black/60 md:p-7">
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-[var(--ri-border)] pb-4">
          <h2 className="text-lg font-medium text-[var(--ri-accent)] md:text-xl">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#3a2a12] bg-[#1a1000] px-3 py-1.5 text-xs font-medium text-[var(--ri-accent)] transition-colors hover:bg-[#221500]"
          >
            Cerrar
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
