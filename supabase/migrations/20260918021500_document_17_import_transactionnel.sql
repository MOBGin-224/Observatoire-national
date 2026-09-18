-- Document 17, partie D.5. Caractere transactionnel de l'import.
--
-- L'import ecrivait les etablissements, puis les equipements, en deux passes
-- distinctes. Un echec en seconde passe laissait les fiches sans leurs
-- equipements, sans trace de l'echec, et sans moyen de distinguer un
-- equipement absent d'un equipement non importe. Un inventaire corrompu en
-- silence.
--
-- Les deux ecritures passent desormais par cette fonction, donc par une seule
-- transaction : un echec sur les equipements annule les etablissements.
--
-- SECURITY INVOKER, volontairement. La fonction ne donne aucun droit
-- supplementaire : les politiques RLS s'appliquent a l'appelant exactement
-- comme lorsque l'application inserait elle-meme. Elle n'apporte que
-- l'atomicite.

create or replace function observatoire.importer_recensement(
  p_etablissements jsonb,
  p_equipements jsonb
)
returns integer
language plpgsql
set search_path to ''
as $$
declare
  v_nb integer;
begin
  -- Les colonnes absentes de la liste gardent leur valeur par defaut :
  -- created_at, updated_at et les champs non collectes par le recensement.
  insert into observatoire.etablissement (
    id, nom, typologie, code_commune, quartier, adresse_texte,
    latitude, longitude, precision_geo, capacite_unites, capacite_source,
    gamme_tarifaire, telephone_1, telephone_2, whatsapp, email, site_web,
    reservation_en_ligne, source_recensement, statut_relation,
    statut_verification, notes, actif
  )
  select id, nom, typologie, code_commune, quartier, adresse_texte,
         latitude, longitude, precision_geo, capacite_unites, capacite_source,
         gamme_tarifaire, telephone_1, telephone_2, whatsapp, email, site_web,
         reservation_en_ligne, source_recensement, statut_relation,
         statut_verification, notes, actif
  from jsonb_to_recordset(p_etablissements) as e(
    id uuid,
    nom text,
    typologie text,
    code_commune text,
    quartier text,
    adresse_texte text,
    latitude numeric,
    longitude numeric,
    precision_geo text,
    capacite_unites integer,
    capacite_source text,
    gamme_tarifaire text,
    telephone_1 text,
    telephone_2 text,
    whatsapp text,
    email text,
    site_web text,
    reservation_en_ligne boolean,
    source_recensement text,
    statut_relation text,
    statut_verification text,
    notes text,
    actif boolean
  );

  get diagnostics v_nb = row_count;

  -- Une ligne par equipement renseigne. Une cellule vide n'en produit aucune,
  -- le tri est fait par l'application au moment de l'analyse du fichier.
  insert into observatoire.etablissement_equipement (
    id_etablissement, code_equipement, disponible, capacite, source
  )
  select id_etablissement, code_equipement, disponible, capacite, source
  from jsonb_to_recordset(p_equipements) as q(
    id_etablissement uuid,
    code_equipement text,
    disponible boolean,
    capacite integer,
    source text
  );

  return v_nb;
end;
$$;

revoke all on function observatoire.importer_recensement(jsonb, jsonb) from public, anon;
grant execute on function observatoire.importer_recensement(jsonb, jsonb) to authenticated;
