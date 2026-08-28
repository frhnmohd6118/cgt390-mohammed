import Link from "next/link";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link className="wordmark" href="/discover">shelf<span>wise</span></Link>
          <nav className="main-nav" aria-label="Main navigation">
            <Link href="/discover">Discover</Link>
            <Link href="/my-books">My Books</Link>
            <span className="nav-note">A place for the next chapter</span>
          </nav>
        </div>
      </header>
      {children}
    </>
  );
}