-- Migration 19 : correction du dernier maillon de la chaine de permissions.
-- Ces fonctions internes doivent lire compte_institutionnel/compte_module
-- quel que soit le role appelant (authenticated n'a et ne doit jamais avoir
-- ce droit directement, document 6 section 1.3). Elles passent donc en
-- SECURITY DEFINER, comme mon_compte()/mes_modules(). Le filtrage par
-- auth.uid() a l'interieur de chaque fonction reste ce qui empeche toute
-- fuite : on ne peut jamais lire que sa PROPRE ligne.
-- Retrait de l'execution publique par defaut (Postgres l'accorde a PUBLIC
-- a la creation) : ce sont des briques internes, pas une API a exposer.

alter function observatoire.compte_valide() security definer;
alter function observatoire.module_actif(text) security definer;
alter function observatoire.territoire_visible(text) security definer;

revoke execute on function observatoire.compte_valide() from public;
revoke execute on function observatoire.module_actif(text) from public;
revoke execute on function observatoire.territoire_visible(text) from public;
;
