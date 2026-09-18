-- Document 17, partie A. Reparation du trou de migration.
--
-- Trois objets vivaient en base sans exister dans aucun fichier de migration :
-- mv_evenementiel_national, sa vue d'acces acces_evenementiel_national, et
-- mv_activite_national. Un deploiement sur base neuve produisait un schema
-- incomplet : l'ecran de synthese echouait a la lecture de la vue d'acces
-- evenementielle, et l'ecran M3_ACTIVITE a celle de son instantane national.
--
-- Le document 17 n'en signalait que deux. Le troisieme a ete trouve par le
-- script de controle de la partie A.3, des sa premiere execution, la ou le
-- croisement fait a la main l'avait ecarte a tort.
--
-- Cette migration recree les deux objets a l'identique de ce qui existe en
-- base. Elle est donc sans effet sur la base courante, ou les deux objets
-- sont deja presents : c'est le sens des clauses "if not exists" et "or
-- replace". Sur une base neuve, elle comble le trou.
--
-- Le contenu ci-dessous est la transcription fidele de la definition relevee
-- en base par pg_get_viewdef. Les deux CTE d'etablissements y selectionnaient
-- toutes les colonnes de la table ; seules l'identite et la capacite sont
-- lues, elles sont donc reduites ici sans changer le resultat.

-- ---------------------------------------------------------------------------
-- Instantane national du module evenementiel (M7).
-- Aucune fenetre temporelle : le vendu est celui de toutes les arrivees a
-- venir. La fenetre de 90 jours prescrite par le document 17 partie C fait
-- l'objet de la migration suivante, pour que la reparation du trou reste
-- separable de la modification de comportement.
-- ---------------------------------------------------------------------------
create materialized view if not exists observatoire.mv_evenementiel_national as
with partenaires as (
  select id, capacite_unites
  from observatoire.etablissement
  where statut_relation = 'PARTENAIRE_ACTIF'
    and actif = true
),
recenses_non_partenaires as (
  select id, capacite_unites
  from observatoire.etablissement
  where statut_relation <> 'PARTENAIRE_ACTIF'
    and statut_relation <> 'DOUBLON'
    and actif = true
),
capacite_vendue as (
  select coalesce(sum(r.nb_unites), 0::bigint) as n
  from observatoire.reservation r
  join partenaires p on p.id = r.id_etablissement
  where r.statut = any (array['CONFIRMEE', 'HONOREE'])
    and r.date_arrivee >= current_date
),
salles as (
  select ee.id_etablissement, ee.capacite
  from observatoire.etablissement_equipement ee
  join observatoire.etablissement e on e.id = ee.id_etablissement
  where ee.code_equipement = 'SALLE_REUNION'
    and coalesce(ee.disponible, false)
    and e.actif = true
),
demandes_futures as (
  select nb_unites_demandees, nb_unites_couvertes
  from observatoire.demande_institutionnelle
  where date_fin >= current_date
     or date_fin is null
),
evenements_futurs as (
  select id
  from observatoire.evenement_calendrier
  where date_fin >= current_date
),
-- Les agregats sont nommes une fois pour que la capacite mobilisable et le
-- taux de tension ne recalculent pas les memes sommes.
socle as (
  select
    coalesce((select sum(capacite_unites) from partenaires), 0::bigint)
      as capacite_partenaires,
    coalesce((select sum(capacite_unites) from recenses_non_partenaires), 0::bigint)
      as capacite_non_partenaire,
    (select n from capacite_vendue) as vendu,
    (select count(*) from salles) as nb_etab_salles,
    coalesce((select sum(capacite) from salles), 0::bigint) as capacite_salles,
    (select count(*) from demandes_futures) as effectif_demandes,
    coalesce((select sum(nb_unites_demandees) from demandes_futures), 0::bigint)
      as volume_demande,
    (select sum(nb_unites_couvertes) from demandes_futures) as volume_couvert,
    (select sum(nb_unites_demandees) from demandes_futures) as volume_demande_brut,
    (select count(*) from evenements_futurs) as effectif_evenements
)
select
  capacite_partenaires as eve_capacite_partenaires,
  capacite_non_partenaire as eve_capacite_recensee_non_partenaire,
  greatest(0::bigint, capacite_partenaires - vendu) as eve_capacite_mobilisable,
  nb_etab_salles as eve_nb_etab_salles,
  capacite_salles as eve_capacite_salles,
  effectif_demandes as eve_effectif_demandes,
  volume_demande as ins_volume_demande,
  -- Regle M1 : en dessous de trois demandes, le taux de couverture n'est pas
  -- publie.
  case
    when effectif_demandes < 3 then null::numeric
    else round(
      100.0 * coalesce(volume_couvert, 0::bigint)::numeric
        / nullif(volume_demande_brut, 0)::numeric,
      1)
  end as ins_taux_couverture,
  case
    when greatest(0::bigint, capacite_partenaires - vendu) = 0 then null::numeric
    else round(
      100.0 * volume_demande::numeric
        / greatest(0::bigint, capacite_partenaires - vendu)::numeric,
      0)
  end as eve_taux_tension_evenement,
  effectif_evenements as eve_effectif_evenements,
  now() as calcule_a
