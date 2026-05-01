import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import bookRoutes from "./routes/bookRoutes.js";

const app = express();

// Middleware base para aceptar JSON y permitir peticiones del frontend.
app.use(cors());
app.use(express.json());

// Healthcheck simple para comprobar si el server vive.
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// API principal de libros.
app.use("/api/v1/books", bookRoutes);

// 404 para rutas no existentes.
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Ruta no encontrada." });
});

// Manejo centralizado de errores inesperados.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor." });
});

export default app;
