-- Fonction d'export ponctuelle : le depot doit redevenir autosuffisant, or
-- l'historique des migrations ne vit aujourd'hui que dans le projet Supabase.
-- Le schema supabase_migrations n'etant pas expose a l'API, cette fonction
-- sert de passe-plat le temps de l'export, puis sera supprimee.
--
-- Reservee a service_role : elle donne le schema complet de la base.
create or replace function observatoire.exporter_migrations()
returns table (version text, nom text, sql text)
language sql
stable
security definer
set search_path to ''
as $$
  select m.version,
         coalesce(m.name, 'migration'),
         array_to_string(m.statements, E';\n\n') || ';'
  from supabase_migrations.schema_migrations m
  where m.statements is not null
  order by m.version
$$;

revoke all on function observatoire.exporter_migrations() from public, authenticated, anon;
grant execute on function observatoire.exporter_migrations() to service_role;;
