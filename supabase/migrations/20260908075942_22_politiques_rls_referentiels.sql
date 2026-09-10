-- Migration 22 : politiques RLS pour les tables de reference/methodologie.
-- Un GRANT seul ne suffit pas : RLS activee sans politique bloque tout acces,
-- meme avec un GRANT (document 11, section 5.4). Meme oubli que pour le schema
-- en migration 16. Ces tables ne figurent pas dans la liste des tables interdites
-- du document 6, section 1.3 : ce sont des donnees de reference, pas des faits.

create policy "lecture authentifiee" on observatoire.indicateur
  for select to authenticated using (true);

create policy "lecture authentifiee" on observatoire.version_indicateur
  for select to authenticated using (true);

create policy "lecture authentifiee" on observatoire.enumeration
  for select to authenticated using (true);

create policy "lecture authentifiee" on observatoire.territoire
  for select to authenticated using (true);
;
