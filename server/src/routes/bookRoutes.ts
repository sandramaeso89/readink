import { Router } from "express";
import { bookController } from "../controllers/bookController.js";

const router = Router();

// Rutas REST de libros.
router.get("/", bookController.getAll);
router.get("/:id", bookController.getById);
router.post("/", bookController.create);
router.patch("/:id", bookController.update);
router.delete("/:id", bookController.remove);

export default router;
