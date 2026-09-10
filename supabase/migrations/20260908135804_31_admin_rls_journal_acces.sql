-- Tout compte valide peut journaliser ses propres actions ; seul ADMIN peut consulter le journal.
create policy "auto journalisation" on observatoire.journal_acces
  for insert to authenticated
  with check (id_compte = auth.uid());

create policy "admin lecture" on observatoire.journal_acces
  for select to authenticated
  using (observatoire.est_admin_actif());

grant select, insert on observatoire.journal_acces to authenticated;
;
