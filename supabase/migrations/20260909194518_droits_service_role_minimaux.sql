-- Le schema observatoire avait ete ouvert a `authenticated` mais pas a
-- `service_role`, qui n'avait meme pas le droit d'usage du schema. Toute
-- operation serveur y echouait par "permission denied for schema observatoire" :
-- la bascule de profil en developpement, et les taches planifiees.
--
-- Les droits accordes ici sont ceux que le code utilise, table par table, et
-- rien de plus. `anon` reste volontairement exclu : l'application n'a aucune
-- partie publique.
grant usage on schema observatoire to service_role;

-- Taches planifiees : la trace d'execution (lib/taches/journaliserTache).
grant insert on observatoire.journal_acces to service_role;

-- Tache de notification : passage de EN_ATTENTE a ENVOYE ou ECHEC.
grant select, update on observatoire.notification_expiration to service_role;

-- Aide de developpement uniquement (lib/actions/dev-profil.ts), bornee au seul
-- compte designe par DEV_COMPTE_TEST_EMAIL cote applicatif.
grant select, update on observatoire.compte_institutionnel to service_role;
grant select, insert, delete on observatoire.compte_module to service_role;

-- Les quatre fonctions de tache restent le seul acces aux tables de faits :
-- elles sont SECURITY DEFINER, service_role n'a donc aucun droit direct sur
-- recherche, reservation, etablissement ni sur les vues materialisees.;
