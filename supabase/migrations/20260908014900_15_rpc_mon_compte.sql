-- Migration 15 : fonctions d'auto-consultation du compte connecte
-- Document 6, section 1.3 : compte_institutionnel n'est lisible par AUCUN role
-- institutionnel, meme pour sa propre ligne. On expose donc un acces controle
-- par fonction SECURITY DEFINER filtree sur auth.uid(), jamais un GRANT sur la table.

create or replace function observatoire.mon_compte()
returns table (
  nom text,
  prenom text,
  fonction text,
  profil text,
  langue text,
  code_territoire_perimetre text,
  granularite_max text,
  institution_denomination text,
  institution_logo_url text
)
language sql
security definer
stable
set search_path = ''
as $$
  select
    c.nom, c.prenom, c.fonction, c.profil, c.langue,
    c.code_territoire_perimetre, c.granularite_max,
    i.denomination, i.logo_url
  from observatoire.compte_institutionnel c
  left join observatoire.institution i on i.id = c.id_institution
  where c.id = auth.uid()
    and c.statut = 'ACTIF'
    and (c.date_expiration is null or c.date_expiration >= current_date)
$$;

revoke all on function observatoire.mon_compte() from public;
grant execute on function observatoire.mon_compte() to authenticated;

create or replace function observatoire.mes_modules()
returns table (code_module text)
language sql
security definer
stable
set search_path = ''
as $$
  select cm.code_module
  from observatoire.compte_module cm
  join observatoire.compte_institutionnel c on c.id = cm.id_compte
  where cm.id_compte = auth.uid()
    and cm.actif = true
    and c.statut = 'ACTIF'
    and (c.date_expiration is null or c.date_expiration >= current_date)
$$;

revoke all on function observatoire.mes_modules() from public;
grant execute on function observatoire.mes_modules() to authenticated;
;
