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
    '11111111-1111-4111-8111-111111111111',
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
    '22222222-2222-4222-8222-222222222222',
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
    '44444444-1111-4111-8111-111111111111',
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
    '55555555-1111-4111-8111-111111111111',
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
    '66666666-1111-4111-8111-111111111111',
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
    '33333333-3333-4333-8333-333333333333',
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
values ('33333333-3333-4333-8333-333333333333', 'platform_admin', 'active')
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
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
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
    '44444444-4444-4444-8444-444444444441',
    '11111111-1111-4111-8111-111111111111',
    '11111111-1111-4111-8111-111111111111',
    '{"sub":"11111111-1111-4111-8111-111111111111","email":"owner@demo.py","email_verified":true}'::jsonb,
    'email',
    timezone('utc', now()),
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '44444444-4444-4444-8444-444444444442',
    '22222222-2222-4222-8222-222222222222',
    '22222222-2222-4222-8222-222222222222',
    '{"sub":"22222222-2222-4222-8222-222222222222","email":"advisor@demo.py","email_verified":true}'::jsonb,
    'email',
    timezone('utc', now()),
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    '44444444-1111-4111-8111-111111111111',
    '44444444-1111-4111-8111-111111111111',
    '{"sub":"44444444-1111-4111-8111-111111111111","email":"tenantadmin@demo.py","email_verified":true}'::jsonb,
    'email',
    timezone('utc', now()),
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '44444444-4444-4444-8444-444444444445',
    '55555555-1111-4111-8111-111111111111',
    '55555555-1111-4111-8111-111111111111',
    '{"sub":"55555555-1111-4111-8111-111111111111","email":"operator@demo.py","email_verified":true}'::jsonb,
    'email',
    timezone('utc', now()),
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '44444444-4444-4444-8444-444444444446',
    '66666666-1111-4111-8111-111111111111',
    '66666666-1111-4111-8111-111111111111',
    '{"sub":"66666666-1111-4111-8111-111111111111","email":"viewer@demo.py","email_verified":true}'::jsonb,
    'email',
    timezone('utc', now()),
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '44444444-4444-4444-8444-444444444443',
    '33333333-3333-4333-8333-333333333333',
    '33333333-3333-4333-8333-333333333333',
    '{"sub":"33333333-3333-4333-8333-333333333333","email":"admin@platform.local","email_verified":true}'::jsonb,
    'email',
    timezone('utc', now()),
    timezone('utc', now()),
    timezone('utc', now())
  )
on conflict (id) do nothing;

insert into public.tenant_users (tenant_id, user_id, role, status)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'tenant_owner', 'active'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '44444444-1111-4111-8111-111111111111', 'tenant_admin', 'active'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '22222222-2222-4222-8222-222222222222', 'advisor', 'active'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '55555555-1111-4111-8111-111111111111', 'operator', 'active'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '66666666-1111-4111-8111-111111111111', 'viewer', 'active')
on conflict (tenant_id, user_id) do nothing;

insert into public.pipeline_stages (id, tenant_id, name, position, category, is_default)
values
  ('10000000-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Nuevo', 1, 'inbox', true),
  ('10000000-0000-4000-8000-000000000002', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Calificado', 2, 'qualified', false),
  ('10000000-0000-4000-8000-000000000003', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Visita', 3, 'visit', false),
  ('10000000-0000-4000-8000-000000000004', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Cerrado ganado', 4, 'won', false)
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
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
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
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
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
    'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
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
    '22222222-2222-4222-8222-222222222222',
    'manual',
    timezone('utc', now())
  ),
  (
    'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
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
    '22222222-2222-4222-8222-222222222222',
    'manual',
    timezone('utc', now())
  )
on conflict (id) do nothing;

insert into public.property_features (tenant_id, property_id, feature_key, feature_value)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'amenities', 'Piscina, quincho, gimnasio'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'outdoor', 'Patio amplio y jardin')
on conflict do nothing;

insert into public.faqs (tenant_id, question, answer, category, status)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '¿Trabajan solo por WhatsApp?',
    'No. Priorizamos WhatsApp, pero tambien centralizamos email y otros canales progresivamente.',
    'general',
    'active'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
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
  'ffffffff-ffff-4fff-8fff-ffffffffffff',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
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
  '22222222-2222-4222-8222-222222222222',
  '10000000-0000-4000-8000-000000000002'
)
on conflict (id) do nothing;

insert into public.lead_property_interests (tenant_id, lead_id, property_id, interest_level)
values (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'ffffffff-ffff-4fff-8fff-ffffffffffff',
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
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
  'abababab-abab-4bab-8bab-abababababab',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'ffffffff-ffff-4fff-8fff-ffffffffffff',
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
  '22222222-2222-4222-8222-222222222222',
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
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'abababab-abab-4bab-8bab-abababababab',
    'lead',
    'inbound',
    'Hola, sigue disponible el departamento de Villa Morra?',
    'text',
    'received',
    timezone('utc', now()) - interval '5 minutes'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'abababab-abab-4bab-8bab-abababababab',
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
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'ffffffff-ffff-4fff-8fff-ffffffffffff',
  '10000000-0000-4000-8000-000000000002',
  '22222222-2222-4222-8222-222222222222',
  'Lead calificado por presupuesto e interes concreto.'
)
on conflict do nothing;

insert into public.audit_logs (tenant_id, actor_user_id, entity_type, entity_id, action, payload)
values (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '11111111-1111-4111-8111-111111111111',
  'property',
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
  'property.created',
  '{"title":"Departamento de 2 dormitorios en Villa Morra"}'::jsonb
)
on conflict do nothing;

-- Rich demo dataset for UI/UX density checks.
-- All records are fake, deterministic, and tenant-scoped to the demo tenant.

