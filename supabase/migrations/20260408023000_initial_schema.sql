create extension if not exists pgcrypto;

create type public.tenant_status as enum ('trial', 'active', 'suspended', 'archived');
create type public.app_platform_role as enum ('platform_admin');
create type public.membership_status as enum ('invited', 'active', 'suspended', 'removed');
create type public.app_tenant_role as enum (
  'tenant_owner',
  'tenant_admin',
  'advisor',
  'operator',
  'viewer'
);
create type public.channel_type as enum (
  'whatsapp',
  'email',
  'webchat',
  'instagram',
  'facebook_leads'
);
create type public.channel_provider as enum (
  'meta_whatsapp_cloud',
  'resend',
  'smtp',
  'custom_webchat',
  'meta_instagram',
  'meta_facebook'
);
create type public.channel_status as enum (
  'disconnected',
  'pending',
  'connected',
  'error',
  'disabled'
);
create type public.property_operation_type as enum ('sale', 'rent');
create type public.property_type as enum (
  'apartment',
  'house',
  'land',
  'office',
  'commercial',
  'warehouse',
  'duplex',
  'condo',
  'other'
);
create type public.property_status as enum (
  'draft',
  'available',
  'reserved',
  'rented',
  'sold',
  'inactive'
);
create type public.lead_interest_type as enum ('sale', 'rent');
create type public.lead_qualification_status as enum (
  'new',
  'contacted',
  'qualified',
  'unqualified',
  'nurturing',
  'won',
  'lost'
);
create type public.lead_interest_level as enum ('low', 'medium', 'high');
create type public.conversation_status as enum (
  'open',
  'pending_human',
  'automated',
  'closed'
);
create type public.sender_type as enum ('lead', 'advisor', 'agent', 'system');
create type public.message_direction as enum ('inbound', 'outbound');
create type public.message_content_type as enum (
  'text',
  'image',
  'audio',
  'video',
  'document',
  'template',
  'system'
);
create type public.message_status as enum (
  'pending',
  'sent',
  'delivered',
  'read',
  'failed',
  'received'
);
create type public.automation_rule_status as enum ('draft', 'active', 'paused', 'archived');
create type public.faq_status as enum ('active', 'inactive');
create type public.appointment_status as enum (
  'scheduled',
  'confirmed',
  'completed',
  'canceled',
  'no_show'
);
create type public.pipeline_category as enum (
  'inbox',
  'qualified',
  'visit',
  'negotiation',
  'won',
  'lost'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, full_name, email, phone, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    email = excluded.email,
    phone = coalesce(excluded.phone, public.user_profiles.phone),
    avatar_url = coalesce(excluded.avatar_url, public.user_profiles.avatar_url),
    updated_at = timezone('utc', now());

  return new;
end;
$$;

create table public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.platform_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  role public.app_platform_role not null,
  status public.membership_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status public.tenant_status not null default 'trial',
  primary_currency text not null default 'PYG',
  timezone text not null default 'America/Asuncion',
  locale text not null default 'es-PY',
  settings jsonb not null default '{}'::jsonb,
  branding jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.tenant_users (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_tenant_role not null,
  status public.membership_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, user_id)
);

