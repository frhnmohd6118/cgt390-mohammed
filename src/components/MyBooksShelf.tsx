"use client";

import { useEffect, useState } from "react";
import { BookCard } from "@/components/BookCard";
import { getBook } from "@/data/books";
import type { ShelfEntry, ShelfStatus } from "@/types/shelf";
import { shelfStatuses, shelfStatusLabels } from "@/types/shelf";

export function MyBooksShelf() {
  const [entries, setEntries] = useState<ShelfEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadShelf() {
      try {
        const response = await fetch("/api/shelf", { signal: controller.signal });
        const result: { entries?: ShelfEntry[]; error?: string } = await response.json();
        if (!response.ok) {
          setError(result.error ?? "Unable to load your shelf.");
          return;
        }
        setEntries(result.entries ?? []);
      } catch {
        if (!controller.signal.aborted) setError("Unable to load your shelf.");
      }
    }

    void loadShelf();
    return () => controller.abort();
  }, []);

  if (error) return <p className="form-error" role="alert">{error}</p>;
  if (!entries) return null;

  return (
    <>
      {shelfStatuses.map((status: ShelfStatus) => {
        const savedBooks = entries
          .map((entry) => entry.status === status ? getBook(entry.book_id) : undefined)
          .filter((book): book is NonNullable<typeof book> => Boolean(book));

        return (
          <section className="shelf-section" key={status}>
            <div className="section-heading">
              <h2>{shelfStatusLabels[status]}</h2>
              <p>{savedBooks.length} {savedBooks.length === 1 ? "book" : "books"}</p>
            </div>
            {savedBooks.length ? (
              <div className="book-grid">{savedBooks.map((book) => <BookCard book={book} key={book.id} />)}</div>
            ) : (
              <p className="shelf-empty">No books here yet.</p>
            )}
          </section>
        );
      })}
    </>
  );
}
