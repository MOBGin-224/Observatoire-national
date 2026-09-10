-- Migration 8 : conformite et classification
-- Document 3, section 9. Document 11, rang 8.
-- Table volontairement vide au lancement, offerte au ministere.

create table observatoire.conformite_etablissement (
  id_etablissement uuid primary key references observatoire.etablissement(id),
  enregistrement_administratif boolean,
  reference_enregistrement text,
  statut_classification text,
  date_classification date,
  date_dernier_controle date,
  source text
);
alter table observatoire.conformite_etablissement enable row level security;
;
