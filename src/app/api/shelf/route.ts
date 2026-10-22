import { revalidatePath } from "next/cache";
import { getBook } from "@/data/books";
import { createClient } from "@/lib/supabase/server";
import { getShelfEntries, removeShelfEntry, saveShelfEntry } from "@/lib/shelves";
import { isShelfStatus } from "@/types/shelf";

type ShelfRequest = Record<string, unknown>;

function isShelfRequest(value: unknown): value is ShelfRequest {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function getAuthenticatedClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function GET() {
  try {
    const { supabase, user } = await getAuthenticatedClient();
    if (!user) return Response.json({ error: "Please log in to manage your shelf." }, { status: 401 });

    const entries = await getShelfEntries(supabase, user.id);
    return Response.json({ entries });
  } catch {
    return Response.json({ error: "Unable to load your shelf." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Choose a valid shelf status." }, { status: 400 });
  }

  if (
    !isShelfRequest(body) ||
    typeof body.bookId !== "string" ||
    !isShelfStatus(body.status)
  ) {
    return Response.json({ error: "Choose a valid shelf status." }, { status: 400 });
  }

  const { bookId, status } = body;

  try {
    const { supabase, user } = await getAuthenticatedClient();
    if (!user) return Response.json({ error: "Please log in to manage your shelf." }, { status: 401 });

    await saveShelfEntry(supabase, user.id, bookId, status);
    revalidatePath(`/books/${bookId}`);
    revalidatePath("/my-books");
    return Response.json({ success: "Shelf updated." });
  } catch (error) {
    if (error instanceof Error && error.message === "That book could not be found.") {
      return Response.json({ error: error.message }, { status: 404 });
    }
    return Response.json({ error: "Unable to update your shelf." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "That book could not be found." }, { status: 400 });
  }

  if (!isShelfRequest(body) || typeof body.bookId !== "string" || !body.bookId.trim()) {
    return Response.json({ error: "That book could not be found." }, { status: 400 });
  }

  const { bookId } = body;

  try {
    const { supabase, user } = await getAuthenticatedClient();
    if (!user) return Response.json({ error: "Please log in to manage your shelf." }, { status: 401 });
    if (!getBook(bookId)) {
      return Response.json({ error: "That book could not be found." }, { status: 404 });
    }

    await removeShelfEntry(supabase, user.id, bookId);
    revalidatePath(`/books/${bookId}`);
    revalidatePath("/my-books");
    return Response.json({ success: "Removed from your shelf." });
  } catch {
    return Response.json({ error: "Unable to remove this book." }, { status: 500 });
  }
}
