alter table public.whatsapp_message_templates
  add column status_updated_by uuid,
  add column status_updated_at timestamptz,
  add column approved_by uuid,
  add column approved_at timestamptz;

update public.whatsapp_message_templates
set
  status_updated_at = coalesce(updated_at, created_at),
  approved_at = case when status = 'approved' then coalesce(updated_at, created_at) else null end;
