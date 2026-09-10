-- Migration 11b : vues materialisees mv_offre_<niveau>
-- Document 9, partie B.4 et B.8 : aucun masquage M1 sur ce module,
-- tout s'affiche y compris a zero.

create materialized view observatoire.mv_offre_national as
select
  count(*) as off_etab_recenses,
  coalesce(sum(capacite_unites), 0) as off_capacite_recensee,
  count(*) filter (where est_partenaire) as off_etab_partenaires,
  case when coalesce(sum(capacite_unites), 0) = 0 then null
       else round(100.0 * coalesce(sum(capacite_unites) filter (where est_partenaire), 0) / sum(capacite_unites), 1)
  end as off_taux_couverture,
  case when count(*) = 0 then null else round(100.0 * count(*) filter (where a_canal_ligne) / count(*), 1) end as off_taux_numerisation,
  case when count(*) = 0 then null else round(100.0 * count(*) filter (where est_reservable_ligne) / count(*), 1) end as off_taux_reservabilite,
  case when count(*) = 0 then null else round(100.0 * count(*) filter (where est_verifie) / count(*), 1) end as off_taux_verification,
  case when count(*) = 0 then null else round(avg(completude)) end as off_completude_fiche,
  (select coalesce(jsonb_object_agg(typologie, n), '{}'::jsonb) from (select typologie, count(*) n from observatoire.v_etablissement_offre where typologie is not null group by typologie) t) as off_repartition_typologie,
  (select coalesce(jsonb_object_agg(gamme_tarifaire, n), '{}'::jsonb) from (select gamme_tarifaire, count(*) n from observatoire.v_etablissement_offre where gamme_tarifaire is not null group by gamme_tarifaire) g) as off_repartition_gamme,
  (select count(*) from observatoire.v_retour_terrain_ecart) as off_ecart_liste_admin,
  count(*) as effectif_echantillon,
  'CONSOLIDE'::text as niveau_fiabilite,
  false as masque,
  now() as calcule_a
from observatoire.v_etablissement_offre;

create materialized view observatoire.mv_offre_region as
select
  eo.code_region as code_territoire,
  count(*) as off_etab_recenses,
  coalesce(sum(eo.capacite_unites), 0) as off_capacite_recensee,
  count(*) filter (where eo.est_partenaire) as off_etab_partenaires,
  case when coalesce(sum(eo.capacite_unites), 0) = 0 then null
       else round(100.0 * coalesce(sum(eo.capacite_unites) filter (where eo.est_partenaire), 0) / sum(eo.capacite_unites), 1)
  end as off_taux_couverture,
  case when count(*) = 0 then null else round(100.0 * count(*) filter (where eo.a_canal_ligne) / count(*), 1) end as off_taux_numerisation,
  case when count(*) = 0 then null else round(100.0 * count(*) filter (where eo.est_reservable_ligne) / count(*), 1) end as off_taux_reservabilite,
  case when count(*) = 0 then null else round(100.0 * count(*) filter (where eo.est_verifie) / count(*), 1) end as off_taux_verification,
  case when count(*) = 0 then null else round(avg(eo.completude)) end as off_completude_fiche,
  (select coalesce(jsonb_object_agg(typologie, n), '{}'::jsonb) from (select typologie, count(*) n from observatoire.v_etablissement_offre i where i.code_region = eo.code_region and typologie is not null group by typologie) t) as off_repartition_typologie,
  (select coalesce(jsonb_object_agg(gamme_tarifaire, n), '{}'::jsonb) from (select gamme_tarifaire, count(*) n from observatoire.v_etablissement_offre i where i.code_region = eo.code_region and gamme_tarifaire is not null group by gamme_tarifaire) g) as off_repartition_gamme,
  (select count(*) from observatoire.v_retour_terrain_ecart r where r.code_region = eo.code_region) as off_ecart_liste_admin,
  count(*) as effectif_echantillon,
  'CONSOLIDE'::text as niveau_fiabilite,
  false as masque,
  now() as calcule_a
from observatoire.v_etablissement_offre eo
where eo.code_region is not null
group by eo.code_region;

