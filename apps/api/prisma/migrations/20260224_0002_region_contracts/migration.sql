ALTER TABLE "cities"
  ADD CONSTRAINT "cities_country_code_len_chk"
  CHECK (char_length("country_code") = 2);

ALTER TABLE "events"
  ADD CONSTRAINT "events_country_code_len_chk"
  CHECK (char_length("country_code") = 2);

ALTER TABLE "cities"
  ADD CONSTRAINT "cities_timezone_not_empty_chk"
  CHECK (char_length(trim("timezone")) > 0);

ALTER TABLE "events"
  ADD CONSTRAINT "events_timezone_not_empty_chk"
  CHECK (char_length(trim("timezone")) > 0);

ALTER TABLE "users"
  ADD CONSTRAINT "users_timezone_not_empty_chk"
  CHECK (char_length(trim("timezone")) > 0);
