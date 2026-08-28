import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { books, getBook } from "@/data/books";
import { createClient } from "@/lib/supabase/server";
import { getShelfEntry } from "@/lib/shelves";
import { ShelfStatusControl } from "@/components/ShelfStatusControl";

export function generateStaticParams() {
  return books.map((book) => ({ id: book.id }));
}

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = getBook(id);
  if (!book) notFound();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const entry = user ? await getShelfEntry(supabase, user.id, book.id) : null;

  return (
    <AppShell>
      <main className="page-width">
        <Link className="back-link" href="/discover">&larr; Back to Discover</Link>
        <div className="detail-layout">
          <div className="detail-cover">
            <div className={`book-cover ${book.coverStyle}`}><span className="cover-title">{book.title}</span></div>
          </div>
          <article className="detail-copy">
            <span className="book-genre">{book.genre}</span>
            <h1>{book.title}</h1>
            <p className="book-author">By {book.author}</p>
            <p className="detail-description">{book.description}</p>
            {user ? <ShelfStatusControl bookId={book.id} entry={entry} /> : <p className="shelf-login-note"><Link href="/login">Log in</Link> to save this book to your shelf.</p>}
            <div className="detail-meta">
              <div><strong>Published</strong><span>{book.year}</span></div>
              <div><strong>Collection</strong><span>Recommended</span></div>
            </div>
          </article>
        </div>
      </main>
    </AppShell>
  );
}