create or replace function observatoire.est_admin_actif()
returns boolean
language sql
stable security definer
set search_path to ''
as $$
  select exists (
    select 1 from observatoire.compte_valide() cv
    where cv.profil = 'ADMIN'
  )
$$;

grant execute on function observatoire.est_admin_actif() to authenticated;
;
