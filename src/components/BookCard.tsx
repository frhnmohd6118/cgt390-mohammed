import Link from "next/link";
import type { Book } from "@/data/books";

export function BookCard({ book }: { book: Book }) {
  return (
    <article className="book-card">
      <Link href={`/books/${book.id}`} aria-label={`View ${book.title}`}>
        <div className={`book-cover ${book.coverStyle}`}>
          <span className="cover-title">{book.title}</span>
        </div>
        <p className="book-author">{book.author}</p>
        <h3 className="book-name">{book.title}</h3>
        <span className="book-genre">{book.genre}</span>
      </Link>
    </article>
  );
}