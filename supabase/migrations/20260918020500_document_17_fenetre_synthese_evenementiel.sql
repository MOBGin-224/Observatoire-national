-- Document 17, partie C. Fenetre des blocs evenementiels en synthese.
--
-- EVE_CAPACITE_SALLES est un comptage d'inventaire : aucune fenetre, il reste
-- tel quel. EVE_CAPACITE_MOBILISABLE n'a aucun sens sans fenetre, mobilisable
-- quand : il s'entend desormais sur les 90 prochains jours, horizon sur lequel
-- une institution prepare un evenement.
--
-- Le libelle du bloc le dit en toutes lettres cote application, cle
-- module.m9.eve.fenetre.
--
-- Portee. Cette vue n'est lue que par l'ecran de synthese : M7 calcule sa
-- propre fenetre par les fonctions evenementiel_fenetre et
-- evenementiel_evenements. Le comportement de M7 n'est donc pas touche.
--
-- eve_taux_tension_evenement rapporte la demande a la capacite mobilisable.
-- Il suit la meme fenetre, sans quoi la vue porterait deux definitions
-- differentes du mot mobilisable. Aucun ecran ne lit cette colonne a ce jour.

drop view if exists observatoire.acces_evenementiel_national;
drop materialized view if exists observatoire.mv_evenementiel_national;

create materialized view observatoire.mv_evenementiel_national as
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
-- Seules les arrivees des 90 prochains jours sont retirees du disponible.
-- Sans cette borne, une reservation lointaine amputait une capacite presentee
-- comme mobilisable a court terme.
capacite_vendue as (
  select coalesce(sum(r.nb_unites), 0::bigint) as n
  from observatoire.reservation r
  join partenaires p on p.id = r.id_etablissement
  where r.statut = any (array['CONFIRMEE', 'HONOREE'])
    and r.date_arrivee >= current_date
    and r.date_arrivee < current_date + 90
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

create view observatoire.acces_evenementiel_national as
select eve_capacite_partenaires, eve_capacite_recensee_non_partenaire,
       eve_capacite_mobilisable, eve_nb_etab_salles, eve_capacite_salles,
       eve_effectif_demandes, ins_volume_demande, ins_taux_couverture,
       eve_taux_tension_evenement, eve_effectif_evenements, calcule_a
from observatoire.mv_evenementiel_national v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M7_EVENEMENTIEL');

grant select on observatoire.acces_evenementiel_national
  to authenticated, role_admin, role_institutionnel;
