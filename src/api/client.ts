import type {
  ApiBook,
  ApiError,
  ApiOpenLibraryBook,
  ApiSuccess,
  CreateBookPayload,
  UpdateBookPayload,
} from '../types/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'

// Error simple para mostrar mensajes claros en UI.
export class ApiClientError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiClientError'
  }
}

// Helper común para centralizar llamadas HTTP.
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  // Si backend responde error, intentamos leer mensaje real.
  if (!response.ok) {
    let errorMessage = 'Error de red no controlado.'

    try {
      const body = (await response.json()) as ApiError
      errorMessage = body.error ?? errorMessage
    } catch {
      errorMessage = `Error HTTP ${response.status}`
    }

    throw new ApiClientError(errorMessage)
  }

  return (await response.json()) as T
}

// Devuelve todos los libros guardados.
export async function getBooks(): Promise<ApiBook[]> {
  const response = await request<ApiSuccess<ApiBook[]>>('/api/v1/books')
  return response.data
}

// Crea un libro nuevo.
export async function createBook(payload: CreateBookPayload): Promise<ApiBook> {
  const response = await request<ApiSuccess<ApiBook>>('/api/v1/books', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response.data
}

// Actualiza un libro existente de forma parcial.
export async function updateBook(bookId: string, payload: UpdateBookPayload): Promise<ApiBook> {
  const response = await request<ApiSuccess<ApiBook>>(`/api/v1/books/${bookId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  return response.data
}

// Elimina un libro por id.
export async function deleteBook(bookId: string): Promise<void> {
  await request<{ message: string }>(`/api/v1/books/${bookId}`, {
    method: 'DELETE',
  })
}

// Busca libros en Open Library pasando por backend.
export async function searchOpenLibrary(query: string): Promise<ApiOpenLibraryBook[]> {
  const safeQuery = query.trim()
  const response = await request<ApiSuccess<ApiOpenLibraryBook[]>>(
    `/api/v1/openlibrary/search?q=${encodeURIComponent(safeQuery)}`,
  )
  return response.data
}
