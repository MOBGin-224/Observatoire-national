-- =============================================================================
-- JEU DE TEST SYNTHETIQUE, VOLET DEMANDE ET ACTIVITE
-- =============================================================================
--
-- AUCUNE DE CES DONNEES N'EST REELLE. Aucune de ces recherches n'a eu lieu,
-- aucune de ces reservations n'existe.
--
-- Complete scripts/jeu-de-test-synthetique.sql, qui charge le parc
-- d'etablissements. A jouer apres lui : les reservations s'accrochent aux
-- etablissements partenaires qu'il cree.
--
-- Identification :
--   recherche    id_session prefixe 'JEU-TEST-', source_donnee = 'JEU_TEST'
--   reservation  id_externe prefixe 'JEU-TEST-', source_donnee = 'JEU_TEST'
--
-- RETRAIT COMPLET :
--   delete from observatoire.reservation where id_externe like 'JEU-TEST-%';
--   delete from observatoire.recherche  where id_session like 'JEU-TEST-%';
--   puis rejouer le bloc REFRESH en fin de fichier.
--
-- Volumetrie et forme voulues :
--   - saisonnalite marquee, pics en janvier, juillet-aout et decembre ;
--   - Conakry concentre la moitie des destinations recherchees ;
--   - environ 8 % de destinations hors referentiel, pour alimenter la zone Z6 ;
--   - un taux de conversion de l'ordre de 2 %, qui est l'ordre de grandeur reel
--     du secteur : c'est precisement ce chiffre que le document 9 quater, K.7,
--     impose de lire a cote du taux de couverture.
--
-- Valeurs deterministes, derivees de l'indice de serie : le script rejoue a
-- l'identique.
-- =============================================================================

delete from observatoire.reservation where id_externe like 'JEU-TEST-%';
delete from observatoire.recherche  where id_session like 'JEU-TEST-%';

-- ----------------------------------------------------------------------------
-- Recherches, 23 000 sur douze mois d'arrivee souhaitee.
-- ----------------------------------------------------------------------------
with volumes (mois_index, effectif) as (
  values (0, 2600), (1, 1700), (2, 1500), (3, 1400), (4, 1200), (5, 1300),
         (6, 2600), (7, 2800), (8, 1800), (9, 1600), (10, 1900), (11, 2600)
),
communes as (
  select code,
         row_number() over (order by code) - 1 as rang,
         count(*) over () as nb
  from observatoire.territoire
  where niveau = 'COMMUNE' and actif = true
),
conakry as (
  select code,
         row_number() over (order by code) - 1 as rang,
         count(*) over () as nb
  from observatoire.territoire
  where niveau = 'COMMUNE' and actif = true and code like '01-%'
),
serie as (
  select v.mois_index, g.i
  from volumes v
  cross join lateral generate_series(1, v.effectif) as g(i)
),
tirage as (
  select s.mois_index,
         s.i,
         (date '2026-01-01' + (s.mois_index || ' month')::interval
           + ((s.i * 13) % 28) * interval '1 day')::date as date_arrivee,
         (array[1,2,2,2,3,3,3,3,4,4,4,5,5,6,7,7,10,12,14,21])[1 + ((s.i * 17) % 20)] as nb_nuits,
         -- Une recherche sur douze porte sur une localite absente du referentiel.
         (s.i % 12) = 0 as hors_referentiel,
         -- Une sur deux vise Conakry, le reste se repartit sur tout le pays.
         (s.i % 10) < 5 as vers_conakry
  from serie s
)
insert into observatoire.recherche (
  id_session, horodatage, destination_saisie, code_territoire_normalise,
  destination_non_reconnue, date_arrivee, date_depart, nb_nuits, nb_voyageurs,
  nb_unites, budget_min_gnf, budget_max_gnf, typologie_filtree, motif_sejour,
  pays_utilisateur, type_appareil, langue_interface, canal, source_trafic,
  utilisateur_connecte, source_donnee
)
select
  'JEU-TEST-' || lpad(t.mois_index::text, 2, '0') || '-' || lpad(t.i::text, 5, '0'),
  (t.date_arrivee - ((5 + (t.i * 7) % 80) || ' day')::interval)::timestamptz,
  case when t.hors_referentiel
       /* L'indice des lignes hors referentiel est toujours multiple de 12 : un
          modulo 8 se replierait sur deux valeurs seulement. On divise d'abord
          par 12, et on pondere pour donner du relief a la zone Z6. */
       then (array['Kaporo','Kaporo','Kaporo','Kaporo',
                   'Sonfonia Gare','Sonfonia Gare','Sonfonia Gare',
                   'Iles de Loos','Iles de Loos','Iles de Loos',
                   'Bel Air','Bel Air',
                   'Soumba','Soumba',
                   'Plage de Bofosso','Mont Gangan','Cap Verga'])
              [1 + ((t.i / 12 + t.mois_index) % 17)]
  end,
  case when t.hors_referentiel then null
       when t.vers_conakry then (select c.code from conakry c where c.rang = (t.i * 3) % c.nb limit 1)
       else (select c.code from communes c where c.rang = (t.i * 7) % c.nb limit 1)
  end,
  t.hors_referentiel,
  t.date_arrivee,
  t.date_arrivee + t.nb_nuits,
  t.nb_nuits,
  1 + ((t.i * 5) % 6),
  1 + ((t.i * 11) % 3),
  case when t.i % 3 = 0 then 200000 + ((t.i * 29) % 8) * 50000 end,
  case when t.i % 3 = 0 then 600000 + ((t.i * 31) % 12) * 75000 end,
  case when t.i % 4 = 0
       then (array['HOTEL','RESIDENCE','AUBERGE','MAISON_HOTES'])[1 + ((t.i * 13) % 4)] end,
  (array['LOISIRS','LOISIRS','LOISIRS','AFFAIRES','AFFAIRES','FAMILIAL','FAMILIAL',
         'EVENEMENTIEL','MISSION','NON_DECLARE'])[1 + ((t.i * 19) % 10)],
  (array['GN','GN','GN','GN','GN','GN','GN','GN','GN',
         'FR','FR','FR','FR','SN','SN','SN','CI','CI','ML','ML',
         'MA','US','BE','GB','CN','TR','GH','LR','SL','AE'])[1 + ((t.i * 23) % 30)],
  (array['MOBILE','MOBILE','MOBILE','MOBILE','MOBILE','MOBILE','MOBILE',
         'DESKTOP','DESKTOP','TABLETTE'])[1 + ((t.i * 29) % 10)],
  case when (t.i * 37) % 10 < 8 then 'fr' else 'en' end,
  (array['WEB','WEB','WEB','WEB','WEB','WEB','WEB','WEB','WHATSAPP','AUTRE'])
    [1 + ((t.i * 41) % 10)],
  (array['DIRECT','RECHERCHE','SOCIAL','REFERENT'])[1 + ((t.i * 43) % 4)],
  (t.i % 7) = 0,
  'JEU_TEST'
