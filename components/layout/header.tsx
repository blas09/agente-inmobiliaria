"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react";

import { signOutAction } from "@/features/auth/actions";

import { FullLogo } from "@/components/layout/full-logo";
import { MobileSidebarContent } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  isPlatformAdmin: boolean;
}

export function AppHeader({ isPlatformAdmin }: AppHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMode = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  return (
    <>
      <header className="bg-background sticky top-0 z-20">
        <nav
          className={cn(
            "bg-background flex items-center justify-between px-6 py-4 transition-colors sm:ps-6 sm:pe-10",
            isScrolled ? "border-border border-b" : "",
          )}
        >
          <div
            className="text-foreground hover:text-primary dark:text-muted-foreground dark:hover:text-primary relative flex cursor-pointer items-center justify-center rounded-full px-[15px] xl:hidden"
            onClick={() => setIsOpen(true)}
          >
            <Icon height={20} icon="tabler:menu-2" width={20} />
          </div>
          <div className="block xl:hidden">
            <Link href="/dashboard">
              <FullLogo />
            </Link>
          </div>
          <div className="hidden flex-1 xl:flex xl:items-center xl:justify-between">
            <div className="relative w-full max-w-xs">
              <Icon
                icon="solar:magnifer-linear"
                width={18}
                height={18}
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
              />
              <Input
                readOnly
                aria-label="Buscar"
                placeholder="Buscar..."
                className="h-11 rounded-xl bg-transparent pl-10"
              />
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="group text-foreground hover:text-primary dark:text-muted-foreground dark:hover:text-primary flex cursor-pointer items-center justify-center rounded-full px-[15px]"
                onClick={toggleMode}
              >
                <span className="group-hover:after:bg-lightprimary relative flex items-center justify-center after:absolute after:-top-1/2 after:h-10 after:w-10 after:rounded-full">
                  {resolvedTheme === "light" ? (
                    <Icon
                      className="text-foreground group-hover:text-primary dark:text-muted-foreground dark:group-hover:text-primary"
                      icon="tabler:moon"
                      width="20"
                    />
                  ) : (
                    <Icon
                      className="text-foreground group-hover:text-primary dark:text-muted-foreground dark:group-hover:text-primary"
                      icon="solar:sun-bold-duotone"
                      width="20"
                    />
                  )}
                </span>
              </button>
              <form action={signOutAction}>
                <Button type="submit" variant="outline">
                  <Icon className="h-4 w-4" icon="solar:logout-3-linear" />
                  Salir
                </Button>
              </form>
            </div>
          </div>
          <div className="flex items-center gap-1 xl:hidden">
            <button
              type="button"
              className="group text-foreground hover:text-primary dark:text-muted-foreground dark:hover:text-primary flex cursor-pointer items-center justify-center rounded-full px-[15px]"
              onClick={toggleMode}
            >
              <span className="group-hover:after:bg-lightprimary relative flex items-center justify-center after:absolute after:-top-1/2 after:h-10 after:w-10 after:rounded-full">
                {resolvedTheme === "light" ? (
                  <Icon
                    className="text-foreground group-hover:text-primary dark:text-muted-foreground dark:group-hover:text-primary"
                    icon="tabler:moon"
                    width="20"
                  />
                ) : (
                  <Icon
                    className="text-foreground group-hover:text-primary dark:text-muted-foreground dark:group-hover:text-primary"
                    icon="solar:sun-bold-duotone"
                    width="20"
                  />
                )}
              </span>
            </button>
            <form action={signOutAction}>
              <Button type="submit" variant="outline">
                <Icon className="h-4 w-4" icon="solar:logout-3-linear" />
                Salir
              </Button>
            </form>
          </div>
        </nav>
      </header>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <MobileSidebarContent
            isPlatformAdmin={isPlatformAdmin}
            onNavigate={() => setIsOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
