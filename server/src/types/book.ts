// Tipo simple para mantener un contrato claro entre capas.
export type ReadingStatus = "wishlist" | "reading" | "read";

// Este tipo define los datos que maneja la API.
export interface Book {
  id: string;
  title: string;
  author: string;
  status: ReadingStatus;
  rating?: number;
  notes?: string;
  progress?: number;
  createdAt: string;
  finishedAt?: string;
}

// Datos de entrada para crear un libro (sin id ni fechas automáticas).
export interface CreateBookInput {
  title: string;
  author: string;
  status: ReadingStatus;
  rating?: number;
  notes?: string;
  progress?: number;
}

// Datos de entrada para actualizar parcialmente un libro.
export interface UpdateBookInput {
  title?: string;
  author?: string;
  status?: ReadingStatus;
  rating?: number;
  notes?: string;
  progress?: number;
}
