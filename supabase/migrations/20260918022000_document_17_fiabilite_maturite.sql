-- Document 17, partie B.2. Fiabilite de MAT_INDICE.
--
-- Le document 16 appliquait a MAT_INDICE la regle des composites : le niveau
-- le plus faible entre l'effectif recense et l'effectif dont les deux
-- composantes de paiement sont renseignees. Resultat, SIGNAL partout tant que
-- les equipements ne sont pas collectes.
--
-- C'est une mauvaise application de la regle. Celle-ci vise les indicateurs
-- qui croisent deux bases de mesure distinctes, comme TEN_INDICE_TENSION qui
-- rapporte de la demande a de l'inventaire : deux echantillons differents, le
-- plus faible commande. Les six composantes de MAT_INDICE sont des attributs
-- des memes etablissements, pas six echantillons. L'echantillon est unique.
--
-- La fiabilite se calcule donc sur le nombre d'etablissements de l'agregat,
-- selon la regle d'inventaire. Une composante non renseignee continue de
-- compter pour zero dans le score, ce qui est conservateur et honnete, mais
-- elle ne degrade plus la fiabilite : l'indicateur serait sinon penalise deux
-- fois pour la meme raison.
--
-- Les colonnes fiabilite_inventaire et fiabilite_paiement sont conservees :
-- l'ecran s'en sert pour dire ce qui est renseigne et ce qui ne l'est pas.

drop view observatoire.acces_maturite_national;
drop view observatoire.acces_maturite_region;
drop view observatoire.acces_maturite_croisements;
drop materialized view observatoire.mv_maturite_national;
drop materialized view observatoire.mv_maturite_region;
drop materialized view observatoire.mv_maturite_croisements;

create materialized view observatoire.mv_maturite_national as
select
  count(*) as off_etab_recenses,
  case when count(*) = 0 then null else round(avg(score), 0) end as mat_indice,
  case when count(*) = 0 then null
       else round(100.0 * count(*) filter (where c_paiement_carte or c_paiement_mobile) / count(*), 1)
  end as mat_taux_paiement_numerique,
  case when count(*) = 0 then null else round(100.0 * count(*) filter (where c_presence_ligne) / count(*), 1) end as mat_comp_presence_ligne,
  case when count(*) = 0 then null else round(100.0 * count(*) filter (where c_canal_reservation) / count(*), 1) end as mat_comp_canal_reservation,
  case when count(*) = 0 then null else round(100.0 * count(*) filter (where c_tarifs_publies) / count(*), 1) end as mat_comp_tarifs_publies,
  case when count(*) = 0 then null else round(100.0 * count(*) filter (where c_coordonnees_valides) / count(*), 1) end as mat_comp_coordonnees_valides,
  case when count(*) = 0 then null else round(100.0 * count(*) filter (where c_paiement_carte) / count(*), 1) end as mat_comp_paiement_carte,
  case when count(*) = 0 then null else round(100.0 * count(*) filter (where c_paiement_mobile) / count(*), 1) end as mat_comp_paiement_mobile,
  case when count(*) = 0 then null else round(100.0 * count(*) filter (where a_canal_ligne) / count(*), 1) end as off_taux_numerisation,
  case when count(*) = 0 then null else round(100.0 * count(*) filter (where est_reservable_ligne) / count(*), 1) end as off_taux_reservabilite,
  count(*) filter (where carte_renseigne) as mat_effectif_carte_renseigne,
  count(*) filter (where mobile_renseigne) as mat_effectif_mobile_renseigne,
  count(*) filter (where paiement_renseigne) as mat_effectif_paiement_renseigne,
  count(*) filter (where paiement_connu) as mat_effectif_paiement_connu,
  observatoire.ponderation_maturite() as mat_ponderation,
  count(*) as effectif_echantillon,
  -- Regle d'inventaire sur l'effectif de l'agregat, et non plus le plus faible
  -- de deux niveaux (document 17, B.2).
  observatoire.niveau_fiabilite('INVENTAIRE', count(*)) as niveau_fiabilite,
  observatoire.niveau_fiabilite('INVENTAIRE', count(*)) as fiabilite_inventaire,
  observatoire.niveau_fiabilite('INVENTAIRE', count(*) filter (where paiement_renseigne)) as fiabilite_paiement,
  now() as calcule_a
