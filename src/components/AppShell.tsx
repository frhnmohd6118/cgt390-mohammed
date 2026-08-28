import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/LogoutButton";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link className="wordmark" href="/discover">shelf<span>wise</span></Link>
          <nav className="main-nav" aria-label="Main navigation">
            <Link href="/discover">Discover</Link>
            <Link href="/my-books">My Books</Link>
            {user ? <LogoutButton /> : <Link href="/login">Log in</Link>}
          </nav>
        </div>
      </header>
      {children}
    </>
  );
}