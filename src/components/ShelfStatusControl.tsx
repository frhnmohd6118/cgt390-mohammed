"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { ShelfEntry, ShelfStatus } from "@/types/shelf";
import { isShelfStatus, shelfStatuses, shelfStatusLabels } from "@/types/shelf";

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, parameters: { reading_status: string }) => void;
  }
}

function trackShelfEvent(eventName: string, status: ShelfStatus) {
  window.gtag?.("event", eventName, { reading_status: status.replaceAll("-", "_") });
}

export function ShelfStatusControl({ bookId, entry }: { bookId: string; entry: ShelfEntry | null }) {
  const router = useRouter();
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [updatePending, setUpdatePending] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const status = new FormData(event.currentTarget).get("status");
    if (!isShelfStatus(status)) {
      setUpdateError("Choose a valid shelf status.");
      setUpdateSuccess(null);
      return;
    }

    setUpdatePending(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    try {
      const response = await fetch("/api/shelf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, status }),
      });
      const result: { error?: string; success?: string } = await response.json();

      if (!response.ok) {
        setUpdateError(result.error ?? "Unable to update your shelf.");
        return;
      }

      setUpdateSuccess(result.success ?? "Shelf updated.");
      if (!entry) trackShelfEvent("add_to_shelf", status);
      router.refresh();
    } catch {
      setUpdateError("Unable to update your shelf.");
    } finally {
      setUpdatePending(false);
    }
  }

  async function handleDelete(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDeletePending(true);
    setDeleteError(null);
    setDeleteSuccess(null);

    try {
      const response = await fetch("/api/shelf", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });
      const result: { error?: string; success?: string } = await response.json();

      if (!response.ok) {
        setDeleteError(result.error ?? "Unable to remove this book.");
        return;
      }

      setDeleteSuccess(result.success ?? "Removed from your shelf.");
      router.refresh();
    } catch {
      setDeleteError("Unable to remove this book.");
    } finally {
      setDeletePending(false);
    }
  }

  return (
    <div className="shelf-control">
      <p className="shelf-control-title">Your shelf</p>
      <form
        className="shelf-form"
        onSubmit={handleUpdate}
      >
        <input name="bookId" type="hidden" value={bookId} />
        <label htmlFor="shelf-status">Status</label>
        <select
          defaultValue={entry?.status ?? ""}
          id="shelf-status"
          name="status"
          onChange={(event) => {
            const status = event.currentTarget.value;
            if (isShelfStatus(status)) trackShelfEvent("reading_status_selected", status);
          }}
          required
        >
          <option disabled value="">Choose a status</option>
          {shelfStatuses.map((status: ShelfStatus) => <option key={status} value={status}>{shelfStatusLabels[status]}</option>)}
        </select>
        <button className="primary-button" disabled={updatePending} type="submit">{updatePending ? "Saving..." : entry ? "Update shelf" : "Add to shelf"}</button>
      </form>
      {(updateError || deleteError) && <p className="form-error" role="alert">{updateError || deleteError}</p>}
      {(updateSuccess || deleteSuccess) && <p className="form-success" role="status">{updateSuccess || deleteSuccess}</p>}
      {entry && <form onSubmit={handleDelete}><input name="bookId" type="hidden" value={bookId} /><button className="remove-button" disabled={deletePending} type="submit">{deletePending ? "Removing..." : "Remove from shelf"}</button></form>}
    </div>
  );
}