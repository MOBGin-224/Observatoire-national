-- Migration 9 : acces institutionnels
-- Document 3, section 10. Document 11, rang 9.
-- compte_institutionnel.id correspond a l'identifiant Supabase Auth.

create table observatoire.institution (
  id uuid primary key default gen_random_uuid(),
  denomination text not null,
  type text,
  logo_url text,
  convention_reference text,
  convention_debut date,
  convention_fin date,
  actif boolean not null default true
);
alter table observatoire.institution enable row level security;

create table observatoire.compte_institutionnel (
  id uuid primary key references auth.users(id) on delete cascade,
  id_institution uuid references observatoire.institution(id),
  nom text not null,
  prenom text not null,
  fonction text,
  email text,
  profil text,
  code_territoire_perimetre text references observatoire.territoire(code),
  granularite_max text,
  langue text,
  date_expiration date,
  statut text not null default 'ACTIF' check (statut in ('ACTIF','SUSPENDU','EXPIRE'))
);
alter table observatoire.compte_institutionnel enable row level security;

create table observatoire.compte_module (
  id_compte uuid not null references observatoire.compte_institutionnel(id),
  code_module text not null,
  actif boolean not null default true,
  primary key (id_compte, code_module)
);
alter table observatoire.compte_module enable row level security;

create table observatoire.journal_acces (
  id uuid primary key default gen_random_uuid(),
  id_compte uuid references observatoire.compte_institutionnel(id),
  horodatage timestamptz not null default now(),
  module text,
  filtres jsonb,
  action text,
  adresse_connexion text
);
alter table observatoire.journal_acces enable row level security;

create table observatoire.export (
  id uuid primary key default gen_random_uuid(),
  reference text not null,
  id_compte uuid references observatoire.compte_institutionnel(id),
  horodatage timestamptz not null default now(),
  module text,
  perimetre jsonb,
  empreinte_contenu text,
  version_indicateurs text
);
alter table observatoire.export enable row level security;

-- Cle etrangere laissee en attente depuis la migration 7
alter table observatoire.demande_institutionnelle
  add constraint demande_institutionnelle_id_institution_fkey
  foreign key (id_institution) references observatoire.institution(id);
;
