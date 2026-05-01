import { createContext } from 'react'
import type { LibraryContextValue } from './LibraryContext'

// Instancia de contexto separada para evitar warning de Fast Refresh.
export const LibraryContext = createContext<LibraryContextValue | null>(null)
