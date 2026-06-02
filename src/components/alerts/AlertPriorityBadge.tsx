import { priorityColor } from "@/lib/constants";
import type { AlertPriority } from "@/types/alert";

export function AlertPriorityBadge({ priority }: { priority: AlertPriority }) {
  return (
    <span
      className="inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em]"
      style={{
        backgroundColor: `${priorityColor[priority]}22`,
        color: priorityColor[priority]
      }}
    >
      {priority}
    </span>
  );
}
