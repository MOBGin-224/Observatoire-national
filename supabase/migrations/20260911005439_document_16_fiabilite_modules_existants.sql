-- Document 16, section B.1 : regle transverse de fiabilite appliquee aux
-- modules deja construits.
--
-- M1_OFFRE : les quatre vues mv_offre_* portaient 'CONSOLIDE' en dur, quel que
-- soit l'effectif. Elles passent a la regle d'inventaire (30 / 10).
-- M3_ACTIVITE : aucune vue ne portait de niveau. Regle de performance (30
-- reservations et 5 etablissements, puis 10 et 3). En dessous, la valeur est
-- masquee, en plus de la regle M1 deja appliquee ; sur l'evolution mensuelle,
-- les valeurs d'un mois masque sont retirees par la vue.
-- M4_TENSION : trois niveaux. Taux infructueux et capacite manquante suivent la
-- regle de la demande ; l'indice de tension est composite (seuils propres de 50
-- et 15 recherches, document 4, croises avec l'inventaire des partenaires) et
-- herite du plus faible.

-- M1_OFFRE ------------------------------------------------------------------

drop view observatoire.acces_offre_national;
drop view observatoire.acces_offre_region;
drop view observatoire.acces_offre_prefecture;
drop view observatoire.acces_offre_commune;
drop materialized view observatoire.mv_offre_national;
drop materialized view observatoire.mv_offre_region;
drop materialized view observatoire.mv_offre_prefecture;
drop materialized view observatoire.mv_offre_commune;

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
  observatoire.niveau_fiabilite('INVENTAIRE', count(*)) as niveau_fiabilite,
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
  observatoire.niveau_fiabilite('INVENTAIRE', count(*)) as niveau_fiabilite,
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
  observatoire.niveau_fiabilite('INVENTAIRE', count(*)) as niveau_fiabilite,
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
  observatoire.niveau_fiabilite('INVENTAIRE', count(*)) as niveau_fiabilite,
  false as masque,
  now() as calcule_a
from observatoire.v_etablissement_offre eo
where eo.code_commune is not null
group by eo.code_commune;

create view observatoire.acces_offre_national as
select v.off_etab_recenses, v.off_capacite_recensee, v.off_etab_partenaires, v.off_taux_couverture,
       v.off_taux_numerisation, v.off_taux_reservabilite, v.off_taux_verification, v.off_completude_fiche,
       v.off_repartition_typologie, v.off_repartition_gamme, v.off_ecart_liste_admin,
       v.effectif_echantillon, v.niveau_fiabilite, v.masque, v.calcule_a
from observatoire.mv_offre_national v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M1_OFFRE');

create view observatoire.acces_offre_region as
select v.code_territoire, v.off_etab_recenses, v.off_capacite_recensee, v.off_etab_partenaires, v.off_taux_couverture,
       v.off_taux_numerisation, v.off_taux_reservabilite, v.off_taux_verification, v.off_completude_fiche,
       v.off_repartition_typologie, v.off_repartition_gamme, v.off_ecart_liste_admin,
       v.effectif_echantillon, v.niveau_fiabilite, v.masque, v.calcule_a
from observatoire.mv_offre_region v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M1_OFFRE')
  and observatoire.territoire_visible(v.code_territoire);

create view observatoire.acces_offre_prefecture as
select v.code_territoire, v.off_etab_recenses, v.off_capacite_recensee, v.off_etab_partenaires, v.off_taux_couverture,
       v.off_taux_numerisation, v.off_taux_reservabilite, v.off_taux_verification, v.off_completude_fiche,
       v.off_repartition_typologie, v.off_repartition_gamme, v.off_ecart_liste_admin,
       v.effectif_echantillon, v.niveau_fiabilite, v.masque, v.calcule_a
from observatoire.mv_offre_prefecture v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M1_OFFRE')
  and observatoire.territoire_visible(v.code_territoire);

create view observatoire.acces_offre_commune as
select v.code_territoire, v.off_etab_recenses, v.off_capacite_recensee, v.off_etab_partenaires, v.off_taux_couverture,
       v.off_taux_numerisation, v.off_taux_reservabilite, v.off_taux_verification, v.off_completude_fiche,
       v.off_repartition_typologie, v.off_repartition_gamme, v.off_ecart_liste_admin,
       v.effectif_echantillon, v.niveau_fiabilite, v.masque, v.calcule_a
from observatoire.mv_offre_commune v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M1_OFFRE')
  and observatoire.territoire_visible(v.code_territoire);

grant select on observatoire.acces_offre_national, observatoire.acces_offre_region,
                observatoire.acces_offre_prefecture, observatoire.acces_offre_commune
  to authenticated, role_institutionnel;

-- M3_ACTIVITE ---------------------------------------------------------------
-- Colonnes identiques en tete, niveau ajoute en fin : les vues d'acces se
-- remplacent sans toucher aux vues materialisees.

