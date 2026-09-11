-- Document 16 : regle transverse de fiabilite (B.1), paliers de capacite de
-- salle (B.2), coefficient de retombees et regle d'activation de M8 (B.4).

-- B.1. Un seul endroit pour les seuils. Les vues appellent ces fonctions,
-- jamais l'application (document 4, section 1).
create or replace function observatoire.niveau_fiabilite(
  p_nature text,
  p_effectif bigint,
  p_effectif_etablissements bigint default null
) returns text
language sql
immutable
set search_path = ''
as $$
  select case p_nature
    when 'INVENTAIRE' then
      case when p_effectif >= 30 then 'CONSOLIDE'
           when p_effectif >= 10 then 'INDICATIF'
           else 'SIGNAL' end
    when 'DEMANDE' then
      case when p_effectif >= 30 then 'CONSOLIDE'
           when p_effectif >= 10 then 'INDICATIF'
           else 'SIGNAL' end
    -- En dessous du seuil indicatif, aucun niveau : la valeur est masquee (regle M1).
    when 'PERFORMANCE' then
      case when p_effectif >= 30 and coalesce(p_effectif_etablissements, 0) >= 5 then 'CONSOLIDE'
           when p_effectif >= 10 and coalesce(p_effectif_etablissements, 0) >= 3 then 'INDICATIF'
           else null end
    when 'INSTITUTIONNELLE' then
      case when p_effectif >= 5 then 'CONSOLIDE'
           when p_effectif >= 2 then 'INDICATIF'
           when p_effectif >= 1 then 'SIGNAL'
           else null end
  end
$$;

-- Regle des indicateurs composites : le niveau le plus faible des composantes.
-- Une composante sans niveau (masquee ou sans donnee) prive le composite de niveau.
create or replace function observatoire.fiabilite_la_plus_faible(variadic p_niveaux text[])
returns text
language sql
immutable
set search_path = ''
as $$
  select case
    when exists (select 1 from unnest(p_niveaux) as n(niveau) where n.niveau is null) then null
    when 'SIGNAL' = any (p_niveaux) then 'SIGNAL'
    when 'INDICATIF' = any (p_niveaux) then 'INDICATIF'
    else 'CONSOLIDE'
  end
$$;

-- B.2. Palier calcule a partir de la capacite, jamais saisi.
create or replace function observatoire.palier_salle(p_capacite integer)
returns text
language sql
immutable
set search_path = ''
as $$
  select case
    when p_capacite is null or p_capacite < 1 then null
    when p_capacite < 20 then 'P1'
    when p_capacite < 50 then 'P2'
    when p_capacite < 100 then 'P3'
    when p_capacite < 200 then 'P4'
    when p_capacite < 500 then 'P5'
    else 'P6'
  end
$$;

revoke all on function observatoire.niveau_fiabilite(text, bigint, bigint) from public, anon;
revoke all on function observatoire.fiabilite_la_plus_faible(text[]) from public, anon;
revoke all on function observatoire.palier_salle(integer) from public, anon;
grant execute on function observatoire.niveau_fiabilite(text, bigint, bigint) to authenticated, service_role;
grant execute on function observatoire.fiabilite_la_plus_faible(text[]) to authenticated, service_role;
grant execute on function observatoire.palier_salle(integer) to authenticated, service_role;

insert into observatoire.enumeration (domaine, code, libelle_fr, libelle_en, ordre, actif) values
  ('PALIER_SALLE', 'P1', 'Moins de 20 places', 'Under 20 seats', 10, true),
  ('PALIER_SALLE', 'P2', '20 à 49 places', '20 to 49 seats', 20, true),
  ('PALIER_SALLE', 'P3', '50 à 99 places', '50 to 99 seats', 30, true),
  ('PALIER_SALLE', 'P4', '100 à 199 places', '100 to 199 seats', 40, true),
  ('PALIER_SALLE', 'P5', '200 à 499 places', '200 to 499 seats', 50, true),
  ('PALIER_SALLE', 'P6', '500 places et plus', '500 seats and over', 60, true)
on conflict (domaine, code) do nothing;

-- A.1. Le domaine existait, seuls ses libelles anglais manquaient (document 10, section 7).
update observatoire.enumeration e
set libelle_en = v.libelle_en
from (values
  ('ANNONCEE', 'Announced'),
  ('CONFIRMEE', 'Confirmed'),
  ('SATISFAITE', 'Fulfilled'),
  ('PARTIELLEMENT_SATISFAITE', 'Partially fulfilled'),
  ('NON_SATISFAITE', 'Not fulfilled'),
  ('ANNULEE', 'Cancelled')
) as v(code, libelle_en)
where e.domaine = 'STATUT_DEMANDE_INST' and e.code = v.code and e.libelle_en is null;

-- B.4. Structure d'accueil du coefficient. Vide au lancement : aucune ligne
-- n'est saisie par estimation. Une ligne sans valeur n'aurait aucun sens,
-- d'ou la seule contrainte posee sur `valeur`.
create table observatoire.coefficient_retombees (
  id uuid primary key default gen_random_uuid(),
  valeur numeric not null check (valeur > 0),
  source_libelle text,
  source_reference text,
  perimetre_source text,
  date_validation date,
  date_effet date,
  date_fin date,
  courante boolean not null default false,
  notes text,
  constraint coefficient_retombees_periode check (date_fin is null or date_effet is null or date_fin >= date_effet)
);

-- Une seule ligne courante a la fois.
create unique index coefficient_retombees_une_courante
  on observatoire.coefficient_retombees (courante) where courante;

alter table observatoire.coefficient_retombees enable row level security;

-- Donnee methodologique, publiable : lue par l'ecran M8 et, a terme, par M10.
create policy "lecture authentifiee" on observatoire.coefficient_retombees
  for select to authenticated using (true);
grant select on observatoire.coefficient_retombees to authenticated;

create or replace function observatoire.coefficient_retombees_valide()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from observatoire.coefficient_retombees c
    where c.courante
      and nullif(btrim(c.source_libelle), '') is not null
      and nullif(btrim(c.perimetre_source), '') is not null
      and c.date_validation is not null
  )
$$;

revoke all on function observatoire.coefficient_retombees_valide() from public, anon;
grant execute on function observatoire.coefficient_retombees_valide() to authenticated, service_role;

-- Regle d'activation tenue par la base : une ligne de compte_module activee
-- par erreur ne suffit pas a ouvrir M8.
create or replace function observatoire.module_actif(p_code_module text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from observatoire.compte_module cm
    join observatoire.compte_valide() cv on cv.id = cm.id_compte
    where cm.code_module = p_code_module and cm.actif = true
  )
  and (p_code_module <> 'M8_RETOMBEES' or observatoire.coefficient_retombees_valide())
$$;

create or replace function observatoire.mes_modules()
returns table(code_module text)
language sql
stable
security definer
set search_path = ''
as $$
  select cm.code_module
  from observatoire.compte_module cm
  join observatoire.compte_institutionnel c on c.id = cm.id_compte
  where cm.id_compte = auth.uid()
    and cm.actif = true
    and c.statut = 'ACTIF'
    and (c.date_expiration is null or c.date_expiration >= current_date)
    and (cm.code_module <> 'M8_RETOMBEES' or observatoire.coefficient_retombees_valide())
$$;
