create view observatoire.acces_tension_national
with (security_invoker = false) as
select v.*
from observatoire.mv_tension_national v
where exists (select 1 from observatoire.compte_valide())
  and observatoire.module_actif('M4_TENSION');

revoke all on observatoire.mv_tension_national from public;
grant select on observatoire.acces_tension_national to role_institutionnel, authenticated;
;
