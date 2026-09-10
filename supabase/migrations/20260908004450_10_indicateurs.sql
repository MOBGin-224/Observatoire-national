-- Migration 10 : indicateurs et methodologie
-- Document 3, section 11. Document 11, rang 10.

create table observatoire.indicateur (
  code text primary key,
  libelle_fr text not null,
  libelle_en text,
  definition_fr text,
  definition_en text,
  formule text,
  unite text,
  decimales integer,
  statut_donnee text,
  regle_masquage text,
  seuil_consolide integer,
  seuil_indicatif integer,
  frequence_rafraichissement text,
  pieges text
);
alter table observatoire.indicateur enable row level security;

create table observatoire.version_indicateur (
  code_indicateur text not null references observatoire.indicateur(code),
  version text not null,
  formule text,
  date_debut date,
  date_fin date,
  primary key (code_indicateur, version)
);
alter table observatoire.version_indicateur enable row level security;
;
