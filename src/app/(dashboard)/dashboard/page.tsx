import { getUserFromRequest } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { WorkoutLog } from "@/models/Workout";
import { HabitEntry } from "@/models/Habit";
import { ProgressEntry } from "@/models/Progress";
import { StatCard } from "@/components/ui/stat-card";
import { WeightChart, WaistChart } from "@/components/charts/weight-chart";
import { WorkoutFrequencyChart } from "@/components/charts/workout-chart";
import { HabitCompletionChartModern } from "@/components/charts/habit-chart";
import { DashboardMotion } from "@/components/dashboard-motion";

export default async function DashboardPage() {
  const user = await getUserFromRequest();

  if (!user) {
    return null;
  }

  await dbConnect();

  const [workoutCount, habitEntryCount, latestProgress] = await Promise.all([
    WorkoutLog.countDocuments({ userId: user.id }),
    HabitEntry.countDocuments({ userId: user.id }),
    ProgressEntry.findOne({ userId: user.id }).sort({ date: -1 }).lean(),
  ]);

  return (
    <DashboardMotion
      header={
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            High-level overview of your training, habits, and progress.
          </p>
        </div>
      }
      stats={[
        <StatCard
          key="workouts"
          label="Workouts logged"
          value={workoutCount}
          description="Total sessions recorded"
        />,
        <StatCard
          key="habits"
          label="Habit entries"
          value={habitEntryCount}
          description="Check-ins across all habits"
        />,
        <StatCard
          key="metrics"
          label="Latest metrics"
          value={
            latestProgress ? (
              <span>
                {latestProgress.weight ?? "–"} kg
                <span className="mx-1 text-xs text-muted-foreground">/</span>
                {latestProgress.waist ?? "–"} cm
              </span>
            ) : (
              "No entries"
            )
          }
          description={
            latestProgress
              ? "Most recent weight & waist"
              : "Add your first measurement"
          }
        />,
      ]}
      charts={[
        <WeightChart key="weight" />,
        <WaistChart key="waist" />,
        <WorkoutFrequencyChart key="freq" />,
        <HabitCompletionChartModern key="habits-chart" />,
      ]}
    />
  );
}
