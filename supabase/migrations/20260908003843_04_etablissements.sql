-- Migration 4 : etablissements
-- Document 3, section 4. Document 11, rang 4.

create or replace function observatoire.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table observatoire.etablissement (
  id uuid primary key default gen_random_uuid(),
  id_externe text,
  nom text not null,
  typologie text,
  statut_relation text,
  code_commune text references observatoire.territoire(code),
  quartier text,
  adresse_texte text,
  latitude numeric,
  longitude numeric,
  precision_geo text,
  capacite_unites integer,
  capacite_source text,
  gamme_tarifaire text,
  tarif_min_gnf integer,
  tarif_max_gnf integer,
  site_web text,
  facebook text,
  instagram text,
  reservation_en_ligne boolean,
  presence_ota text[],
  telephone_1 text,
  telephone_2 text,
  whatsapp text,
  email text,
  source_recensement text,
  statut_verification text,
  date_derniere_verification date,
  consentement_publication text,
  actif boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint capacite_requise_si_partenaire_actif
    check (statut_relation <> 'PARTENAIRE_ACTIF' or capacite_unites is not null)
);
alter table observatoire.etablissement enable row level security;

create trigger trg_etablissement_updated_at
  before update on observatoire.etablissement
  for each row execute function observatoire.set_updated_at();

create table observatoire.etablissement_equipement (
  id_etablissement uuid not null references observatoire.etablissement(id),
  code_equipement text not null,
  disponible boolean,
  capacite integer,
  source text,
  date_verification date,
  primary key (id_etablissement, code_equipement)
);
alter table observatoire.etablissement_equipement enable row level security;

create table observatoire.etablissement_historique (
  id uuid primary key default gen_random_uuid(),
  id_etablissement uuid not null references observatoire.etablissement(id),
  champ text not null,
  valeur_avant text,
  valeur_apres text,
  date_effet timestamptz not null default now()
);
alter table observatoire.etablissement_historique enable row level security;

create table observatoire.retour_terrain (
  id uuid primary key default gen_random_uuid(),
  id_etablissement uuid references observatoire.etablissement(id),
  nom_declare text,
  code_territoire text references observatoire.territoire(code),
  statut_terrain text,
  commentaire text,
  collecteur text,
  source_recensement text,
  horodatage timestamptz not null default now()
);
alter table observatoire.retour_terrain enable row level security;
;
