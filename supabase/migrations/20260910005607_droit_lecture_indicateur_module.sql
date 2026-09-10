-- La table etait creee avec sa politique RLS mais sans droit SELECT : la
-- politique autorisait une lecture que le role n'avait pas le droit de tenter.
-- Les deux sont necessaires, RLS filtre des lignes, elle n'accorde pas l'acces.
grant select on observatoire.indicateur_module to authenticated;;
