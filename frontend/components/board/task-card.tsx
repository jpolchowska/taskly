import { getCategoryColor } from "@/lib/categories";
import { DragHandleIcon, MenuDotsIcon } from "./icons";

interface TaskCardProps {
  title: string;
  category: string;
}

export function TaskCard({ title, category }: TaskCardProps) {
  const color = getCategoryColor(category);

  return (
    <div className="flex cursor-grab items-start gap-2.5 rounded-2xl border border-border bg-card py-3.5 pr-3 pl-2 shadow-[var(--shadow-card)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
      <div className="shrink-0 pt-1 text-muted-foreground opacity-60">
        <DragHandleIcon />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="text-sm leading-snug font-medium text-foreground">{title}</div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-[7px] w-[7px] shrink-0 rounded-full"
            style={{ backgroundColor: `light-dark(${color.light}, ${color.dark})` }}
          />
          <span className="text-[11.5px] font-medium text-muted-foreground">{category}</span>
        </div>
      </div>

      <button
        type="button"
        aria-label="Task menu"
        className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
      >
        <MenuDotsIcon />
      </button>
    </div>
  );
}
