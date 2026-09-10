-- Migration 3 : tables d'enumeration
-- Document 3, section 3. Document 11, rang 3.

create table observatoire.enumeration (
  domaine text not null,
  code text not null,
  libelle_fr text not null,
  libelle_en text,
  ordre integer,
  actif boolean not null default true,
  primary key (domaine, code)
);
alter table observatoire.enumeration enable row level security;

create table observatoire.gamme_tarifaire_borne (
  code_gamme text not null,
  borne_min_gnf integer,
  borne_max_gnf integer,
  date_effet date not null,
  courante boolean not null default false,
  primary key (code_gamme, date_effet)
);
alter table observatoire.gamme_tarifaire_borne enable row level security;
;
