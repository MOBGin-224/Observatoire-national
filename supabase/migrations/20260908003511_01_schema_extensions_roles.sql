-- Migration 1 : schema, extensions, roles
-- Document 11, section 5.2, rang 1

create schema if not exists observatoire;

create extension if not exists pgcrypto with schema public;

-- Trois roles de base (document 3 section 13, document 11 section 5.3)
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'role_institutionnel') then
    create role role_institutionnel nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'role_admin') then
    create role role_admin nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'role_ingestion') then
    create role role_ingestion nologin;
  end if;
end
$$;

grant usage on schema observatoire to role_institutionnel, role_admin, role_ingestion;
;
