"use client";

import { useState } from "react";
import { BookCard } from "@/components/BookCard";
import type { Book } from "@/data/books";

type DiscoverView = "for-you" | "new-releases" | "genres";

const genreOptions = ["Fiction", "Fantasy", "Mystery", "Romance", "Science Fiction"];

export function DiscoverTabs({ recommended, newReleases, allBooks }: { recommended: Book[]; newReleases: Book[]; allBooks: Book[] }) {
  const [view, setView] = useState<DiscoverView>("for-you");
  const [selectedGenre, setSelectedGenre] = useState(genreOptions[0]);

  const tabs: { id: DiscoverView; label: string }[] = [
    { id: "for-you", label: "For You" },
    { id: "new-releases", label: "New Releases" },
    { id: "genres", label: "Genres" },
  ];
  const genreBooks = allBooks.filter((book) => book.genre.toLowerCase() === selectedGenre.toLowerCase());
  const displayedBooks = view === "for-you" ? recommended : view === "new-releases" ? newReleases : genreBooks;
  const heading = view === "for-you" ? "Recommended for you" : view === "new-releases" ? "New releases" : selectedGenre;
  const description = view === "for-you" ? "Six places to begin" : view === "new-releases" ? "Freshly added to the reading room" : "Browse by genre";

  return (
    <>
      <nav className="discover-tabs" aria-label="Discover categories">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={view === tab.id ? "discover-tab is-active" : "discover-tab"}
            type="button"
            aria-pressed={view === tab.id}
            onClick={() => setView(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {view === "genres" && (
        <div className="genre-options" aria-label="Choose a genre">
          {genreOptions.map((genre) => (
            <button
              key={genre}
              className={selectedGenre === genre ? "genre-option is-active" : "genre-option"}
              type="button"
              aria-pressed={selectedGenre === genre}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      )}

      <div className="section-heading">
        <h2>{heading}</h2>
        <p>{description}</p>
      </div>
      <div className="book-grid">
        {displayedBooks.map((book) => <BookCard key={book.id} book={book} />)}
      </div>
    </>
  );
}