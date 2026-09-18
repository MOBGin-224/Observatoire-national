-- Document 17, partie A.3. Controle automatique.
--
-- La regle est desormais sans exception : aucun objet de base n'est cree,
-- modifie ou supprime autrement que par un fichier de migration. Pour que la
-- regle soit verifiable et non declarative, il faut pouvoir comparer ce qui
-- vit en base a ce que les migrations creent.
--
-- Le schema pg_catalog n'est pas expose a l'API PostgREST. Cette fonction est
-- le passe-plat qui rend l'inventaire lisible par le script de controle,
-- scripts/controle-migrations.mjs, avec la cle service role.
--
-- Elle ne lit aucune donnee metier : uniquement des noms d'objets.

create or replace function observatoire.inventaire_objets()
returns table (categorie text, identifiant text)
language sql
security definer
set search_path to ''
stable
as $$
  -- Tables, vues et vues materialisees du schema observatoire.
  select case c.relkind
           when 'r' then 'table'
           when 'v' then 'vue'
           when 'm' then 'vue_materialisee'
         end::text,
         c.relname::text
  from pg_catalog.pg_class c
  join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'observatoire'
    and c.relkind in ('r', 'v', 'm')

  union all

  -- Fonctions, comparees par nom. Une surcharge supplementaire ou manquante
  -- n'est donc pas detectee ; une fonction entierement absente l'est, et
  -- c'est le cas qui casse un deploiement.
  select 'fonction'::text, p.proname::text
  from pg_catalog.pg_proc p
  join pg_catalog.pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'observatoire'
  group by p.proname

  union all

  -- Politiques de securite, identifiees par leur table et leur nom.
  select 'politique'::text, (c.relname || ' : ' || pol.polname)::text
  from pg_catalog.pg_policy pol
  join pg_catalog.pg_class c on c.oid = pol.polrelid
  join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'observatoire'

  union all

  -- Index, hors ceux que Postgres cree lui-meme pour servir une contrainte
  -- de cle primaire ou d'unicite : ceux-la naissent avec la table et n'ont
  -- pas d'instruction create index dans les migrations.
  select 'index'::text, ic.relname::text
  from pg_catalog.pg_index i
  join pg_catalog.pg_class ic on ic.oid = i.indexrelid
  join pg_catalog.pg_class tc on tc.oid = i.indrelid
  join pg_catalog.pg_namespace n on n.oid = tc.relnamespace
  where n.nspname = 'observatoire'
    and not exists (
      select 1 from pg_catalog.pg_constraint k where k.conindid = i.indexrelid
    );
$$;

-- Jamais appelee depuis une session utilisateur, comme les quatre fonctions
-- de taches planifiees.
revoke all on function observatoire.inventaire_objets() from public, authenticated, anon;
grant execute on function observatoire.inventaire_objets() to service_role;
