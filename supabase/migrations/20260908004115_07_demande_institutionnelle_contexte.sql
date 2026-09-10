-- Migration 7 : demande institutionnelle et contexte
-- Document 3, sections 6 et 7. Document 11, rang 7.
-- id_institution sans FK pour l'instant : la table institution arrive en migration 9.

create table observatoire.demande_institutionnelle (
  id uuid primary key default gen_random_uuid(),
  libelle text,
  id_institution uuid,
  organisation_declarante text,
  type_demande text,
  code_territoire text references observatoire.territoire(code),
  date_debut date,
  date_fin date,
  nb_personnes integer,
  nb_unites_demandees integer,
  gamme_souhaitee text,
  besoin_salle boolean,
  capacite_salle_requise integer,
  nb_unites_couvertes integer,
  statut text,
  date_declaration date,
  source text,
  notes text
);
alter table observatoire.demande_institutionnelle enable row level security;

create table observatoire.evenement_calendrier (
  id uuid primary key default gen_random_uuid(),
  libelle text not null,
  type_evenement text,
  portee text,
  code_territoire text references observatoire.territoire(code),
  date_debut date,
  date_fin date,
  recurrence text check (recurrence in ('PONCTUEL','ANNUEL')),
  description text,
  source text,
  created_at timestamptz not null default now()
);
alter table observatoire.evenement_calendrier enable row level security;
;
