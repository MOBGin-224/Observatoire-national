-- institution
create policy "admin lecture" on observatoire.institution
  for select to authenticated using (observatoire.est_admin_actif());
create policy "admin ecriture insert" on observatoire.institution
  for insert to authenticated with check (observatoire.est_admin_actif());
create policy "admin ecriture update" on observatoire.institution
  for update to authenticated using (observatoire.est_admin_actif()) with check (observatoire.est_admin_actif());
grant select, insert, update on observatoire.institution to authenticated;

-- compte_institutionnel
create policy "admin lecture" on observatoire.compte_institutionnel
  for select to authenticated using (observatoire.est_admin_actif());
create policy "admin ecriture insert" on observatoire.compte_institutionnel
  for insert to authenticated with check (observatoire.est_admin_actif());
create policy "admin ecriture update" on observatoire.compte_institutionnel
  for update to authenticated using (observatoire.est_admin_actif()) with check (observatoire.est_admin_actif());
grant select, insert, update on observatoire.compte_institutionnel to authenticated;

-- compte_module
create policy "admin lecture" on observatoire.compte_module
  for select to authenticated using (observatoire.est_admin_actif());
create policy "admin ecriture insert" on observatoire.compte_module
  for insert to authenticated with check (observatoire.est_admin_actif());
create policy "admin ecriture update" on observatoire.compte_module
  for update to authenticated using (observatoire.est_admin_actif()) with check (observatoire.est_admin_actif());
grant select, insert, update on observatoire.compte_module to authenticated;

-- etablissement
create policy "admin lecture" on observatoire.etablissement
  for select to authenticated using (observatoire.est_admin_actif());
create policy "admin ecriture insert" on observatoire.etablissement
  for insert to authenticated with check (observatoire.est_admin_actif());
create policy "admin ecriture update" on observatoire.etablissement
  for update to authenticated using (observatoire.est_admin_actif()) with check (observatoire.est_admin_actif());
grant select, insert, update on observatoire.etablissement to authenticated;

-- etablissement_equipement
create policy "admin lecture" on observatoire.etablissement_equipement
  for select to authenticated using (observatoire.est_admin_actif());
create policy "admin ecriture insert" on observatoire.etablissement_equipement
  for insert to authenticated with check (observatoire.est_admin_actif());
create policy "admin ecriture update" on observatoire.etablissement_equipement
  for update to authenticated using (observatoire.est_admin_actif()) with check (observatoire.est_admin_actif());
grant select, insert, update on observatoire.etablissement_equipement to authenticated;

-- etablissement_historique (lecture + insertion par le trigger security definer ; pas d'update/delete applicatif)
create policy "admin lecture" on observatoire.etablissement_historique
  for select to authenticated using (observatoire.est_admin_actif());
create policy "admin ecriture insert" on observatoire.etablissement_historique
  for insert to authenticated with check (observatoire.est_admin_actif());
grant select, insert on observatoire.etablissement_historique to authenticated;

-- territoire_variante
create policy "admin lecture" on observatoire.territoire_variante
  for select to authenticated using (observatoire.est_admin_actif());
create policy "admin ecriture insert" on observatoire.territoire_variante
  for insert to authenticated with check (observatoire.est_admin_actif());
grant select, insert on observatoire.territoire_variante to authenticated;
;
