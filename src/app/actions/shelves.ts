"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { removeShelfEntry, saveShelfEntry } from "@/lib/shelves";
import { isShelfStatus } from "@/types/shelf";

type ShelfActionState = { error?: string; success?: string };

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function updateShelfEntry(
  _state: ShelfActionState,
  formData: FormData,
): Promise<ShelfActionState> {
  const bookId = formData.get("bookId");
  const status = formData.get("status");
  if (typeof bookId !== "string" || !isShelfStatus(status)) return { error: "Choose a valid shelf status." };

  const { supabase, user } = await getAuthenticatedUser();
  if (!user) return { error: "Please log in to manage your shelf." };

  try {
    await saveShelfEntry(supabase, user.id, bookId, status);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to update your shelf." };
  }

  revalidatePath(`/books/${bookId}`);
  revalidatePath("/my-books");
  return { success: "Shelf updated." };
}

export async function deleteShelfEntry(
  _state: ShelfActionState,
  formData: FormData,
): Promise<ShelfActionState> {
  const bookId = formData.get("bookId");
  if (typeof bookId !== "string") return { error: "That book could not be found." };

  const { supabase, user } = await getAuthenticatedUser();
  if (!user) return { error: "Please log in to manage your shelf." };

  try {
    await removeShelfEntry(supabase, user.id, bookId);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to remove this book." };
  }

  revalidatePath(`/books/${bookId}`);
  revalidatePath("/my-books");
  return { success: "Removed from your shelf." };
}