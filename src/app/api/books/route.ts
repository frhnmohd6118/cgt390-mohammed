import { allBooks } from "@/data/books";

const MAX_QUERY_LENGTH = 100;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryValues = searchParams.getAll("q");

  if (
    [...searchParams.keys()].some((key) => key !== "q") ||
    queryValues.length > 1
  ) {
    return Response.json({ error: "Invalid query parameters." }, { status: 400 });
  }

  if (queryValues.length === 0) {
    return Response.json({ books: allBooks });
  }

  const query = queryValues[0]?.trim() ?? "";
  if (!query || query.length > MAX_QUERY_LENGTH) {
    return Response.json(
      { error: "Search query must be 1 to 100 characters." },
      { status: 400 },
    );
  }

  const normalizedQuery = query.toLowerCase();
  const books = allBooks.filter((book) =>
    `${book.title} ${book.author}`.toLowerCase().includes(normalizedQuery),
  );

  return Response.json({ books });
}
