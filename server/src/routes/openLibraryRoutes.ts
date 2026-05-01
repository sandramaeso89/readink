import { Router } from "express";
import { openLibraryController } from "../controllers/openLibraryController.js";

const router = Router();

// Ruta de búsqueda proxy a Open Library.
router.get("/search", (req, res) => {
  void openLibraryController.search(req, res);
});

export default router;
