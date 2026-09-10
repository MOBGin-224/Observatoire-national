-- Migration 17 : meme correction que la migration 16, pour les vues materialisees.
-- Les vues d'acces (security_invoker) verifient les droits du role appelant reel
-- (authenticated), pas de role_institutionnel.

grant select on
  observatoire.mv_offre_national,
  observatoire.mv_offre_region,
  observatoire.mv_offre_prefecture,
  observatoire.mv_offre_commune
to authenticated;
;
