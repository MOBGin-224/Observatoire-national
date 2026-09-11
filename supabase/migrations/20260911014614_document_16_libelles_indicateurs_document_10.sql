-- Les libelles d'indicateur affiches a l'ecran viennent de la table indicateur,
-- qui doit reprendre au mot pres le document 10, section 8.
--
-- CONF_ECART_ENREGISTREMENT : critere L.10.5 du document 9 quater. La base
-- portait "Ecart d'enregistrement", intitule que la fiche L.7 ecarte au profit
-- d'un constat qui ne se lit pas comme une denonciation.
-- EVE_CAPACITE_MOBILISABLE : la base reprenait le titre de fiche du document 4
-- ("... sur une fenetre"), le document 10 retient "Capacite mobilisable" ; la
-- fenetre est deja nommee par le bandeau de la zone 1.
update observatoire.indicateur
set libelle_fr = 'Établissements dont l''enregistrement n''est pas documenté',
    libelle_en = 'Establishments with undocumented registration'
where code = 'CONF_ECART_ENREGISTREMENT';

update observatoire.indicateur
set libelle_fr = 'Capacité mobilisable',
    libelle_en = 'Mobilisable capacity'
where code = 'EVE_CAPACITE_MOBILISABLE';
