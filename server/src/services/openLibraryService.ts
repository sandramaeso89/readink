import type { OpenLibraryBook, OpenLibrarySearchResponse } from "../types/openLibrary.js";

// Busca libros en Open Library y normaliza a contrato interno.
export async function searchOpenLibrary(query: string): Promise<OpenLibraryBook[]> {
  // Hacemos dos búsquedas para cubrir casos por título y por autor.
  const titleUrl = new URL("https://openlibrary.org/search.json");
  titleUrl.searchParams.set("title", query);
  titleUrl.searchParams.set("limit", "8");

  const authorUrl = new URL("https://openlibrary.org/search.json");
  authorUrl.searchParams.set("author", query);
  authorUrl.searchParams.set("limit", "8");

  const [titleResponse, authorResponse] = await Promise.all([fetch(titleUrl), fetch(authorUrl)]);

  if (!titleResponse.ok || !authorResponse.ok) {
    throw new Error("No se pudo consultar Open Library.");
  }

  const [titleData, authorData] = (await Promise.all([
    titleResponse.json(),
    authorResponse.json(),
  ])) as [OpenLibrarySearchResponse, OpenLibrarySearchResponse];

  // Combinamos ambos resultados y eliminamos duplicados por key.
  const combinedDocs = [...(titleData.docs ?? []), ...(authorData.docs ?? [])];
  const uniqueDocs = combinedDocs.filter((book, index, array) => {
    const currentKey = book.key ?? `${book.title}-${book.author_name?.[0] ?? "unknown"}`;
    return (
      array.findIndex((candidate) => {
        const candidateKey = candidate.key ?? `${candidate.title}-${candidate.author_name?.[0] ?? "unknown"}`;
        return candidateKey === currentKey;
      }) === index
    );
  });

  // Filtramos a resultados en español para cumplir requisito de idioma.
  const spanishDocs = uniqueDocs.filter((book) => {
      const langs = book.language ?? [];
      return langs.includes("spa") || langs.includes("es");
  });

  return (
    spanishDocs.map((book) => ({
      id: book.key ?? `ol-${Math.random().toString(36).slice(2)}`,
      title: book.title ?? "Sin título",
      author: book.author_name?.[0] ?? "Autor desconocido",
      coverUrl: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : undefined,
      firstPublishYear: book.first_publish_year,
    })) ?? []
  );
}
