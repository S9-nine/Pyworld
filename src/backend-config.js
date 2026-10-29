/* Online backend settings (Supabase). The project URL and the public anon / publishable key are safe
   in website code: the Row Level Security rules in supabase/schema.sql decide what each player can
   read and write. Never put the service_role or secret key here, or anywhere in this repo.
   Leave url empty and the game plays fully offline, saving in the browser only. */
const CQ_BACKEND = {
  url: "https://uivurucifxyrfzasqnqz.supabase.co",
  key: "sb_publishable_obNKyewOHnxhyjCSnKwKIw_CbjJYK-p",
  // Where players send privacy and safety questions (shown in the Privacy Policy and Terms). This repo is
  // public, so use an address made for the game, not a personal one. Empty = the in-game Feedback button.
  contact: ""
};
