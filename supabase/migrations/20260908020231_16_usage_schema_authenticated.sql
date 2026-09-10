-- Migration 16 : correction d'un oubli
-- Supabase route les connexions reelles via les roles internes anon/authenticated/
-- service_role, pas directement via role_institutionnel/role_admin/role_ingestion
-- (ceux-ci restent le modele conceptuel du document 3, a rattacher plus tard via
-- les claims JWT personnalisees si besoin). Sans USAGE sur le schema, PostgREST
-- refuse tout, meme un simple appel de fonction.

grant usage on schema observatoire to authenticated;
;
