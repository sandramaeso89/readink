// Tipo mínimo de obra que consume nuestra UI.
export interface OpenLibraryBook {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  firstPublishYear?: number;
}

// Tipo parcial de respuesta externa de Open Library.
export interface OpenLibrarySearchResponse {
  docs?: Array<{
    key?: string;
    title?: string;
    author_name?: string[];
    cover_i?: number;
    first_publish_year?: number;
    language?: string[];
  }>;
}
