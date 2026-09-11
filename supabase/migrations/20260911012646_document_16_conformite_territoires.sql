-- Document 16, sections B.1 et D.2 ; document 9 quater, partie L.
-- Zone 4 : preparation a la classification, sur le seul recensement.
-- Zone 5 : ecart entre liste administrative et terrain, par statut.
-- Zones 1, 2, 3 et 6 : donnees administratives transmises, par region et par
-- categorie. Vides tant qu'aucune transmission n'a eu lieu (L.7), jamais a zero.

-- v_retour_terrain_ecart gagne le statut terrain en derniere colonne : les
-- vues de l'offre qui la lisent ne sont pas touchees.
create or replace view observatoire.v_retour_terrain_ecart as
select h.code_region, h.code_prefecture, h.code_commune, r.statut_terrain
from observatoire.retour_terrain r
left join observatoire.v_territoire_hierarchie h on h.code_origine = r.code_territoire
where r.statut_terrain in ('FERME_DEFINITIF', 'INEXISTANT', 'RECLASSEMENT')
  and r.source_recensement = 'ADMINISTRATION';

-- Une ligne par etablissement recense, sur le perimetre de l'offre. Vue interne.
--
-- Fiche complete : les quatre composantes de OFF_COMPLETUDE_FICHE qui
-- conditionnent une classification (document 9 quater, L.6) : coordonnees,
-- localisation, tarifs, typologie et capacite, avec les memes criteres que le
-- score de completude. La presence en ligne n'en fait pas partie.
-- Pret pour classification : fiche complete et verifiee.
create view observatoire.v_conformite_etablissement as
select
  eo.id,
  eo.code_region,
  eo.typologie,
  eo.gamme_tarifaire,
  eo.est_verifie,
  (    (e.telephone_1 is not null or e.whatsapp is not null or e.email is not null)
   and e.latitude is not null and e.longitude is not null
   and e.tarif_min_gnf is not null and e.tarif_max_gnf is not null
   and e.typologie is not null and e.capacite_unites is not null
  ) as fiche_complete,
  (c.id_etablissement is not null) as transmis,
  coalesce(c.enregistrement_administratif, false) as enregistre,
  (c.statut_classification is not null) as classe,
  c.source as source_transmission,
  c.date_dernier_controle
from observatoire.v_etablissement_offre eo
join observatoire.etablissement e on e.id = eo.id
left join observatoire.conformite_etablissement c on c.id_etablissement = eo.id;

revoke all on observatoire.v_conformite_etablissement from authenticated, anon;

drop view observatoire.acces_conformite_national;
drop materialized view observatoire.mv_conformite_national;

-- CONF_TAUX_* rapportes aux etablissements recenses, comme le prescrit le
-- document 4, section 8, et non aux seuls etablissements transmis : une
-- transmission partielle laisse les autres "non documentes", pas absents du
-- denominateur.
create materialized view observatoire.mv_conformite_national as
with base as (
  select * from observatoire.v_conformite_etablissement
), effectifs as (
  select
    count(*) as recenses,
    count(*) filter (where transmis) as transmis,
    count(*) filter (where enregistre) as enregistres,
    count(*) filter (where classe) as classes,
    count(*) filter (where fiche_complete) as completes,
    count(*) filter (where est_verifie) as verifiees,
    count(*) filter (where fiche_complete and est_verifie) as prets
  from base
), ecart as (
  select statut_terrain from observatoire.v_retour_terrain_ecart
)
select
  f.recenses as off_etab_recenses,
  f.transmis as conf_effectif_transmission,
  case when f.transmis = 0 or f.recenses = 0 then null
       else round(100.0 * f.enregistres / f.recenses, 1) end as conf_taux_enregistrement,
  case when f.transmis = 0 or f.recenses = 0 then null
       else round(100.0 * f.classes / f.recenses, 1) end as conf_taux_classification,
  case when f.transmis = 0 then null else f.recenses - f.enregistres end as conf_ecart_enregistrement,
  case when f.transmis = 0 then null else f.enregistres end as conf_enregistres,
  case when f.transmis = 0 then null else f.classes end as conf_classes,
  f.completes as conf_fiches_completes,
  f.verifiees as conf_fiches_verifiees,
  f.prets as conf_etab_prets_classification,
  (select count(*) from ecart where statut_terrain = 'FERME_DEFINITIF') as conf_ecart_fermes,
  (select count(*) from ecart where statut_terrain = 'INEXISTANT') as conf_ecart_inexistants,
  (select count(*) from ecart where statut_terrain = 'RECLASSEMENT') as conf_ecart_reclasses,
  (select count(*) from ecart) as off_ecart_liste_admin,
  (select string_agg(distinct source_transmission, ', ' order by source_transmission)
     from base where transmis) as conf_sources,
  (select max(date_dernier_controle) from base where transmis) as conf_date_donnees,
  f.recenses as effectif_echantillon,
  -- Indicateurs administratifs : effectif des etablissements transmis.
  case when f.transmis = 0 then null
       else observatoire.niveau_fiabilite('INVENTAIRE', f.transmis) end as niveau_fiabilite,
  -- Zones 4 et 5, et volume recense : effectif du recensement.
  observatoire.niveau_fiabilite('INVENTAIRE', f.recenses) as fiabilite_recensement,
  now() as calcule_a
from effectifs f;

