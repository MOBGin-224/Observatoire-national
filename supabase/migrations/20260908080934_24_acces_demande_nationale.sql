create view observatoire.acces_demande_national
with (security_invoker = false) as
select v.*
from observatoire.mv_demande_national v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M2_DEMANDE');

revoke all on observatoire.mv_demande_national from public;
grant select on observatoire.acces_demande_national to role_institutionnel, authenticated;
;
