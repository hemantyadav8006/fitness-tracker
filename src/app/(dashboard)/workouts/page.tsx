import dbConnect from "@/lib/dbConnect";
import { getUserFromRequest } from "@/lib/auth";
import { WorkoutLog, WorkoutTemplate } from "@/models/Workout";
import { WorkoutTemplateForm } from "@/components/workouts/WorkoutTemplateForm";
import { WorkoutQuickLogForm } from "@/components/workouts/WorkoutQuickLogForm";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function WorkoutsPage() {
  const user = await getUserFromRequest();
  if (!user) {
    return null;
  }

  await dbConnect();

  const [templates, logs] = await Promise.all([
    WorkoutTemplate.find({ userId: user.id }).sort({ name: 1 }).lean(),
    WorkoutLog.find({ userId: user.id }).sort({ date: -1 }).limit(20).lean(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Workouts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Build templates and log sessions with a few taps.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card className="space-y-4 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">Create template</h2>
            <Badge variant="outline">Reusable workouts</Badge>
          </div>
          <WorkoutTemplateForm />
        </Card>

        <Card className="space-y-4 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">Quick log</h2>
            <Badge variant="outline">Under a minute</Badge>
          </div>
          <WorkoutQuickLogForm />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4 sm:p-5">
          <h2 className="mb-3 text-sm font-semibold">Templates</h2>
          {templates.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No templates yet. Use the form above to add custom workouts.
            </p>
          ) : (
            <ul className="space-y-3 text-sm">
              {templates.map((t) => (
                <li
                  key={String(t._id)}
                  className="flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.exercises.map((e) => e.name).join(", ")}
                    </div>
                  </div>
                  <Badge variant="outline">
                    {t.exercises.length} exercise
                    {t.exercises.length === 1 ? "" : "s"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-4 sm:p-5">
          <h2 className="mb-3 text-sm font-semibold">Recent logs</h2>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No workouts logged yet. Use the quick log above to add a session.
            </p>
          ) : (
            <ul className="space-y-3 text-sm">
              {logs.map((log) => (
                <li
                  key={String(log._id)}
                  className="border-b border-border/60 pb-2 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>
                      {new Date(log.date).toLocaleDateString(undefined, {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                    <span>{log.exercises.length} exercise(s)</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {log.exercises.map((ex, index) => (
                      <div key={`${log._id}-${index}`}>
                        <div className="font-medium">{ex.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {ex.sets
                            .map(
                              (s) =>
                                `${s.reps} reps @ ${s.weight}${
                                  s.notes ? ` (${s.notes})` : ""
                                }`,
                            )
                            .join(" • ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
