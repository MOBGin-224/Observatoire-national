create table observatoire.import_recensement (
  id uuid primary key default gen_random_uuid(),
  horodatage timestamptz not null default now(),
  id_compte uuid references observatoire.compte_institutionnel(id),
  nom_fichier text not null,
  nb_lignes_total integer not null default 0,
  nb_lignes_valides integer not null default 0,
  nb_lignes_erreur integer not null default 0,
  rapport jsonb
);

alter table observatoire.import_recensement enable row level security;

create policy "admin lecture" on observatoire.import_recensement
  for select to authenticated
  using (observatoire.est_admin_actif());

create policy "admin ecriture" on observatoire.import_recensement
  for insert to authenticated
  with check (observatoire.est_admin_actif());

grant select, insert on observatoire.import_recensement to authenticated;
;