-- Toutes les regions du referentiel, y compris celles sans etablissement ni
-- ecart : un territoire vide se voit.
create materialized view observatoire.mv_conformite_region as
with etab as (
  select
    code_region,
    count(*) as recenses,
    count(*) filter (where fiche_complete) as completes,
    count(*) filter (where est_verifie) as verifiees,
    count(*) filter (where fiche_complete and est_verifie) as prets,
    count(*) filter (where transmis) as transmis,
    count(*) filter (where enregistre) as enregistres,
    count(*) filter (where classe) as classes
  from observatoire.v_conformite_etablissement
  where code_region is not null
  group by code_region
), ecart as (
  select
    code_region,
    count(*) filter (where statut_terrain = 'FERME_DEFINITIF') as fermes,
    count(*) filter (where statut_terrain = 'INEXISTANT') as inexistants,
    count(*) filter (where statut_terrain = 'RECLASSEMENT') as reclasses,
    count(*) as total
  from observatoire.v_retour_terrain_ecart
  where code_region is not null
  group by code_region
), transmission_nationale as (
  select count(*) filter (where transmis) as n from observatoire.v_conformite_etablissement
)
select
  t.code as code_territoire,
  coalesce(e.recenses, 0) as off_etab_recenses,
  coalesce(e.completes, 0) as conf_fiches_completes,
  coalesce(e.verifiees, 0) as conf_fiches_verifiees,
  coalesce(e.prets, 0) as conf_etab_prets_classification,
  coalesce(x.fermes, 0) as conf_ecart_fermes,
  coalesce(x.inexistants, 0) as conf_ecart_inexistants,
  coalesce(x.reclasses, 0) as conf_ecart_reclasses,
  coalesce(x.total, 0) as off_ecart_liste_admin,
  coalesce(e.transmis, 0) as conf_effectif_transmission,
  case when (select n from transmission_nationale) = 0 then null else coalesce(e.enregistres, 0) end as conf_enregistres,
  case when (select n from transmission_nationale) = 0 then null else coalesce(e.classes, 0) end as conf_classes,
  case when (select n from transmission_nationale) = 0 or coalesce(e.recenses, 0) = 0 then null
       else round(100.0 * e.enregistres / e.recenses, 1) end as conf_taux_enregistrement,
  case when (select n from transmission_nationale) = 0 then null
       else coalesce(e.recenses, 0) - coalesce(e.enregistres, 0) end as conf_ecart_enregistrement,
  observatoire.niveau_fiabilite('INVENTAIRE', coalesce(e.recenses, 0)) as fiabilite_recensement,
  case when coalesce(e.transmis, 0) = 0 then null
       else observatoire.niveau_fiabilite('INVENTAIRE', e.transmis) end as niveau_fiabilite,
  now() as calcule_a
from observatoire.territoire t
left join etab e on e.code_region = t.code
left join ecart x on x.code_region = t.code
where t.niveau = 'REGION' and t.actif = true;

create materialized view observatoire.mv_conformite_croisements as
with transmission_nationale as (
  select count(*) filter (where transmis) as n from observatoire.v_conformite_etablissement
), lignes as (
  select 'TYPOLOGIE'::text as dimension, typologie as code, transmis, enregistre, classe
  from observatoire.v_conformite_etablissement
  where typologie is not null
  union all
  select 'GAMME'::text, gamme_tarifaire, transmis, enregistre, classe
  from observatoire.v_conformite_etablissement
  where gamme_tarifaire is not null
)
select
  dimension,
  code,
  count(*) as off_etab_recenses,
  count(*) filter (where transmis) as conf_effectif_transmission,
  case when (select n from transmission_nationale) = 0 then null
       else count(*) filter (where enregistre) end as conf_enregistres,
  case when (select n from transmission_nationale) = 0 then null
       else count(*) filter (where classe) end as conf_classes,
  case when count(*) filter (where transmis) = 0 then null
       else observatoire.niveau_fiabilite('INVENTAIRE', count(*) filter (where transmis)) end as niveau_fiabilite,
  now() as calcule_a
from lignes
group by dimension, code;

create view observatoire.acces_conformite_national as
select v.off_etab_recenses, v.conf_effectif_transmission, v.conf_taux_enregistrement,
       v.conf_taux_classification, v.conf_ecart_enregistrement, v.conf_enregistres, v.conf_classes,
       v.conf_fiches_completes, v.conf_fiches_verifiees, v.conf_etab_prets_classification,
       v.conf_ecart_fermes, v.conf_ecart_inexistants, v.conf_ecart_reclasses, v.off_ecart_liste_admin,
       v.conf_sources, v.conf_date_donnees, v.effectif_echantillon,
       v.niveau_fiabilite, v.fiabilite_recensement, v.calcule_a
from observatoire.mv_conformite_national v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M5_CONFORMITE');

create view observatoire.acces_conformite_region as
select v.code_territoire, v.off_etab_recenses, v.conf_fiches_completes, v.conf_fiches_verifiees,
       v.conf_etab_prets_classification, v.conf_ecart_fermes, v.conf_ecart_inexistants,
       v.conf_ecart_reclasses, v.off_ecart_liste_admin, v.conf_effectif_transmission,
       v.conf_enregistres, v.conf_classes, v.conf_taux_enregistrement, v.conf_ecart_enregistrement,
       v.fiabilite_recensement, v.niveau_fiabilite, v.calcule_a
from observatoire.mv_conformite_region v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M5_CONFORMITE')
  and observatoire.territoire_visible(v.code_territoire);

create view observatoire.acces_conformite_croisements as
select v.dimension, v.code, v.off_etab_recenses, v.conf_effectif_transmission,
       v.conf_enregistres, v.conf_classes, v.niveau_fiabilite, v.calcule_a
from observatoire.mv_conformite_croisements v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M5_CONFORMITE');

grant select on observatoire.acces_conformite_national, observatoire.acces_conformite_region,
                observatoire.acces_conformite_croisements
  to authenticated, role_institutionnel;
