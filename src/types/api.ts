// Estado de lectura que comparte frontend y backend.
export type ApiReadingStatus = 'wishlist' | 'reading' | 'read'

// Tipo de libro que devuelve el backend.
export interface ApiBook {
  id: string
  title: string
  author: string
  coverUrl?: string
  status: ApiReadingStatus
  rating?: number
  notes?: string
  progress?: number
  createdAt: string
  finishedAt?: string
}

// Respuesta correcta genérica del backend.
export interface ApiSuccess<T> {
  data: T
}

// Respuesta de error del backend.
export interface ApiError {
  error: string
  details?: string[]
}

// Payload para crear libro desde el frontend.
export interface CreateBookPayload {
  title: string
  author: string
  coverUrl?: string
  status: ApiReadingStatus
  rating?: number
  notes?: string
  progress?: number
}

// Payload para actualizar parcialmente un libro.
export interface UpdateBookPayload {
  title?: string
  author?: string
  coverUrl?: string
  status?: ApiReadingStatus
  rating?: number
  notes?: string
  progress?: number
}

// Resultado normalizado de búsqueda Open Library vía backend.
export interface ApiOpenLibraryBook {
  id: string
  title: string
  author: string
  coverUrl?: string
  firstPublishYear?: number
}
