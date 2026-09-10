-- Migration 25 : vue materialisee mv_tension_national (document 4, section 5 ;
-- document 9, partie D). Niveau national uniquement, meme limite que les
-- modules precedents.
-- Point de vigilance signale a l'utilisateur : TEN_CAPACITE_MANQUANTE est calcule
-- ICI SANS le dedoublonnage par session prescrit par le document 4 (section 13,
-- point ouvert 4 : la regle exacte de dedoublonnage n'est pas encore tranchee).
-- A revoir des que ce point sera arrete.

create materialized view observatoire.mv_tension_national as
with recherches as (
  select r.*, rr.statut_resultat
  from observatoire.recherche r
  left join observatoire.resultat_recherche rr on rr.id_recherche = r.id
),
total as (
  select count(*) as n from recherches
),
echecs as (
  select * from recherches where statut_resultat is not null and statut_resultat <> 'RESULTATS_DISPONIBLES'
),
effectif_echecs as (
  select count(*) as n from echecs
),
capacite_reservable as (
  select coalesce(sum(capacite_unites), 0) as n
  from observatoire.etablissement
  where statut_relation = 'PARTENAIRE_ACTIF' and actif = true
)
select
  case when (select n from total) = 0 then null
       else round(100.0 * (select count(*) from recherches where statut_resultat is not null and statut_resultat <> 'RESULTATS_DISPONIBLES') / (select n from total), 1)
  end as ten_taux_infructueux,
  case when (select n from effectif_echecs) < 10 then null
       else (select coalesce(sum(nb_unites), 0) from echecs)
  end as ten_capacite_manquante,
  (select n from effectif_echecs) as ten_capacite_manquante_effectif,
  case when (select n from capacite_reservable) = 0 then null else 100 end as ten_indice_tension,
  (select coalesce(jsonb_object_agg(statut_resultat, n), '{}'::jsonb)
     from (
       select statut_resultat, count(*) n
       from recherches
       where statut_resultat in ('OFFRE_INDISPONIBLE', 'NON_RESERVABLE', 'AUCUNE_OFFRE', 'HORS_PERIMETRE')
       group by statut_resultat
     ) e) as ten_repartition_echec,
  (select n from total) as effectif_echantillon,
  now() as calcule_a
from (select 1) as unite_ligne;
;
