-- Development credentials
-- owner@demo.py / Password123!
-- tenantadmin@demo.py / Password123!
-- advisor@demo.py / Password123!
-- operator@demo.py / Password123!
-- viewer@demo.py / Password123!
-- admin@platform.local / Password123!

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  is_anonymous
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'owner@demo.py',
    crypt('Password123!', gen_salt('bf')),
    timezone('utc', now()),
    null,
    '',
    null,
    '',
    null,
    '',
    '',
    null,
    timezone('utc', now()),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Sofia Benitez","phone":"+595981000001"}'::jsonb,
    false,
    timezone('utc', now()),
    timezone('utc', now()),
    '+595981000001',
    null,
    '',
    '',
    null,
    '',
    0,
    null,
    '',
    null,
    false,
    false
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'advisor@demo.py',
    crypt('Password123!', gen_salt('bf')),
    timezone('utc', now()),
    null,
    '',
    null,
    '',
    null,
    '',
    '',
    null,
    timezone('utc', now()),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Martin Acosta","phone":"+595981000002"}'::jsonb,
    false,
    timezone('utc', now()),
    timezone('utc', now()),
    '+595981000002',
    null,
    '',
    '',
    null,
    '',
    0,
    null,
    '',
    null,
    false,
    false
  ),
  (
    '44444444-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'tenantadmin@demo.py',
    crypt('Password123!', gen_salt('bf')),
    timezone('utc', now()),
    null,
    '',
    null,
    '',
    null,
    '',
    '',
    null,
    timezone('utc', now()),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Carla Duarte","phone":"+595981000003"}'::jsonb,
    false,
    timezone('utc', now()),
    timezone('utc', now()),
    '+595981000003',
    null,
    '',
    '',
    null,
    '',
    0,
    null,
    '',
    null,
    false,
    false
  ),
  (
    '55555555-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'operator@demo.py',
    crypt('Password123!', gen_salt('bf')),
    timezone('utc', now()),
    null,
    '',
    null,
    '',
    null,
    '',
    '',
    null,
    timezone('utc', now()),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Lucia Ferreira","phone":"+595981000004"}'::jsonb,
    false,
    timezone('utc', now()),
    timezone('utc', now()),
    '+595981000004',
    null,
    '',
    '',
    null,
    '',
    0,
    null,
    '',
    null,
    false,
    false
  ),
  (
    '66666666-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'viewer@demo.py',
    crypt('Password123!', gen_salt('bf')),
    timezone('utc', now()),
    null,
    '',
    null,
    '',
    null,
    '',
    '',
    null,
    timezone('utc', now()),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Diego Mendez","phone":"+595981000005"}'::jsonb,
    false,
    timezone('utc', now()),
    timezone('utc', now()),
    '+595981000005',
    null,
    '',
    '',
    null,
    '',
    0,
    null,
    '',
    null,
    false,
    false
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@platform.local',
    crypt('Password123!', gen_salt('bf')),
    timezone('utc', now()),
    null,
    '',
    null,
    '',
    null,
    '',
    '',
    null,
    timezone('utc', now()),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Platform Admin"}'::jsonb,
    false,
    timezone('utc', now()),
    timezone('utc', now()),
    null,
    null,
    '',
    '',
    null,
    '',
    0,
    null,
    '',
    null,
    false,
    false
  )
on conflict (id) do nothing;

insert into public.platform_users (user_id, role, status)
values ('33333333-3333-3333-3333-333333333333', 'platform_admin', 'active')
on conflict (user_id) do nothing;

insert into public.tenants (
  id,
  name,
  slug,
  status,
  primary_currency,
  timezone,
  locale,
  settings,
  branding
)
values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Inmobiliaria Demo Paraguay',
  'demo-paraguay',
  'active',
  'PYG',
  'America/Asuncion',
  'es-PY',
  '{"lead_sources":["whatsapp","facebook","email"],"default_country":"Paraguay"}'::jsonb,
  '{"primaryColor":"#0f766e","logoText":"Demo PY"}'::jsonb
)
on conflict (id) do nothing;