create materialized view observatoire.mv_offre_prefecture as
select
  eo.code_prefecture as code_territoire,
  count(*) as off_etab_recenses,
  coalesce(sum(eo.capacite_unites), 0) as off_capacite_recensee,
  count(*) filter (where eo.est_partenaire) as off_etab_partenaires,
  case when coalesce(sum(eo.capacite_unites), 0) = 0 then null
       else round(100.0 * coalesce(sum(eo.capacite_unites) filter (where eo.est_partenaire), 0) / sum(eo.capacite_unites), 1)
  end as off_taux_couverture,
  case when count(*) = 0 then null else round(100.0 * count(*) filter (where eo.a_canal_ligne) / count(*), 1) end as off_taux_numerisation,
  case when count(*) = 0 then null else round(100.0 * count(*) filter (where eo.est_reservable_ligne) / count(*), 1) end as off_taux_reservabilite,
  case when count(*) = 0 then null else round(100.0 * count(*) filter (where eo.est_verifie) / count(*), 1) end as off_taux_verification,
  case when count(*) = 0 then null else round(avg(eo.completude)) end as off_completude_fiche,
  (select coalesce(jsonb_object_agg(typologie, n), '{}'::jsonb) from (select typologie, count(*) n from observatoire.v_etablissement_offre i where i.code_prefecture = eo.code_prefecture and typologie is not null group by typologie) t) as off_repartition_typologie,
  (select coalesce(jsonb_object_agg(gamme_tarifaire, n), '{}'::jsonb) from (select gamme_tarifaire, count(*) n from observatoire.v_etablissement_offre i where i.code_prefecture = eo.code_prefecture and gamme_tarifaire is not null group by gamme_tarifaire) g) as off_repartition_gamme,
  (select count(*) from observatoire.v_retour_terrain_ecart r where r.code_prefecture = eo.code_prefecture) as off_ecart_liste_admin,
  count(*) as effectif_echantillon,
  'CONSOLIDE'::text as niveau_fiabilite,
  false as masque,
  now() as calcule_a
from observatoire.v_etablissement_offre eo
where eo.code_prefecture is not null
group by eo.code_prefecture;

create materialized view observatoire.mv_offre_commune as
select
  eo.code_commune as code_territoire,
  count(*) as off_etab_recenses,
  coalesce(sum(eo.capacite_unites), 0) as off_capacite_recensee,
  count(*) filter (where eo.est_partenaire) as off_etab_partenaires,
  case when coalesce(sum(eo.capacite_unites), 0) = 0 then null
       else round(100.0 * coalesce(sum(eo.capacite_unites) filter (where eo.est_partenaire), 0) / sum(eo.capacite_unites), 1)
  end as off_taux_couverture,
  case when count(*) = 0 then null else round(100.0 * count(*) filter (where eo.a_canal_ligne) / count(*), 1) end as off_taux_numerisation,
  case when count(*) = 0 then null else round(100.0 * count(*) filter (where eo.est_reservable_ligne) / count(*), 1) end as off_taux_reservabilite,
  case when count(*) = 0 then null else round(100.0 * count(*) filter (where eo.est_verifie) / count(*), 1) end as off_taux_verification,
  case when count(*) = 0 then null else round(avg(eo.completude)) end as off_completude_fiche,
  (select coalesce(jsonb_object_agg(typologie, n), '{}'::jsonb) from (select typologie, count(*) n from observatoire.v_etablissement_offre i where i.code_commune = eo.code_commune and typologie is not null group by typologie) t) as off_repartition_typologie,
  (select coalesce(jsonb_object_agg(gamme_tarifaire, n), '{}'::jsonb) from (select gamme_tarifaire, count(*) n from observatoire.v_etablissement_offre i where i.code_commune = eo.code_commune and gamme_tarifaire is not null group by gamme_tarifaire) g) as off_repartition_gamme,
  (select count(*) from observatoire.v_retour_terrain_ecart r where r.code_commune = eo.code_commune) as off_ecart_liste_admin,
  count(*) as effectif_echantillon,
  'CONSOLIDE'::text as niveau_fiabilite,
  false as masque,
  now() as calcule_a
from observatoire.v_etablissement_offre eo
where eo.code_commune is not null
group by eo.code_commune;
;
