-- Document 15 section 5, amendant le document 3 section 11.
-- Un indicateur appartient a plusieurs modules : une colonne sur `indicateur`
-- n'en retiendrait qu'un et fausserait le comptage qu'elle devait produire.
create table if not exists observatoire.indicateur_module (
  code_indicateur text not null references observatoire.indicateur(code) on delete cascade,
  code_module text not null,
  ordre integer,
  -- Vrai pour le module d'origine de l'indicateur, faux la ou il est repris.
  principal boolean not null default false,
  primary key (code_indicateur, code_module)
);

create index if not exists indicateur_module_par_module
  on observatoire.indicateur_module (code_module);

alter table observatoire.indicateur_module enable row level security;

-- Le rattachement est du referentiel, pas de la donnee sensible : il alimente
-- les cartes d'acces de la synthese et la fiche methodologique, visibles de
-- tout compte valide.
drop policy if exists "indicateur_module lecture" on observatoire.indicateur_module;
create policy "indicateur_module lecture"
on observatoire.indicateur_module for select
to authenticated
using (exists (select 1 from observatoire.compte_valide()));

-- Les indicateurs de contexte du document 4 section 11 n'avaient jamais ete
-- charges. CTX_RECENSEMENT_PROGRESSION est au rang 3 des blocs cles du profil
-- ADMIN (document 15, section 1) : sans lui, l'ecran d'atterrissage interne
-- est incomplet.
insert into observatoire.indicateur
  (code, libelle_fr, libelle_en, definition_fr, definition_en, formule, unite, decimales, statut_donnee, regle_masquage, frequence_rafraichissement, pieges)
values
  ('CTX_RECENSEMENT_PROGRESSION', 'Progression du recensement', 'Survey progress',
   'Nombre de fiches d''etablissement creees par semaine, par territoire et par source de recensement.',
   'Number of establishment records created per week, by territory and by survey source.',
   'Fiches creees par semaine, par territoire et par source', 'entier', 0, 'RECENSE', 'M0', 'Quotidienne',
   'Pilotage interne mais publiable : montrer a une institution la progression de l''inventaire national transforme un effort commercial en indicateur suivi conjointement.'),
  ('CTX_FRAICHEUR_DONNEE', 'Fraicheur de la donnee', 'Data freshness',
   'Date et heure du dernier rafraichissement, par module.',
   'Date and time of the last refresh, by module.',
   'Date et heure du dernier rafraichissement, par module', 'horodatage', 0, 'RECENSE', 'M0', 'Continue',
   'Affichee sur chaque bloc, jamais masquable.')
on conflict (code) do nothing;;
