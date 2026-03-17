INSERT INTO "cities" ("id", "country_code", "name", "slug", "timezone")
VALUES
  ('11111111-1111-4111-8111-111111111111', 'CO', 'Bogota', 'bogota', 'America/Bogota')
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "event_categories" ("id", "slug", "name", "icon")
VALUES
  ('22222222-2222-4222-8222-222222222201', 'musica', 'Musica', 'music'),
  ('22222222-2222-4222-8222-222222222202', 'teatro', 'Teatro', 'theater'),
  ('22222222-2222-4222-8222-222222222203', 'ferias', 'Ferias', 'storefront'),
  ('22222222-2222-4222-8222-222222222204', 'gastronomia', 'Gastronomia', 'restaurant'),
  ('22222222-2222-4222-8222-222222222205', 'nightlife', 'Nightlife', 'nightlife')
ON CONFLICT ("slug") DO NOTHING;
