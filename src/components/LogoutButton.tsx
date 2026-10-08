import { logout } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button className="logout-button" type="submit">Log out</button>
    </form>
  );
}