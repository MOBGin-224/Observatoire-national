-- Les colonnes de sortie portaient les memes noms que les colonnes de la table,
-- ce qui rendait les references ambigues. Reecriture en SQL pur, avec un CTE
-- pour l'insertion et une jointure pour les coordonnees du titulaire.
drop function if exists observatoire.relever_expirations_a_notifier(integer[]);

create function observatoire.relever_expirations_a_notifier(p_echeances integer[])
returns table (
  id_notification uuid,
  id_compte uuid,
  email text,
  nom text,
  prenom text,
  langue text,
  date_expiration date,
  echeance_jours integer
)
language sql
security definer
set search_path to ''
as $$
  with inserees as (
    insert into observatoire.notification_expiration (id_compte, date_expiration, echeance_jours)
    select c.id, c.date_expiration, e.jours
    from observatoire.compte_institutionnel c
    cross join unnest(p_echeances) as e(jours)
    where c.statut = 'ACTIF'
      and c.date_expiration is not null
      and c.date_expiration = current_date + e.jours
    on conflict (id_compte, date_expiration, echeance_jours) do nothing
    returning
      notification_expiration.id,
      notification_expiration.id_compte,
      notification_expiration.date_expiration,
      notification_expiration.echeance_jours
  )
  select i.id, i.id_compte, c.email, c.nom, c.prenom, c.langue, i.date_expiration, i.echeance_jours
  from inserees i
  join observatoire.compte_institutionnel c on c.id = i.id_compte
$$;

revoke all on function observatoire.relever_expirations_a_notifier(integer[]) from public, authenticated, anon;
grant execute on function observatoire.relever_expirations_a_notifier(integer[]) to service_role;;
