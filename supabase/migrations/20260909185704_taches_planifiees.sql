-- Document 14 section 5.1 : tâches planifiées appelées par Vercel Cron.
-- La logique vit en base, la route ne fait que déclencher et journaliser.
-- Aucune durée n'est écrite ici : elles arrivent en paramètre depuis lib/config.

-- --------------------------------------------------------------------------
-- Document 3 (amendé par le document 14) et document 13 section 3.
-- --------------------------------------------------------------------------
create table if not exists observatoire.notification_expiration (
  id uuid primary key default gen_random_uuid(),
  id_compte uuid not null references observatoire.compte_institutionnel(id),
  date_expiration date not null,
  echeance_jours integer not null,
  horodatage timestamptz not null default now(),
  statut text not null default 'EN_ATTENTE',
  constraint notification_expiration_statut_valide
    check (statut in ('EN_ATTENTE', 'ENVOYE', 'ECHEC')),
  -- Une échéance ne se notifie qu'une fois. Une date d'expiration prolongée
  -- par l'administration rouvre le cycle, ce qui est le comportement voulu.
  constraint notification_expiration_unicite
    unique (id_compte, date_expiration, echeance_jours)
);

alter table observatoire.notification_expiration enable row level security;

-- Seule l'administration consulte le tableau de suivi (document 13 section 3).
drop policy if exists "notification lecture admin" on observatoire.notification_expiration;
create policy "notification lecture admin"
on observatoire.notification_expiration for select
to authenticated
using (observatoire.est_admin_actif());

-- --------------------------------------------------------------------------
-- Tâche quotidienne : relever les échéances atteintes, sans doublon.
-- Renvoie les destinataires ; l'envoi lui-même est fait par l'appelant.
-- --------------------------------------------------------------------------
create or replace function observatoire.relever_expirations_a_notifier(p_echeances integer[])
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
language plpgsql
security definer
set search_path to ''
as $$
begin
  return query
  insert into observatoire.notification_expiration (id_compte, date_expiration, echeance_jours)
  select c.id, c.date_expiration, e.jours
  from observatoire.compte_institutionnel c
  cross join unnest(p_echeances) as e(jours)
  where c.statut = 'ACTIF'
    and c.date_expiration is not null
    and c.date_expiration = current_date + e.jours
  on conflict (id_compte, date_expiration, echeance_jours) do nothing
  returning
    observatoire.notification_expiration.id,
    observatoire.notification_expiration.id_compte,
    (select c2.email from observatoire.compte_institutionnel c2
      where c2.id = observatoire.notification_expiration.id_compte),
    (select c2.nom from observatoire.compte_institutionnel c2
      where c2.id = observatoire.notification_expiration.id_compte),
    (select c2.prenom from observatoire.compte_institutionnel c2
      where c2.id = observatoire.notification_expiration.id_compte),
    (select c2.langue from observatoire.compte_institutionnel c2
      where c2.id = observatoire.notification_expiration.id_compte),
    observatoire.notification_expiration.date_expiration,
    observatoire.notification_expiration.echeance_jours;
end;
$$;

-- --------------------------------------------------------------------------
-- Tâche mensuelle : purges. Document 13 section 8, durées provisoires.
-- La purge est irréversible : elle ne touche que ce que le document nomme.
-- --------------------------------------------------------------------------
create or replace function observatoire.purger_recherches(p_mois integer)
returns integer
language plpgsql
security definer
set search_path to ''
as $$
declare
  v_limite timestamptz := now() - make_interval(months => p_mois);
  v_supprimees integer;
begin
  -- Les liens sont coupés, pas les enregistrements portés par un autre régime.
  -- Une réservation est une transaction, pas un enregistrement de recherche :
  -- le document 13 section 8 ne lui fixe aucune durée, elle est conservée.
  update observatoire.reservation r
  set id_recherche = null
  where r.id_recherche in (
    select rc.id from observatoire.recherche rc where rc.horodatage < v_limite
  );

  update observatoire.consultation_etablissement ce
  set id_recherche = null
  where ce.id_recherche in (
    select rc.id from observatoire.recherche rc where rc.horodatage < v_limite
  );

  -- resultat_recherche est l'extension 1 pour 1 de recherche : sans elle, il
  -- ne veut plus rien dire.
  delete from observatoire.resultat_recherche rr
  where rr.id_recherche in (
    select rc.id from observatoire.recherche rc where rc.horodatage < v_limite
  );

  delete from observatoire.recherche rc where rc.horodatage < v_limite;
  get diagnostics v_supprimees = row_count;
  return v_supprimees;
end;
$$;

create or replace function observatoire.purger_journal_acces(p_mois integer)
returns integer
language plpgsql
security definer
set search_path to ''
as $$
declare
  v_supprimees integer;
begin
  delete from observatoire.journal_acces ja
  where ja.horodatage < now() - make_interval(months => p_mois);
  get diagnostics v_supprimees = row_count;
  return v_supprimees;
end;
$$;

-- --------------------------------------------------------------------------
-- Document 3 section 12 : les vues matérialisées sont rafraîchies par tâche
-- planifiée. Le parcours est dynamique pour qu'une vue ajoutée plus tard soit
-- prise en compte sans modifier cette fonction.
-- --------------------------------------------------------------------------
create or replace function observatoire.rafraichir_agregats()
returns integer
language plpgsql
security definer
set search_path to ''
as $$
declare
  v_vue record;
  v_nb integer := 0;
begin
  for v_vue in
    select c.relname
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'observatoire' and c.relkind = 'm'
    order by c.relname
  loop
    execute format('refresh materialized view observatoire.%I', v_vue.relname);
    v_nb := v_nb + 1;
  end loop;
  return v_nb;
end;
$$;

-- Ces quatre fonctions ne sont jamais appelées depuis une session utilisateur.
revoke all on function observatoire.relever_expirations_a_notifier(integer[]) from public, authenticated, anon;
revoke all on function observatoire.purger_recherches(integer) from public, authenticated, anon;
revoke all on function observatoire.purger_journal_acces(integer) from public, authenticated, anon;
revoke all on function observatoire.rafraichir_agregats() from public, authenticated, anon;

grant execute on function observatoire.relever_expirations_a_notifier(integer[]) to service_role;
grant execute on function observatoire.purger_recherches(integer) to service_role;
grant execute on function observatoire.purger_journal_acces(integer) to service_role;
grant execute on function observatoire.rafraichir_agregats() to service_role;;
