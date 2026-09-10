-- Migration 20 : l'appel de fonction dans une vue n'herite PAS des droits du
-- proprietaire de la vue (contrairement a l'acces aux tables) : Postgres verifie
-- le droit EXECUTE du role appelant reel a chaque appel. Sans danger a accorder :
-- ces fonctions restent SECURITY DEFINER et filtrent strictement par auth.uid(),
-- on ne peut donc jamais lire que ses propres droits, jamais ceux d'un autre compte.

grant execute on function observatoire.compte_valide() to authenticated;
grant execute on function observatoire.module_actif(text) to authenticated;
grant execute on function observatoire.territoire_visible(text) to authenticated;
;
