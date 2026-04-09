import { CardBox } from "@/components/dashboard/card-box";
import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { DashboardTopCards } from "@/components/dashboard/top-cards";
import { Badge } from "@/components/ui/badge";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { listChannels } from "@/server/queries/channels";
import { formatDateTime } from "@/lib/utils";

export default async function ChannelsPage() {
  const { activeTenant } = await getActiveTenantContext();
  const channels = await listChannels(activeTenant.id);
  const connectedCount = channels.filter(
    (channel) => channel.status === "connected",
  ).length;

  return (
    <div className="space-y-6">
      <ProfileWelcome title="Canales" />
      <DashboardTopCards
        items={[
          {
            key: "total",
            label: "Canales",
            value: channels.length,
            tone: "primary",
          },
          {
            key: "connected",
            label: "Conectados",
            value: connectedCount,
            tone: "success",
          },
          {
            key: "pending",
            label: "Pendientes",
            value: channels.length - connectedCount,
            tone: "warning",
          },
        ]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {channels.map((channel) => {
          const whatsappAccount = Array.isArray(
            channel.channel_whatsapp_accounts,
          )
            ? channel.channel_whatsapp_accounts[0]
            : channel.channel_whatsapp_accounts;

          return (
            <CardBox key={channel.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{channel.display_name}</CardTitle>
                    <CardDescription className="mt-1">
                      {channel.provider} · {channel.type}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      channel.status === "connected"
                        ? "lightSuccess"
                        : "outline"
                    }
                  >
                    {channel.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  <span className="text-muted-foreground">Conectado:</span>{" "}
                  {formatDateTime(channel.connected_at)}
                </p>
                {whatsappAccount ? (
                  <div className="border-border bg-muted rounded-xl border p-4">
                    <p className="font-medium">
                      {whatsappAccount.verified_name ?? "WhatsApp conectado"}
                    </p>
                    <p className="text-muted-foreground mt-1">
                      {whatsappAccount.display_phone_number ??
                        "Sin número visible"}
                    </p>
                    <p className="text-muted-foreground mt-2 text-xs tracking-[0.18em] uppercase">
                      Webhook {whatsappAccount.webhook_status}
                    </p>
                  </div>
                ) : null}
              </CardContent>
            </CardBox>
          );
        })}
      </div>
    </div>
  );
}
