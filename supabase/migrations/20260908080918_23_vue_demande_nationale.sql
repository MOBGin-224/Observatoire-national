create materialized view observatoire.mv_demande_national as
with base as (
  select * from observatoire.recherche
),
effectif as (
  select count(*) as n from base
),
fiab as (
  select case
    when n >= 30 then 'CONSOLIDE'
    when n >= 10 then 'INDICATIF'
    else 'SIGNAL'
  end as niveau
  from effectif
),
budget as (
  select
    count(*) filter (where budget_max_gnf is not null) as n_avec_budget,
    percentile_cont(0.5) within group (order by budget_max_gnf)
      filter (where budget_max_gnf is not null) as mediane_budget
  from base
),
origine as (
  select coalesce(jsonb_object_agg(pays_utilisateur, n), '{}'::jsonb) as j
  from (select pays_utilisateur, count(*) n from base where pays_utilisateur is not null group by pays_utilisateur) o
),
appareil as (
  select coalesce(jsonb_object_agg(type_appareil, n), '{}'::jsonb) as j
  from (select type_appareil, count(*) n from base where type_appareil is not null group by type_appareil) a
),
canal as (
  select coalesce(jsonb_object_agg(canal, n), '{}'::jsonb) as j
  from (select canal, count(*) n from base where canal is not null group by canal) c
),
hors_ref as (
  select coalesce(jsonb_object_agg(destination_saisie, n), '{}'::jsonb) as j
  from (
    select destination_saisie, count(*) n
    from base
    where destination_non_reconnue = true and destination_saisie is not null
    group by destination_saisie
  ) d
)
select
  count(*) as dem_volume_recherches,
  percentile_cont(0.5) within group (order by (date_arrivee - horodatage::date)) as dem_booking_window,
  percentile_cont(0.5) within group (order by nb_nuits) as dem_duree_sejour_recherchee,
  (select mediane_budget from budget) as dem_budget_recherche,
  (select n_avec_budget from budget) as dem_budget_effectif,
  case when count(*) = 0 then null
       else round(100.0 * (select n_avec_budget from budget) / count(*), 1)
  end as dem_budget_part_pct,
  (select j from origine) as dem_origine_pays,
  (select j from appareil) as dem_repartition_appareil,
  (select j from canal) as dem_repartition_canal,
  (select j from hors_ref) as dem_destinations_non_reconnues,
  count(*) as effectif_echantillon,
  (select niveau from fiab) as niveau_fiabilite,
  false as masque,
  now() as calcule_a
from base;
;
