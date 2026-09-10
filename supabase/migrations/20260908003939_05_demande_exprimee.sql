-- Migration 5 : demande exprimee
-- Document 3, section 5. Document 11, rang 5.
-- Rappel document 7 : adresse reseau brute jamais stockee (seul le pays derive l'est),
-- position navigateur stockee mais jamais publiee sous le niveau pays.

create table observatoire.recherche (
  id uuid primary key default gen_random_uuid(),
  id_session text,
  horodatage timestamptz not null default now(),
  destination_saisie text,
  code_territoire_normalise text references observatoire.territoire(code),
  destination_non_reconnue boolean,
  date_arrivee date,
  date_depart date,
  nb_nuits integer,
  nb_voyageurs integer,
  nb_unites integer,
  budget_min_gnf integer,
  budget_max_gnf integer,
  typologie_filtree text,
  motif_sejour text,
  pays_utilisateur text,
  geo_fine_lat numeric,
  geo_fine_lng numeric,
  type_appareil text,
  langue_interface text,
  canal text,
  source_trafic text,
  utilisateur_connecte boolean,
  source_donnee text
);
alter table observatoire.recherche enable row level security;

create table observatoire.resultat_recherche (
  id_recherche uuid primary key references observatoire.recherche(id),
  nb_resultats_total integer,
  nb_resultats_disponibles integer,
  nb_etablissements_recenses_zone integer,
  statut_resultat text
);
alter table observatoire.resultat_recherche enable row level security;

create table observatoire.consultation_etablissement (
  id uuid primary key default gen_random_uuid(),
  id_recherche uuid references observatoire.recherche(id),
  id_etablissement uuid references observatoire.etablissement(id),
  position_liste integer,
  horodatage timestamptz not null default now()
);
alter table observatoire.consultation_etablissement enable row level security;
;