create table public.channels (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  type public.channel_type not null,
  provider public.channel_provider not null,
  external_account_id text,
  display_name text not null,
  status public.channel_status not null default 'pending',
  credentials_ref text,
  metadata jsonb not null default '{}'::jsonb,
  connected_at timestamptz,
  last_synced_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.channel_whatsapp_accounts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  channel_id uuid not null unique references public.channels (id) on delete cascade,
  meta_business_account_id text,
  whatsapp_business_account_id text,
  phone_number_id text unique,
  display_phone_number text,
  verified_name text,
  status public.channel_status not null default 'pending',
  webhook_status text not null default 'pending',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  external_ref text,
  title text not null,
  description text,
  operation_type public.property_operation_type not null,
  property_type public.property_type not null,
  price numeric(14,2),
  currency text not null default 'PYG',
  expenses_amount numeric(14,2),
  location_text text,
  country text not null default 'Paraguay',
  state text,
  city text,
  neighborhood text,
  address text,
  bedrooms integer,
  bathrooms integer,
  garages integer,
  area_m2 numeric(10,2),
  lot_area_m2 numeric(10,2),
  pets_allowed boolean not null default false,
  furnished boolean not null default false,
  has_pool boolean not null default false,
  has_garden boolean not null default false,
  has_balcony boolean not null default false,
  status public.property_status not null default 'draft',
  advisor_id uuid references public.user_profiles (id) on delete set null,
  source text,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.property_media (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  property_id uuid not null references public.properties (id) on delete cascade,
  file_path text not null,
  file_type text not null,
  position integer not null default 0,
  alt_text text,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.property_features (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  property_id uuid not null references public.properties (id) on delete cascade,
  feature_key text not null,
  feature_value text,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  name text not null,
  position integer not null,
  category public.pipeline_category not null default 'inbox',
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, position)
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  source text,
  source_details jsonb not null default '{}'::jsonb,
  interest_type public.lead_interest_type,
  budget_min numeric(14,2),
  budget_max numeric(14,2),
  desired_city text,
  desired_neighborhood text,
  bedrooms_needed integer,
  move_in_date date,
  financing_needed boolean,
  pets boolean,
  notes text,
  qualification_status public.lead_qualification_status not null default 'new',
  score integer check (score is null or score between 0 and 100),
  assigned_to uuid references public.user_profiles (id) on delete set null,
  pipeline_stage_id uuid references public.pipeline_stages (id) on delete set null,
  is_human_handoff_required boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.lead_property_interests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  property_id uuid not null references public.properties (id) on delete cascade,
  interest_level public.lead_interest_level not null default 'medium',
  created_at timestamptz not null default timezone('utc', now()),
  unique (lead_id, property_id)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  channel_id uuid not null references public.channels (id) on delete cascade,
  lead_id uuid references public.leads (id) on delete set null,
  property_id uuid references public.properties (id) on delete set null,
  assigned_to uuid references public.user_profiles (id) on delete set null,
  status public.conversation_status not null default 'open',
  contact_identifier text,
  contact_display_name text,
  handoff_reason text,
  last_message_at timestamptz,
  closed_at timestamptz,
  ai_enabled boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_type public.sender_type not null,
  direction public.message_direction not null,
  external_message_id text,
  content text,
  content_type public.message_content_type not null default 'text',
  message_status public.message_status not null default 'pending',
  error_message text,
  raw_payload jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  delivered_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.channel_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants (id) on delete cascade,
  channel_id uuid references public.channels (id) on delete cascade,
  provider public.channel_provider,
  event_type text not null,
  direction public.message_direction,
  external_event_id text,
  payload jsonb not null default '{}'::jsonb,
  processing_status text not null default 'received',
  error_message text,
  processed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.automation_rules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  name text not null,
  type text not null,
  trigger_event text not null,
  conditions jsonb not null default '{}'::jsonb,
  actions jsonb not null default '{}'::jsonb,
  status public.automation_rule_status not null default 'draft',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  question text not null,
  answer text not null,
  category text,
  status public.faq_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  property_id uuid references public.properties (id) on delete set null,
  advisor_id uuid references public.user_profiles (id) on delete set null,
  scheduled_at timestamptz not null,
  status public.appointment_status not null default 'scheduled',
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.lead_stage_history (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  stage_id uuid not null references public.pipeline_stages (id) on delete cascade,
  changed_by uuid references public.user_profiles (id) on delete set null,
  changed_at timestamptz not null default timezone('utc', now()),
  notes text
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants (id) on delete cascade,
  actor_user_id uuid references auth.users (id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index properties_tenant_external_ref_uniq
  on public.properties (tenant_id, external_ref)
  where external_ref is not null;

create unique index messages_tenant_external_message_id_uniq
  on public.messages (tenant_id, external_message_id)
  where external_message_id is not null;

create unique index channel_events_channel_external_event_id_uniq
  on public.channel_events (channel_id, external_event_id)
  where channel_id is not null and external_event_id is not null;

create index tenant_users_user_id_idx on public.tenant_users (user_id);
create index tenant_users_tenant_id_idx on public.tenant_users (tenant_id);
create index platform_users_user_id_idx on public.platform_users (user_id);
create index channels_tenant_id_idx on public.channels (tenant_id);
create index channel_whatsapp_accounts_tenant_id_idx on public.channel_whatsapp_accounts (tenant_id);
create index properties_tenant_id_idx on public.properties (tenant_id);
create index properties_status_idx on public.properties (tenant_id, status);
create index property_media_property_id_idx on public.property_media (property_id);
create index property_features_property_id_idx on public.property_features (property_id);
create index pipeline_stages_tenant_id_idx on public.pipeline_stages (tenant_id);
create index leads_tenant_id_idx on public.leads (tenant_id);
create index leads_assigned_to_idx on public.leads (assigned_to);
create index leads_stage_idx on public.leads (pipeline_stage_id);
create index lead_property_interests_lead_id_idx on public.lead_property_interests (lead_id);
create index conversations_tenant_id_idx on public.conversations (tenant_id);
create index conversations_status_idx on public.conversations (tenant_id, status);
create index conversations_lead_id_idx on public.conversations (lead_id);
create index messages_conversation_id_idx on public.messages (conversation_id);
create index messages_tenant_id_idx on public.messages (tenant_id);
create index automation_rules_tenant_id_idx on public.automation_rules (tenant_id);
create index faqs_tenant_id_idx on public.faqs (tenant_id);
create index appointments_tenant_id_idx on public.appointments (tenant_id);
create index lead_stage_history_tenant_id_idx on public.lead_stage_history (tenant_id);
create index audit_logs_tenant_id_idx on public.audit_logs (tenant_id);
create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id);

create trigger set_user_profiles_updated_at
before update on public.user_profiles
for each row
execute function public.set_updated_at();

create trigger set_platform_users_updated_at
before update on public.platform_users
for each row
execute function public.set_updated_at();

create trigger set_tenants_updated_at
before update on public.tenants
for each row
execute function public.set_updated_at();

create trigger set_tenant_users_updated_at
before update on public.tenant_users
for each row
execute function public.set_updated_at();

create trigger set_channels_updated_at
before update on public.channels
for each row
execute function public.set_updated_at();

create trigger set_channel_whatsapp_accounts_updated_at
before update on public.channel_whatsapp_accounts
for each row
execute function public.set_updated_at();

create trigger set_properties_updated_at
before update on public.properties
for each row
execute function public.set_updated_at();

create trigger set_pipeline_stages_updated_at
before update on public.pipeline_stages
for each row
execute function public.set_updated_at();

create trigger set_leads_updated_at
before update on public.leads
for each row
execute function public.set_updated_at();

create trigger set_conversations_updated_at
before update on public.conversations
for each row
execute function public.set_updated_at();

create trigger set_automation_rules_updated_at
before update on public.automation_rules
for each row
execute function public.set_updated_at();

create trigger set_faqs_updated_at
before update on public.faqs
for each row
execute function public.set_updated_at();

create trigger set_appointments_updated_at
before update on public.appointments
for each row
execute function public.set_updated_at();

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.platform_users pu
    where pu.user_id = auth.uid()
      and pu.role = 'platform_admin'
      and pu.status = 'active'
  );
$$;

create or replace function public.is_tenant_member(target_tenant uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_platform_admin()
    or exists (
      select 1
      from public.tenant_users tu
      where tu.tenant_id = target_tenant
        and tu.user_id = auth.uid()
        and tu.status = 'active'
    );
$$;

create or replace function public.has_tenant_role(
  target_tenant uuid,
  allowed_roles public.app_tenant_role[]
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_platform_admin()
    or exists (
      select 1
      from public.tenant_users tu
      where tu.tenant_id = target_tenant
        and tu.user_id = auth.uid()
        and tu.status = 'active'
        and tu.role = any (allowed_roles)
    );
$$;

create or replace function public.shares_tenant_with_user(target_user uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_platform_admin()
    or target_user = auth.uid()
    or exists (
      select 1
      from public.tenant_users me
      join public.tenant_users other
        on me.tenant_id = other.tenant_id
      where me.user_id = auth.uid()
        and me.status = 'active'
        and other.user_id = target_user
        and other.status = 'active'
    );
$$;

alter table public.user_profiles enable row level security;
alter table public.platform_users enable row level security;
alter table public.tenants enable row level security;
alter table public.tenant_users enable row level security;
alter table public.channels enable row level security;
alter table public.channel_whatsapp_accounts enable row level security;
alter table public.properties enable row level security;
alter table public.property_media enable row level security;
alter table public.property_features enable row level security;
alter table public.pipeline_stages enable row level security;
alter table public.leads enable row level security;
alter table public.lead_property_interests enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.channel_events enable row level security;
alter table public.automation_rules enable row level security;
alter table public.faqs enable row level security;
alter table public.appointments enable row level security;
alter table public.lead_stage_history enable row level security;
alter table public.audit_logs enable row level security;

alter table public.user_profiles force row level security;
alter table public.platform_users force row level security;
alter table public.tenants force row level security;
alter table public.tenant_users force row level security;
alter table public.channels force row level security;
alter table public.channel_whatsapp_accounts force row level security;
alter table public.properties force row level security;
alter table public.property_media force row level security;
alter table public.property_features force row level security;
alter table public.pipeline_stages force row level security;
alter table public.leads force row level security;
alter table public.lead_property_interests force row level security;
alter table public.conversations force row level security;
alter table public.messages force row level security;
alter table public.channel_events force row level security;
alter table public.automation_rules force row level security;
alter table public.faqs force row level security;
alter table public.appointments force row level security;
alter table public.lead_stage_history force row level security;
alter table public.audit_logs force row level security;

create policy "user_profiles_select_same_tenant"
on public.user_profiles
for select
using (public.shares_tenant_with_user(id));

create policy "user_profiles_insert_self"
on public.user_profiles
for insert
with check (id = auth.uid() or public.is_platform_admin());

create policy "user_profiles_update_self"
on public.user_profiles
for update
using (id = auth.uid() or public.is_platform_admin())
with check (id = auth.uid() or public.is_platform_admin());

create policy "platform_users_admin_only"
on public.platform_users
for all
using (public.is_platform_admin())
with check (public.is_platform_admin());

create policy "tenants_select_member"
on public.tenants
for select
using (public.is_tenant_member(id));

create policy "tenants_insert_platform_admin"
on public.tenants
for insert
with check (public.is_platform_admin());

create policy "tenants_update_admin"
on public.tenants
for update
using (
  public.has_tenant_role(id, array['tenant_owner', 'tenant_admin']::public.app_tenant_role[])
)
with check (
  public.has_tenant_role(id, array['tenant_owner', 'tenant_admin']::public.app_tenant_role[])
);

create policy "tenant_users_select_member"
on public.tenant_users
for select
using (public.is_tenant_member(tenant_id));

create policy "tenant_users_manage_admin"
on public.tenant_users
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

create policy "channels_select_member"
on public.channels
for select
using (public.is_tenant_member(tenant_id));

create policy "channels_manage_admin"
on public.channels
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

create policy "channel_whatsapp_select_member"
on public.channel_whatsapp_accounts
for select
using (public.is_tenant_member(tenant_id));

create policy "channel_whatsapp_manage_admin"
on public.channel_whatsapp_accounts
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

create policy "properties_select_member"
on public.properties
for select
using (public.is_tenant_member(tenant_id));

create policy "properties_insert_operator"
on public.properties
for insert
with check (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator', 'advisor']::public.app_tenant_role[]
  )
);

create policy "properties_update_operator"
on public.properties
for update
using (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator', 'advisor']::public.app_tenant_role[]
  )
)
with check (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator', 'advisor']::public.app_tenant_role[]
  )
);

create policy "properties_delete_admin"
on public.properties
for delete
using (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin']::public.app_tenant_role[]
  )
);

create policy "property_media_select_member"
on public.property_media
for select
using (public.is_tenant_member(tenant_id));

create policy "property_media_manage_operator"
on public.property_media
for all
using (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator', 'advisor']::public.app_tenant_role[]
  )
)
with check (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator', 'advisor']::public.app_tenant_role[]
  )
);