from socle;

-- ---------------------------------------------------------------------------
-- Instantane national du module activite (M3).
--
-- Troisieme objet du meme trou, trouve par le script de controle et non par
-- le croisement fait a la main : mv_activite_national n'est cree par aucune
-- migration, et n'apparait dans le depot que dans un commentaire et dans la
-- vue d'acces qui la lit. Le controle automatique de la partie A.3 justifie
-- son existence des sa premiere execution.
--
-- La periode de reference part du 1er janvier 2026, date ecrite en dur dans
-- la definition relevee en base. Elle est conservee telle quelle ici : la
-- reparation restaure l'existant, elle ne le corrige pas. Cette date est un
-- parametre qui devrait vivre dans /lib/config selon le document 13 section
-- 13 ; c'est signale, non traite.
-- ---------------------------------------------------------------------------
create materialized view if not exists observatoire.mv_activite_national as
with partenaires as (
  select id, capacite_unites
  from observatoire.etablissement
  where statut_relation = 'PARTENAIRE_ACTIF'
    and actif = true
),
effectif as (
  select count(*) as n,
         coalesce(sum(capacite_unites), 0::bigint) as capacite_totale,
         coalesce(max(capacite_unites), 0) as capacite_max
  from partenaires
),
toutes_reservations as (
  select r.date_reservation, r.date_arrivee, r.nb_nuits, r.nb_unites,
         r.montant_hebergement_gnf, r.statut, r.id_recherche
  from observatoire.reservation r
  join partenaires p on p.id = r.id_etablissement
),
reservations_valides as (
  select * from toutes_reservations where statut <> 'ANNULEE'
),
-- Compte toutes les lignes d'inventaire, sans restriction aux partenaires :
-- sert uniquement a distinguer "aucun inventaire collecte" de "inventaire
-- collecte mais aucune unite disponible".
inventaire_dispo as (
  select count(*) as n from observatoire.inventaire_quotidien
),
inv_agg as (
  select coalesce(sum(iq.unites_disponibles), 0::bigint) as disponibles,
         coalesce(sum(iq.unites_vendues), 0::bigint) as vendues
  from observatoire.inventaire_quotidien iq
  join partenaires p on p.id = iq.id_etablissement
  where iq.etablissement_actif is distinct from false
),
honorees as (
  select * from reservations_valides where statut = 'HONOREE'
),
nuitees_agg as (
  select coalesce(sum(nb_nuits * nb_unites), 0::bigint) as nuitees,
         coalesce(sum(montant_hebergement_gnf), 0::bigint) as revenu
  from honorees
),
jours_periode as (
  select greatest(1, current_date - date '2026-01-01') as n
),
-- Regle M1, calculee en base : c'est la vue qui rend le verdict de masquage,
-- jamais l'application.
masque_calc as (
  select (select n from effectif) < 3
      or (select capacite_max from effectif)::numeric
         > ((select capacite_totale from effectif))::numeric * 0.5
    as masque
),
recherches_total as (
  select count(*) as n from observatoire.recherche
)
select
  (select n from effectif) as act_effectif_partenaires,
  (select masque from masque_calc) as act_masque,
  (select count(*) from reservations_valides) as act_reservations,
  (select nuitees from nuitees_agg) as act_nuitees,
  case
    when (select n from inventaire_dispo) = 0 then null::numeric
    when (select disponibles from inv_agg) = 0 then null::numeric
    else round(100.0 * (select vendues from inv_agg)::numeric
               / (select disponibles from inv_agg)::numeric, 1)
  end as act_taux_occupation,
  case
    when (select capacite_totale from effectif) = 0 then null::numeric
    else round(100.0 * (select nuitees from nuitees_agg)::numeric
               / ((select capacite_totale from effectif)
                  * (select n from jours_periode))::numeric, 1)
  end as act_taux_occupation_contractualise,
  case
    when (select nuitees from nuitees_agg) = 0 then null::numeric
    else round((select revenu from nuitees_agg)::numeric
               / (select nuitees from nuitees_agg)::numeric, 0)
  end as act_adr,
  case
    when (select capacite_totale from effectif) = 0 then null::numeric
    else round((select revenu from nuitees_agg)::numeric
               / ((select capacite_totale from effectif)
                  * (select n from jours_periode))::numeric, 0)
  end as act_revpar,
  -- Mediane, jamais moyenne : document 4 et vocabulaire impose.
  (select percentile_cont(0.5::double precision)
     within group (order by (nb_nuits::double precision))
   from honorees) as act_alos,
  (select percentile_cont(0.5::double precision)
     within group (order by ((date_arrivee - date_reservation::date)::double precision))
   from toutes_reservations
   where date_arrivee is not null) as act_lead_time,
  case
    when (select count(*) from toutes_reservations) = 0 then null::numeric
    else round(100.0 * (select count(*) from toutes_reservations
                        where statut = 'ANNULEE')::numeric
               / (select count(*) from toutes_reservations)::numeric, 1)
  end as act_taux_annulation,
  case
    when (select count(*) from toutes_reservations) = 0 then null::numeric
    else round(100.0 * (select count(*) from toutes_reservations
                        where statut = 'NON_PRESENTATION')::numeric
               / (select count(*) from toutes_reservations)::numeric, 1)
  end as act_taux_non_presentation,
  -- En dessous de 100 recherches, le taux de conversion n'est pas publie.
  case
    when (select n from recherches_total) < 100 then null::numeric
    else round(100.0 * (select count(*) from reservations_valides
                        where id_recherche is not null)::numeric
               / (select n from recherches_total)::numeric, 1)
  end as act_taux_conversion,
  (select n from recherches_total) as act_effectif_recherches,
  now() as calcule_a;

-- ---------------------------------------------------------------------------
-- Vue d'acces. Meme motif que les autres : la vue materialisee ne porte aucun
-- droit pour authenticated, la vue d'acces porte les gardes.
-- Aucune garde de territoire : l'instantane est national par construction.
-- ---------------------------------------------------------------------------
create or replace view observatoire.acces_evenementiel_national as
select eve_capacite_partenaires, eve_capacite_recensee_non_partenaire,
       eve_capacite_mobilisable, eve_nb_etab_salles, eve_capacite_salles,
       eve_effectif_demandes, ins_volume_demande, ins_taux_couverture,
       eve_taux_tension_evenement, eve_effectif_evenements, calcule_a
from observatoire.mv_evenementiel_national v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M7_EVENEMENTIEL');

grant select on observatoire.acces_evenementiel_national
  to authenticated, role_admin, role_institutionnel;
