"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import SimpleBar from "simplebar-react";
import { Icon } from "@iconify/react";
import { AMLogo, AMMenu, AMMenuItem, AMSidebar } from "tailwind-sidebar";

import { cn } from "@/lib/utils";
import { FullLogo } from "@/components/layout/full-logo";
import {
  getSidebarItems,
  type SidebarItem,
} from "@/components/layout/sidebar-items";

function renderSidebarItems(
  items: SidebarItem[],
  currentPath: string,
  onNavigate?: () => void,
) {
  return items.map((item) => {
    const isSelected =
      item.url === "/dashboard"
        ? currentPath === item.url
        : item.url
          ? currentPath.startsWith(item.url)
          : false;

    if (item.heading) {
      return (
        <div className="mb-1" key={item.id}>
          <AMMenu
            ClassName="hide-menu leading-21 text-sidebar-foreground font-bold uppercase text-xs"
            subHeading={item.heading}
          />
        </div>
      );
    }

    if (item.children?.length) {
      return (
        <div key={item.id}>
          {item.children.map((child) => {
            const selected =
              child.url === "/dashboard"
                ? currentPath === child.url
                : child.url
                  ? currentPath.startsWith(child.url)
                  : false;

            return (
              <div key={child.id} onClick={onNavigate}>
                <AMMenuItem
                  className="text-sidebar-foreground dark:text-sidebar-foreground mt-0.5"
                  component={Link}
                  icon={
                    <Icon
                      height={21}
                      icon={child.icon ?? "solar:widget-2-linear"}
                      width={21}
                    />
                  }
                  isSelected={selected}
                  link={child.url}
                >
                  <span className="flex-1 truncate">
                    {child.title || child.name}
                  </span>
                </AMMenuItem>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div key={item.id} onClick={onNavigate}>
        <AMMenuItem
          className={cn(
            "text-sidebar-foreground dark:text-sidebar-foreground mt-0.5",
          )}
          component={Link}
          icon={
            <Icon
              height={21}
              icon={item.icon ?? "solar:widget-2-linear"}
              width={21}
            />
          }
          isSelected={isSelected}
          link={item.url}
        >
          <span className="flex-1 truncate">{item.title || item.name}</span>
        </AMMenuItem>
      </div>
    );
  });
}

function SidebarContent({
  isPlatformAdmin,
  onNavigate,
}: {
  isPlatformAdmin: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const sidebarMode = theme === "light" || theme === "dark" ? theme : undefined;
  const sections = getSidebarItems(isPlatformAdmin);

  return (
    <AMSidebar
      animation
      collapsible="none"
      className="border-border bg-sidebar dark:bg-sidebar fixed top-0 left-0 z-10 h-screen border"
      mode={sidebarMode}
      showProfile={false}
      showTrigger={false}
      width="270px"
    >
      <div className="brand-logo flex items-center overflow-hidden px-6">
        <AMLogo component={Link} href="/dashboard" img="">
          <FullLogo />
        </AMLogo>
      </div>
      <SimpleBar className="h-[calc(100vh-88px)]">
        <div className="px-6">
          {sections.map((section) => (
            <div key={section.id}>
              {renderSidebarItems(
                [
                  ...(section.heading
                    ? [
                        {
                          heading: section.heading,
                          id: `${section.id}-heading`,
                        },
                      ]
                    : []),
                  ...(section.children ?? []),
                ],
                pathname,
                onNavigate,
              )}
            </div>
          ))}
        </div>
      </SimpleBar>
    </AMSidebar>
  );
}

export function Sidebar({ isPlatformAdmin }: { isPlatformAdmin: boolean }) {
  return (
    <aside className="hidden xl:block">
      <SidebarContent isPlatformAdmin={isPlatformAdmin} />
    </aside>
  );
}

export function MobileSidebarContent({
  isPlatformAdmin,
  onNavigate,
}: {
  isPlatformAdmin: boolean;
  onNavigate?: () => void;
}) {
  return (
    <SidebarContent isPlatformAdmin={isPlatformAdmin} onNavigate={onNavigate} />
  );
}
