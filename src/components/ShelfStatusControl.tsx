"use client";

import { useActionState } from "react";
import { deleteShelfEntry, updateShelfEntry } from "@/app/actions/shelves";
import type { ShelfEntry, ShelfStatus } from "@/types/shelf";
import { shelfStatuses, shelfStatusLabels } from "@/types/shelf";

export function ShelfStatusControl({ bookId, entry }: { bookId: string; entry: ShelfEntry | null }) {
  const [updateState, updateAction, updatePending] = useActionState(updateShelfEntry, {});
  const [deleteState, deleteAction, deletePending] = useActionState(deleteShelfEntry, {});

  return (
    <div className="shelf-control">
      <p className="shelf-control-title">Your shelf</p>
      <form action={updateAction} className="shelf-form">
        <input name="bookId" type="hidden" value={bookId} />
        <label htmlFor="shelf-status">Status</label>
        <select defaultValue={entry?.status ?? ""} id="shelf-status" name="status" required>
          <option disabled value="">Choose a status</option>
          {shelfStatuses.map((status: ShelfStatus) => <option key={status} value={status}>{shelfStatusLabels[status]}</option>)}
        </select>
        <button className="primary-button" disabled={updatePending} type="submit">{updatePending ? "Saving..." : entry ? "Update shelf" : "Add to shelf"}</button>
      </form>
      {(updateState.error || deleteState.error) && <p className="form-error" role="alert">{updateState.error || deleteState.error}</p>}
      {(updateState.success || deleteState.success) && <p className="form-success" role="status">{updateState.success || deleteState.success}</p>}
      {entry && <form action={deleteAction}><input name="bookId" type="hidden" value={bookId} /><button className="remove-button" disabled={deletePending} type="submit">{deletePending ? "Removing..." : "Remove from shelf"}</button></form>}
    </div>
  );
}