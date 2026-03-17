-- Extensions
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Enums
CREATE TYPE "Role" AS ENUM ('user', 'organizer', 'moderator', 'admin');
CREATE TYPE "EventStatus" AS ENUM ('draft', 'published', 'cancelled', 'finished');
CREATE TYPE "VerificationStatus" AS ENUM ('unverified', 'verified_manual', 'trusted_source');
CREATE TYPE "NotificationChannel" AS ENUM ('push', 'email');
CREATE TYPE "ReportStatus" AS ENUM ('open', 'reviewing', 'resolved', 'dismissed');

-- Core tables
CREATE TABLE "cities" (
  "id" UUID NOT NULL,
  "country_code" VARCHAR(2) NOT NULL,
  "name" VARCHAR(120) NOT NULL,
  "slug" VARCHAR(120) NOT NULL,
  "timezone" VARCHAR(64) NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "cities_slug_key" ON "cities" ("slug");
CREATE INDEX "cities_country_code_idx" ON "cities" ("country_code");

CREATE TABLE "users" (
  "id" UUID NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "password_hash" VARCHAR(255) NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'user',
  "city_id" UUID NULL,
  "timezone" VARCHAR(64) NOT NULL DEFAULT 'America/Bogota',
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users" ("email");
CREATE INDEX "users_city_id_idx" ON "users" ("city_id");

CREATE TABLE "event_categories" (
  "id" UUID NOT NULL,
  "slug" VARCHAR(80) NOT NULL,
  "name" VARCHAR(80) NOT NULL,
  "icon" VARCHAR(120) NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "event_categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "event_categories_slug_key" ON "event_categories" ("slug");

CREATE TABLE "user_interests" (
  "user_id" UUID NOT NULL,
  "category_id" UUID NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "user_interests_pkey" PRIMARY KEY ("user_id", "category_id")
);

CREATE TABLE "organizers" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "name" VARCHAR(160) NOT NULL,
  "slug" VARCHAR(160) NOT NULL,
  "description" TEXT NULL,
  "is_verified" BOOLEAN NOT NULL DEFAULT FALSE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "organizers_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "organizers_user_id_key" ON "organizers" ("user_id");
CREATE UNIQUE INDEX "organizers_slug_key" ON "organizers" ("slug");

CREATE TABLE "venues" (
  "id" UUID NOT NULL,
  "city_id" UUID NOT NULL,
  "name" VARCHAR(180) NOT NULL,
  "address_line" VARCHAR(255) NOT NULL,
  "location" geography(Point, 4326) NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "venues_city_id_idx" ON "venues" ("city_id");

CREATE TABLE "events" (
  "id" UUID NOT NULL,
  "organizer_id" UUID NOT NULL,
  "venue_id" UUID NOT NULL,
  "category_id" UUID NOT NULL,
  "city_id" UUID NOT NULL,
  "country_code" VARCHAR(2) NOT NULL,
  "timezone" VARCHAR(64) NOT NULL,
  "title" VARCHAR(220) NOT NULL,
  "description_short" VARCHAR(500) NOT NULL,
  "description_long" TEXT NULL,
  "cover_image_url" VARCHAR(500) NOT NULL,
  "ticket_url" VARCHAR(500) NULL,
  "price_min" DECIMAL(12,2) NULL,
  "price_max" DECIMAL(12,2) NULL,
  "start_at" TIMESTAMPTZ NOT NULL,
  "end_at" TIMESTAMPTZ NULL,
  "status" "EventStatus" NOT NULL DEFAULT 'draft',
  "verification_status" "VerificationStatus" NOT NULL DEFAULT 'unverified',
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "cancelled_at" TIMESTAMPTZ NULL,
  CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "events_city_id_start_at_idx" ON "events" ("city_id", "start_at");
CREATE INDEX "events_status_start_at_idx" ON "events" ("status", "start_at");
CREATE INDEX "events_country_code_city_id_idx" ON "events" ("country_code", "city_id");

CREATE TABLE "event_dates" (
  "id" UUID NOT NULL,
  "event_id" UUID NOT NULL,
  "starts_at" TIMESTAMPTZ NOT NULL,
  "ends_at" TIMESTAMPTZ NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "event_dates_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "event_dates_event_id_starts_at_idx" ON "event_dates" ("event_id", "starts_at");

CREATE TABLE "event_media" (
  "id" UUID NOT NULL,
  "event_id" UUID NOT NULL,
  "media_url" VARCHAR(500) NOT NULL,
  "media_type" VARCHAR(40) NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "event_media_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "event_media_event_id_idx" ON "event_media" ("event_id");

CREATE TABLE "event_bookmarks" (
  "user_id" UUID NOT NULL,
  "event_id" UUID NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "event_bookmarks_pkey" PRIMARY KEY ("user_id", "event_id")
);

CREATE INDEX "event_bookmarks_event_id_idx" ON "event_bookmarks" ("event_id");

CREATE TABLE "notification_subscriptions" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "channel" "NotificationChannel" NOT NULL,
  "target" VARCHAR(255) NOT NULL,
  "is_enabled" BOOLEAN NOT NULL DEFAULT TRUE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "notification_subscriptions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "notification_subscriptions_user_id_channel_idx"
  ON "notification_subscriptions" ("user_id", "channel");

CREATE TABLE "event_reports" (
  "id" UUID NOT NULL,
  "event_id" UUID NOT NULL,
  "reporter_id" UUID NOT NULL,
  "reason" VARCHAR(255) NOT NULL,
  "details" TEXT NULL,
  "status" "ReportStatus" NOT NULL DEFAULT 'open',
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "resolved_at" TIMESTAMPTZ NULL,
  CONSTRAINT "event_reports_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "event_reports_event_id_status_idx" ON "event_reports" ("event_id", "status");

CREATE TABLE "audit_logs" (
  "id" UUID NOT NULL,
  "actor_id" UUID NOT NULL,
  "action" VARCHAR(80) NOT NULL,
  "entity" VARCHAR(80) NOT NULL,
  "entity_id" UUID NOT NULL,
  "metadata" JSONB NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "audit_logs_entity_entity_id_idx" ON "audit_logs" ("entity", "entity_id");
CREATE INDEX "audit_logs_actor_id_created_at_idx" ON "audit_logs" ("actor_id", "created_at");

-- Foreign keys
ALTER TABLE "users"
  ADD CONSTRAINT "users_city_id_fkey"
  FOREIGN KEY ("city_id") REFERENCES "cities" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "user_interests"
  ADD CONSTRAINT "user_interests_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_interests"
  ADD CONSTRAINT "user_interests_category_id_fkey"
  FOREIGN KEY ("category_id") REFERENCES "event_categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "organizers"
  ADD CONSTRAINT "organizers_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "venues"
  ADD CONSTRAINT "venues_city_id_fkey"
  FOREIGN KEY ("city_id") REFERENCES "cities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "events"
  ADD CONSTRAINT "events_organizer_id_fkey"
  FOREIGN KEY ("organizer_id") REFERENCES "organizers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "events"
  ADD CONSTRAINT "events_venue_id_fkey"
  FOREIGN KEY ("venue_id") REFERENCES "venues" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "events"
  ADD CONSTRAINT "events_category_id_fkey"
  FOREIGN KEY ("category_id") REFERENCES "event_categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "events"
  ADD CONSTRAINT "events_city_id_fkey"
  FOREIGN KEY ("city_id") REFERENCES "cities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "event_dates"
  ADD CONSTRAINT "event_dates_event_id_fkey"
  FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "event_media"
  ADD CONSTRAINT "event_media_event_id_fkey"
  FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "event_bookmarks"
  ADD CONSTRAINT "event_bookmarks_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "event_bookmarks"
  ADD CONSTRAINT "event_bookmarks_event_id_fkey"
  FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "notification_subscriptions"
  ADD CONSTRAINT "notification_subscriptions_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "event_reports"
  ADD CONSTRAINT "event_reports_event_id_fkey"
  FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "event_reports"
  ADD CONSTRAINT "event_reports_reporter_id_fkey"
  FOREIGN KEY ("reporter_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "audit_logs"
  ADD CONSTRAINT "audit_logs_actor_id_fkey"
  FOREIGN KEY ("actor_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
