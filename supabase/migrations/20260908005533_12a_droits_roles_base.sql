-- Migration 12a : droits de base des trois roles
-- Document 3, section 13. Document 6, section 11.

-- role_admin : lecture et ecriture sur tout le schema applicatif
grant select, insert, update, delete on all tables in schema observatoire to role_admin;
alter default privileges in schema observatoire grant select, insert, update, delete on tables to role_admin;

-- role_ingestion : ecriture seule sur les tables de faits alimentees par la plateforme, aucune lecture
grant insert, update on
  observatoire.etablissement,
  observatoire.etablissement_equipement,
  observatoire.etablissement_historique,
  observatoire.retour_terrain,
  observatoire.recherche,
  observatoire.resultat_recherche,
  observatoire.consultation_etablissement,
  observatoire.reservation,
  observatoire.inventaire_quotidien,
  observatoire.demande_institutionnelle
to role_ingestion;

-- role_institutionnel : aucun droit sur les tables de base, seulement sur des vues d'acces
-- creees en migration 12b (document 6, section 1.3 : jamais les tables de faits).
;
