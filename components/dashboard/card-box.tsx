import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardBoxProps {
  children: ReactNode;
  className?: string;
}

export function CardBox({ children, className }: CardBoxProps) {
  return <Card className={cn("border-border", className)}>{children}</Card>;
}
