import type {
  ApiBook,
  ApiError,
  ApiOpenLibraryBook,
  ApiSuccess,
  CreateBookPayload,
  UpdateBookPayload,
} from '../types/api'

// Si VITE_API_BASE_URL está como "" en .env, `??` no sustituye y fetch usa URLs relativas
// contra el origen de Vite (p. ej. :5173), no contra Express (:4000).
function resolveApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL
  const trimmed = typeof raw === 'string' ? raw.trim() : ''
  const fallback = 'http://localhost:4000'
  if (!trimmed) return fallback
  return trimmed.replace(/\/+$/, '')
}

const API_BASE_URL = resolveApiBaseUrl()

// Error simple para mostrar mensajes claros en UI.
export class ApiClientError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'ApiClientError'
  }
}

// Helper común para centralizar llamadas HTTP.
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    })
  } catch (cause) {
    const hint =
      API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1')
        ? ' Comprueba que el backend esté en marcha (npm run dev:server, puerto 4000).'
        : ''
    throw new ApiClientError(
      `No hay conexión con la API (${API_BASE_URL}).${hint}`,
      { cause },
    )
  }

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
