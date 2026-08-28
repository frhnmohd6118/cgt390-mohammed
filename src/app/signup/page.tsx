import { AuthForm } from "@/components/AuthForm";

export default function SignupPage() {
  return <main className="auth-page"><div className="auth-panel"><p className="eyebrow">Make a reading space</p><h1>Start your shelfwise story.</h1><p className="auth-intro">Create an account to gather the books you want to remember.</p><AuthForm mode="signup" /></div></main>;
}