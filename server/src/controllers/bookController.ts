import type { Request, Response } from "express";
import { bookService } from "../services/bookService.js";
import { validateCreateBook, validateUpdateBook } from "../validators/bookValidator.js";

export const bookController = {
  // GET /api/v1/books
  getAll(_req: Request, res: Response): void {
    const books = bookService.getAll();
    res.status(200).json({ data: books });
  },

  // GET /api/v1/books/:id
  getById(req: Request, res: Response): void {
    const book = bookService.getById(req.params.id);

    if (!book) {
      res.status(404).json({ error: "Libro no encontrado." });
      return;
    }

    res.status(200).json({ data: book });
  },

  // POST /api/v1/books
  create(req: Request, res: Response): void {
    const validation = validateCreateBook(req.body);

    if (validation.errors.length > 0 || !validation.data) {
      res.status(400).json({ error: "Datos invalidos.", details: validation.errors });
      return;
    }

    const createdBook = bookService.create(validation.data);
    res.status(201).json({ data: createdBook });
  },

  // PATCH /api/v1/books/:id
  update(req: Request, res: Response): void {
    const validation = validateUpdateBook(req.body);

    if (validation.errors.length > 0 || !validation.data) {
      res.status(400).json({ error: "Datos invalidos.", details: validation.errors });
      return;
    }

    const updatedBook = bookService.update(req.params.id, validation.data);

    if (!updatedBook) {
      res.status(404).json({ error: "Libro no encontrado." });
      return;
    }

    res.status(200).json({ data: updatedBook });
  },

  // DELETE /api/v1/books/:id
  remove(req: Request, res: Response): void {
    const deleted = bookService.remove(req.params.id);

    if (!deleted) {
      res.status(404).json({ error: "Libro no encontrado." });
      return;
    }

    res.status(200).json({ message: "Libro eliminado correctamente." });
  }
};
