"use client";

interface HabitEntryLike {
  date: Date | string;
}

interface HabitHeatmapProps {
  entries: HabitEntryLike[];
}

interface Cell {
  date: Date;
  active: boolean;
}

export function HabitHeatmap({ entries }: HabitHeatmapProps) {
  const today = new Date();
  const days = 30;

  const entryDates = new Set(
    entries.map((e) => new Date(e.date).toISOString().slice(0, 10)),
  );

  const cells: Cell[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    cells.push({ date: d, active: entryDates.has(key) });
  }

  return (
    <div className="mt-1 space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {cells.map((cell) => (
          <div
            key={cell.date.toISOString()}
            className={`h-4 w-4 rounded-sm transition-colors duration-150 ${
              cell.active
                ? "bg-emerald-500/90 hover:bg-emerald-400"
                : "bg-muted hover:bg-muted/90"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>30 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
