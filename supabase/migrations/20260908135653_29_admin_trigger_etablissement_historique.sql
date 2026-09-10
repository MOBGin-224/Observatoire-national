create or replace function observatoire.tf_etablissement_historique()
returns trigger
language plpgsql
security definer
set search_path to ''
as $$
begin
  if new.statut_relation is distinct from old.statut_relation then
    insert into observatoire.etablissement_historique (id_etablissement, champ, valeur_avant, valeur_apres)
    values (new.id, 'statut_relation', old.statut_relation, new.statut_relation);
  end if;
  if new.capacite_unites is distinct from old.capacite_unites then
    insert into observatoire.etablissement_historique (id_etablissement, champ, valeur_avant, valeur_apres)
    values (new.id, 'capacite_unites', old.capacite_unites::text, new.capacite_unites::text);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_etablissement_historique on observatoire.etablissement;

create trigger trg_etablissement_historique
  after update on observatoire.etablissement
  for each row
  execute function observatoire.tf_etablissement_historique();
;
