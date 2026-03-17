ALTER TABLE "events"
  ADD COLUMN "slug" VARCHAR(220);

CREATE UNIQUE INDEX "events_slug_key" ON "events" ("slug");

ALTER TABLE "events"
  ADD CONSTRAINT "events_time_range_chk"
  CHECK ("end_at" IS NULL OR "end_at" >= "start_at");
