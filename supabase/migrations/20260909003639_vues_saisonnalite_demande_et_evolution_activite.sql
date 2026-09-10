-- Document 9, C.5 zone Z4 (saisonnalite de l'intention) et Z2 (destinations
-- recherchees), document 9 quater, K.5 zone Z2 (evolution dans le temps).
-- Ces trois zones sont prescrites depuis l'origine mais n'avaient aucune vue
-- d'agregat pour les alimenter. Meme motif que les vues existantes : une vue
-- materialisee sans droit pour authenticated, plus une vue d'acces qui porte
-- les gardes compte_valide, module_actif et territoire_visible.

-- ---------------------------------------------------------------------------
-- Saisonnalite de la demande, par mois d'arrivee souhaitee.
-- La serie de mois est continue : un mois sans recherche vaut zero et non un
-- trou, sinon la courbe relierait deux points de part et d'autre d'une absence.
-- ---------------------------------------------------------------------------
create materialized view observatoire.mv_demande_saisonnalite as
with bornes as (
  select date_trunc('month', min(date_arrivee))::date as d1,
         date_trunc('month', max(date_arrivee))::date as d2
  from observatoire.recherche
  where date_arrivee is not null
),
mois as (
  select generate_series(b.d1, b.d2, interval '1 month')::date as m
  from bornes b
  where b.d1 is not null
)
select to_char(m.m, 'YYYY-MM') as mois,
       m.m as debut_mois,
       count(r.id) as dem_volume_recherches,
       percentile_cont(0.5) within group (order by r.nb_nuits::double precision)
         as dem_duree_sejour_recherchee,
       count(r.id) as effectif_echantillon,
       case
         when count(r.id) >= 30 then 'CONSOLIDE'
         when count(r.id) >= 10 then 'INDICATIF'
         else 'SIGNAL'
       end as niveau_fiabilite,
       false as masque,
       now() as calcule_a
from mois m
left join observatoire.recherche r
  on r.date_arrivee is not null
 and date_trunc('month', r.date_arrivee)::date = m.m
group by m.m;

-- ---------------------------------------------------------------------------
-- Destinations recherchees, par region.
-- Construite sur la destination saisie et normalisee, jamais sur le pays de la
-- connexion (document 9, C.7 : c'est le point de methode central du module).
-- ---------------------------------------------------------------------------
create materialized view observatoire.mv_demande_region as
select h.code_region as code_territoire,
       count(*) as dem_volume_recherches,
       count(distinct r.id_session) as dem_sessions,
       percentile_cont(0.5) within group (order by r.nb_nuits::double precision)
         as dem_duree_sejour_recherchee,
       count(*) as effectif_echantillon,
       case
         when count(*) >= 30 then 'CONSOLIDE'
         when count(*) >= 10 then 'INDICATIF'
         else 'SIGNAL'
       end as niveau_fiabilite,
       false as masque,
       now() as calcule_a
from observatoire.recherche r
join observatoire.v_territoire_hierarchie h
  on h.code_origine = r.code_territoire_normalise
where r.code_territoire_normalise is not null
  and h.code_region is not null
group by h.code_region;

-- ---------------------------------------------------------------------------
-- Evolution de l'activite, par mois d'arrivee.
-- Les formules reprennent a l'identique celles de mv_activite_national, pour que
-- la courbe et le bloc cle ne puissent pas diverger. Le verdict de masquage est
-- celui du perimetre partenaire, calcule ici une fois et non par mois : c'est
-- une propriete de l'echantillon, pas de la periode.
-- ---------------------------------------------------------------------------
create materialized view observatoire.mv_activite_evolution as
with partenaires as (
  select id, capacite_unites
  from observatoire.etablissement
  where statut_relation = 'PARTENAIRE_ACTIF' and actif = true
),
capacite as (
  select coalesce(sum(capacite_unites), 0) as totale,
         count(*) as n,
         coalesce(max(capacite_unites), 0) as maxi
  from partenaires
),
res as (
  select r.id, r.statut, r.nb_nuits, r.nb_unites, r.montant_hebergement_gnf,
         date_trunc('month', r.date_arrivee)::date as mois
  from observatoire.reservation r
  join partenaires p on p.id = r.id_etablissement
  where r.date_arrivee is not null
),
bornes as (select min(mois) as d1, max(mois) as d2 from res),
mois as (
  select generate_series(b.d1, b.d2, interval '1 month')::date as m
  from bornes b
  where b.d1 is not null
)
select to_char(m.m, 'YYYY-MM') as mois,
       m.m as debut_mois,
       count(res.id) filter (where res.statut <> 'ANNULEE') as act_reservations,
       coalesce(sum(res.nb_nuits * res.nb_unites) filter (where res.statut = 'HONOREE'), 0)
         as act_nuitees,
       case
         when coalesce(sum(res.nb_nuits * res.nb_unites) filter (where res.statut = 'HONOREE'), 0) = 0
           then null
         else round(
           coalesce(sum(res.montant_hebergement_gnf) filter (where res.statut = 'HONOREE'), 0)::numeric
           / sum(res.nb_nuits * res.nb_unites) filter (where res.statut = 'HONOREE')::numeric, 0)
       end as act_adr,
       case
         when (select totale from capacite) = 0 then null
         else round(
           coalesce(sum(res.montant_hebergement_gnf) filter (where res.statut = 'HONOREE'), 0)::numeric
           / ((select totale from capacite)
              * extract(day from (m.m + interval '1 month' - interval '1 day')))::numeric, 0)
       end as act_revpar,
       case
         when (select totale from capacite) = 0 then null
         else round(
           100.0 * coalesce(sum(res.nb_nuits * res.nb_unites) filter (where res.statut = 'HONOREE'), 0)::numeric
           / ((select totale from capacite)
              * extract(day from (m.m + interval '1 month' - interval '1 day')))::numeric, 1)
       end as act_taux_occupation_contractualise,
       (select n < 3 or maxi::numeric > totale::numeric * 0.5 from capacite) as masque,
       (select n from capacite) as effectif_echantillon,
       now() as calcule_a
from mois m
left join res on res.mois = m.m
group by m.m;

-- ---------------------------------------------------------------------------
-- Vues d'acces. Aucune vue materialisee n'est lisible directement par
-- l'application (document 11, section 6.1).
-- ---------------------------------------------------------------------------
create view observatoire.acces_demande_saisonnalite as
select mois, debut_mois, dem_volume_recherches, dem_duree_sejour_recherchee,
       effectif_echantillon, niveau_fiabilite, masque, calcule_a
from observatoire.mv_demande_saisonnalite v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M2_DEMANDE');

create view observatoire.acces_demande_region as
select code_territoire, dem_volume_recherches, dem_sessions,
       dem_duree_sejour_recherchee, effectif_echantillon, niveau_fiabilite,
       masque, calcule_a
from observatoire.mv_demande_region v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M2_DEMANDE')
  and observatoire.territoire_visible(code_territoire);

create view observatoire.acces_activite_evolution as
select mois, debut_mois, act_reservations, act_nuitees, act_adr, act_revpar,
       act_taux_occupation_contractualise, masque, effectif_echantillon, calcule_a
from observatoire.mv_activite_evolution v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M3_ACTIVITE');

grant select on observatoire.acces_demande_saisonnalite to authenticated, role_admin, role_institutionnel;
grant select on observatoire.acces_demande_region to authenticated, role_admin, role_institutionnel;
grant select on observatoire.acces_activite_evolution to authenticated, role_admin, role_institutionnel;;
