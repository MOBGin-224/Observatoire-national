-- Document 13 section 1 et document 14 section 4.
-- Compartiment prive, adresses signees uniquement, logos d'institution exclusivement.
-- Rien d'autre n'y transite : un compartiment qui accueille des contenus non
-- prevus devient un angle mort de securite.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'logos-institutions',
  'logos-institutions',
  false,
  2097152,                                    -- 2 Mo, document 13 section 13
  array['image/png', 'image/svg+xml']         -- PNG et SVG, rien d'autre
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Convention de chemin : <id_institution>/<nom_fichier>. Le premier segment
-- porte le cloisonnement, c'est lui que les politiques interrogent.
create or replace function observatoire.mon_institution()
returns uuid
language sql
stable
security definer
set search_path to ''
as $$
  select c.id_institution
  from observatoire.compte_institutionnel c
  where c.id = auth.uid()
    and c.statut = 'ACTIF'
    and (c.date_expiration is null or c.date_expiration >= current_date)
$$;

revoke all on function observatoire.mon_institution() from public;
grant execute on function observatoire.mon_institution() to authenticated;

-- Lecture : l'administration voit tout, un compte institutionnel ne voit que
-- le logo de sa propre institution. Necessaire pour l'en-tete et pour la
-- mention d'attribution des exports (document 7 section 7.2).
drop policy if exists "logo lecture cloisonnee" on storage.objects;
create policy "logo lecture cloisonnee"
on storage.objects for select
to authenticated
using (
  bucket_id = 'logos-institutions'
  and (
    observatoire.est_admin_actif()
    or (storage.foldername(name))[1] = observatoire.mon_institution()::text
  )
);

-- Ecriture : profil ADMIN exclusivement. Une institution ne televerse jamais
-- son propre logo, c'est l'administration interne qui le fait.
drop policy if exists "logo depot admin" on storage.objects;
create policy "logo depot admin"
on storage.objects for insert
to authenticated
with check (bucket_id = 'logos-institutions' and observatoire.est_admin_actif());

drop policy if exists "logo remplacement admin" on storage.objects;
create policy "logo remplacement admin"
on storage.objects for update
to authenticated
using (bucket_id = 'logos-institutions' and observatoire.est_admin_actif())
with check (bucket_id = 'logos-institutions' and observatoire.est_admin_actif());

drop policy if exists "logo suppression admin" on storage.objects;
create policy "logo suppression admin"
on storage.objects for delete
to authenticated
using (bucket_id = 'logos-institutions' and observatoire.est_admin_actif());;
