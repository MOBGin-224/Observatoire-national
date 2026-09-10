-- Document 15, section 6 : le bandeau de perimetre a deux variantes.
-- Vue dediee plutot qu'extension de mv_offre_national, que quatre ecrans
-- lisent deja : le bandeau est un indicateur a part entiere (CTX_PERIMETRE,
-- document 4 section 11), il merite sa propre source.
--
-- Elle porte les champs des deux variantes. Le cloisonnement se fait a
-- l'affichage, selon le profil : aucune des deux valeurs internes n'est
-- sensible au sens du document 7, elles sont simplement hors sujet pour une
-- institution.
create materialized view if not exists observatoire.mv_perimetre_national as
select
  count(*)                                            as off_etab_recenses,
  coalesce(sum(e.capacite_unites), 0)                 as off_capacite_recensee,
  count(*) filter (where e.est_partenaire)            as off_etab_partenaires,
  -- Substitution 1 du document 15 : compte tous les etablissements disposant
  -- d'un canal de reservation en ligne, toutes plateformes confondues. Mesure
  -- du secteur, pas du portefeuille de l'entreprise.
  count(*) filter (where e.est_reservable_ligne)      as off_etab_reservables,
  case when coalesce(sum(e.capacite_unites), 0) = 0 then null
       else round(100.0 * coalesce(sum(e.capacite_unites) filter (where e.est_partenaire), 0)
                  / sum(e.capacite_unites), 1) end    as off_taux_couverture,
  case when count(*) = 0 then null
       else round(100.0 * count(*) filter (where e.est_verifie) / count(*), 1)
  end                                                 as off_taux_verification,
  -- Substitution 2 du document 15 : part du pays couverte par l'inventaire.
  -- Le denominateur est la region, seul niveau dont le referentiel est
  -- complet. Le referentiel communal est volontairement partiel (document 13,
  -- section 11.1) : l'employer donnerait un rapport flatteur et faux.
  (select count(distinct t.code) from observatoire.territoire t
    where t.niveau = 'REGION'
      and exists (select 1 from observatoire.v_etablissement_offre x
                   where x.code_region = t.code))     as territoires_couverts,
  (select count(*) from observatoire.territoire t
    where t.niveau = 'REGION')                        as territoires_total,
  now()                                               as calcule_a
from observatoire.v_etablissement_offre e;

-- Vue d'acces, au meme gabarit que les autres : jamais la vue materialisee
-- brute depuis l'application (document 11, section 6.1).
create or replace view observatoire.acces_perimetre_national as
select v.off_etab_recenses,
       v.off_capacite_recensee,
       v.off_etab_partenaires,
       v.off_etab_reservables,
       v.off_taux_couverture,
       v.off_taux_verification,
       v.territoires_couverts,
       v.territoires_total,
       v.calcule_a
from observatoire.mv_perimetre_national v
-- Le bandeau est present sur tous les ecrans de tous les profils : il ne
-- depend d'aucun module actif, seulement d'un compte valide.
where exists (select 1 from observatoire.compte_valide());

grant select on observatoire.acces_perimetre_national to authenticated;;
