import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type MetricTone =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "info"
  | "error";

const toneStyles: Record<
  MetricTone,
  {
    card: string;
    text: string;
  }
> = {
  primary: {
    card: "bg-lightprimary/85",
    text: "text-primaryemphasis",
  },
  secondary: {
    card: "bg-lightsecondary/85",
    text: "text-secondaryemphasis",
  },
  success: {
    card: "bg-lightsuccess/85",
    text: "text-successemphasis",
  },
  warning: {
    card: "bg-lightwarning/85",
    text: "text-warningemphasis",
  },
  info: {
    card: "bg-lightinfo/85",
    text: "text-infoemphasis",
  },
  error: {
    card: "bg-lighterror/85",
    text: "text-erroremphasis",
  },
};

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  tone?: MetricTone;
  className?: string;
  valueClassName?: string;
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  className,
  valueClassName,
}: MetricCardProps) {
  const styles = toneStyles[tone];

  return (
    <div
      className={cn(
        "flex min-h-[8.75rem] flex-col items-center justify-center gap-3 rounded-lg px-5 py-6 text-center transition-transform duration-200 hover:scale-[1.02]",
        styles.card,
        className,
      )}
    >
      {Icon ? <Icon className={cn("h-10 w-10", styles.text)} /> : null}
      <p className={cn("text-base font-medium", styles.text)}>{label}</p>
      <p
        className={cn(
          "text-[2.05rem] leading-none font-semibold tracking-tight",
          styles.text,
          valueClassName,
        )}
      >
        {value}
      </p>
    </div>
  );
}
