-- Rattachement principal, deduit de la structure en familles du document 4 :
-- chaque section du dictionnaire correspond a un module d'origine.
insert into observatoire.indicateur_module (code_indicateur, code_module, principal, ordre)
select i.code,
       case split_part(i.code, '_', 1)
         when 'OFF'  then 'M1_OFFRE'
         when 'DEM'  then 'M2_DEMANDE'
         when 'ACT'  then 'M3_ACTIVITE'
         when 'TEN'  then 'M4_TENSION'
         when 'CONF' then 'M5_CONFORMITE'
         when 'MAT'  then 'M6_MATURITE'
         when 'EVE'  then 'M7_EVENEMENTIEL'
         -- Document 4 section 6 : la demande institutionnelle est restituee
         -- dans le module evenementiel, ou elle est confrontee a la capacite.
         when 'INS'  then 'M7_EVENEMENTIEL'
         when 'RET'  then 'M8_RETOMBEES'
         -- Les indicateurs de contexte pilotent la collecte : leur module
         -- d'origine est l'administration. A confirmer par le document 4.
         when 'CTX'  then 'M11_ADMIN'
       end,
       true,
       row_number() over (partition by split_part(i.code, '_', 1) order by i.code)
from observatoire.indicateur i
on conflict (code_indicateur, code_module) do nothing;

-- Reprises explicitement listees au document 15, section 5.1.
insert into observatoire.indicateur_module (code_indicateur, code_module, principal)
values
  ('OFF_ETAB_RECENSES', 'M5_CONFORMITE', false),
  ('OFF_ETAB_RECENSES', 'M6_MATURITE', false),
  ('OFF_ETAB_RECENSES', 'M7_EVENEMENTIEL', false),
  ('OFF_CAPACITE_RECENSEE', 'M7_EVENEMENTIEL', false),
  ('OFF_COMPLETUDE_FICHE', 'M5_CONFORMITE', false),
  ('OFF_TAUX_VERIFICATION', 'M5_CONFORMITE', false),
  ('TEN_TAUX_INFRUCTUEUX', 'M7_EVENEMENTIEL', false)
on conflict (code_indicateur, code_module) do nothing;

-- Reprises dans la synthese : tout indicateur cite par une liste de blocs cles
-- du document 9 bis section F.4, profil ADMIN compris.
insert into observatoire.indicateur_module (code_indicateur, code_module, principal)
select unnest(array[
  'OFF_ETAB_RECENSES','OFF_CAPACITE_RECENSEE','OFF_TAUX_COUVERTURE','OFF_TAUX_RESERVABILITE',
  'OFF_TAUX_NUMERISATION','OFF_TAUX_VERIFICATION','OFF_COMPLETUDE_FICHE',
  'MAT_INDICE','DEM_VOLUME_RECHERCHES','DEM_BOOKING_WINDOW',
  'TEN_TAUX_INFRUCTUEUX','TEN_CAPACITE_MANQUANTE','TEN_FENETRES_SATURATION',
  'INS_DEFICIT','CONF_TAUX_ENREGISTREMENT','CONF_TAUX_CLASSIFICATION',
  'EVE_CAPACITE_MOBILISABLE','EVE_CAPACITE_SALLES','CTX_RECENSEMENT_PROGRESSION'
]), 'M9_SYNTHESE', false
on conflict (code_indicateur, code_module) do nothing;;
