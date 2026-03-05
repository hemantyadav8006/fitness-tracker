import { connectToDatabase } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { WorkoutLog, WorkoutTemplate } from "@/models/Workout";
import { WorkoutTemplateForm } from "@/components/workouts/WorkoutTemplateForm";
import { WorkoutQuickLogForm } from "@/components/workouts/WorkoutQuickLogForm";

export default async function WorkoutsPage() {
  const user = await getUserFromRequest();
  if (!user) {
    return null;
  }

  await connectToDatabase();

  const [templates, logs] = await Promise.all([
    WorkoutTemplate.find({ userId: user.id }).sort({ name: 1 }).lean(),
    WorkoutLog.find({ userId: user.id }).sort({ date: -1 }).limit(20).lean()
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Workouts</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Manage workout templates and recent workout logs.
        </p>
      </div>

      <section className="card space-y-4 p-4">
        <h2 className="text-sm font-semibold">Create template</h2>
        <WorkoutTemplateForm />
      </section>

      <section className="card space-y-4 p-4">
        <h2 className="text-sm font-semibold">Quick log</h2>
        <WorkoutQuickLogForm />
      </section>

      <section className="card p-4">
        <h2 className="mb-3 text-sm font-semibold">Templates</h2>
        {templates.length === 0 ? (
          <p className="text-sm text-gray-500">
            No templates yet. Use the form above to add custom workouts.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {templates.map((t) => (
              <li key={String(t._id)}>
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-gray-500">
                  {t.exercises.map((e) => e.name).join(", ")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card p-4">
        <h2 className="mb-3 text-sm font-semibold">Recent Logs</h2>
        {logs.length === 0 ? (
          <p className="text-sm text-gray-500">
            No workouts logged yet. Use the quick log above to add a session.
          </p>
        ) : (
          <ul className="space-y-3 text-sm">
            {logs.map((log) => (
              <li key={String(log._id)} className="border-b border-border pb-2 last:border-b-0">
                <div className="text-xs text-gray-500">
                  {new Date(log.date).toLocaleDateString()}
                </div>
                <div>
                  {log.exercises.map((ex) => (
                    <div key={String(ex._id)} className="mt-1">
                      <div className="font-medium">{ex.name}</div>
                      <div className="text-xs text-gray-500">
                        {ex.sets
                          .map((s) => `${s.reps} reps @ ${s.weight}${s.notes ? ` (${s.notes})` : ""}`)
                          .join(" • ")}
                      </div>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

