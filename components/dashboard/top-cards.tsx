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
    card: "bg-lightprimary dark:bg-lightprimary",
    text: "text-primary",
  },
  secondary: {
    card: "bg-lightsecondary dark:bg-lightsecondary",
    text: "text-secondary",
  },
  success: {
    card: "bg-lightsuccess dark:bg-lightsuccess",
    text: "text-success",
  },
  warning: {
    card: "bg-lightwarning dark:bg-lightwarning",
    text: "text-warning",
  },
  info: { card: "bg-lightinfo dark:bg-lightinfo", text: "text-info" },
  error: { card: "bg-lighterror dark:bg-lighterror", text: "text-error" },
};

interface DashboardTopCardsProps {
  items: TopCardItem[];
}

export function DashboardTopCards({ items }: DashboardTopCardsProps) {
  return (
    <div className="grid grid-cols-12 gap-6">
      {items.map((item) => {
        const Icon = item.icon;
        const styles = toneStyles[item.tone];

        return (
          <div
            key={item.key}
            className={cn(
              "col-span-12 rounded-md p-6 text-center md:col-span-6 lg:col-span-4",
              styles.card,
            )}
          >
            {Icon ? (
              <div className="mb-3 flex justify-center">
                <Icon className={cn("h-12 w-12", styles.text)} />
              </div>
            ) : null}
            <h6 className={cn("mb-1 text-lg font-semibold", styles.text)}>
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