from tirage t;

-- ----------------------------------------------------------------------------
-- Reservations, 6 000 sur les memes douze mois, sur le parc partenaire.
-- ----------------------------------------------------------------------------
with partenaires as (
  select id,
         row_number() over (order by id_externe) - 1 as rang,
         count(*) over () as nb
  from observatoire.etablissement
  where statut_relation = 'PARTENAIRE_ACTIF' and actif = true
),
volumes (mois_index, effectif) as (
  values (0, 700), (1, 430), (2, 380), (3, 350), (4, 300), (5, 330),
         (6, 690), (7, 740), (8, 460), (9, 410), (10, 480), (11, 730)
),
serie as (
  select v.mois_index, g.i
  from volumes v
  cross join lateral generate_series(1, v.effectif) as g(i)
),
tirage as (
  select s.mois_index,
         s.i,
         (date '2026-01-01' + (s.mois_index || ' month')::interval
           + ((s.i * 11) % 28) * interval '1 day')::date as date_arrivee,
         (array[1,2,2,2,3,3,3,4,4,5,6,7])[1 + ((s.i * 7) % 12)] as nb_nuits,
         1 + ((s.i * 5) % 3) as nb_unites,
         (array['HONOREE','HONOREE','HONOREE','HONOREE','HONOREE','HONOREE','HONOREE',
                'HONOREE','HONOREE','HONOREE','HONOREE','HONOREE','HONOREE','HONOREE',
                'HONOREE','CONFIRMEE','CONFIRMEE','ANNULEE','ANNULEE','NON_PRESENTATION'])
           [1 + ((s.i * 13) % 20)] as statut,
         p.id as id_etablissement
  from serie s
  join partenaires p on p.rang = (s.i * 3 + s.mois_index) % p.nb
)
insert into observatoire.reservation (
  id_externe, id_etablissement, date_reservation, date_arrivee, date_depart,
  nb_nuits, nb_unites, montant_hebergement_gnf, pays_origine, motif_sejour,
  statut, date_changement_statut, source_donnee
)
select
  'JEU-TEST-R' || lpad(t.mois_index::text, 2, '0') || '-' || lpad(t.i::text, 5, '0'),
  t.id_etablissement,
  (t.date_arrivee - ((3 + (t.i * 7) % 60) || ' day')::interval)::timestamptz,
  t.date_arrivee,
  t.date_arrivee + t.nb_nuits,
  t.nb_nuits,
  t.nb_unites,
  -- Tarif a la nuitee autour de 520 000 GNF, module par l'indice de serie.
  t.nb_nuits * t.nb_unites * (380000 + ((t.i * 17) % 25) * 12000),
  (array['GN','GN','GN','GN','FR','FR','SN','CI','ML','US'])[1 + ((t.i * 19) % 10)],
  (array['LOISIRS','LOISIRS','AFFAIRES','AFFAIRES','FAMILIAL','EVENEMENTIEL',
         'MISSION','NON_DECLARE'])[1 + ((t.i * 23) % 8)],
  t.statut,
  (t.date_arrivee + interval '1 day')::timestamptz,
  'JEU_TEST'
from tirage t;

-- ----------------------------------------------------------------------------
-- Rattachement d'une reservation sur douze a la recherche qui l'a precedee.
-- C'est ce rattachement, et lui seul, qui produit le taux de conversion :
-- environ 500 reservations rattachees sur 23 000 recherches, soit 2,2 %.
-- ----------------------------------------------------------------------------
with a_rattacher as (
  select id, row_number() over (order by id_externe) - 1 as rang
  from observatoire.reservation
  where id_externe like 'JEU-TEST-%'
),
recherches as (
  select id, row_number() over (order by id_session) - 1 as rang, count(*) over () as nb
  from observatoire.recherche
  where id_session like 'JEU-TEST-%'
)
update observatoire.reservation r
set id_recherche = (select x.id from recherches x where x.rang = (a.rang * 41) % x.nb limit 1)
from a_rattacher a
where r.id = a.id and a.rang % 12 = 0;

-- ----------------------------------------------------------------------------
refresh materialized view observatoire.mv_demande_national;
refresh materialized view observatoire.mv_demande_saisonnalite;
refresh materialized view observatoire.mv_demande_region;
refresh materialized view observatoire.mv_activite_national;
refresh materialized view observatoire.mv_activite_evolution;
refresh materialized view observatoire.mv_tension_national;
