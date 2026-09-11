-- Document 9 ter, partie J ; document 16, sections B.1, B.2 et D.4.
--
-- M7_EVENEMENTIEL raisonne en fenetre, pas en periode (J.3) : les dates et le
-- territoire sont choisis a l'ecran. Un agregat de fenetre ne se pre-calcule
-- pas en vue materialisee. Il est produit par une fonction qui applique
-- elle-meme les controles des vues d'acces (compte valide, module actif,
-- territoire visible) et ne renvoie que des agregats.
--
-- Confidentialite : la part "deja vendu" derive des reservations des
-- partenaires. Sur un territoire a un ou deux partenaires, elle revelerait
-- l'occupation d'un etablissement identifiable. La regle M1 s'y applique
-- (document 7, qui prime) : sous trois partenaires, ou si l'un d'eux porte plus
-- de la moitie des unites, le vendu, le disponible partenaire et tout ce qui en
-- derive sont masques. La capacite des non-partenaires, donnee d'inventaire,
-- reste affichee.

-- Evenements futurs proposes au selecteur (J.5), issus des deux sources.
create or replace function observatoire.evenementiel_evenements()
returns table (
  source text,
  id uuid,
  libelle text,
  code_territoire text,
  date_debut date,
  date_fin date
)
language sql
stable
security definer
set search_path = ''
as $$
  select e.source, e.id, e.libelle, e.code_territoire, e.date_debut, e.date_fin
  from (
    select 'DEMANDE'::text as source, d.id, d.libelle, d.code_territoire, d.date_debut, d.date_fin
    from observatoire.demande_institutionnelle d
    where d.date_debut is not null
      and coalesce(d.statut, '') <> 'ANNULEE'
      and coalesce(d.date_fin, d.date_debut) >= current_date
    union all
    select 'CALENDRIER'::text, c.id, c.libelle, c.code_territoire, c.date_debut, c.date_fin
    from observatoire.evenement_calendrier c
    where c.date_debut is not null
      and coalesce(c.date_fin, c.date_debut) >= current_date
  ) e
  where exists (select 1 from observatoire.compte_valide())
    and observatoire.module_actif('M7_EVENEMENTIEL')
    and (e.code_territoire is null or observatoire.territoire_visible(e.code_territoire))
  order by e.date_debut, e.libelle
$$;