insert into auth.identities (
  id,
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values
  (
    '44444444-4444-4444-4444-444444444441',
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    '{"sub":"11111111-1111-1111-1111-111111111111","email":"owner@demo.py","email_verified":true}'::jsonb,
    'email',
    timezone('utc', now()),
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '44444444-4444-4444-4444-444444444442',
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    '{"sub":"22222222-2222-2222-2222-222222222222","email":"advisor@demo.py","email_verified":true}'::jsonb,
    'email',
    timezone('utc', now()),
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '44444444-1111-1111-1111-111111111111',
    '44444444-1111-1111-1111-111111111111',
    '{"sub":"44444444-1111-1111-1111-111111111111","email":"tenantadmin@demo.py","email_verified":true}'::jsonb,
    'email',
    timezone('utc', now()),
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '44444444-4444-4444-4444-444444444445',
    '55555555-1111-1111-1111-111111111111',
    '55555555-1111-1111-1111-111111111111',
    '{"sub":"55555555-1111-1111-1111-111111111111","email":"operator@demo.py","email_verified":true}'::jsonb,
    'email',
    timezone('utc', now()),
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '44444444-4444-4444-4444-444444444446',
    '66666666-1111-1111-1111-111111111111',
    '66666666-1111-1111-1111-111111111111',
    '{"sub":"66666666-1111-1111-1111-111111111111","email":"viewer@demo.py","email_verified":true}'::jsonb,
    'email',
    timezone('utc', now()),
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '44444444-4444-4444-4444-444444444443',
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333',
    '{"sub":"33333333-3333-3333-3333-333333333333","email":"admin@platform.local","email_verified":true}'::jsonb,
    'email',
    timezone('utc', now()),
    timezone('utc', now()),
    timezone('utc', now())
  )
on conflict (id) do nothing;

insert into public.tenant_users (tenant_id, user_id, role, status)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'tenant_owner', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-1111-1111-1111-111111111111', 'tenant_admin', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'advisor', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-1111-1111-1111-111111111111', 'operator', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-1111-1111-1111-111111111111', 'viewer', 'active')
on conflict (tenant_id, user_id) do nothing;

insert into public.pipeline_stages (id, tenant_id, name, position, category, is_default)
values
  ('10000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Nuevo', 1, 'inbox', true),
  ('10000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Calificado', 2, 'qualified', false),
  ('10000000-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Visita', 3, 'visit', false),
  ('10000000-0000-0000-0000-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Cerrado ganado', 4, 'won', false)
on conflict (id) do nothing;

insert into public.channels (
  id,
  tenant_id,
  type,
  provider,
  external_account_id,
  display_name,
  status,
  credentials_ref,
  metadata,
  connected_at
)
values (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'whatsapp',
  'meta_whatsapp_cloud',
  'waba-demo-001',
  'WhatsApp Ventas',
  'connected',
  'vault://tenants/demo-paraguay/whatsapp',
  '{"quality_rating":"green"}'::jsonb,
  timezone('utc', now())
)
on conflict (id) do nothing;

insert into public.channel_whatsapp_accounts (
  id,
  tenant_id,
  channel_id,
  meta_business_account_id,
  whatsapp_business_account_id,
  phone_number_id,
  display_phone_number,
  verified_name,
  status,
  webhook_status,
  metadata
)
values (
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'meta-bm-001',
  'waba-001',
  'phone-001',
  '+595 981 123456',
  'Demo Paraguay',
  'connected',
  'verified',
  '{"template_namespace":"demo"}'::jsonb
)
on conflict (id) do nothing;

insert into public.properties (
  id,
  tenant_id,
  external_ref,
  title,
  description,
  operation_type,
  property_type,
  price,
  currency,
  location_text,
  city,
  neighborhood,
  address,
  bedrooms,
  bathrooms,
  garages,
  area_m2,
  pets_allowed,
  furnished,
  has_balcony,
  status,
  advisor_id,
  source,
  published_at
)
values
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'ASU-1001',
    'Departamento de 2 dormitorios en Villa Morra',
    'Departamento moderno con balcon, amenities y cochera.',
    'sale',
    'apartment',
    1250000000,
    'PYG',
    'Villa Morra, Asuncion',
    'Asuncion',
    'Villa Morra',
    'Av. San Martin 1234',
    2,
    2,
    1,
    96,
    true,
    false,
    true,
    'available',
    '22222222-2222-2222-2222-222222222222',
    'manual',
    timezone('utc', now())
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'LMB-2001',
    'Casa con patio en Lambaré',
    'Casa familiar con jardin y espacio para mascotas.',
    'rent',
    'house',
    5500000,
    'PYG',
    'Lambare Centro',
    'Lambare',
    'Centro',
    'Calle 8 de Diciembre 456',
    3,
    2,
    2,
    180,
    true,
    false,
    false,
    'available',
    '22222222-2222-2222-2222-222222222222',
    'manual',
    timezone('utc', now())
  )