from observatoire.v_maturite_etablissement;

create materialized view observatoire.mv_maturite_region as
select
  code_region as code_territoire,
  count(*) as off_etab_recenses,
  round(avg(score), 0) as mat_indice,
  round(100.0 * count(*) filter (where c_presence_ligne) / count(*), 1) as mat_comp_presence_ligne,
  round(100.0 * count(*) filter (where c_canal_reservation) / count(*), 1) as mat_comp_canal_reservation,
  round(100.0 * count(*) filter (where c_paiement_carte or c_paiement_mobile) / count(*), 1) as mat_taux_paiement_numerique,
  count(*) filter (where paiement_renseigne) as mat_effectif_paiement_renseigne,
  count(*) filter (where paiement_connu) as mat_effectif_paiement_connu,
  count(*) as effectif_echantillon,
  observatoire.niveau_fiabilite('INVENTAIRE', count(*)) as niveau_fiabilite,
  now() as calcule_a
from observatoire.v_maturite_etablissement
where code_region is not null
group by code_region;

create materialized view observatoire.mv_maturite_croisements as
select
  'TYPOLOGIE'::text as dimension,
  typologie as code,
  count(*) as effectif_echantillon,
  round(avg(score), 0) as mat_indice,
  observatoire.niveau_fiabilite('INVENTAIRE', count(*)) as niveau_fiabilite,
  now() as calcule_a
from observatoire.v_maturite_etablissement
where typologie is not null
group by typologie
union all
select
  'GAMME'::text,
  gamme_tarifaire,
  count(*),
  round(avg(score), 0),
  observatoire.niveau_fiabilite('INVENTAIRE', count(*)),
  now()
from observatoire.v_maturite_etablissement
where gamme_tarifaire is not null
group by gamme_tarifaire;

create view observatoire.acces_maturite_national as
select v.off_etab_recenses, v.mat_indice, v.mat_taux_paiement_numerique,
       v.mat_comp_presence_ligne, v.mat_comp_canal_reservation, v.mat_comp_tarifs_publies,
       v.mat_comp_coordonnees_valides, v.mat_comp_paiement_carte, v.mat_comp_paiement_mobile,
       v.off_taux_numerisation, v.off_taux_reservabilite,
       v.mat_effectif_carte_renseigne, v.mat_effectif_mobile_renseigne,
       v.mat_effectif_paiement_renseigne, v.mat_effectif_paiement_connu,
       v.mat_ponderation, v.effectif_echantillon,
       v.niveau_fiabilite, v.fiabilite_inventaire, v.fiabilite_paiement, v.calcule_a
from observatoire.mv_maturite_national v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M6_MATURITE');

create view observatoire.acces_maturite_region as
select v.code_territoire, v.off_etab_recenses, v.mat_indice, v.mat_comp_presence_ligne,
       v.mat_comp_canal_reservation, v.mat_taux_paiement_numerique,
       v.mat_effectif_paiement_renseigne, v.mat_effectif_paiement_connu,
       v.effectif_echantillon, v.niveau_fiabilite, v.calcule_a
from observatoire.mv_maturite_region v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M6_MATURITE')
  and observatoire.territoire_visible(v.code_territoire);

create view observatoire.acces_maturite_croisements as
select v.dimension, v.code, v.effectif_echantillon, v.mat_indice, v.niveau_fiabilite, v.calcule_a
from observatoire.mv_maturite_croisements v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M6_MATURITE');

grant select on observatoire.acces_maturite_national, observatoire.acces_maturite_region,
                observatoire.acces_maturite_croisements
  to authenticated, role_institutionnel;
