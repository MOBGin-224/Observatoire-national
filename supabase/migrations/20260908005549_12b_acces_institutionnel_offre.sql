-- Migration 12b : fonctions de controle d'acces et vues securisees pour M1_OFFRE
-- Document 6 : trois dimensions independantes (profil/module, perimetre, granularite).
-- Postgres ne supporte pas RLS sur une vue materialisee : le filtrage se fait donc
-- par des vues de securite qui enveloppent les mv_offre_*, jamais interrogees directement
-- par un role institutionnel.

create or replace function observatoire.compte_valide()
returns table (id uuid, profil text, code_territoire_perimetre text, granularite_max text)
language sql
security invoker
stable
set search_path = ''
as $$
  select c.id, c.profil, c.code_territoire_perimetre, c.granularite_max
  from observatoire.compte_institutionnel c
  where c.id = auth.uid()
    and c.statut = 'ACTIF'
    and (c.date_expiration is null or c.date_expiration >= current_date)
$$;

create or replace function observatoire.module_actif(p_code_module text)
returns boolean
language sql
security invoker
stable
set search_path = ''
as $$
  select exists (
    select 1
    from observatoire.compte_module cm
    join observatoire.compte_valide() cv on cv.id = cm.id_compte
    where cm.code_module = p_code_module and cm.actif = true
  )
$$;

-- Un territoire est visible si le perimetre du compte est national (nul),
-- ou si le territoire cible est le perimetre lui-meme ou l'une de ses communes/prefectures descendantes.
create or replace function observatoire.territoire_visible(p_code_territoire text)
returns boolean
language sql
security invoker
stable
set search_path = ''
as $$
  select exists (
    select 1
    from observatoire.compte_valide() cv
    left join observatoire.v_territoire_hierarchie h on h.code_origine = p_code_territoire
    where cv.code_territoire_perimetre is null
       or cv.code_territoire_perimetre = p_code_territoire
       or cv.code_territoire_perimetre = h.code_region
       or cv.code_territoire_perimetre = h.code_prefecture
  )
$$;

create view observatoire.acces_offre_national
with (security_invoker = true) as
select v.*
from observatoire.mv_offre_national v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M1_OFFRE');

create view observatoire.acces_offre_region
with (security_invoker = true) as
select v.*
from observatoire.mv_offre_region v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M1_OFFRE')
  and observatoire.territoire_visible(v.code_territoire);

create view observatoire.acces_offre_prefecture
with (security_invoker = true) as
select v.*
from observatoire.mv_offre_prefecture v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M1_OFFRE')
  and observatoire.territoire_visible(v.code_territoire);

create view observatoire.acces_offre_commune
with (security_invoker = true) as
select v.*
from observatoire.mv_offre_commune v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M1_OFFRE')
  and observatoire.territoire_visible(v.code_territoire);

revoke all on observatoire.mv_offre_national, observatoire.mv_offre_region, observatoire.mv_offre_prefecture, observatoire.mv_offre_commune from public;

grant select on
  observatoire.acces_offre_national,
  observatoire.acces_offre_region,
  observatoire.acces_offre_prefecture,
  observatoire.acces_offre_commune
to role_institutionnel, authenticated;
;
