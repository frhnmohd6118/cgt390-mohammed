import { AppShell } from "@/components/AppShell";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MyBooksShelf } from "@/components/MyBooksShelf";

export default async function MyBooksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <AppShell>
      <main className="page-width">
        <p className="eyebrow">Your reading space</p>
        <h1 className="page-title">My Books</h1>
        <p className="page-intro">Books you have chosen to keep close, organized by where you are in the story.</p>
        <MyBooksShelf />
      </main>
    </AppShell>
  );
}