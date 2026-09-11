-- Document 16, sections A.2, B.1 et C.2 ; document 9 ter, partie I.
-- Ponderation definitive de MAT_INDICE (carte 5, mobile money 15), niveau de
-- fiabilite composite, et agregats par region et par categorie pour les zones
-- 2, 4, 5 et 6 de M6_MATURITE.

-- Source unique de la ponderation : le score la lit, la vue nationale la publie,
-- et l'ecran affiche ainsi les poids qui ont reellement servi au calcul.
create or replace function observatoire.ponderation_maturite()
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select jsonb_build_object(
    'presence_ligne', 20,
    'canal_reservation', 30,
    'tarifs_publies', 20,
    'coordonnees_valides', 10,
    'paiement_carte', 5,
    'paiement_mobile', 15
  )
$$;

revoke all on function observatoire.ponderation_maturite() from public, anon;
grant execute on function observatoire.ponderation_maturite() to authenticated, service_role;

-- Une ligne par etablissement recense, sur le meme perimetre que l'offre
-- (v_etablissement_offre) : OFF_ETAB_RECENSES et OFF_TAUX_NUMERISATION sont
-- ainsi identiques dans M1 et M6. Vue interne, aucun droit institutionnel.
create view observatoire.v_maturite_etablissement as
with equipements as (
  select
    id_etablissement,
    bool_or(code_equipement = 'PAIEMENT_CARTE' and coalesce(disponible, false)) as c_paiement_carte,
    bool_or(code_equipement = 'PAIEMENT_MOBILE_MONEY' and coalesce(disponible, false)) as c_paiement_mobile,
    bool_or(code_equipement = 'PAIEMENT_CARTE' and disponible is not null) as carte_renseigne,
    bool_or(code_equipement = 'PAIEMENT_MOBILE_MONEY' and disponible is not null) as mobile_renseigne
  from observatoire.etablissement_equipement
  group by id_etablissement
), composantes as (
  select
    eo.id,
    eo.code_region,
    eo.typologie,
    eo.gamme_tarifaire,
    eo.a_canal_ligne,
    eo.est_reservable_ligne,
    (e.site_web is not null or e.facebook is not null or e.instagram is not null
      or coalesce(array_length(e.presence_ota, 1), 0) > 0) as c_presence_ligne,
    coalesce(e.reservation_en_ligne, false) as c_canal_reservation,
    (e.tarif_min_gnf is not null or e.tarif_max_gnf is not null) as c_tarifs_publies,
    (e.telephone_1 is not null or e.email is not null) as c_coordonnees_valides,
    coalesce(q.c_paiement_carte, false) as c_paiement_carte,
    coalesce(q.c_paiement_mobile, false) as c_paiement_mobile,
    coalesce(q.carte_renseigne, false) as carte_renseigne,
    coalesce(q.mobile_renseigne, false) as mobile_renseigne
  from observatoire.v_etablissement_offre eo
  join observatoire.etablissement e on e.id = eo.id
  left join equipements q on q.id_etablissement = eo.id
)
select
  c.*,
  (c.carte_renseigne and c.mobile_renseigne) as paiement_renseigne,
  (c.carte_renseigne or c.mobile_renseigne) as paiement_connu,
  -- Une composante non renseignee compte pour zero (document 16, C.2).
  (  case when c.c_presence_ligne then (p.poids ->> 'presence_ligne')::int else 0 end
   + case when c.c_canal_reservation then (p.poids ->> 'canal_reservation')::int else 0 end
   + case when c.c_tarifs_publies then (p.poids ->> 'tarifs_publies')::int else 0 end
   + case when c.c_coordonnees_valides then (p.poids ->> 'coordonnees_valides')::int else 0 end
   + case when c.c_paiement_carte then (p.poids ->> 'paiement_carte')::int else 0 end
   + case when c.c_paiement_mobile then (p.poids ->> 'paiement_mobile')::int else 0 end
  ) as score
from composantes c
cross join (select observatoire.ponderation_maturite() as poids) p;

revoke all on observatoire.v_maturite_etablissement from authenticated, anon;

drop view observatoire.acces_maturite_national;
drop materialized view observatoire.mv_maturite_national;

-- Le niveau de l'indice est composite : le plus faible entre l'effectif recense
-- et l'effectif dont les deux composantes de paiement sont renseignees.
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
  observatoire.fiabilite_la_plus_faible(
    observatoire.niveau_fiabilite('INVENTAIRE', count(*)),
    observatoire.niveau_fiabilite('INVENTAIRE', count(*) filter (where paiement_renseigne))
  ) as niveau_fiabilite,
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
  observatoire.fiabilite_la_plus_faible(
    observatoire.niveau_fiabilite('INVENTAIRE', count(*)),
    observatoire.niveau_fiabilite('INVENTAIRE', count(*) filter (where paiement_renseigne))
  ) as niveau_fiabilite,
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
  observatoire.fiabilite_la_plus_faible(
    observatoire.niveau_fiabilite('INVENTAIRE', count(*)),
    observatoire.niveau_fiabilite('INVENTAIRE', count(*) filter (where paiement_renseigne))
  ) as niveau_fiabilite,
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
  observatoire.fiabilite_la_plus_faible(
    observatoire.niveau_fiabilite('INVENTAIRE', count(*)),
    observatoire.niveau_fiabilite('INVENTAIRE', count(*) filter (where paiement_renseigne))
  ),
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
