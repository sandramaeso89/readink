// Este tipo marca en qué lista está un libro dentro de Readink.
export type ReadingStatus = 'WISHLIST' | 'READING' | 'READ'

// Este es el tipo principal de un libro guardado en la app.
export interface Book {
  // id interno para identificar el libro en nuestra UI.
  id: string
  // workKey suele venir de Open Library.
  workKey: string
  title: string
  authorNames: string[]
  firstPublishYear?: number
  coverUrl?: string
  list: ReadingStatus
  // Nota personal de la usuaria.
  note: string | null
  // Valoración de 1 a 5; null significa "sin valorar aún".
  rating: 1 | 2 | 3 | 4 | 5 | null
}
