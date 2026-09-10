-- Migration 6 : activite observee
-- Document 3, section 8. Document 11, rang 6.
-- Aucun champ de commission, marge, frais ou moyen de paiement (document 7, interdiction 1.1).

create table observatoire.reservation (
  id uuid primary key default gen_random_uuid(),
  id_externe text,
  id_etablissement uuid not null references observatoire.etablissement(id),
  id_recherche uuid references observatoire.recherche(id),
  date_reservation timestamptz not null default now(),
  date_arrivee date,
  date_depart date,
  nb_nuits integer,
  nb_unites integer,
  montant_hebergement_gnf integer,
  pays_origine text,
  motif_sejour text,
  statut text not null check (statut in ('CONFIRMEE','ANNULEE','NON_PRESENTATION','HONOREE')),
  date_changement_statut timestamptz,
  source_donnee text
);
alter table observatoire.reservation enable row level security;

create table observatoire.inventaire_quotidien (
  id_etablissement uuid not null references observatoire.etablissement(id),
  date date not null,
  unites_disponibles integer,
  unites_vendues integer,
  tarif_moyen_gnf integer,
  etablissement_actif boolean,
  source_donnee text,
  primary key (id_etablissement, date)
);
alter table observatoire.inventaire_quotidien enable row level security;
;
