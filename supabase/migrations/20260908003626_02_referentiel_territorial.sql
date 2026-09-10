-- Migration 2 : referentiel territorial
-- Document 3, section 2. Document 11, rang 2.
-- Les FK vers la future table enumeration seront ajoutees en migration 3,
-- une fois cette table creee (colonnes niveau, nature, etat_route,
-- praticabilite_saison_pluies restent en text simple pour l'instant).

create table observatoire.version_decoupage (
  code text primary key,
  libelle text not null,
  source text,
  date_effet date,
  courante boolean not null default false
);
alter table observatoire.version_decoupage enable row level security;

create table observatoire.territoire (
  code text primary key,
  niveau text not null,
  libelle text not null,
  code_parent text references observatoire.territoire(code),
  nature text,
  version_decoupage text not null references observatoire.version_decoupage(code),
  code_equivalent_anterieur text,
  actif boolean not null default true
);
alter table observatoire.territoire enable row level security;

create table observatoire.territoire_variante (
  id uuid primary key default gen_random_uuid(),
  code_territoire text not null references observatoire.territoire(code),
  variante text not null
);
alter table observatoire.territoire_variante enable row level security;

create table observatoire.territoire_geometrie (
  code_territoire text primary key references observatoire.territoire(code),
  geometrie jsonb,
  centroide_lat numeric,
  centroide_lng numeric,
  source text,
  version_decoupage text references observatoire.version_decoupage(code)
);
alter table observatoire.territoire_geometrie enable row level security;

create table observatoire.territoire_accessibilite (
  code_territoire text primary key references observatoire.territoire(code),
  distance_conakry_km integer,
  temps_trajet_conakry_min integer,
  etat_route text,
  praticabilite_saison_pluies text,
  infrastructures_transport text[],
  aeroport_le_plus_proche text,
  distance_aeroport_km integer,
  source text,
  date_maj date
);
alter table observatoire.territoire_accessibilite enable row level security;
;