create or replace function observatoire.evenementiel_fenetre(
  p_debut date,
  p_fin date,
  p_territoire text default null,
  p_gammes text[] default null,
  p_capacite_salle_min integer default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_resultat jsonb;
begin
  -- Une fenetre compte au moins une nuit.
  if p_debut is null or p_fin is null or p_fin <= p_debut then
    return null;
  end if;

  if not exists (select 1 from observatoire.compte_valide())
     or not observatoire.module_actif('M7_EVENEMENTIEL')
     or (p_territoire is not null and not observatoire.territoire_visible(p_territoire)) then
    return null;
  end if;

  with etab as (
    select eo.id, eo.code_region, eo.code_prefecture, eo.code_commune,
           coalesce(eo.est_partenaire, false) as est_partenaire,
           eo.gamme_tarifaire,
           coalesce(eo.capacite_unites, 0) as capacite
    from observatoire.v_etablissement_offre eo
    where (p_territoire is null or p_territoire in (eo.code_region, eo.code_prefecture, eo.code_commune))
      and (p_gammes is null or eo.gamme_tarifaire = any (p_gammes))
  ),
  nuits as (
    select generate_series(p_debut, p_fin - 1, interval '1 day')::date as nuit
  ),
  -- Unites vendues par partenaire et par nuit, plafonnees a sa capacite.
  vendu_nuit as (
    select n.nuit, e.id, e.code_region, e.code_prefecture, e.code_commune,
           least(sum(r.nb_unites), e.capacite) as unites
    from nuits n
    join observatoire.reservation r
      on r.date_arrivee <= n.nuit and r.date_depart > n.nuit
     and r.statut in ('CONFIRMEE', 'HONOREE')
    join etab e on e.id = r.id_etablissement and e.est_partenaire
    group by n.nuit, e.id, e.code_region, e.code_prefecture, e.code_commune, e.capacite
  ),
  -- La capacite retiree d'une fenetre est le pic nocturne, pas la somme des sejours.
  vendu as (
    select coalesce(max(t.total), 0) as unites
    from (select nuit, sum(unites) as total from vendu_nuit group by nuit) t
  ),
  partenaires as (
    select count(*) as n, coalesce(sum(capacite), 0) as capacite, coalesce(max(capacite), 0) as capacite_max
    from etab where est_partenaire
  ),
  autres as (
    select count(*) as n, coalesce(sum(capacite), 0) as capacite
    from etab where not est_partenaire
  ),
  confidentialite as (
    select (p.n between 1 and 2 or (p.n >= 3 and p.capacite_max > 0.5 * p.capacite)) as masque
    from partenaires p
  ),
  salles as (
    select ee.id_etablissement, ee.capacite, observatoire.palier_salle(ee.capacite) as palier
    from observatoire.etablissement_equipement ee
    join etab e on e.id = ee.id_etablissement
    where ee.code_equipement = 'SALLE_REUNION' and ee.disponible = true
      and (p_capacite_salle_min is null or ee.capacite >= p_capacite_salle_min)
  ),
  salles_renseignees as (
    select count(*) as n
    from observatoire.etablissement_equipement ee
    join etab e on e.id = ee.id_etablissement
    where ee.code_equipement = 'SALLE_REUNION' and ee.disponible is not null
  ),
  demandes as (
    select d.id, d.libelle, d.type_demande, d.date_debut, d.date_fin,
           d.nb_unites_demandees, d.nb_unites_couvertes, d.statut
    from observatoire.demande_institutionnelle d
    left join observatoire.v_territoire_hierarchie h on h.code_origine = d.code_territoire
    where d.date_debut is not null
      and d.date_debut < p_fin
      and coalesce(d.date_fin, d.date_debut + 1) > p_debut
      and (p_territoire is null or p_territoire in (h.code_region, h.code_prefecture, h.code_commune))
  ),
  -- Les besoins qui se chevauchent se cumulent (J.8) ; une demande annulee
  -- reste listee mais ne pese plus.
  besoin as (
    select count(*) filter (where coalesce(statut, '') <> 'ANNULEE') as n,
           coalesce(sum(nb_unites_demandees) filter (where coalesce(statut, '') <> 'ANNULEE'), 0) as demandees,
           coalesce(sum(nb_unites_couvertes) filter (where coalesce(statut, '') <> 'ANNULEE'), 0) as couvertes
    from demandes
  ),
  calcul as (
    select
      (select count(*) from etab) as etablissements,
      p.capacite + a.capacite as capacite_recensee,
      a.capacite as recenses_non_reservables,
      c.masque,
      case when c.masque then null else least(v.unites, p.capacite) end as deja_vendu,
      case when c.masque then null else greatest(0, p.capacite - v.unites) end as partenaires_disponibles,
      case when c.masque then null else greatest(0, p.capacite - v.unites) + a.capacite end as capacite_mobilisable,
      b.n as demandes,
      b.demandees,
      b.couvertes
    from partenaires p, autres a, vendu v, confidentialite c, besoin b
  ),
  -- Zone 4 : territoires enfants de la fenetre, les regions au niveau national.
  enfants as (
    select t.code, t.libelle
    from observatoire.territoire t
    where t.actif
      and case when p_territoire is null then t.niveau = 'REGION' and t.code_parent is null
               else t.code_parent = p_territoire end
  ),
  enfants_etab as (
    select c.code,
           count(e.id) as n_etab,
           count(e.id) filter (where e.est_partenaire) as n_part,
           coalesce(sum(e.capacite) filter (where e.est_partenaire), 0) as cap_part,
           coalesce(max(e.capacite) filter (where e.est_partenaire), 0) as cap_max,
           coalesce(sum(e.capacite) filter (where not e.est_partenaire), 0) as cap_autres
    from enfants c
    left join etab e on c.code in (e.code_region, e.code_prefecture, e.code_commune)
    group by c.code
  ),
  enfants_vendu as (
    select c.code, coalesce(max(t.total), 0) as vendu
    from enfants c
    left join (
      select c2.code, v.nuit, sum(v.unites) as total
      from enfants c2
      join vendu_nuit v on c2.code in (v.code_region, v.code_prefecture, v.code_commune)
      group by c2.code, v.nuit
    ) t on t.code = c.code
    group by c.code
  ),
  enfants_calcul as (
    select c.code, c.libelle, x.n_etab,
           (x.n_part between 1 and 2 or (x.n_part >= 3 and x.cap_max > 0.5 * x.cap_part)) as masque,
           greatest(0, x.cap_part - v.vendu) + x.cap_autres as mobilisable
    from enfants c
    join enfants_etab x on x.code = c.code
    join enfants_vendu v on v.code = c.code
  )
  select jsonb_build_object(
    'etablissements', k.etablissements,
    'capacite_recensee', k.capacite_recensee,
    'masque_partenaires', k.masque,
    'partenaires_disponibles', k.partenaires_disponibles,
    'recenses_non_reservables', k.recenses_non_reservables,
    'deja_vendu', k.deja_vendu,
    'capacite_mobilisable', k.capacite_mobilisable,
    'etablissements_salles', (select count(distinct id_etablissement) from salles),
    'places_salles', (select coalesce(sum(capacite), 0) from salles),
    'demandes', k.demandes,
    'unites_demandees', k.demandees,
    'unites_couvertes', k.couvertes,
    'taux_tension',
      case when k.masque or k.demandes = 0 or coalesce(k.capacite_mobilisable, 0) = 0 then null
           else round(100.0 * k.demandees / k.capacite_mobilisable, 0) end,
    'deficit',
      case when k.masque or k.demandes = 0 then null
           else greatest(0, k.demandees - k.capacite_mobilisable) end,
    -- Masquage du dictionnaire : minimum 3 demandes.
    'taux_couverture',
      case when k.demandes < 3 or k.demandees = 0 then null
           else round(100.0 * k.couvertes / k.demandees, 1) end,
    'fiabilite_capacite', observatoire.niveau_fiabilite('INVENTAIRE', k.etablissements),
    'fiabilite_salles', observatoire.niveau_fiabilite('INVENTAIRE', (select n from salles_renseignees)),
    'fiabilite_tension', observatoire.fiabilite_la_plus_faible(
        observatoire.niveau_fiabilite('INVENTAIRE', k.etablissements),
        observatoire.niveau_fiabilite('INSTITUTIONNELLE', k.demandes)),
    'gammes', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'code', g.gamme_tarifaire, 'capacite', g.capacite, 'etablissements', g.n)
             order by g.gamme_tarifaire), '[]'::jsonb)
      from (select gamme_tarifaire, sum(capacite) as capacite, count(*) as n
            from etab where gamme_tarifaire is not null group by gamme_tarifaire) g),
    'paliers', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'palier', s.palier, 'etablissements', s.n, 'places', s.places)
             order by s.palier), '[]'::jsonb)
      from (select palier, count(distinct id_etablissement) as n, sum(capacite) as places
            from salles where palier is not null group by palier) s),
    'territoires', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'code', ec.code, 'libelle', ec.libelle, 'etablissements', ec.n_etab, 'masque', ec.masque,
               'mobilisable', case when ec.n_etab = 0 or ec.masque then null else ec.mobilisable end)
             order by ec.libelle), '[]'::jsonb)
      from enfants_calcul ec),
    'liste_demandes', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'id', d.id, 'libelle', d.libelle, 'type', d.type_demande,
               'date_debut', d.date_debut, 'date_fin', d.date_fin,
               'demandees', d.nb_unites_demandees, 'couvertes', d.nb_unites_couvertes,
               'statut', d.statut)
             order by d.date_debut, d.libelle), '[]'::jsonb)
      from demandes d),
    'calcule_a', now()
  )
  into v_resultat
  from calcul k;

  return v_resultat;
end;
$$;

revoke all on function observatoire.evenementiel_evenements() from public, anon;
revoke all on function observatoire.evenementiel_fenetre(date, date, text, text[], integer) from public, anon;
grant execute on function observatoire.evenementiel_evenements() to authenticated;
grant execute on function observatoire.evenementiel_fenetre(date, date, text, text[], integer) to authenticated;
