create table public.whatsapp_message_templates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  language text not null default 'en_US',
  category text,
  status text not null default 'approved',
  components jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index whatsapp_message_templates_tenant_name_language_idx
  on public.whatsapp_message_templates (tenant_id, name, language);
create index whatsapp_message_templates_tenant_id_idx
  on public.whatsapp_message_templates (tenant_id);

create trigger set_whatsapp_message_templates_updated_at
before update on public.whatsapp_message_templates
for each row execute function public.set_updated_at();

alter table public.whatsapp_message_templates enable row level security;
alter table public.whatsapp_message_templates force row level security;

create policy "whatsapp_message_templates_select_member"
on public.whatsapp_message_templates
for select
using (public.is_tenant_member(tenant_id));

create policy "whatsapp_message_templates_manage_admin"
on public.whatsapp_message_templates
for all
using (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin']::public.app_tenant_role[]
  )
)
with check (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin']::public.app_tenant_role[]
  )
);
