import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type TopCardTone =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "info"
  | "error";

interface TopCardItem {
  key: string;
  label: string;
  value: string | number;
  icon?: LucideIcon;
  tone: TopCardTone;
}

const toneStyles: Record<TopCardTone, { card: string; text: string }> = {
  primary: {
    card: "bg-primary dark:bg-primary",
    text: "text-white",
  },
  secondary: {
    card: "bg-secondary dark:bg-secondary",
    text: "text-white",
  },
  success: {
    card: "bg-success dark:bg-success",
    text: "text-white",
  },
  warning: {
    card: "bg-warning dark:bg-warning",
    text: "text-white",
  },
  info: { card: "bg-info dark:bg-info", text: "text-white" },
  error: { card: "bg-error dark:bg-error", text: "text-white" },
};

interface DashboardTopCardsProps {
  items: TopCardItem[];
}

export function DashboardTopCards({ items }: DashboardTopCardsProps) {
  return (
    <div className="grid grid-cols-12 gap-4 lg:gap-6">
      {items.map((item) => {
        const Icon = item.icon;
        const styles = toneStyles[item.tone];

        return (
          <div
            key={item.key}
            className={cn(
              "col-span-12 rounded-md p-4 text-center sm:col-span-6 xl:col-span-4",
              styles.card,
            )}
          >
            {Icon ? (
              <div className="mb-3 flex justify-center">
                <Icon className={cn("h-12 w-12", styles.text)} />
              </div>
            ) : null}
            <h6
              className={cn(
                "mb-1 text-base leading-snug font-semibold sm:text-lg",
                styles.text,
              )}
            >
              {item.label}
            </h6>
            <h3 className={cn("text-2xl font-semibold", styles.text)}>
              {item.value}
            </h3>
          </div>
        );
      })}
    </div>
  );
}
