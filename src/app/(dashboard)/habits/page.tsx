import { connectToDatabase } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { Habit, HabitEntry } from "@/models/Habit";
import { HabitForm } from "@/components/habits/HabitForm";
import { HabitTodayForm } from "@/components/habits/HabitTodayForm";
import type { HabitDTO } from "@/types/domain";

export default async function HabitsPage() {
  const user = await getUserFromRequest();
  if (!user) {
    return null;
  }

  await connectToDatabase();

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
        <h1 className="text-2xl font-semibold">Habits</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Overview of your habits and recent completion entries.
        </p>
      </div>

      <section className="card space-y-4 p-4">
        <h2 className="text-sm font-semibold">Create habit</h2>
        <HabitForm />
      </section>

      <section className="card space-y-4 p-4">
        <h2 className="text-sm font-semibold">Today&apos;s completion</h2>
        <HabitTodayForm habits={habitDtos} />
      </section>

      <section className="card p-4">
        <h2 className="mb-3 text-sm font-semibold">Habits & recent entries</h2>
        {habits.length === 0 ? (
          <p className="text-sm text-gray-500">
            No habits yet. Use the form above to create your first habit.
          </p>
        ) : (
          <ul className="space-y-3 text-sm">
            {habits.map((habit) => {
              const habitEntries = entriesByHabit.get(String(habit._id)) ?? [];
              return (
                <li key={String(habit._id)} className="border-b border-border pb-3 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{habit.name}</div>
                      <div className="text-xs text-gray-500">
                        Target: {habit.targetType}
                        {habit.targetValue != null ? ` (${habit.targetValue})` : ""}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {habitEntries.length} entries
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

