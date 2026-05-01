interface ValidationResult {
  query?: string;
  errors: string[];
}

// Valida query param "q" en frontera de red.
export function validateOpenLibrarySearchQuery(rawQuery: unknown): ValidationResult {
  if (typeof rawQuery !== "string") {
    return { errors: ["q es obligatorio y debe ser texto."] };
  }

  const query = rawQuery.trim();

  if (query.length < 3) {
    return { errors: ["q debe tener al menos 3 caracteres."] };
  }

  return { query, errors: [] };
}