on conflict (id) do nothing;

insert into public.property_features (tenant_id, property_id, feature_key, feature_value)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'amenities', 'Piscina, quincho, gimnasio'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'outdoor', 'Patio amplio y jardin')
on conflict do nothing;

insert into public.faqs (tenant_id, question, answer, category, status)
values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '¿Trabajan solo por WhatsApp?',
    'No. Priorizamos WhatsApp, pero tambien centralizamos email y otros canales progresivamente.',
    'general',
    'active'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '¿Se puede coordinar visita?',
    'Si. Podemos registrar tu interes y coordinar una visita con un asesor.',
    'visitas',
    'active'
  )
on conflict do nothing;

insert into public.leads (
  id,
  tenant_id,
  full_name,
  email,
  phone,
  source,
  source_details,
  interest_type,
  budget_min,
  budget_max,
  desired_city,
  desired_neighborhood,
  bedrooms_needed,
  financing_needed,
  pets,
  notes,
  qualification_status,
  score,
  assigned_to,
  pipeline_stage_id
)
values (
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Laura Gonzalez',
  'laura@example.com',
  '+595981999999',
  'whatsapp',
  '{"campaign":"meta-click-to-whatsapp"}'::jsonb,
  'sale',
  1000000000,
  1400000000,
  'Asuncion',
  'Villa Morra',
  2,
  true,
  true,
  'Busca departamento con amenities y acepta credito.',
  'qualified',
  78,
  '22222222-2222-2222-2222-222222222222',
  '10000000-0000-0000-0000-000000000002'
)
on conflict (id) do nothing;

insert into public.lead_property_interests (tenant_id, lead_id, property_id, interest_level)
values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'high'
)
on conflict (lead_id, property_id) do nothing;

insert into public.conversations (
  id,
  tenant_id,
  channel_id,
  lead_id,
  property_id,
  assigned_to,
  status,
  contact_identifier,
  contact_display_name,
  handoff_reason,
  last_message_at,
  ai_enabled
)
values (
  'abababab-abab-abab-abab-abababababab',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  '22222222-2222-2222-2222-222222222222',
  'pending_human',
  '+595981999999',
  'Laura Gonzalez',
  'Solicita confirmacion de disponibilidad y visita.',
  timezone('utc', now()),
  true
)
on conflict (id) do nothing;

insert into public.messages (
  tenant_id,
  conversation_id,
  sender_type,
  direction,
  content,
  content_type,
  message_status,
  created_at
)
values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'abababab-abab-abab-abab-abababababab',
    'lead',
    'inbound',
    'Hola, sigue disponible el departamento de Villa Morra?',
    'text',
    'received',
    timezone('utc', now()) - interval '5 minutes'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'abababab-abab-abab-abab-abababababab',
    'agent',
    'outbound',
    'Si, sigue disponible. Si queres, te hago unas preguntas y coordinamos visita.',
    'text',
    'sent',
    timezone('utc', now()) - interval '4 minutes'
  )
on conflict do nothing;

insert into public.lead_stage_history (tenant_id, lead_id, stage_id, changed_by, notes)
values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  '10000000-0000-0000-0000-000000000002',
  '22222222-2222-2222-2222-222222222222',
  'Lead calificado por presupuesto e interes concreto.'
)
on conflict do nothing;

insert into public.audit_logs (tenant_id, actor_user_id, entity_type, entity_id, action, payload)
values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  'property',
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'property.created',
  '{"title":"Departamento de 2 dormitorios en Villa Morra"}'::jsonb
)
on conflict do nothing;
