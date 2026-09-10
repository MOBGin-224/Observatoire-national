-- Migration 18 : correction d'une regression de securite introduite en migration 17.
-- security_invoker=true obligeait le role appelant (authenticated) a avoir SELECT
-- directement sur la vue materialisee brute, ce qui revenait a l'exposer sans
-- filtrage via l'API REST (les vues materialisees n'ont pas de RLS).
-- Les vues d'acces repassent en security_invoker=false (comportement par defaut) :
-- elles s'executent avec les droits du proprietaire de la vue, jamais du role
-- appelant. Le filtrage par compte/perimetre/module reste garanti car auth.uid()
-- lit une variable de session, pas les droits du role courant.

revoke select on
  observatoire.mv_offre_national,
  observatoire.mv_offre_region,
  observatoire.mv_offre_prefecture,
  observatoire.mv_offre_commune
from authenticated;

drop view observatoire.acces_offre_national;
drop view observatoire.acces_offre_region;
drop view observatoire.acces_offre_prefecture;
drop view observatoire.acces_offre_commune;

create view observatoire.acces_offre_national as
select v.*
from observatoire.mv_offre_national v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M1_OFFRE');

create view observatoire.acces_offre_region as
select v.*
from observatoire.mv_offre_region v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M1_OFFRE')
  and observatoire.territoire_visible(v.code_territoire);

create view observatoire.acces_offre_prefecture as
select v.*
from observatoire.mv_offre_prefecture v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M1_OFFRE')
  and observatoire.territoire_visible(v.code_territoire);

create view observatoire.acces_offre_commune as
select v.*
from observatoire.mv_offre_commune v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M1_OFFRE')
  and observatoire.territoire_visible(v.code_territoire);

grant select on
  observatoire.acces_offre_national,
  observatoire.acces_offre_region,
  observatoire.acces_offre_prefecture,
  observatoire.acces_offre_commune
to role_institutionnel, authenticated;
;
