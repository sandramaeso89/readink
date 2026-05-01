import type {
  CreateBookInput,
  ReadingStatus,
  UpdateBookInput
} from "../types/book.js";

interface ValidationResult<T> {
  data?: T;
  errors: string[];
}

const allowedStatuses: ReadingStatus[] = ["wishlist", "reading", "read"];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// Valida body de creación en la frontera HTTP.
export function validateCreateBook(body: unknown): ValidationResult<CreateBookInput> {
  if (!isObject(body)) {
    return { errors: ["El body debe ser un objeto JSON."] };
  }

  const title = body.title;
  const author = body.author;
  const status = body.status;
  const rating = body.rating;
  const notes = body.notes;
  const progress = body.progress;
  const errors: string[] = [];

  if (typeof title !== "string" || title.trim().length === 0) {
    errors.push("title es obligatorio y debe ser texto.");
  }

  if (typeof author !== "string" || author.trim().length === 0) {
    errors.push("author es obligatorio y debe ser texto.");
  }

  if (typeof status !== "string" || !allowedStatuses.includes(status as ReadingStatus)) {
    errors.push("status debe ser wishlist, reading o read.");
  }

  if (rating !== undefined && (typeof rating !== "number" || rating < 1 || rating > 5)) {
    errors.push("rating debe ser un numero entre 1 y 5.");
  }

  if (notes !== undefined && typeof notes !== "string") {
    errors.push("notes debe ser texto.");
  }

  if (progress !== undefined && (typeof progress !== "number" || progress < 0 || progress > 100)) {
    errors.push("progress debe ser un numero entre 0 y 100.");
  }

  if (errors.length > 0) return { errors };

  // Aquí ya sabemos que title y author son string válidos por las validaciones anteriores.
  const safeTitle = title as string;
  const safeAuthor = author as string;
  const safeStatus = status as ReadingStatus;

  return {
    errors: [],
    data: {
      title: safeTitle.trim(),
      author: safeAuthor.trim(),
      status: safeStatus,
      rating: rating as number | undefined,
      notes: notes as string | undefined,
      progress: progress as number | undefined
    }
  };
}

// Valida body de actualización parcial (PATCH).
export function validateUpdateBook(body: unknown): ValidationResult<UpdateBookInput> {
  if (!isObject(body)) {
    return { errors: ["El body debe ser un objeto JSON."] };
  }

  const errors: string[] = [];
  const data: UpdateBookInput = {};

  if ("title" in body) {
    if (typeof body.title !== "string" || body.title.trim().length === 0) {
      errors.push("title debe ser texto no vacio.");
    } else {
      data.title = body.title.trim();
    }
  }

  if ("author" in body) {
    if (typeof body.author !== "string" || body.author.trim().length === 0) {
      errors.push("author debe ser texto no vacio.");
    } else {
      data.author = body.author.trim();
    }
  }

  if ("status" in body) {
    if (typeof body.status !== "string" || !allowedStatuses.includes(body.status as ReadingStatus)) {
      errors.push("status debe ser wishlist, reading o read.");
    } else {
      data.status = body.status as ReadingStatus;
    }
  }

  if ("rating" in body) {
    if (typeof body.rating !== "number" || body.rating < 1 || body.rating > 5) {
      errors.push("rating debe ser un numero entre 1 y 5.");
    } else {
      data.rating = body.rating;
    }
  }

  if ("notes" in body) {
    if (typeof body.notes !== "string") {
      errors.push("notes debe ser texto.");
    } else {
      data.notes = body.notes;
    }
  }

  if ("progress" in body) {
    if (typeof body.progress !== "number" || body.progress < 0 || body.progress > 100) {
      errors.push("progress debe ser un numero entre 0 y 100.");
    } else {
      data.progress = body.progress;
    }
  }

  if (Object.keys(data).length === 0) {
    errors.push("Debes enviar al menos un campo valido para actualizar.");
  }

  return { errors, data: errors.length === 0 ? data : undefined };
}
