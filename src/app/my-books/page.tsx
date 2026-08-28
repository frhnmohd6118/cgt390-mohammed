import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MyBooksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <AppShell>
      <main className="page-width">
        <p className="eyebrow">Your reading space</p>
        <h1 className="page-title">My Books</h1>
        <div className="placeholder">
          <h2>Your shelves are on their way.</h2>
          <p>This space will become your personal library in the next stage of Shelfwise. For now, explore the recommendations and find a book that catches your eye.</p>
          <Link className="back-link" href="/discover">Browse recommendations &rarr;</Link>
        </div>
      </main>
    </AppShell>
  );
}