-- Migration 14 : cles etrangeres vers enumeration laissees en attente en migration 2
-- Technique de la colonne generee : une FK simple ne peut pas cibler
-- "enumeration(domaine, code) avec domaine fixe" directement en Postgres.

alter table observatoire.territoire
  add column niveau_domaine text generated always as ('NIVEAU_TERRITOIRE') stored,
  add constraint territoire_niveau_fkey
    foreign key (niveau_domaine, niveau) references observatoire.enumeration(domaine, code);

alter table observatoire.territoire
  add constraint territoire_nature_check check (nature is null or nature in ('URBAINE','RURALE'));

alter table observatoire.territoire_accessibilite
  add column etat_route_domaine text generated always as ('ETAT_ROUTE') stored,
  add constraint territoire_accessibilite_etat_route_fkey
    foreign key (etat_route_domaine, etat_route) references observatoire.enumeration(domaine, code);

alter table observatoire.territoire_accessibilite
  add column praticabilite_domaine text generated always as ('PRATICABILITE') stored,
  add constraint territoire_accessibilite_praticabilite_fkey
    foreign key (praticabilite_domaine, praticabilite_saison_pluies) references observatoire.enumeration(domaine, code);
;