create or replace view observatoire.acces_activite_national as
select v.act_reservations, v.act_nuitees, v.act_taux_occupation, v.act_taux_occupation_contractualise,
       v.act_adr, v.act_revpar, v.act_alos, v.act_lead_time, v.act_taux_annulation,
       v.act_taux_non_presentation, v.act_taux_conversion,
       (v.act_masque
         or observatoire.niveau_fiabilite('PERFORMANCE', v.act_reservations, v.act_effectif_partenaires) is null
       ) as act_masque,
       v.act_effectif_partenaires, v.act_effectif_recherches, v.calcule_a,
       observatoire.niveau_fiabilite('PERFORMANCE', v.act_reservations, v.act_effectif_partenaires) as niveau_fiabilite
from observatoire.mv_activite_national v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M3_ACTIVITE');

create or replace view observatoire.acces_activite_evolution as
with m as (
  select v.*,
         (v.masque
           or observatoire.niveau_fiabilite('PERFORMANCE', v.act_reservations, v.effectif_echantillon) is null
         ) as masque_mois
  from observatoire.mv_activite_evolution v
)
select m.mois, m.debut_mois, m.act_reservations, m.act_nuitees,
       case when m.masque_mois then null else m.act_adr end as act_adr,
       case when m.masque_mois then null else m.act_revpar end as act_revpar,
       case when m.masque_mois then null else m.act_taux_occupation_contractualise end as act_taux_occupation_contractualise,
       m.masque_mois as masque,
       m.effectif_echantillon, m.calcule_a,
       observatoire.niveau_fiabilite('PERFORMANCE', m.act_reservations, m.effectif_echantillon) as niveau_fiabilite
from m
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M3_ACTIVITE');

-- M4_TENSION ----------------------------------------------------------------

drop view observatoire.acces_tension_national;
drop materialized view observatoire.mv_tension_national;

create materialized view observatoire.mv_tension_national as
with recherches as (
  select r.id, r.nb_unites, rr.statut_resultat
  from observatoire.recherche r
  left join observatoire.resultat_recherche rr on rr.id_recherche = r.id
), total as (
  select count(*) as n from recherches
), echecs as (
  select id, nb_unites, statut_resultat
  from recherches
  where statut_resultat is not null and statut_resultat <> 'RESULTATS_DISPONIBLES'
), effectif_echecs as (
  select count(*) as n from echecs
), partenaires as (
  select count(*) as n, coalesce(sum(capacite_unites), 0::bigint) as capacite
  from observatoire.etablissement
  where statut_relation = 'PARTENAIRE_ACTIF' and actif = true
)
select
  case when (select n from total) = 0 then null::numeric
       else round(100.0 * (select n from effectif_echecs) / (select n from total), 1)
  end as ten_taux_infructueux,
  case when (select n from effectif_echecs) < 10 then null::bigint
       else (select coalesce(sum(nb_unites), 0::bigint) from echecs)
  end as ten_capacite_manquante,
  (select n from effectif_echecs) as ten_capacite_manquante_effectif,
  case when (select capacite from partenaires) = 0 then null::integer else 100 end as ten_indice_tension,
  (select coalesce(jsonb_object_agg(e.statut_resultat, e.n), '{}'::jsonb)
     from (select statut_resultat, count(*) as n
           from recherches
           where statut_resultat in ('OFFRE_INDISPONIBLE', 'NON_RESERVABLE', 'AUCUNE_OFFRE', 'HORS_PERIMETRE')
           group by statut_resultat) e
  ) as ten_repartition_echec,
  (select n from total) as effectif_echantillon,
  now() as calcule_a,
  (select n from partenaires) as ten_effectif_partenaires,
  observatoire.niveau_fiabilite('DEMANDE', (select n from total)) as niveau_fiabilite,
  observatoire.niveau_fiabilite('DEMANDE', (select n from effectif_echecs)) as ten_capacite_manquante_fiabilite,
  case when (select capacite from partenaires) = 0 then null
       else observatoire.fiabilite_la_plus_faible(
         case when (select n from total) >= 50 then 'CONSOLIDE'
              when (select n from total) >= 15 then 'INDICATIF'
              else 'SIGNAL' end,
         observatoire.niveau_fiabilite('INVENTAIRE', (select n from partenaires))
       )
  end as ten_indice_fiabilite
from (select 1) as unite_ligne;

create view observatoire.acces_tension_national as
select v.ten_taux_infructueux, v.ten_capacite_manquante, v.ten_capacite_manquante_effectif, v.ten_indice_tension,
       v.ten_repartition_echec, v.effectif_echantillon, v.calcule_a,
       v.niveau_fiabilite, v.ten_capacite_manquante_fiabilite, v.ten_indice_fiabilite
from observatoire.mv_tension_national v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M4_TENSION');

grant select on observatoire.acces_tension_national to authenticated, role_institutionnel;