insert into public.pipeline_stages (id, tenant_id, name, position, category, is_default)
values
  ('10000000-0000-4000-8000-000000000005', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Negociacion', 5, 'negotiation', false),
  ('10000000-0000-4000-8000-000000000006', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Cerrado perdido', 6, 'lost', false)
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
  expenses_amount,
  location_text,
  city,
  neighborhood,
  address,
  bedrooms,
  bathrooms,
  garages,
  area_m2,
  lot_area_m2,
  pets_allowed,
  furnished,
  has_pool,
  has_garden,
  has_balcony,
  status,
  advisor_id,
  source,
  published_at
)
values
  (
    'dddddddd-dddd-4ddd-8ddd-dddddddddd01',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'ASU-1002',
    'Monoambiente amoblado en Las Mercedes',
    'Unidad compacta para renta temporaria o vivienda ejecutiva.',
    'rent',
    'apartment',
    4200000,
    'PYG',
    650000,
    'Las Mercedes, Asuncion',
    'Asuncion',
    'Las Mercedes',
    'Tte. Vera 781',
    1,
    1,
    1,
    48,
    null,
    false,
    true,
    false,
    false,
    true,
    'available',
    '22222222-2222-4222-8222-222222222222',
    'manual',
    timezone('utc', now()) - interval '9 days'
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-dddddddddd02',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'ASU-1003',
    'Oficina corporativa sobre Aviadores',
    'Planta flexible con salas privadas, recepcion y estacionamiento.',
    'rent',
    'office',
    9800000,
    'PYG',
    1800000,
    'Aviadores del Chaco, Asuncion',
    'Asuncion',
    'Ykua Sati',
    'Av. Aviadores del Chaco 2401',
    null,
    2,
    3,
    155,
    null,
    false,
    false,
    false,
    false,
    false,
    'available',
    '44444444-1111-4111-8111-111111111111',
    'manual',
    timezone('utc', now()) - interval '7 days'
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-dddddddddd03',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'SAN-3001',
    'Duplex familiar en San Lorenzo',
    'Duplex con patio, quincho y salida rapida a acceso sur.',
    'sale',
    'duplex',
    780000000,
    'PYG',
    null,
    'San Lorenzo, Central',
    'San Lorenzo',
    'Barcequillo',
    'Capitan Insfran 344',
    3,
    3,
    2,
    142,
    210,
    true,
    false,
    false,
    true,
    true,
    'available',
    '22222222-2222-4222-8222-222222222222',
    'manual',
    timezone('utc', now()) - interval '5 days'
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-dddddddddd04',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'FER-4101',
    'Terreno residencial en Fernando de la Mora',
    'Lote regular con servicios basicos y documentacion al dia.',
    'sale',
    'land',
    350000000,
    'PYG',
    null,
    'Zona Norte, Fernando de la Mora',
    'Fernando de la Mora',
    'Zona Norte',
    'Rio Yhaguy 112',
    null,
    null,
    null,
    null,
    420,
    false,
    false,
    false,
    false,
    false,
    'reserved',
    '44444444-1111-4111-8111-111111111111',
    'manual',
    timezone('utc', now()) - interval '15 days'
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-dddddddddd05',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'ASU-1004',
    'Penthouse con terraza en Carmelitas',
    'Departamento premium con terraza propia, piscina y vista abierta.',
    'sale',
    'apartment',
    2350000000,
    'PYG',
    2600000,
    'Carmelitas, Asuncion',
    'Asuncion',
    'Carmelitas',
    'Cap. Nudelmann 922',
    3,
    4,
    2,
    188,
    null,
    false,
    true,
    true,
    false,
    true,
    'available',
    '22222222-2222-4222-8222-222222222222',
    'manual',
    timezone('utc', now()) - interval '2 days'
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-dddddddddd06',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'LUQ-5101',
    'Deposito logistico en Luque',
    'Deposito con acceso para camiones y oficina administrativa.',
    'rent',
    'warehouse',
    18500000,
    'PYG',
    null,
    'Luque, Central',
    'Luque',
    'Maka-i',
    'Ruta Luque San Bernardino km 8',
    null,
    2,
    6,
    620,
    1200,
    false,
    false,
    false,
    false,
    false,
    'draft',
    '44444444-1111-4111-8111-111111111111',
    'manual',
    null
  )
on conflict (id) do nothing;

insert into public.property_features (id, tenant_id, property_id, feature_key, feature_value)
values
  ('30000000-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'dddddddd-dddd-4ddd-8ddd-dddddddddd01', 'amenities', 'Laundry, cowork, seguridad 24h'),
  ('30000000-0000-4000-8000-000000000002', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'dddddddd-dddd-4ddd-8ddd-dddddddddd02', 'commercial', 'Recepcion, sala de reuniones, generador'),
  ('30000000-0000-4000-8000-000000000003', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'dddddddd-dddd-4ddd-8ddd-dddddddddd03', 'outdoor', 'Patio, quincho y parrilla'),
  ('30000000-0000-4000-8000-000000000004', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'dddddddd-dddd-4ddd-8ddd-dddddddddd05', 'premium', 'Terraza privada, piscina, dos cocheras'),
  ('30000000-0000-4000-8000-000000000005', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'dddddddd-dddd-4ddd-8ddd-dddddddddd06', 'logistics', 'Acceso camion, playa de maniobras')
on conflict (id) do nothing;

insert into public.faqs (id, tenant_id, question, answer, category, status)
values
  ('31000000-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '¿Puedo reservar una propiedad?', 'Si. La reserva depende de disponibilidad, documentacion y aprobacion comercial.', 'reservas', 'active'),
  ('31000000-0000-4000-8000-000000000002', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '¿Aceptan mascotas en alquileres?', 'Depende de cada propiedad. El asesor confirma la regla antes de coordinar visita.', 'alquileres', 'active'),
  ('31000000-0000-4000-8000-000000000003', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '¿Tienen propiedades para inversion?', 'Si. Podemos filtrar por renta estimada, zona y ticket de inversion.', 'inversion', 'active'),
  ('31000000-0000-4000-8000-000000000004', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '¿Puedo financiar la compra?', 'Podemos registrar si necesitás financiacion y derivar opciones con bancos aliados.', 'financiacion', 'active'),
  ('31000000-0000-4000-8000-000000000005', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '¿Trabajan con tasaciones?', 'Las tasaciones se coordinan manualmente con el equipo comercial.', 'servicios', 'inactive'),
  ('31000000-0000-4000-8000-000000000006', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '¿Cuanto tarda coordinar una visita?', 'Normalmente se coordina dentro de las siguientes 24 horas habiles.', 'visitas', 'active')
on conflict (id) do nothing;

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
  pipeline_stage_id,
  is_human_handoff_required,
  created_at
)
values
  ('ffffffff-ffff-4fff-8fff-fffffffffff1', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Andrea Rojas', 'andrea.rojas@example.com', '+595981111001', 'whatsapp', '{"campaign":"carmelitas-premium"}'::jsonb, 'sale', 1800000000, 2500000000, 'Asuncion', 'Carmelitas', 3, true, false, 'Quiere terraza y dos cocheras. Alta intencion.', 'qualified', 86, '22222222-2222-4222-8222-222222222222', '10000000-0000-4000-8000-000000000003', true, timezone('utc', now()) - interval '4 days'),
  ('ffffffff-ffff-4fff-8fff-fffffffffff2', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Roberto Silva', 'roberto.silva@example.com', '+595981111002', 'facebook', '{"adset":"alquileres-ejecutivos"}'::jsonb, 'rent', 3500000, 5000000, 'Asuncion', 'Las Mercedes', 1, false, false, 'Busca monoambiente amoblado por 12 meses.', 'contacted', 62, '22222222-2222-4222-8222-222222222222', '10000000-0000-4000-8000-000000000002', false, timezone('utc', now()) - interval '3 days'),
  ('ffffffff-ffff-4fff-8fff-fffffffffff3', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Paola Fernandez', 'paola.fernandez@example.com', '+595981111003', 'email', '{"source":"referido"}'::jsonb, 'sale', 650000000, 900000000, 'San Lorenzo', 'Barcequillo', 3, true, true, 'Familia con dos hijos. Quiere patio y colegios cerca.', 'qualified', 74, '22222222-2222-4222-8222-222222222222', '10000000-0000-4000-8000-000000000003', false, timezone('utc', now()) - interval '2 days'),
  ('ffffffff-ffff-4fff-8fff-fffffffffff4', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Miguel Pereira', 'miguel.pereira@example.com', '+595981111004', 'whatsapp', '{"campaign":"oficinas-aviadores"}'::jsonb, 'rent', 8500000, 12000000, 'Asuncion', 'Ykua Sati', null, false, false, 'Necesita oficina con estacionamiento para equipo de 12 personas.', 'new', 55, '44444444-1111-4111-8111-111111111111', '10000000-0000-4000-8000-000000000001', true, timezone('utc', now()) - interval '1 day'),
  ('ffffffff-ffff-4fff-8fff-fffffffffff5', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Camila Torres', 'camila.torres@example.com', '+595981111005', 'instagram', '{"campaign":"terrenos-central"}'::jsonb, 'sale', 250000000, 380000000, 'Fernando de la Mora', 'Zona Norte', null, false, false, 'Consulta por lote para construir vivienda.', 'nurturing', 48, '44444444-1111-4111-8111-111111111111', '10000000-0000-4000-8000-000000000002', false, timezone('utc', now()) - interval '8 days'),
  ('ffffffff-ffff-4fff-8fff-fffffffffff6', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Hugo Ramirez', 'hugo.ramirez@example.com', '+595981111006', 'whatsapp', '{"campaign":"depositos-luque"}'::jsonb, 'rent', 15000000, 22000000, 'Luque', 'Maka-i', null, false, false, 'Empresa necesita deposito con patio de maniobras.', 'contacted', 69, '44444444-1111-4111-8111-111111111111', '10000000-0000-4000-8000-000000000002', false, timezone('utc', now()) - interval '6 hours'),
  ('ffffffff-ffff-4fff-8fff-fffffffffff7', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Natalia Vera', 'natalia.vera@example.com', '+595981111007', 'manual', '{"origin":"walk-in"}'::jsonb, 'rent', 5000000, 6500000, 'Lambare', 'Centro', 3, false, true, 'Busca casa pet friendly para mudanza en 30 dias.', 'won', 91, '22222222-2222-4222-8222-222222222222', '10000000-0000-4000-8000-000000000004', false, timezone('utc', now()) - interval '12 days'),
  ('ffffffff-ffff-4fff-8fff-fffffffffff8', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Santiago Ortiz', 'santiago.ortiz@example.com', '+595981111008', 'facebook', '{"campaign":"villa-morra"}'::jsonb, 'sale', 900000000, 1100000000, 'Asuncion', 'Villa Morra', 2, true, false, 'Presupuesto bajo para propiedad objetivo. Requiere seguimiento.', 'unqualified', 32, '22222222-2222-4222-8222-222222222222', '10000000-0000-4000-8000-000000000006', false, timezone('utc', now()) - interval '10 days'),
  ('ffffffff-ffff-4fff-8fff-fffffffffff9', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Mariana Lopez', 'mariana.lopez@example.com', '+595981111009', 'whatsapp', '{"campaign":"casa-familiar"}'::jsonb, 'sale', 750000000, 850000000, 'San Lorenzo', 'Barcequillo', 3, true, true, 'Interesada en oferta si incluye cocina amoblada.', 'qualified', 77, '22222222-2222-4222-8222-222222222222', '10000000-0000-4000-8000-000000000005', true, timezone('utc', now()) - interval '18 hours'),
  ('ffffffff-ffff-4fff-8fff-ffffffffff10', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Esteban Costa', 'esteban.costa@example.com', '+595981111010', 'email', '{"source":"newsletter"}'::jsonb, 'rent', 3800000, 4500000, 'Asuncion', 'Las Mercedes', 1, false, false, 'Quiere visitar dos opciones el mismo dia.', 'new', 51, '55555555-1111-4111-8111-111111111111', '10000000-0000-4000-8000-000000000001', false, timezone('utc', now()) - interval '2 hours')
on conflict (id) do nothing;

insert into public.lead_property_interests (tenant_id, lead_id, property_id, interest_level)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ffffffff-ffff-4fff-8fff-fffffffffff1', 'dddddddd-dddd-4ddd-8ddd-dddddddddd05', 'high'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ffffffff-ffff-4fff-8fff-fffffffffff2', 'dddddddd-dddd-4ddd-8ddd-dddddddddd01', 'high'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ffffffff-ffff-4fff-8fff-fffffffffff3', 'dddddddd-dddd-4ddd-8ddd-dddddddddd03', 'high'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ffffffff-ffff-4fff-8fff-fffffffffff4', 'dddddddd-dddd-4ddd-8ddd-dddddddddd02', 'medium'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ffffffff-ffff-4fff-8fff-fffffffffff5', 'dddddddd-dddd-4ddd-8ddd-dddddddddd04', 'medium'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ffffffff-ffff-4fff-8fff-fffffffffff6', 'dddddddd-dddd-4ddd-8ddd-dddddddddd06', 'high'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ffffffff-ffff-4fff-8fff-fffffffffff7', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'high'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ffffffff-ffff-4fff-8fff-fffffffffff9', 'dddddddd-dddd-4ddd-8ddd-dddddddddd03', 'high'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ffffffff-ffff-4fff-8fff-ffffffffff10', 'dddddddd-dddd-4ddd-8ddd-dddddddddd01', 'medium')
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
values
  ('abababab-abab-4bab-8bab-ababababab01', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'ffffffff-ffff-4fff-8fff-fffffffffff1', 'dddddddd-dddd-4ddd-8ddd-dddddddddd05', '22222222-2222-4222-8222-222222222222', 'pending_human', '+595981111001', 'Andrea Rojas', 'Pide confirmacion de disponibilidad premium.', timezone('utc', now()) - interval '25 minutes', true),
  ('abababab-abab-4bab-8bab-ababababab02', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'ffffffff-ffff-4fff-8fff-fffffffffff2', 'dddddddd-dddd-4ddd-8ddd-dddddddddd01', '22222222-2222-4222-8222-222222222222', 'open', '+595981111002', 'Roberto Silva', null, timezone('utc', now()) - interval '3 hours', true),
  ('abababab-abab-4bab-8bab-ababababab03', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'ffffffff-ffff-4fff-8fff-fffffffffff3', 'dddddddd-dddd-4ddd-8ddd-dddddddddd03', '22222222-2222-4222-8222-222222222222', 'automated', '+595981111003', 'Paola Fernandez', null, timezone('utc', now()) - interval '8 hours', true),
  ('abababab-abab-4bab-8bab-ababababab04', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'ffffffff-ffff-4fff-8fff-fffffffffff4', 'dddddddd-dddd-4ddd-8ddd-dddddddddd02', '44444444-1111-4111-8111-111111111111', 'pending_human', '+595981111004', 'Miguel Pereira', 'Consulta comercial B2B requiere asesor.', timezone('utc', now()) - interval '1 hour', false),
  ('abababab-abab-4bab-8bab-ababababab05', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'ffffffff-ffff-4fff-8fff-fffffffffff6', 'dddddddd-dddd-4ddd-8ddd-dddddddddd06', '44444444-1111-4111-8111-111111111111', 'open', '+595981111006', 'Hugo Ramirez', null, timezone('utc', now()) - interval '40 minutes', true),
  ('abababab-abab-4bab-8bab-ababababab06', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'ffffffff-ffff-4fff-8fff-fffffffffff7', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', '22222222-2222-4222-8222-222222222222', 'closed', '+595981111007', 'Natalia Vera', null, timezone('utc', now()) - interval '9 days', true),
  ('abababab-abab-4bab-8bab-ababababab07', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'ffffffff-ffff-4fff-8fff-fffffffffff9', 'dddddddd-dddd-4ddd-8ddd-dddddddddd03', '22222222-2222-4222-8222-222222222222', 'pending_human', '+595981111009', 'Mariana Lopez', 'Negociacion activa por equipamiento incluido.', timezone('utc', now()) - interval '18 minutes', true),
  ('abababab-abab-4bab-8bab-ababababab08', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'ffffffff-ffff-4fff-8fff-ffffffffff10', 'dddddddd-dddd-4ddd-8ddd-dddddddddd01', '55555555-1111-4111-8111-111111111111', 'open', '+595981111010', 'Esteban Costa', null, timezone('utc', now()) - interval '12 minutes', true)
on conflict (id) do nothing;

insert into public.messages (
  id,
  tenant_id,
  conversation_id,
  sender_type,
  direction,
  external_message_id,
  content,
  content_type,
  message_status,
  error_message,
  created_at
)
values
  ('40000000-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'abababab-abab-4bab-8bab-ababababab01', 'lead', 'inbound', 'wamid.demo.001', 'Hola, quiero saber si el penthouse de Carmelitas sigue disponible.', 'text', 'received', null, timezone('utc', now()) - interval '35 minutes'),
  ('40000000-0000-4000-8000-000000000002', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'abababab-abab-4bab-8bab-ababababab01', 'agent', 'outbound', 'wamid.demo.002', 'Sigue disponible. Te confirmo agenda para coordinar visita.', 'text', 'delivered', null, timezone('utc', now()) - interval '30 minutes'),
  ('40000000-0000-4000-8000-000000000003', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'abababab-abab-4bab-8bab-ababababab01', 'lead', 'inbound', 'wamid.demo.003', 'Perfecto, podria ser mañana por la tarde?', 'text', 'received', null, timezone('utc', now()) - interval '25 minutes'),
  ('40000000-0000-4000-8000-000000000004', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'abababab-abab-4bab-8bab-ababababab02', 'lead', 'inbound', 'wamid.demo.004', 'Busco monoambiente amoblado cerca de Las Mercedes.', 'text', 'received', null, timezone('utc', now()) - interval '4 hours'),
  ('40000000-0000-4000-8000-000000000005', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'abababab-abab-4bab-8bab-ababababab02', 'agent', 'outbound', 'wamid.demo.005', 'Tenemos una opcion amoblada. Te paso detalles y requisitos.', 'text', 'read', null, timezone('utc', now()) - interval '3 hours'),
  ('40000000-0000-4000-8000-000000000006', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'abababab-abab-4bab-8bab-ababababab03', 'lead', 'inbound', 'wamid.demo.006', 'Necesito casa o duplex con patio en San Lorenzo.', 'text', 'received', null, timezone('utc', now()) - interval '9 hours'),
  ('40000000-0000-4000-8000-000000000007', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'abababab-abab-4bab-8bab-ababababab03', 'agent', 'outbound', 'wamid.demo.007', 'El duplex de Barcequillo coincide con tu busqueda.', 'text', 'sent', null, timezone('utc', now()) - interval '8 hours'),
  ('40000000-0000-4000-8000-000000000008', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'abababab-abab-4bab-8bab-ababababab04', 'lead', 'inbound', 'wamid.demo.008', 'Necesito una oficina para 12 personas sobre Aviadores.', 'text', 'received', null, timezone('utc', now()) - interval '2 hours'),
  ('40000000-0000-4000-8000-000000000009', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'abababab-abab-4bab-8bab-ababababab04', 'agent', 'outbound', 'wamid.demo.009', 'Intento enviar brochure de oficina.', 'text', 'failed', 'Provider rejected template parameters.', timezone('utc', now()) - interval '1 hour'),
  ('40000000-0000-4000-8000-000000000010', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'abababab-abab-4bab-8bab-ababababab05', 'lead', 'inbound', 'wamid.demo.010', 'El deposito permite entrada de camiones grandes?', 'text', 'received', null, timezone('utc', now()) - interval '55 minutes'),
  ('40000000-0000-4000-8000-000000000011', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'abababab-abab-4bab-8bab-ababababab05', 'agent', 'outbound', 'wamid.demo.011', 'Si, tiene playa de maniobras y oficina administrativa.', 'text', 'delivered', null, timezone('utc', now()) - interval '40 minutes'),
  ('40000000-0000-4000-8000-000000000012', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'abababab-abab-4bab-8bab-ababababab06', 'lead', 'inbound', 'wamid.demo.012', 'Confirmo alquiler de la casa de Lambare.', 'text', 'received', null, timezone('utc', now()) - interval '9 days'),
  ('40000000-0000-4000-8000-000000000013', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'abababab-abab-4bab-8bab-ababababab06', 'agent', 'outbound', 'wamid.demo.013', 'Gracias, dejamos la operacion registrada como cerrada.', 'text', 'read', null, timezone('utc', now()) - interval '9 days'),
  ('40000000-0000-4000-8000-000000000014', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'abababab-abab-4bab-8bab-ababababab07', 'lead', 'inbound', 'wamid.demo.014', 'Si incluyen la cocina amoblada puedo avanzar con una oferta.', 'text', 'received', null, timezone('utc', now()) - interval '40 minutes'),
  ('40000000-0000-4000-8000-000000000015', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'abababab-abab-4bab-8bab-ababababab07', 'advisor', 'outbound', 'wamid.demo.015', 'Lo reviso con el propietario y te confirmo hoy.', 'text', 'sent', null, timezone('utc', now()) - interval '18 minutes'),
  ('40000000-0000-4000-8000-000000000016', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'abababab-abab-4bab-8bab-ababababab08', 'lead', 'inbound', 'wamid.demo.016', 'Quiero visitar dos monoambientes esta semana.', 'text', 'received', null, timezone('utc', now()) - interval '20 minutes'),
  ('40000000-0000-4000-8000-000000000017', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'abababab-abab-4bab-8bab-ababababab08', 'system', 'outbound', 'wamid.demo.017', 'Se registro solicitud de agenda.', 'system', 'sent', null, timezone('utc', now()) - interval '12 minutes')
on conflict (id) do nothing;

insert into public.appointments (
  id,
  tenant_id,
  lead_id,
  property_id,
  advisor_id,
  scheduled_at,
  status,
  notes
)
values
  ('50000000-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ffffffff-ffff-4fff-8fff-fffffffffff1', 'dddddddd-dddd-4ddd-8ddd-dddddddddd05', '22222222-2222-4222-8222-222222222222', timezone('utc', now()) + interval '1 day', 'scheduled', 'Confirmar documento de identidad antes de visita.'),
  ('50000000-0000-4000-8000-000000000002', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ffffffff-ffff-4fff-8fff-fffffffffff2', 'dddddddd-dddd-4ddd-8ddd-dddddddddd01', '22222222-2222-4222-8222-222222222222', timezone('utc', now()) + interval '2 days', 'confirmed', 'Cliente viene despues del trabajo.'),
  ('50000000-0000-4000-8000-000000000003', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ffffffff-ffff-4fff-8fff-fffffffffff3', 'dddddddd-dddd-4ddd-8ddd-dddddddddd03', '22222222-2222-4222-8222-222222222222', timezone('utc', now()) + interval '3 days', 'scheduled', 'Quiere revisar patio y estado de cocina.'),
  ('50000000-0000-4000-8000-000000000004', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ffffffff-ffff-4fff-8fff-fffffffffff4', 'dddddddd-dddd-4ddd-8ddd-dddddddddd02', '44444444-1111-4111-8111-111111111111', timezone('utc', now()) + interval '4 days', 'confirmed', 'Visita B2B con gerente administrativo.'),
  ('50000000-0000-4000-8000-000000000005', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ffffffff-ffff-4fff-8fff-fffffffffff7', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', '22222222-2222-4222-8222-222222222222', timezone('utc', now()) - interval '6 days', 'completed', 'Visita completada, contrato en preparacion.'),
  ('50000000-0000-4000-8000-000000000006', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ffffffff-ffff-4fff-8fff-fffffffffff8', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', '22222222-2222-4222-8222-222222222222', timezone('utc', now()) - interval '8 days', 'no_show', 'Cliente no asistio y no respondio seguimiento.'),
  ('50000000-0000-4000-8000-000000000007', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ffffffff-ffff-4fff-8fff-fffffffffff9', 'dddddddd-dddd-4ddd-8ddd-dddddddddd03', '22222222-2222-4222-8222-222222222222', timezone('utc', now()) + interval '6 hours', 'scheduled', 'Negociacion activa, preparar comparables.'),
  ('50000000-0000-4000-8000-000000000008', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ffffffff-ffff-4fff-8fff-fffffffffff5', 'dddddddd-dddd-4ddd-8ddd-dddddddddd04', '44444444-1111-4111-8111-111111111111', timezone('utc', now()) - interval '3 days', 'canceled', 'Cliente pospuso busqueda por cambio de presupuesto.')
on conflict (id) do nothing;

insert into public.lead_stage_history (id, tenant_id, lead_id, stage_id, changed_by, changed_at, notes)
values
  ('60000000-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ffffffff-ffff-4fff-8fff-fffffffffff1', '10000000-0000-4000-8000-000000000002', '22222222-2222-4222-8222-222222222222', timezone('utc', now()) - interval '4 days', 'Calificada por presupuesto y zona premium.'),
  ('60000000-0000-4000-8000-000000000002', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ffffffff-ffff-4fff-8fff-fffffffffff1', '10000000-0000-4000-8000-000000000003', '22222222-2222-4222-8222-222222222222', timezone('utc', now()) - interval '1 day', 'Pasa a visita por disponibilidad confirmada.'),
  ('60000000-0000-4000-8000-000000000003', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ffffffff-ffff-4fff-8fff-fffffffffff7', '10000000-0000-4000-8000-000000000004', '22222222-2222-4222-8222-222222222222', timezone('utc', now()) - interval '7 days', 'Operacion cerrada con reserva abonada.'),
  ('60000000-0000-4000-8000-000000000004', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ffffffff-ffff-4fff-8fff-fffffffffff8', '10000000-0000-4000-8000-000000000006', '22222222-2222-4222-8222-222222222222', timezone('utc', now()) - interval '8 days', 'Presupuesto insuficiente para propiedad objetivo.'),
  ('60000000-0000-4000-8000-000000000005', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ffffffff-ffff-4fff-8fff-fffffffffff9', '10000000-0000-4000-8000-000000000005', '22222222-2222-4222-8222-222222222222', timezone('utc', now()) - interval '12 hours', 'Inicio de negociacion por equipamiento incluido.')
on conflict (id) do nothing;

insert into public.whatsapp_message_templates (
  id,
  tenant_id,
  name,
  language,
  category,
  status,
  components,
  is_active,
  status_updated_by,
  status_updated_at,
  approved_by,
  approved_at
)
values
  ('70000000-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'visit_confirmation', 'es_PY', 'UTILITY', 'approved', '[{"type":"body","parameters":[{"type":"text","text":"{{1}}"},{"type":"text","text":"{{2}}"}]}]'::jsonb, true, '11111111-1111-4111-8111-111111111111', timezone('utc', now()) - interval '7 days', '11111111-1111-4111-8111-111111111111', timezone('utc', now()) - interval '7 days'),
  ('70000000-0000-4000-8000-000000000002', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'property_follow_up', 'es_PY', 'MARKETING', 'approved', '[{"type":"body","parameters":[{"type":"text","text":"{{1}}"}]}]'::jsonb, true, '44444444-1111-4111-8111-111111111111', timezone('utc', now()) - interval '5 days', '44444444-1111-4111-8111-111111111111', timezone('utc', now()) - interval '5 days'),
  ('70000000-0000-4000-8000-000000000003', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'missing_documents', 'es_PY', 'UTILITY', 'pending', '[]'::jsonb, true, '11111111-1111-4111-8111-111111111111', timezone('utc', now()) - interval '1 day', null, null),
  ('70000000-0000-4000-8000-000000000004', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'price_drop_alert', 'es_PY', 'MARKETING', 'rejected', '[]'::jsonb, false, '44444444-1111-4111-8111-111111111111', timezone('utc', now()) - interval '2 days', null, null),
  ('70000000-0000-4000-8000-000000000005', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'visit_reminder', 'es_PY', 'UTILITY', 'paused', '[{"type":"body","parameters":[{"type":"text","text":"{{1}}"}]}]'::jsonb, false, '11111111-1111-4111-8111-111111111111', timezone('utc', now()) - interval '3 days', '11111111-1111-4111-8111-111111111111', timezone('utc', now()) - interval '4 days')
on conflict (id) do nothing;

insert into public.channel_events (
  id,
  tenant_id,
  channel_id,
  provider,
  event_type,
  direction,
  external_event_id,
  payload,
  processing_status,
  error_message,
  processed_at,
  created_at
)
values
  ('80000000-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'meta_whatsapp_cloud', 'message.outbound.sent', 'outbound', 'evt-demo-001', '{"message_id":"wamid.demo.002"}'::jsonb, 'processed', null, timezone('utc', now()) - interval '30 minutes', timezone('utc', now()) - interval '30 minutes'),
  ('80000000-0000-4000-8000-000000000002', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'meta_whatsapp_cloud', 'message.outbound.delivered', 'outbound', 'evt-demo-002', '{"message_id":"wamid.demo.005"}'::jsonb, 'processed', null, timezone('utc', now()) - interval '3 hours', timezone('utc', now()) - interval '3 hours'),
  ('80000000-0000-4000-8000-000000000003', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'meta_whatsapp_cloud', 'message.outbound.read', 'outbound', 'evt-demo-003', '{"message_id":"wamid.demo.013"}'::jsonb, 'processed', null, timezone('utc', now()) - interval '9 days', timezone('utc', now()) - interval '9 days'),
  ('80000000-0000-4000-8000-000000000004', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'meta_whatsapp_cloud', 'message.outbound.failed', 'outbound', 'evt-demo-004', '{"message_id":"wamid.demo.009"}'::jsonb, 'failed', 'Provider rejected template parameters.', timezone('utc', now()) - interval '1 hour', timezone('utc', now()) - interval '1 hour'),
  ('80000000-0000-4000-8000-000000000005', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'meta_whatsapp_cloud', 'message.outbound.retry', 'outbound', 'evt-demo-005', '{"message_id":"wamid.demo.009","attempt":2}'::jsonb, 'processed', null, timezone('utc', now()) - interval '50 minutes', timezone('utc', now()) - interval '50 minutes'),
  ('80000000-0000-4000-8000-000000000006', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'meta_whatsapp_cloud', 'message.outbound.retry_failed', 'outbound', 'evt-demo-006', '{"message_id":"wamid.demo.009","attempt":3}'::jsonb, 'failed', 'Retry limit reached.', timezone('utc', now()) - interval '45 minutes', timezone('utc', now()) - interval '45 minutes'),
  ('80000000-0000-4000-8000-000000000007', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'meta_whatsapp_cloud', 'webhook.rejected', 'inbound', 'evt-demo-007', '{"reason":"invalid_signature"}'::jsonb, 'rejected', 'Invalid webhook signature.', null, timezone('utc', now()) - interval '2 hours'),
  ('80000000-0000-4000-8000-000000000008', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'meta_whatsapp_cloud', 'message.inbound.received', 'inbound', 'evt-demo-008', '{"message_id":"wamid.demo.016"}'::jsonb, 'processed', null, timezone('utc', now()) - interval '20 minutes', timezone('utc', now()) - interval '20 minutes')
on conflict (id) do nothing;

-- Heavy demo dataset for pagination and production-like density checks.
-- Generated rows are deterministic, fake, tenant-scoped, and safe to reset.

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
select
  ('90000000-0000-4000-8000-' || lpad(series.index::text, 12, '0'))::uuid,
  'Inmobiliaria Piloto ' || lpad(series.index::text, 2, '0'),
  'piloto-' || lpad(series.index::text, 2, '0'),
  (
    case
      when series.index % 11 = 0 then 'suspended'
      when series.index % 7 = 0 then 'trial'
      else 'active'
    end
  )::public.tenant_status,
  'PYG',
  'America/Asuncion',
  'es-PY',
  jsonb_build_object(
    'lead_sources',
    jsonb_build_array('whatsapp', 'manual', 'email'),
    'default_country',
    'Paraguay'
  ),
  jsonb_build_object('logoText', 'Piloto ' || lpad(series.index::text, 2, '0'))
from generate_series(1, 18) as series(index)
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
  expenses_amount,
  location_text,
  city,
  neighborhood,
  address,
  bedrooms,
  bathrooms,
  garages,
  area_m2,
  lot_area_m2,
  pets_allowed,
  furnished,
  has_pool,
  has_garden,
  has_balcony,
  status,
  advisor_id,
  source,
  published_at,
  created_at
)
select
  ('91000000-0000-4000-8000-' || lpad(series.index::text, 12, '0'))::uuid,
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'BULK-' || lpad(series.index::text, 4, '0'),
  case
    when series.index % 9 = 0 then 'Casa familiar con patio en barrio cerrado ' || series.index
    when series.index % 8 = 0 then 'Local comercial sobre avenida principal ' || series.index
    when series.index % 7 = 0 then 'Terreno listo para desarrollo residencial ' || series.index
    when series.index % 6 = 0 then 'Oficina corporativa con cocheras ' || series.index
    else 'Departamento luminoso para operacion comercial ' || series.index
  end,
  'Ficha generada para probar listados extensos, filtros por estado y rendimiento visual.',
  (
    case when series.index % 3 = 0 then 'rent' else 'sale' end
  )::public.property_operation_type,
  (
    case
      when series.index % 9 = 0 then 'house'
      when series.index % 8 = 0 then 'commercial'
      when series.index % 7 = 0 then 'land'
      when series.index % 6 = 0 then 'office'
      when series.index % 5 = 0 then 'duplex'
      else 'apartment'
    end
  )::public.property_type,
  case
    when series.index % 3 = 0 then 3200000 + (series.index * 145000)
    else 420000000 + (series.index * 27000000)
  end,
  'PYG',
  case when series.index % 3 = 0 then 450000 + (series.index * 15000) else null end,
  (
    case
      when series.index % 5 = 0 then 'Carmelitas'
      when series.index % 4 = 0 then 'Villa Morra'
      when series.index % 3 = 0 then 'Las Mercedes'
      when series.index % 2 = 0 then 'San Lorenzo'
      else 'Fernando de la Mora'
    end
  ) || ', Paraguay',
  case
    when series.index % 4 = 0 then 'Asuncion'
    when series.index % 3 = 0 then 'Lambare'
    when series.index % 2 = 0 then 'San Lorenzo'
    else 'Fernando de la Mora'
  end,
  case
    when series.index % 5 = 0 then 'Carmelitas'
    when series.index % 4 = 0 then 'Villa Morra'
    when series.index % 3 = 0 then 'Las Mercedes'
    when series.index % 2 = 0 then 'Barcequillo'
    else 'Zona Norte'
  end,
  'Calle Demo ' || series.index,
  case when series.index % 7 = 0 then null else 1 + (series.index % 4) end,
  case when series.index % 7 = 0 then null else 1 + (series.index % 3) end,
  series.index % 4,
  case when series.index % 7 = 0 then null else 45 + (series.index * 3) end,
  case when series.index % 7 = 0 then 300 + (series.index * 12) else null end,
  series.index % 2 = 0,
  series.index % 6 = 0,
  series.index % 10 = 0,
  series.index % 9 = 0,
  series.index % 4 = 0,
  (
    case
      when series.index % 13 = 0 then 'inactive'
      when series.index % 11 = 0 then 'sold'
      when series.index % 7 = 0 then 'reserved'
      when series.index % 6 = 0 then 'draft'
      else 'available'
    end
  )::public.property_status,
  case
    when series.index % 4 = 0 then '44444444-1111-4111-8111-111111111111'::uuid
    when series.index % 5 = 0 then '55555555-1111-4111-8111-111111111111'::uuid
    else '22222222-2222-4222-8222-222222222222'::uuid
  end,
  'seed-bulk',
  case when series.index % 6 = 0 then null else timezone('utc', now()) - (series.index || ' days')::interval end,
  timezone('utc', now()) - (series.index || ' days')::interval
from generate_series(1, 90) as series(index)
on conflict (id) do nothing;

insert into public.property_features (
  id,
  tenant_id,
  property_id,
  feature_key,
  feature_value
)
select
  ('91100000-0000-4000-8000-' || lpad(series.index::text, 12, '0'))::uuid,
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  ('91000000-0000-4000-8000-' || lpad(series.index::text, 12, '0'))::uuid,
  case
    when series.index % 5 = 0 then 'commercial_notes'
    when series.index % 4 = 0 then 'amenities'
    when series.index % 3 = 0 then 'financing'
    else 'sales_notes'
  end,
  case
    when series.index % 5 = 0 then 'Alta visibilidad, transito y estacionamiento cercano.'
    when series.index % 4 = 0 then 'Amenities, seguridad y espacios comunes.'
    when series.index % 3 = 0 then 'Apta para credito sujeto a evaluacion bancaria.'
    else 'Ficha cargada para probar densidad operacional.'
  end
from generate_series(1, 90) as series(index)
on conflict (id) do nothing;

insert into public.faqs (
  id,
  tenant_id,
  question,
  answer,
  category,
  status,
  created_at
)
select
  ('91200000-0000-4000-8000-' || lpad(series.index::text, 12, '0'))::uuid,
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'Pregunta frecuente operativa ' || series.index,
  'Respuesta generada para probar una base editorial extensa con categorias, estados y textos de longitud media.',
  case
    when series.index % 6 = 0 then 'documentacion'
    when series.index % 5 = 0 then 'financiacion'
    when series.index % 4 = 0 then 'visitas'
    when series.index % 3 = 0 then 'alquileres'
    else 'general'
  end,
  case when series.index % 8 = 0 then 'inactive' else 'active' end::public.faq_status,
  timezone('utc', now()) - (series.index || ' hours')::interval
from generate_series(1, 42) as series(index)
on conflict (id) do nothing;

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
  move_in_date,
  financing_needed,
  pets,
  notes,
  qualification_status,
  score,
  assigned_to,
  pipeline_stage_id,
  is_human_handoff_required,
  created_at
)
select
  ('92000000-0000-4000-8000-' || lpad(series.index::text, 12, '0'))::uuid,
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'Lead Demo ' || lpad(series.index::text, 3, '0'),
  'lead.demo.' || lpad(series.index::text, 3, '0') || '@example.com',
  '+5959812' || lpad(series.index::text, 5, '0'),
  case
    when series.index % 6 = 0 then 'email'
    when series.index % 5 = 0 then 'instagram'
    when series.index % 4 = 0 then 'facebook_leads'
    when series.index % 3 = 0 then 'manual'
    else 'whatsapp'
  end,
  jsonb_build_object('campaign', 'bulk-density-' || (series.index % 7)),
  case when series.index % 3 = 0 then 'rent' else 'sale' end::public.lead_interest_type,
  case when series.index % 3 = 0 then 2800000 + (series.index * 45000) else 350000000 + (series.index * 8000000) end,
  case when series.index % 3 = 0 then 5200000 + (series.index * 65000) else 900000000 + (series.index * 11000000) end,
  case
    when series.index % 5 = 0 then 'Asuncion'
    when series.index % 4 = 0 then 'Lambare'
    when series.index % 3 = 0 then 'San Lorenzo'
    else 'Fernando de la Mora'
  end,
  case
    when series.index % 5 = 0 then 'Carmelitas'
    when series.index % 4 = 0 then 'Centro'
    when series.index % 3 = 0 then 'Barcequillo'
    else 'Zona Norte'
  end,
  1 + (series.index % 4),
  (current_date + ((series.index % 45) || ' days')::interval)::date,
  series.index % 2 = 0,
  series.index % 5 = 0,
  'Lead generado para probar bandejas extensas, tabs por estado y busqueda.',
  (
    case
      when series.index % 17 = 0 then 'lost'
      when series.index % 13 = 0 then 'won'
      when series.index % 11 = 0 then 'unqualified'
      when series.index % 7 = 0 then 'nurturing'
      when series.index % 5 = 0 then 'qualified'
      when series.index % 3 = 0 then 'contacted'
      else 'new'
    end
  )::public.lead_qualification_status,
  least(100, 25 + (series.index % 76)),
  case
    when series.index % 4 = 0 then '44444444-1111-4111-8111-111111111111'::uuid
    when series.index % 5 = 0 then '55555555-1111-4111-8111-111111111111'::uuid
    else '22222222-2222-4222-8222-222222222222'::uuid
  end,
  ('10000000-0000-4000-8000-' || lpad(((series.index % 6) + 1)::text, 12, '0'))::uuid,
  series.index % 6 = 0,
  timezone('utc', now()) - ((series.index * 3) || ' hours')::interval
from generate_series(1, 140) as series(index)
on conflict (id) do nothing;

insert into public.lead_property_interests (
  tenant_id,
  lead_id,
  property_id,
  interest_level
)
select
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  ('92000000-0000-4000-8000-' || lpad(series.index::text, 12, '0'))::uuid,
  ('91000000-0000-4000-8000-' || lpad((((series.index - 1) % 90) + 1)::text, 12, '0'))::uuid,
  case
    when series.index % 5 = 0 then 'high'
    when series.index % 3 = 0 then 'low'
    else 'medium'
  end::public.lead_interest_level
from generate_series(1, 140) as series(index)
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
  ai_enabled,
  created_at
)
select
  ('93000000-0000-4000-8000-' || lpad(series.index::text, 12, '0'))::uuid,
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  ('92000000-0000-4000-8000-' || lpad(series.index::text, 12, '0'))::uuid,
  ('91000000-0000-4000-8000-' || lpad((((series.index - 1) % 90) + 1)::text, 12, '0'))::uuid,
  case
    when series.index % 4 = 0 then '44444444-1111-4111-8111-111111111111'::uuid
    when series.index % 5 = 0 then '55555555-1111-4111-8111-111111111111'::uuid
    else '22222222-2222-4222-8222-222222222222'::uuid
  end,
  (
    case
      when series.index % 13 = 0 then 'closed'
      when series.index % 7 = 0 then 'automated'
      when series.index % 4 = 0 then 'pending_human'
      else 'open'
    end
  )::public.conversation_status,
  '+5959823' || lpad(series.index::text, 5, '0'),
  'Lead Demo ' || lpad(series.index::text, 3, '0'),
  case when series.index % 4 = 0 then 'Requiere respuesta humana por condicion comercial.' else null end,
  timezone('utc', now()) - ((series.index * 17) || ' minutes')::interval,
  series.index % 9 <> 0,
  timezone('utc', now()) - ((series.index * 18) || ' minutes')::interval
from generate_series(1, 110) as series(index)
on conflict (id) do nothing;

insert into public.messages (
  id,
  tenant_id,
  conversation_id,
  sender_type,
  direction,
  external_message_id,
  content,
  content_type,
  message_status,
  error_message,
  created_at
)
select
  ('94000000-0000-4000-8000-' || lpad(((conversation.index * 10) + message.index)::text, 12, '0'))::uuid,
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  ('93000000-0000-4000-8000-' || lpad(conversation.index::text, 12, '0'))::uuid,
  case
    when message.index = 1 then 'lead'
    when message.index = 2 then 'agent'
    else 'advisor'
  end::public.sender_type,
  case when message.index = 1 then 'inbound' else 'outbound' end::public.message_direction,
  'wamid.bulk.' || conversation.index || '.' || message.index,
  case
    when message.index = 1 then 'Hola, quiero informacion sobre la propiedad publicada.'
    when message.index = 2 then 'Gracias por escribirnos. Te comparto datos y validamos disponibilidad.'
    else 'Quedo atento para coordinar visita o seguimiento.'
  end,
  'text',
  case
    when message.index = 1 then 'received'
    when conversation.index % 12 = 0 and message.index = 2 then 'failed'
    when conversation.index % 5 = 0 then 'read'
    when conversation.index % 3 = 0 then 'delivered'
    else 'sent'
  end::public.message_status,
  case
    when conversation.index % 12 = 0 and message.index = 2 then 'Simulated provider failure for density testing.'
    else null
  end,
  timezone('utc', now()) - (((conversation.index * 17) - message.index) || ' minutes')::interval
from generate_series(1, 110) as conversation(index)
cross join generate_series(1, 3) as message(index)
on conflict (id) do nothing;

insert into public.appointments (
  id,
  tenant_id,
  lead_id,
  property_id,
  advisor_id,
  scheduled_at,
  status,
  notes,
  created_at
)
select
  ('95000000-0000-4000-8000-' || lpad(series.index::text, 12, '0'))::uuid,
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  ('92000000-0000-4000-8000-' || lpad(series.index::text, 12, '0'))::uuid,
  ('91000000-0000-4000-8000-' || lpad((((series.index - 1) % 90) + 1)::text, 12, '0'))::uuid,
  case
    when series.index % 4 = 0 then '44444444-1111-4111-8111-111111111111'::uuid
    when series.index % 5 = 0 then '55555555-1111-4111-8111-111111111111'::uuid
    else '22222222-2222-4222-8222-222222222222'::uuid
  end,
  timezone('utc', now()) + (((series.index % 28) - 10) || ' days')::interval + ((9 + (series.index % 8)) || ' hours')::interval,
  (
    case
      when series.index % 17 = 0 then 'no_show'
      when series.index % 13 = 0 then 'canceled'
      when series.index % 7 = 0 then 'completed'
      when series.index % 4 = 0 then 'confirmed'
      else 'scheduled'
    end
  )::public.appointment_status,
  'Visita generada para probar agenda con volumen y estados variados.',
  timezone('utc', now()) - ((series.index * 2) || ' hours')::interval
from generate_series(1, 100) as series(index)
on conflict (id) do nothing;

insert into public.lead_stage_history (
  id,
  tenant_id,
  lead_id,
  stage_id,
  changed_by,
  changed_at,
  notes
)
select
  ('96000000-0000-4000-8000-' || lpad(series.index::text, 12, '0'))::uuid,
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  ('92000000-0000-4000-8000-' || lpad(series.index::text, 12, '0'))::uuid,
  ('10000000-0000-4000-8000-' || lpad(((series.index % 6) + 1)::text, 12, '0'))::uuid,
  case
    when series.index % 4 = 0 then '44444444-1111-4111-8111-111111111111'::uuid
    else '22222222-2222-4222-8222-222222222222'::uuid
  end,
  timezone('utc', now()) - ((series.index * 4) || ' hours')::interval,
  'Movimiento generado para poblar historial comercial.'
from generate_series(1, 140) as series(index)
on conflict (id) do nothing;

insert into public.whatsapp_message_templates (
  id,
  tenant_id,
  name,
  language,
  category,
  status,
  components,
  is_active,
  status_updated_by,
  status_updated_at,
  approved_by,
  approved_at
)
select
  ('97000000-0000-4000-8000-' || lpad(series.index::text, 12, '0'))::uuid,
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'bulk_template_' || lpad(series.index::text, 2, '0'),
  'es_PY',
  case when series.index % 4 = 0 then 'MARKETING' else 'UTILITY' end,
  (
    case
      when series.index % 11 = 0 then 'paused'
      when series.index % 7 = 0 then 'rejected'
      when series.index % 5 = 0 then 'pending'
      else 'approved'
    end
  ),
  jsonb_build_array(
    jsonb_build_object(
      'type',
      'body',
      'parameters',
      jsonb_build_array(jsonb_build_object('type', 'text', 'text', '{{1}}'))
    )
  ),
  series.index % 9 <> 0,
  case
    when series.index % 4 = 0 then '44444444-1111-4111-8111-111111111111'::uuid
    else '11111111-1111-4111-8111-111111111111'::uuid
  end,
  timezone('utc', now()) - (series.index || ' days')::interval,
  case
    when series.index % 5 = 0 or series.index % 7 = 0 then null
    when series.index % 4 = 0 then '44444444-1111-4111-8111-111111111111'::uuid
    else '11111111-1111-4111-8111-111111111111'::uuid
  end,
  case
    when series.index % 5 = 0 or series.index % 7 = 0 then null
    else timezone('utc', now()) - (series.index || ' days')::interval
  end
from generate_series(1, 28) as series(index)
on conflict (id) do nothing;

insert into public.channel_events (
  id,
  tenant_id,
  channel_id,
  provider,
  event_type,
  direction,
  external_event_id,
  payload,
  processing_status,
  error_message,
  processed_at,
  created_at
)
select
  ('98000000-0000-4000-8000-' || lpad(series.index::text, 12, '0'))::uuid,
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'meta_whatsapp_cloud',
  case
    when series.index % 19 = 0 then 'webhook.rejected'
    when series.index % 13 = 0 then 'message.outbound.retry_failed'
    when series.index % 11 = 0 then 'message.outbound.failed'
    when series.index % 5 = 0 then 'message.outbound.read'
    when series.index % 3 = 0 then 'message.outbound.delivered'
    else 'message.inbound.received'
  end,
  case when series.index % 2 = 0 then 'outbound' else 'inbound' end::public.message_direction,
  'evt-bulk-' || lpad(series.index::text, 4, '0'),
  jsonb_build_object('sequence', series.index),
  case
    when series.index % 19 = 0 then 'rejected'
    when series.index % 13 = 0 or series.index % 11 = 0 then 'failed'
    else 'processed'
  end,
  case
    when series.index % 19 = 0 then 'Invalid signature in simulated webhook.'
    when series.index % 13 = 0 then 'Retry limit reached in simulated provider.'
    when series.index % 11 = 0 then 'Provider rejected simulated message.'
    else null
  end,
  case
    when series.index % 19 = 0 then null
    else timezone('utc', now()) - ((series.index * 11) || ' minutes')::interval
  end,
  timezone('utc', now()) - ((series.index * 11) || ' minutes')::interval
from generate_series(1, 150) as series(index)
on conflict (id) do nothing;
