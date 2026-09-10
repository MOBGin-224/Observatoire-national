-- Migration 11a : vues intermediaires pour le module M1_OFFRE
-- Document 3, section 12. Document 4, section 2. Document 9, partie B.
-- Hierarchie calculee via code_parent (et non par decoupage du code),
-- pour gerer correctement le cas de Conakry qui n'a pas de niveau prefecture
-- (document 1, "Conakry est une zone speciale sans niveau prefectoral").

create or replace view observatoire.v_territoire_hierarchie as
with recursive chaine as (
  select t.code as code_origine, t.code as code_courant, t.niveau as niveau_courant, t.code_parent
  from observatoire.territoire t
  union all
  select c.code_origine, p.code, p.niveau, p.code_parent
  from chaine c
  join observatoire.territoire p on p.code = c.code_parent
)
select
  code_origine,
  max(code_courant) filter (where niveau_courant = 'REGION') as code_region,
  max(code_courant) filter (where niveau_courant = 'PREFECTURE') as code_prefecture,
  max(code_courant) filter (where niveau_courant = 'COMMUNE') as code_commune
from chaine
group by code_origine;

-- Un etablissement recense = actif et hors DOUBLON (document 4, section 1 et OFF_ETAB_RECENSES)
create or replace view observatoire.v_etablissement_offre as
select
  e.id,
  h.code_region,
  h.code_prefecture,
  h.code_commune,
  e.statut_relation,
  e.typologie,
  e.gamme_tarifaire,
  e.capacite_unites,
  (e.statut_relation = 'PARTENAIRE_ACTIF') as est_partenaire,
  (e.site_web is not null or e.facebook is not null or e.instagram is not null) as a_canal_ligne,
  coalesce(e.reservation_en_ligne, false) as est_reservable_ligne,
  (e.statut_verification in ('VERIFIE_TEL','VERIFIE_TERRAIN')) as est_verifie,
  (
    (case when e.telephone_1 is not null or e.whatsapp is not null or e.email is not null then 30 else 0 end)
    + (case when e.latitude is not null and e.longitude is not null then 20 else 0 end)
    + (case when e.tarif_min_gnf is not null and e.tarif_max_gnf is not null then 20 else 0 end)
    + (case when e.typologie is not null and e.capacite_unites is not null then 20 else 0 end)
    + (case when e.site_web is not null or e.facebook is not null or e.instagram is not null then 10 else 0 end)
  ) as completude
from observatoire.etablissement e
left join observatoire.v_territoire_hierarchie h on h.code_origine = e.code_commune
where e.actif = true and coalesce(e.statut_relation, '') <> 'DOUBLON';

-- Ecart liste administrative (document 4, OFF_ECART_LISTE_ADMIN)
create or replace view observatoire.v_retour_terrain_ecart as
select
  h.code_region,
  h.code_prefecture,
  h.code_commune
from observatoire.retour_terrain r
left join observatoire.v_territoire_hierarchie h on h.code_origine = r.code_territoire
where r.statut_terrain in ('FERME_DEFINITIF', 'INEXISTANT', 'RECLASSEMENT')
  and r.source_recensement = 'ADMINISTRATION';
;
