import { AppShell } from "@/components/AppShell";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getShelfEntries } from "@/lib/shelves";
import { BookCard } from "@/components/BookCard";
import { getBook } from "@/data/books";
import { shelfStatuses, shelfStatusLabels, type ShelfStatus } from "@/types/shelf";

export default async function MyBooksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const entries = await getShelfEntries(supabase, user.id);

  return (
    <AppShell>
      <main className="page-width">
        <p className="eyebrow">Your reading space</p>
        <h1 className="page-title">My Books</h1>
        <p className="page-intro">Books you have chosen to keep close, organized by where you are in the story.</p>
        {shelfStatuses.map((status: ShelfStatus) => {
          const savedBooks = entries.map((entry) => entry.status === status ? getBook(entry.book_id) : undefined).filter((book): book is NonNullable<typeof book> => Boolean(book));
          return <section className="shelf-section" key={status}><div className="section-heading"><h2>{shelfStatusLabels[status]}</h2><p>{savedBooks.length} {savedBooks.length === 1 ? "book" : "books"}</p></div>{savedBooks.length ? <div className="book-grid">{savedBooks.map((book) => <BookCard book={book} key={book.id} />)}</div> : <p className="shelf-empty">No books here yet.</p>}</section>;
        })}
      </main>
    </AppShell>
  );
}