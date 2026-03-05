import { getUserFromRequest } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { WorkoutLog } from "@/models/Workout";
import { HabitEntry } from "@/models/Habit";
import { ProgressEntry } from "@/models/Progress";
import { WeightProgressChart } from "@/components/charts/WeightProgressChart";
import { WaistProgressChart } from "@/components/charts/WaistProgressChart";
import { WorkoutFrequencyChart } from "@/components/charts/WorkoutFrequencyChart";
import { HabitCompletionChart } from "@/components/charts/HabitCompletionChart";

export default async function DashboardPage() {
  const user = await getUserFromRequest();

  if (!user) {
    // Should be handled by layout redirect, but keep a safeguard.
    return null;
  }

  await connectToDatabase();

  const [workoutCount, habitEntryCount, latestProgress] = await Promise.all([
    WorkoutLog.countDocuments({ userId: user.id }),
    HabitEntry.countDocuments({ userId: user.id }),
    ProgressEntry.findOne({ userId: user.id }).sort({ date: -1 }).lean()
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          High-level overview of your training and habits.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-4">
          <div className="text-xs font-medium uppercase text-gray-500">Workouts Logged</div>
          <div className="mt-2 text-2xl font-semibold">{workoutCount}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs font-medium uppercase text-gray-500">Habit Entries</div>
          <div className="mt-2 text-2xl font-semibold">{habitEntryCount}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs font-medium uppercase text-gray-500">Latest Metrics</div>
          {latestProgress ? (
            <div className="mt-2 text-sm">
              <div>Weight: {latestProgress.weight ?? "–"} kg</div>
              <div>Waist: {latestProgress.waist ?? "–"} cm</div>
            </div>
          ) : (
            <div className="mt-2 text-sm text-gray-500">No entries yet</div>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-4">
          <h2 className="mb-2 text-sm font-semibold">Weight Progress</h2>
          <WeightProgressChart />
        </div>
        <div className="card p-4">
          <h2 className="mb-2 text-sm font-semibold">Waist Progress</h2>
          <WaistProgressChart />
        </div>
        <div className="card p-4">
          <h2 className="mb-2 text-sm font-semibold">Workout Frequency</h2>
          <WorkoutFrequencyChart />
        </div>
        <div className="card p-4">
          <h2 className="mb-2 text-sm font-semibold">Habit Completion</h2>
          <HabitCompletionChart />
        </div>
      </div>
    </div>
  );
}

