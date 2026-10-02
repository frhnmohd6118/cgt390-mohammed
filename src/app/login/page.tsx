import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Log in | Shelfwise",
};

export default function LoginPage() {
  return <main className="auth-page"><div className="auth-panel"><p className="eyebrow">Welcome back</p><h1>Return to your reading.</h1><p className="auth-intro">Log in to keep your reading space close.</p><AuthForm mode="login" /></div></main>;
}