create policy "property_features_select_member"
on public.property_features
for select
using (public.is_tenant_member(tenant_id));

create policy "property_features_manage_operator"
on public.property_features
for all
using (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator', 'advisor']::public.app_tenant_role[]
  )
)
with check (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator', 'advisor']::public.app_tenant_role[]
  )
);

create policy "pipeline_stages_select_member"
on public.pipeline_stages
for select
using (public.is_tenant_member(tenant_id));

create policy "pipeline_stages_manage_admin"
on public.pipeline_stages
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

create policy "leads_select_member"
on public.leads
for select
using (public.is_tenant_member(tenant_id));

create policy "leads_insert_operator"
on public.leads
for insert
with check (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator', 'advisor']::public.app_tenant_role[]
  )
);

create policy "leads_update_operator"
on public.leads
for update
using (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator', 'advisor']::public.app_tenant_role[]
  )
)
with check (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator', 'advisor']::public.app_tenant_role[]
  )
);

create policy "leads_delete_admin"
on public.leads
for delete
using (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin']::public.app_tenant_role[]
  )
);

create policy "lead_property_interests_select_member"
on public.lead_property_interests
for select
using (public.is_tenant_member(tenant_id));

create policy "lead_property_interests_manage_operator"
on public.lead_property_interests
for all
using (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator', 'advisor']::public.app_tenant_role[]
  )
)
with check (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator', 'advisor']::public.app_tenant_role[]
  )
);

