import { Home, Sparkles, Wrench } from "lucide-react";

type HousingSummaryCardsProps = {
  totalUnits: number;
  availableUnits: number;
  maintenanceUnits: number;
};

export function HousingSummaryCards({
  totalUnits,
  availableUnits,
  maintenanceUnits,
}: HousingSummaryCardsProps) {
  const cards = [
    {
      label: "Registered units",
      value: totalUnits,
      icon: Home,
      color: "var(--color-accent)",
      bgColor: "var(--color-accent-soft)",
      description: "Total property assets",
    },
    {
      label: "Available now",
      value: availableUnits,
      icon: Sparkles,
      color: "var(--color-success)",
      bgColor: "#edf9f1",
      description: "Ready for allocation",
    },
    {
      label: "Under maintenance",
      value: maintenanceUnits,
      icon: Wrench,
      color: "var(--color-warning)",
      bgColor: "#fff7e3",
      description: "Currently in repair",
    },
  ];
  

  return (
    <div className="grid gap-4 md:grid-cols-3 w-full">
      {cards.map((card) => (
        <article 
          key={card.label}
          className="group relative overflow-hidden bg-white border border-[var(--border)] p-6 transition-all hover:bg-[var(--surface-muted)]"
        >
          <div className="flex items-start gap-4">
            <div 
              className="flex h-12 w-12 shrink-0 items-center justify-center"
              style={{ backgroundColor: card.bgColor, color: card.color }}
            >
              <card.icon className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted font-bold">{card.label}</span>
              <span className="text-3xl font-bold text-[var(--color-primary)] tracking-tight">
                {card.value}
              </span>
              <p className="text-[11px] text-muted font-medium">
                {card.description}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
