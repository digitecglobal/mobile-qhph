ALTER TABLE "venues"
  ADD COLUMN "latitude" DECIMAL(9,6),
  ADD COLUMN "longitude" DECIMAL(9,6);

CREATE INDEX "venues_city_id_latitude_longitude_idx"
  ON "venues" ("city_id", "latitude", "longitude");

INSERT INTO "users" ("id", "email", "password_hash", "role", "city_id", "timezone")
VALUES
  (
    '33333333-3333-4333-8333-333333333333',
    'demo.organizer@qhph.app',
    '$2a$10$xibK79fN4Yrrw4iQ31m2w.shV89w4M2H3fN6fV6vPSxchM7xL3vJS',
    'organizer',
    '11111111-1111-4111-8111-111111111111',
    'America/Bogota'
  )
ON CONFLICT ("email") DO NOTHING;

INSERT INTO "organizers" ("id", "user_id", "name", "slug", "description", "is_verified")
VALUES
  (
    '44444444-4444-4444-8444-444444444444',
    '33333333-3333-4333-8333-333333333333',
    'Que hay pa\' hacer Demo',
    'qhph-demo',
    'Organizador demo para entorno local',
    true
  )
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "venues" (
  "id",
  "city_id",
  "name",
  "address_line",
  "location",
  "latitude",
  "longitude"
)
VALUES
  (
    '55555555-5555-4555-8555-555555555501',
    '11111111-1111-4111-8111-111111111111',
    'Movistar Arena',
    'Av. NQS #63-00',
    ST_GeogFromText('SRID=4326;POINT(-74.0772 4.6486)'),
    4.6486,
    -74.0772
  ),
  (
    '55555555-5555-4555-8555-555555555502',
    '11111111-1111-4111-8111-111111111111',
    'Teatro Jorge Eliecer Gaitan',
    'Cra. 7 #22-47',
    ST_GeogFromText('SRID=4326;POINT(-74.0714 4.6074)'),
    4.6074,
    -74.0714
  ),
  (
    '55555555-5555-4555-8555-555555555503',
    '11111111-1111-4111-8111-111111111111',
    'Parque Simon Bolivar',
    'Av. Calle 53 y Av. Esmeralda',
    ST_GeogFromText('SRID=4326;POINT(-74.0930 4.6584)'),
    4.6584,
    -74.0930
  ),
  (
    '55555555-5555-4555-8555-555555555504',
    '11111111-1111-4111-8111-111111111111',
    'Zona T',
    'Calle 82 #12-18',
    ST_GeogFromText('SRID=4326;POINT(-74.0508 4.6672)'),
    4.6672,
    -74.0508
  )
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "events" (
  "id",
  "slug",
  "organizer_id",
  "venue_id",
  "category_id",
  "city_id",
  "country_code",
  "timezone",
  "title",
  "description_short",
  "description_long",
  "cover_image_url",
  "ticket_url",
  "price_min",
  "price_max",
  "start_at",
  "end_at",
  "status",
  "verification_status"
)
VALUES
  (
    '66666666-6666-4666-8666-666666666601',
    'festival-bogota-vibra',
    '44444444-4444-4444-8444-444444444444',
    '55555555-5555-4555-8555-555555555503',
    '22222222-2222-4222-8222-222222222201',
    '11111111-1111-4111-8111-111111111111',
    'CO',
    'America/Bogota',
    'Festival Bogota Vibra',
    'Concierto masivo con bandas locales e invitadas internacionales.',
    'Una jornada de musica en vivo con food trucks, zonas de descanso y activaciones de marca.',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea',
    'https://example.com/tickets/festival-bogota-vibra',
    30000,
    180000,
    NOW() + INTERVAL '3 days',
    NOW() + INTERVAL '3 days 8 hours',
    'published',
    'trusted_source'
  ),
  (
    '66666666-6666-4666-8666-666666666602',
    'obra-noches-en-la-candelaria',
    '44444444-4444-4444-8444-444444444444',
    '55555555-5555-4555-8555-555555555502',
    '22222222-2222-4222-8222-222222222202',
    '11111111-1111-4111-8111-111111111111',
    'CO',
    'America/Bogota',
    'Noches en La Candelaria',
    'Obra teatral contemporanea con elenco nacional.',
    'Montaje de drama urbano con musica en vivo y conversatorio post funcion.',
    'https://images.unsplash.com/photo-1503095396549-807759245b35',
    'https://example.com/tickets/noches-candelaria',
    20000,
    90000,
    NOW() + INTERVAL '5 days',
    NOW() + INTERVAL '5 days 2 hours',
    'published',
    'verified_manual'
  ),
  (
    '66666666-6666-4666-8666-666666666603',
    'feria-emprende-bogota',
    '44444444-4444-4444-8444-444444444444',
    '55555555-5555-4555-8555-555555555503',
    '22222222-2222-4222-8222-222222222203',
    '11111111-1111-4111-8111-111111111111',
    'CO',
    'America/Bogota',
    'Feria Emprende Bogota',
    'Encuentro de marcas independientes y emprendimientos creativos.',
    'Feria abierta con agenda de talleres, networking y experiencias para familias.',
    'https://images.unsplash.com/photo-1511578314322-379afb476865',
    NULL,
    0,
    0,
    NOW() + INTERVAL '2 days',
    NOW() + INTERVAL '2 days 6 hours',
    'published',
    'unverified'
  ),
  (
    '66666666-6666-4666-8666-666666666604',
    'sabores-de-bogota',
    '44444444-4444-4444-8444-444444444444',
    '55555555-5555-4555-8555-555555555503',
    '22222222-2222-4222-8222-222222222204',
    '11111111-1111-4111-8111-111111111111',
    'CO',
    'America/Bogota',
    'Sabores de Bogota',
    'Festival gastronomico con chefs locales y cocina internacional.',
    'Experiencia culinaria con degustaciones, mercado de productores y clases en vivo.',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
    'https://example.com/tickets/sabores-bogota',
    15000,
    70000,
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '7 days 5 hours',
    'published',
    'verified_manual'
  ),
  (
    '66666666-6666-4666-8666-666666666605',
    'ruta-nightlife-zona-t',
    '44444444-4444-4444-8444-444444444444',
    '55555555-5555-4555-8555-555555555504',
    '22222222-2222-4222-8222-222222222205',
    '11111111-1111-4111-8111-111111111111',
    'CO',
    'America/Bogota',
    'Ruta Nightlife Zona T',
    'Recorrido nocturno por bares y clubes con acceso preferencial.',
    'Plan nocturno para grupos con beneficios en entradas y cocteles de bienvenida.',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
    'https://example.com/tickets/ruta-nightlife-zonat',
    40000,
    140000,
    NOW() + INTERVAL '1 day',
    NOW() + INTERVAL '1 day 4 hours',
    'published',
    'trusted_source'
  )
ON CONFLICT ("slug") DO NOTHING;
