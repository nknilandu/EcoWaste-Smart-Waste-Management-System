interface Props {
  completedDates: Set<string>; // ISO date strings like '2026-04-15'
}

export default function TaskChart({ completedDates }: Props) {
  const today = new Date();
  const days: { date: string; label: string; done: boolean }[] = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().split('T')[0];
    days.push({
      date: iso,
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      done: completedDates.has(iso),
    });
  }

  return (
    <div className="bg-card border rounded-2xl p-5">
      <h3 className="text-sm font-semibold mb-4">30-Day Activity</h3>
      <div className="flex items-end gap-[3px] h-24">
        {days.map(d => (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div
              className={`w-full rounded-sm transition-all duration-300 ${d.done ? 'bg-primary hover:bg-primary/80' : 'bg-muted hover:bg-muted-foreground/20'}`}
              style={{ height: d.done ? '100%' : '20%', minHeight: 80 }}
            />
            {/* Tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {d.label} {d.done ? '✓' : '✗'}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
        <span>{days[0].label}</span>
        <span>Today</span>
      </div>
      <div className="flex items-center gap-4 mt-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" /> Completed</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-muted inline-block" /> Missed</span>
      </div>
    </div>
  );
}
