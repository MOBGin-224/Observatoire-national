-- Migration 21 : lecture des tables de referentiel/methodologie par l'application.
-- Document 6, section 1.3 : la liste des tables interdites aux roles institutionnels
-- ne mentionne ni indicateur, ni enumeration, ni territoire, ni version_indicateur.
-- Ce sont des donnees de reference, pas des faits : necessaires a /lib/indicators
-- (document 11, section 6.4) pour resoudre libelle/unite/decimales d'un indicateur.

grant select on
  observatoire.indicateur,
  observatoire.version_indicateur,
  observatoire.enumeration,
  observatoire.territoire
to authenticated;
;
