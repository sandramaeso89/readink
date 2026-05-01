import type { Request, Response } from "express";
import { searchOpenLibrary } from "../services/openLibraryService.js";
import { validateOpenLibrarySearchQuery } from "../validators/openLibraryValidator.js";

export const openLibraryController = {
  // GET /api/v1/openlibrary/search?q=...
  async search(req: Request, res: Response): Promise<void> {
    const validation = validateOpenLibrarySearchQuery(req.query.q);

    if (validation.errors.length > 0 || !validation.query) {
      res.status(400).json({ error: "Parámetros inválidos.", details: validation.errors });
      return;
    }

    try {
      const books = await searchOpenLibrary(validation.query);
      res.status(200).json({ data: books });
    } catch {
      res.status(500).json({ error: "No se pudo obtener resultados de Open Library." });
    }
  },
};
