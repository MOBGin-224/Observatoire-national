-- Document 9 quater, partie M ; document 16, sections B.1, B.4 et D.5.
--
-- M8_RETOMBEES reste desactive pour tous les comptes : module_actif et
-- mes_modules le ferment tant qu'aucun coefficient courant et valide n'est
-- enregistre. Ces vues ne renvoient donc aucune ligne aujourd'hui ; elles
-- existent pour que l'ecran soit pret le jour ou les trois conditions de la
-- section M.3 seront reunies.
--
-- Donnee de performance sur perimetre partenaire : regle M1 sur chaque cellule
-- (au moins trois etablissements, aucun au-dela de la moitie des unites), et
-- regle de performance du document 16, B.1 (sous 10 reservations et 3
-- etablissements, masque). Une valeur masquee est retiree par la vue d'acces,
-- pas seulement signalee. Les nuitees d'une categorie a un seul etablissement
-- seraient une occupation nominative : elles sont retirees avec la depense.
--
-- L'estimation n'est jamais stockee. Elle se calcule a la lecture, dans la vue
-- d'acces, a partir du seul coefficient courant et valide : un coefficient
-- revise s'applique sans rafraichissement, et aucun ecart ne peut s'installer
-- entre le chiffre et le coefficient affiche a cote.

-- Reservations honorees du perimetre partenaire. Vue interne.
create view observatoire.v_retombees_reservation as
select r.id, r.id_etablissement, r.date_arrivee, r.nb_nuits, r.nb_unites,
       r.montant_hebergement_gnf, r.pays_origine,
       e.typologie, e.gamme_tarifaire, e.capacite_unites, h.code_region
from observatoire.reservation r
join observatoire.etablissement e on e.id = r.id_etablissement
left join observatoire.v_territoire_hierarchie h on h.code_origine = e.code_commune
where r.statut = 'HONOREE'
  and e.statut_relation = 'PARTENAIRE_ACTIF'
  and e.actif = true;

revoke all on observatoire.v_retombees_reservation from authenticated, anon;

drop view observatoire.acces_retombees_national;
drop materialized view observatoire.mv_retombees_national;

create materialized view observatoire.mv_retombees_national as
with partenaires as (
  select count(*) as n,
         coalesce(max(capacite_unites), 0) as capacite_max,
         coalesce(sum(capacite_unites), 0) as capacite_totale
  from observatoire.etablissement
  where statut_relation = 'PARTENAIRE_ACTIF' and actif = true
), honorees as (
  select count(*) as n,
         coalesce(sum(nb_nuits * nb_unites), 0) as nuitees,
         coalesce(sum(montant_hebergement_gnf), 0) as depense
  from observatoire.v_retombees_reservation
)
select
  (   p.n < 3
   or p.capacite_max > p.capacite_totale * 0.5
   or observatoire.niveau_fiabilite('PERFORMANCE', h.n, p.n) is null) as ret_masque,
  p.n as ret_effectif_partenaires,
  h.n as ret_reservations,
  h.nuitees as act_nuitees,
  h.depense as ret_depense_hebergement,
  observatoire.niveau_fiabilite('PERFORMANCE', h.n, p.n) as niveau_fiabilite,
  now() as calcule_a
from partenaires p, honorees h;

create materialized view observatoire.mv_retombees_evolution as
with partenaires as (
  select count(*) as n,
         coalesce(max(capacite_unites), 0) as capacite_max,
         coalesce(sum(capacite_unites), 0) as capacite_totale
  from observatoire.etablissement
  where statut_relation = 'PARTENAIRE_ACTIF' and actif = true
), mois as (
  select date_trunc('month', date_arrivee)::date as mois,
         count(*) as n,
         sum(montant_hebergement_gnf) as depense,
         sum(nb_nuits * nb_unites) as nuitees
  from observatoire.v_retombees_reservation
  where date_arrivee is not null
  group by 1
), bornes as (
  select min(mois) as d1, max(mois) as d2 from mois
), serie as (
  select generate_series(d1, d2, interval '1 month')::date as mois from bornes where d1 is not null
)
select
  to_char(s.mois, 'YYYY-MM') as mois,
  coalesce(m.depense, 0) as ret_depense_hebergement,
  coalesce(m.nuitees, 0) as act_nuitees,
  coalesce(m.n, 0) as ret_reservations,
  (   p.n < 3
   or p.capacite_max > p.capacite_totale * 0.5
   or observatoire.niveau_fiabilite('PERFORMANCE', coalesce(m.n, 0), p.n) is null) as masque,
  observatoire.niveau_fiabilite('PERFORMANCE', coalesce(m.n, 0), p.n) as niveau_fiabilite,
  now() as calcule_a
from serie s
left join mois m on m.mois = s.mois
cross join partenaires p;

