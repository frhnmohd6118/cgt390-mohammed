"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const supabase = createClient();
    const result = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName } } });

    setPending(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }

    router.push("/discover");
    router.refresh();
  }

  const isLogin = mode === "login";

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {!isLogin && <label>Display name<input required value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label>}
      <label>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
      <label>Password<input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="primary-button" disabled={pending} type="submit">{pending ? "Working..." : isLogin ? "Log in" : "Create account"}</button>
      <p className="form-switch">{isLogin ? "New to Shelfwise?" : "Already have an account?"} <Link href={isLogin ? "/signup" : "/login"}>{isLogin ? "Sign up" : "Log in"}</Link></p>
    </form>
  );
}