create policy "conversations_select_member"
on public.conversations
for select
using (public.is_tenant_member(tenant_id));

create policy "conversations_manage_operator"
on public.conversations
for all
using (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator', 'advisor']::public.app_tenant_role[]
  )
)
with check (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator', 'advisor']::public.app_tenant_role[]
  )
);

create policy "messages_select_member"
on public.messages
for select
using (public.is_tenant_member(tenant_id));

create policy "messages_manage_operator"
on public.messages
for all
using (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator', 'advisor']::public.app_tenant_role[]
  )
)
with check (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator', 'advisor']::public.app_tenant_role[]
  )
);

create policy "channel_events_select_admin"
on public.channel_events
for select
using (
  tenant_id is null
  and public.is_platform_admin()
  or public.is_tenant_member(tenant_id)
);

create policy "channel_events_manage_admin"
on public.channel_events
for all
using (
  tenant_id is null
  and public.is_platform_admin()
  or public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin']::public.app_tenant_role[]
  )
)
with check (
  tenant_id is null
  and public.is_platform_admin()
  or public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin']::public.app_tenant_role[]
  )
);

create policy "automation_rules_select_member"
on public.automation_rules
for select
using (public.is_tenant_member(tenant_id));

create policy "automation_rules_manage_admin"
on public.automation_rules
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

