export interface SidebarItem {
  heading?: string;
  id: string;
  name?: string;
  title?: string;
  icon?: string;
  url?: string;
  children?: SidebarItem[];
}

export function getSidebarItems(isPlatformAdmin: boolean): SidebarItem[] {
  const items: SidebarItem[] = [
    {
      id: "core-heading",
      children: [
        {
          id: "dashboard",
          name: "Resumen",
          icon: "solar:widget-2-linear",
          url: "/dashboard",
        },
        {
          id: "properties",
          name: "Propiedades",
          icon: "solar:buildings-2-linear",
          url: "/dashboard/properties",
        },
        {
          id: "leads",
          name: "Leads",
          icon: "solar:users-group-rounded-linear",
          url: "/dashboard/leads",
        },
        {
          id: "conversations",
          name: "Conversaciones",
          icon: "solar:chat-round-line-linear",
          url: "/dashboard/conversations",
        },
        {
          id: "appointments",
          name: "Agenda",
          icon: "solar:calendar-mark-linear",
          url: "/dashboard/appointments",
        },
        {
          id: "faqs",
          name: "FAQs",
          icon: "solar:question-circle-linear",
          url: "/dashboard/faqs",
        },
        {
          id: "channels",
          name: "Canales",
          icon: "solar:plug-circle-linear",
          url: "/dashboard/channels",
        },
        {
          id: "settings",
          name: "Configuración",
          icon: "solar:settings-linear",
          url: "/dashboard/settings",
        },
      ],
    },
  ];

  if (isPlatformAdmin) {
    items.push({
      heading: "Platform",
      id: "platform-heading",
      children: [
        {
          id: "platform-tenants",
          name: "Tenants",
          icon: "solar:shield-user-linear",
          url: "/dashboard/platform/tenants",
        },
      ],
    });
  }

  return items;
}
