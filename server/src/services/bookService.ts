import { randomUUID } from "node:crypto";
import type { Book, CreateBookInput, UpdateBookInput } from "../types/book.js";

// Al inicio usamos memoria para mantenerlo simple en nivel junior.
const books: Book[] = [];

export const bookService = {
  // Devuelve la lista completa.
  getAll(): Book[] {
    return books;
  },

  // Busca un libro por id.
  getById(id: string): Book | undefined {
    return books.find((book) => book.id === id);
  },

  // Crea un libro con id y fecha automática.
  create(input: CreateBookInput): Book {
    const now = new Date().toISOString();
    const newBook: Book = {
      id: randomUUID(),
      title: input.title,
      author: input.author,
      coverUrl: input.coverUrl,
      status: input.status,
      rating: input.rating,
      notes: input.notes,
      progress: input.progress,
      createdAt: now,
      finishedAt: input.status === "read" ? now : undefined
    };

    books.push(newBook);
    return newBook;
  },

  // Actualiza solo los campos enviados en PATCH.
  update(id: string, input: UpdateBookInput): Book | undefined {
    const book = books.find((item) => item.id === id);
    if (!book) return undefined;

    if (input.title !== undefined) book.title = input.title;
    if (input.author !== undefined) book.author = input.author;
    if (input.coverUrl !== undefined) book.coverUrl = input.coverUrl;
    if (input.status !== undefined) book.status = input.status;
    if (input.rating !== undefined) book.rating = input.rating;
    if (input.notes !== undefined) book.notes = input.notes;
    if (input.progress !== undefined) book.progress = input.progress;

    // Si queda como leído y no tenía finishedAt, lo completamos.
    if (book.status === "read" && !book.finishedAt) {
      book.finishedAt = new Date().toISOString();
    }

    // Si deja de estar leído, limpiamos finishedAt.
    if (book.status !== "read") {
      book.finishedAt = undefined;
    }

    return book;
  },

  // Elimina libro por id y confirma si existía.
  remove(id: string): boolean {
    const index = books.findIndex((book) => book.id === id);
    if (index === -1) return false;

    books.splice(index, 1);
    return true;
  }
};
