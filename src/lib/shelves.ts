import type { SupabaseClient } from "@supabase/supabase-js";
import { getBook } from "@/data/books";
import type { ShelfEntry, ShelfStatus } from "@/types/shelf";

export async function getShelfEntry(supabase: SupabaseClient, userId: string, bookId: string) {
  const { data, error } = await supabase
    .from("shelf_entries")
    .select("*")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as ShelfEntry | null;
}

export async function getShelfEntries(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("shelf_entries")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as ShelfEntry[];
}

export async function saveShelfEntry(
  supabase: SupabaseClient,
  userId: string,
  bookId: string,
  status: ShelfStatus,
) {
  if (!getBook(bookId)) throw new Error("That book could not be found.");

  const { error } = await supabase
    .from("shelf_entries")
    .upsert({ user_id: userId, book_id: bookId, status }, { onConflict: "user_id,book_id" });

  if (error) throw new Error(error.message);
}

export async function removeShelfEntry(supabase: SupabaseClient, userId: string, bookId: string) {
  const { error } = await supabase
    .from("shelf_entries")
    .delete()
    .eq("user_id", userId)
    .eq("book_id", bookId);

  if (error) throw new Error(error.message);
}