create policy "faqs_select_member"
on public.faqs
for select
using (public.is_tenant_member(tenant_id));

create policy "faqs_manage_operator"
on public.faqs
for all
using (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator']::public.app_tenant_role[]
  )
)
with check (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator']::public.app_tenant_role[]
  )
);

create policy "appointments_select_member"
on public.appointments
for select
using (public.is_tenant_member(tenant_id));

create policy "appointments_manage_operator"
on public.appointments
for all
using (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator', 'advisor']::public.app_tenant_role[]
  )
)
with check (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator', 'advisor']::public.app_tenant_role[]
  )
);

create policy "lead_stage_history_select_member"
on public.lead_stage_history
for select
using (public.is_tenant_member(tenant_id));

create policy "lead_stage_history_manage_operator"
on public.lead_stage_history
for all
using (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator', 'advisor']::public.app_tenant_role[]
  )
)
with check (
  public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator', 'advisor']::public.app_tenant_role[]
  )
);

create policy "audit_logs_select_admin"
on public.audit_logs
for select
using (
  tenant_id is null
  and public.is_platform_admin()
  or public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin']::public.app_tenant_role[]
  )
);

create policy "audit_logs_insert_system"
on public.audit_logs
for insert
with check (
  tenant_id is null
  and public.is_platform_admin()
  or public.has_tenant_role(
    tenant_id,
    array['tenant_owner', 'tenant_admin', 'operator', 'advisor']::public.app_tenant_role[]
  )
);
