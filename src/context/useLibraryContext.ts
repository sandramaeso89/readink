import { useContext } from 'react'
import { LibraryContext } from './LibraryContextInstance'

// Hook único para leer el contexto global de biblioteca.
export function useLibraryContext() {
  const context = useContext(LibraryContext)
  if (!context) {
    throw new Error('useLibraryContext debe usarse dentro de LibraryProvider')
  }
  return context
}
