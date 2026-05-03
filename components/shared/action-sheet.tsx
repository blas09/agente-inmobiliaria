"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ActionSheetProps {
  triggerLabel: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function ActionSheet({
  triggerLabel,
  title,
  description,
  children,
}: ActionSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-full justify-start" variant="outline">
          {triggerLabel}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col overflow-y-auto p-6 sm:max-w-xl lg:max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <SheetHeader className="space-y-2">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          <SheetClose asChild>
            <Button aria-label="Cerrar panel" size="icon" variant="ghost">
              <X aria-hidden="true" />
            </Button>
          </SheetClose>
        </div>
        <div className="mt-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
