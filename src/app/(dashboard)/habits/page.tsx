import dbConnect from "@/lib/dbConnect";
import { getUserFromRequest } from "@/lib/auth";
import { Habit, HabitEntry } from "@/models/Habit";
import { HabitForm } from "@/components/habits/HabitForm";
import { HabitTodayForm } from "@/components/habits/HabitTodayForm";
import type { HabitDTO } from "@/types/domain";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HabitHeatmap } from "@/components/habits/HabitHeatmap";

export default async function HabitsPage() {
  const user = await getUserFromRequest();
  if (!user) {
    return null;
  }

  await dbConnect();

  const [habits, entries] = await Promise.all([
    Habit.find({ userId: user.id }).sort({ name: 1 }).lean(),
    HabitEntry.find({ userId: user.id }).sort({ date: -1 }).limit(90).lean()
  ]);

  const entriesByHabit = new Map<string, typeof entries>();
  for (const entry of entries) {
    const key = entry.habitId;
    const current = entriesByHabit.get(key) ?? [];
    current.push(entry);
    entriesByHabit.set(key, current);
  }

  const habitDtos: HabitDTO[] = habits.map((h) => ({
    _id: String(h._id),
    userId: h.userId,
    name: h.name,
    targetType: h.targetType,
    targetValue: h.targetValue ?? null
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Habits</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Build consistent routines and see your streaks at a glance.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card className="space-y-4 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">Create habit</h2>
            <Badge variant="outline">New routine</Badge>
          </div>
          <HabitForm />
        </Card>

        <Card className="space-y-4 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">Today&apos;s completion</h2>
            <Badge variant="outline">Daily check-in</Badge>
          </div>
          <HabitTodayForm habits={habitDtos} />
        </Card>
      </div>

      <Card className="p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">Habits & recent entries</h2>
          <Badge variant="outline">Last 30 days</Badge>
        </div>
        {habits.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No habits yet. Use the form above to create your first habit.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {habits.map((habit) => {
              const habitEntries = entriesByHabit.get(String(habit._id)) ?? [];
              return (
                <div
                  key={String(habit._id)}
                  className="space-y-3 rounded-2xl border border-border/60 bg-background/40 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">{habit.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Target: {habit.targetType}
                        {habit.targetValue != null
                          ? ` (${habit.targetValue})`
                          : ""}
                      </div>
                    </div>
                    <Badge variant="outline">
                      {habitEntries.length} entries
                    </Badge>
                  </div>
                  <HabitHeatmap entries={habitEntries} />
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

