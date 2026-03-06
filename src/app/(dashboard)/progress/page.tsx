import dbConnect from "@/lib/dbConnect";
import { getUserFromRequest } from "@/lib/auth";
import { ProgressEntry } from "@/models/Progress";
import { ProgressForm } from "@/components/progress/ProgressForm";
import { ProgressEntries } from "@/components/progress/ProgressEntries";
import type { ProgressEntryDTO } from "@/types/domain";
import { Card } from "@/components/ui/card";

export default async function ProgressPage() {
  const user = await getUserFromRequest();
  if (!user) {
    return null;
  }

  await dbConnect();

  const entries = await ProgressEntry.find({ userId: user.id })
    .sort({ date: -1 })
    .limit(60)
    .lean();

  const serialized: ProgressEntryDTO[] = entries.map((e) => ({
    _id: String(e._id),
    userId: e.userId,
    date: e.date.toISOString(),
    weight: e.weight ?? null,
    waist: e.waist ?? null,
    notes: e.notes,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Progress</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track measurements and notes to see long‑term change.
        </p>
      </div>

      <Card className="space-y-4 p-4 sm:p-5">
        <h2 className="text-sm font-semibold">Add / update entry</h2>
        <ProgressForm />
      </Card>

      <Card className="p-4 sm:p-5">
        <h2 className="mb-3 text-sm font-semibold">Entries</h2>
        <ProgressEntries entries={serialized} />
      </Card>
    </div>
  );
}
