import { connectToDatabase } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { ProgressEntry } from "@/models/Progress";
import { ProgressForm } from "@/components/progress/ProgressForm";
import { ProgressEntries } from "@/components/progress/ProgressEntries";
import type { ProgressEntryDTO } from "@/types/domain";

export default async function ProgressPage() {
  const user = await getUserFromRequest();
  if (!user) {
    return null;
  }

  await connectToDatabase();

  const entries = await ProgressEntry.find({ userId: user.id }).sort({ date: -1 }).limit(60).lean();

  const serialized: ProgressEntryDTO[] = entries.map((e) => ({
    _id: String(e._id),
    userId: e.userId,
    date: e.date.toISOString(),
    weight: e.weight ?? null,
    waist: e.waist ?? null,
    notes: e.notes
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Progress</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Recent measurements and notes.
        </p>
      </div>

      <section className="card space-y-4 p-4">
        <h2 className="text-sm font-semibold">Add / update entry</h2>
        <ProgressForm />
      </section>

      <section className="card p-4">
        <h2 className="mb-3 text-sm font-semibold">Entries</h2>
        <ProgressEntries entries={serialized} />
      </section>
    </div>
  );
}

