-- =============================================================================
-- JEU DE TEST SYNTHETIQUE - OBSERVATOIRE NATIONAL DE L'HOSPITALITE
-- =============================================================================
--
-- AUCUNE DE CES DONNEES N'EST REELLE. Aucun de ces etablissements n'existe.
--
-- Le CLAUDE.md du projet, regle 3, interdit de generer des donnees
-- d'illustration, avec une seule exception : "un jeu de test synthetique
-- explicitement identifie". C'est cet objet.
--
-- Identification, triple et systematique :
--   - id_externe    prefixe 'JEU-TEST-'
--   - nom           prefixe '[JEU DE TEST] '
--   - notes         mention en clair
--
-- Objet : valider la mise en page et les visualisations de l'ecran M1_OFFRE.
-- Ce jeu ne doit jamais servir a produire un chiffre cite, un export, une
-- capture d'ecran de presentation, ni alimenter une demonstration institutionnelle.
--
-- RETRAIT COMPLET, une seule commande :
--   delete from observatoire.etablissement where id_externe like 'JEU-TEST-%';
--   puis rejouer le bloc REFRESH en fin de fichier.
--
-- Repartition volontaire :
--   - Conakry concentre l'offre, comme dans la realite du marche guineen ;
--   - la region 10 (Beyla) reste a zero, pour verifier que la tuile hachuree,
--     la ligne de tableau a zero et les etats vides se comportent correctement.
--
-- Les valeurs sont deterministes (derivees de l'indice de serie), donc le
-- script rejoue a l'identique.
-- =============================================================================

begin;

delete from observatoire.etablissement where id_externe like 'JEU-TEST-%';

with repartition (code_region, effectif) as (
  values ('01', 52), ('02', 18), ('03', 16), ('09', 13), ('07', 12),
         ('05', 10), ('04',  8), ('06',  7), ('08',  6), ('10',  0)
),
communes as (
  select h.code_origine as code_commune,
         h.code_region,
         row_number() over (partition by h.code_region order by h.code_origine) - 1 as rang,
         count(*)     over (partition by h.code_region) as nb_communes
  from observatoire.v_territoire_hierarchie h
  join observatoire.territoire t on t.code = h.code_origine
  where t.niveau = 'COMMUNE'
),
serie as (
  select r.code_region, g.i
  from repartition r
  cross join lateral generate_series(1, r.effectif) as g(i)
  where r.effectif > 0
),
tirage as (
  select
    s.code_region,
    s.i,
    c.code_commune,
    /* Ponderations : l'hotel et la residence dominent, le lodge et le receptif
       restent marginaux, ce qui est la structure attendue du parc guineen. */
    (array['HOTEL','HOTEL','HOTEL','HOTEL','HOTEL','HOTEL',
           'RESIDENCE','RESIDENCE','RESIDENCE','RESIDENCE','RESIDENCE',
           'AUBERGE','AUBERGE','AUBERGE','AUBERGE',
           'MAISON_HOTES','MAISON_HOTES','MAISON_HOTES',
           'LODGE','RECEPTIF'])[1 + ((s.i * 7 + s.code_region::int * 3) % 20)] as typologie,
    (array['G1','G1','G1','G1','G2','G2','G2','G3','G3','G4'])
      [1 + ((s.i * 11 + s.code_region::int) % 10)] as gamme_tarifaire,
    (array['RECENSE','RECENSE','RECENSE','RECENSE','RECENSE','RECENSE','RECENSE',
           'RECENSE','RECENSE','RECENSE','RECENSE','RECENSE','RECENSE',
           'PARTENAIRE_ACTIF','PARTENAIRE_ACTIF','PARTENAIRE_ACTIF','PARTENAIRE_ACTIF',
           'PARTENAIRE_ACTIF','PARTENAIRE_INACTIF','PARTENAIRE_INACTIF'])
      [1 + ((s.i * 13 + s.code_region::int * 5) % 20)] as statut_relation,
    (array['NON_VERIFIE','NON_VERIFIE','NON_VERIFIE','NON_VERIFIE',
           'VERIFIE_TEL','VERIFIE_TEL','VERIFIE_TEL',
           'VERIFIE_TERRAIN','VERIFIE_TERRAIN','VERIFIE_TERRAIN'])
      [1 + ((s.i * 17 + s.code_region::int * 7) % 10)] as statut_verification,
    ((s.i * 5) % 10) < 4  as a_presence_en_ligne,
    ((s.i * 3 + s.code_region::int) % 10) < 3 as reserve_en_ligne,
    ((s.i * 19) % 10) < 8 as a_contact,
    ((s.i * 23) % 10) < 7 as a_coordonnees,
    ((s.i * 29) % 10) < 6 as a_tarifs
  from serie s
  join communes c
    on c.code_region = s.code_region
   and c.rang = (s.i * 7) % c.nb_communes
)
insert into observatoire.etablissement (
  id_externe, nom, typologie, statut_relation, code_commune,
  capacite_unites, capacite_source, gamme_tarifaire,
  tarif_min_gnf, tarif_max_gnf,
  site_web, facebook, reservation_en_ligne,
  telephone_1, latitude, longitude, precision_geo,
  source_recensement, statut_verification, consentement_publication,
  actif, notes
)
select
  'JEU-TEST-' || t.code_region || '-' || lpad(t.i::text, 3, '0'),
  '[JEU DE TEST] Etablissement ' || t.code_region || '-' || lpad(t.i::text, 3, '0'),
  t.typologie,
  t.statut_relation,
  t.code_commune,
  /* Capacite : socle par typologie, plus une variation deterministe. */
  case t.typologie
    when 'HOTEL'     then 24
    when 'RESIDENCE' then 12
    when 'AUBERGE'   then 10
    when 'LODGE'     then 16
    when 'RECEPTIF'  then 30
    else 8
  end + ((t.i * 13) % 41),
  'DECLAREE',
  t.gamme_tarifaire,
  case when t.a_tarifs then 150000 + ((t.i * 37) % 20) * 25000 end,
  case when t.a_tarifs then 400000 + ((t.i * 41) % 30) * 40000 end,
  case when t.a_presence_en_ligne and t.i % 2 = 0
       then 'https://exemple.invalid/jeu-test/' || t.code_region || '-' || t.i end,
  case when t.a_presence_en_ligne
       then 'https://facebook.invalid/jeu-test/' || t.code_region || '-' || t.i end,
  t.reserve_en_ligne and t.statut_relation = 'PARTENAIRE_ACTIF',
  case when t.a_contact then '+224 6' || lpad(((t.i * 971) % 100000000)::text, 8, '0') end,
  case when t.a_coordonnees then round(7.5 + ((t.i * 31) % 45) * 0.1, 5) end,
  case when t.a_coordonnees then round(-15.0 + ((t.i * 43) % 70) * 0.1, 5) end,
  case when t.a_coordonnees then 'RELEVE' end,
  'TERRAIN',
  t.statut_verification,
  'NON_DEMANDE',
  true,
  'JEU DE TEST SYNTHETIQUE. Donnee non reelle, produite pour valider la mise en page de l''ecran M1_OFFRE. Ne jamais citer, exporter ni presenter.'
from tirage t;

commit;

-- Les vues d'agregat sont materialisees : sans ce bloc, l'ecran ne voit rien.
refresh materialized view observatoire.mv_offre_commune;
refresh materialized view observatoire.mv_offre_prefecture;
refresh materialized view observatoire.mv_offre_region;
refresh materialized view observatoire.mv_offre_national;
refresh materialized view observatoire.mv_maturite_national;
