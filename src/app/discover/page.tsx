import { AppShell } from "@/components/AppShell";
import { BookCard } from "@/components/BookCard";
import { books } from "@/data/books";

export default function DiscoverPage() {
  return (
    <AppShell>
      <main className="page-width">
        <p className="eyebrow">The reading room</p>
        <h1 className="page-title">Find a story<br />worth keeping.</h1>
        <p className="page-intro">A considered collection of fictional books for curious readers. Start with something unexpected, or follow a familiar feeling.</p>
        <div className="section-heading">
          <h2>Recommended for you</h2>
          <p>Six places to begin</p>
        </div>
        <div className="book-grid">
          {books.map((book) => <BookCard key={book.id} book={book} />)}
        </div>
      </main>
    </AppShell>
  );
}