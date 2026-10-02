import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { DiscoverTabs } from "@/components/DiscoverTabs";
import { allBooks, books, newReleases } from "@/data/books";

export const metadata: Metadata = {
  title: "Discover | Shelfwise",
};

export default function DiscoverPage() {
  return (
    <AppShell>
      <main className="page-width">
        <p className="eyebrow">The reading room</p>
        <h1 className="page-title">Find a story<br />worth keeping.</h1>
        <p className="page-intro">A considered collection of fictional books for curious readers. Start with something unexpected, or follow a familiar feeling.</p>
        <DiscoverTabs recommended={books} newReleases={newReleases} allBooks={allBooks} />
      </main>
    </AppShell>
  );
}