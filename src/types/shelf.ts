export const shelfStatuses = [
  "want-to-read",
  "currently-reading",
  "read",
  "did-not-finish",
] as const;

export type ShelfStatus = (typeof shelfStatuses)[number];

export type ShelfEntry = {
  id: string;
  user_id: string;
  book_id: string;
  status: ShelfStatus;
  created_at: string;
  updated_at: string;
};

export const shelfStatusLabels: Record<ShelfStatus, string> = {
  "want-to-read": "Want to Read",
  "currently-reading": "Currently Reading",
  read: "Read",
  "did-not-finish": "Did Not Finish",
};

export function isShelfStatus(value: unknown): value is ShelfStatus {
  return typeof value === "string" && shelfStatuses.includes(value as ShelfStatus);
}