create materialized view observatoire.mv_retombees_repartitions as
with lignes as (
  select 'TYPOLOGIE'::text as dimension, typologie as code, id_etablissement, capacite_unites,
         montant_hebergement_gnf, nb_nuits, nb_unites
  from observatoire.v_retombees_reservation where typologie is not null
  union all
  select 'GAMME'::text, gamme_tarifaire, id_etablissement, capacite_unites,
         montant_hebergement_gnf, nb_nuits, nb_unites
  from observatoire.v_retombees_reservation where gamme_tarifaire is not null
  union all
  select 'ORIGINE'::text, pays_origine, id_etablissement, capacite_unites,
         montant_hebergement_gnf, nb_nuits, nb_unites
  from observatoire.v_retombees_reservation where pays_origine is not null
), etablissements as (
  select dimension, code, id_etablissement, max(capacite_unites) as capacite
  from lignes group by dimension, code, id_etablissement
), confidentialite as (
  select dimension, code, count(*) as n_etab,
         coalesce(max(capacite), 0) as capacite_max,
         coalesce(sum(capacite), 0) as capacite_totale
  from etablissements group by dimension, code
), agregats as (
  select dimension, code, count(*) as n_res,
         sum(montant_hebergement_gnf) as depense,
         sum(nb_nuits * nb_unites) as nuitees
  from lignes group by dimension, code
)
select
  a.dimension,
  a.code,
  coalesce(a.depense, 0) as ret_depense_hebergement,
  coalesce(a.nuitees, 0) as act_nuitees,
  a.n_res as ret_reservations,
  (   c.n_etab < 3
   or c.capacite_max > c.capacite_totale * 0.5
   or observatoire.niveau_fiabilite('PERFORMANCE', a.n_res, c.n_etab) is null) as masque,
  observatoire.niveau_fiabilite('PERFORMANCE', a.n_res, c.n_etab) as niveau_fiabilite,
  now() as calcule_a
from agregats a
join confidentialite c on c.dimension = a.dimension and c.code = a.code;

create materialized view observatoire.mv_retombees_region as
with etablissements as (
  select code_region, id_etablissement, max(capacite_unites) as capacite
  from observatoire.v_retombees_reservation
  where code_region is not null
  group by code_region, id_etablissement
), confidentialite as (
  select code_region, count(*) as n_etab,
         coalesce(max(capacite), 0) as capacite_max,
         coalesce(sum(capacite), 0) as capacite_totale
  from etablissements group by code_region
), agregats as (
  select code_region, count(*) as n_res,
         sum(montant_hebergement_gnf) as depense,
         sum(nb_nuits * nb_unites) as nuitees
  from observatoire.v_retombees_reservation
  where code_region is not null
  group by code_region
)
select
  a.code_region as code_territoire,
  coalesce(a.nuitees, 0) as act_nuitees,
  coalesce(a.depense, 0) as ret_depense_hebergement,
  a.n_res as ret_reservations,
  (   c.n_etab < 3
   or c.capacite_max > c.capacite_totale * 0.5
   or observatoire.niveau_fiabilite('PERFORMANCE', a.n_res, c.n_etab) is null) as masque,
  observatoire.niveau_fiabilite('PERFORMANCE', a.n_res, c.n_etab) as niveau_fiabilite,
  now() as calcule_a
from agregats a
join confidentialite c on c.code_region = a.code_region;

create view observatoire.acces_retombees_national as
select v.ret_masque, v.ret_effectif_partenaires, v.ret_reservations, v.act_nuitees,
       case when v.ret_masque then null else v.ret_depense_hebergement end as ret_depense_hebergement,
       case when v.ret_masque or v.ret_depense_hebergement = 0 then null
            else round(v.ret_depense_hebergement * (
              select c.valeur from observatoire.coefficient_retombees c
              where c.courante and observatoire.coefficient_retombees_valide()))
       end as ret_depense_totale_estimee,
       v.niveau_fiabilite, v.calcule_a
from observatoire.mv_retombees_national v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M8_RETOMBEES');

create view observatoire.acces_retombees_evolution as
select v.mois,
       case when v.masque then null else v.ret_depense_hebergement end as ret_depense_hebergement,
       v.masque, v.niveau_fiabilite, v.calcule_a
from observatoire.mv_retombees_evolution v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M8_RETOMBEES');

create view observatoire.acces_retombees_repartitions as
select v.dimension, v.code,
       case when v.masque then null else v.ret_depense_hebergement end as ret_depense_hebergement,
       case when v.masque then null else v.act_nuitees end as act_nuitees,
       v.masque, v.niveau_fiabilite, v.calcule_a
from observatoire.mv_retombees_repartitions v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M8_RETOMBEES');

create view observatoire.acces_retombees_region as
select v.code_territoire,
       case when v.masque then null else v.act_nuitees end as act_nuitees,
       case when v.masque then null else v.ret_depense_hebergement end as ret_depense_hebergement,
       case when v.masque or v.ret_depense_hebergement = 0 then null
            else round(v.ret_depense_hebergement * (
              select c.valeur from observatoire.coefficient_retombees c
              where c.courante and observatoire.coefficient_retombees_valide()))
       end as ret_depense_totale_estimee,
       v.masque, v.niveau_fiabilite, v.calcule_a
from observatoire.mv_retombees_region v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M8_RETOMBEES')
  and observatoire.territoire_visible(v.code_territoire);

grant select on observatoire.acces_retombees_national, observatoire.acces_retombees_evolution,
                observatoire.acces_retombees_repartitions, observatoire.acces_retombees_region
  to authenticated, role_institutionnel;
