"use client";

import { useRouter } from "next/navigation";
import type { ProgressEntryDTO } from "@/types/domain";

interface Props {
  entries: ProgressEntryDTO[];
}

export function ProgressEntries({ entries }: Props) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Delete this entry?")) return;
    await fetch(`/api/progress/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (entries.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No progress entries yet. Use the form above to add measurements.
      </p>
    );
  }

  return (
    <ul className="space-y-3 text-sm">
      {entries.map((e) => (
        <li key={e._id} className="border-b border-border pb-3 last:border-b-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-medium">
                {new Date(e.date).toLocaleDateString()}
              </div>
              <div className="text-xs text-gray-500">
                {e.weight != null && (
                  <span className="mr-3">Weight: {e.weight} kg</span>
                )}
                {e.waist != null && <span>Waist: {e.waist} cm</span>}
              </div>
              {e.notes && (
                <div className="mt-1 text-xs text-gray-600">{e.notes}</div>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleDelete(e._id)}
              className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
