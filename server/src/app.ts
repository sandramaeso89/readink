import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./docs/openapi.js";
import bookRoutes from "./routes/bookRoutes.js";
import openLibraryRoutes from "./routes/openLibraryRoutes.js";

const app = express();

// Middleware base para aceptar JSON y permitir peticiones del frontend.
app.use(cors());
app.use(express.json());

// Healthcheck simple para comprobar si el server vive.
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// Swagger UI para explorar y probar endpoints desde navegador.
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

// API principal de libros.
app.use("/api/v1/books", bookRoutes);
// API proxy para búsqueda Open Library.
app.use("/api/v1/openlibrary", openLibraryRoutes);

// 404 para rutas no existentes.
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Ruta no encontrada." });
});

// Manejo centralizado de errores inesperados.
app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor." });
});

export default app;
