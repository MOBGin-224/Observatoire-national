# Document 3. Modèle de données

**Projet :** Observatoire National de l'Hospitalité Guinéenne
**Maître d'ouvrage :** SIMANDOU SEJOUR
**Version :** 1.0
**Statut :** Prescriptif. Schéma à implémenter tel quel.
**Prérequis :** documents 1 et 2.

---

## 1. Principes

**Postgres via Supabase.** Toutes les tables dans un schéma applicatif dédié, jamais dans `public`.

**Trois familles de tables.** Le référentiel, qui décrit le monde. Les faits, qui enregistrent ce qui se passe. L'administration, qui gère les accès. Les agrégats ne sont jamais stockés en dur : ils sont calculés par vues matérialisées.

**Identifiants.** UUID en clé primaire partout, sauf pour le référentiel territorial qui utilise ses codes stables comme clés naturelles. Raison : le territoire est une donnée de référence externe et versionnée, ses codes doivent rester lisibles dans les requêtes.

**Horodatage.** Toute table de fait porte `created_at` et `updated_at` en `timestamptz`. Stockage en UTC, affichage en Africa/Conakry.

**Cible d'alimentation externe.** Les tables de faits sont conçues pour être remplies aussi bien par saisie que par un flux venu de simandousejour.com. Chacune porte un champ `source_donnee` et un `id_externe`, nul tant que le raccordement n'est pas fait.

**Cloisonnement.** Aucune table ne contient de donnée financière de Simandou Séjour ni de donnée personnelle de voyageur. Le modèle ne prévoit aucun champ pour les accueillir. C'est une garantie structurelle, pas une consigne.

---

## 2. Référentiel territorial

### `territoire`

Table unique et hiérarchique couvrant les trois niveaux. Un seul modèle vaut mieux que trois tables : tous les filtres et agrégats remontent la hiérarchie de la même façon.

| Champ | Type | Note |
|---|---|---|
| `code` | text, PK | Forme `05`, `05-03`, `05-03-02` |
| `niveau` | text FK | `REGION`, `PREFECTURE`, `COMMUNE` |
| `libelle` | text | Libellé officiel |
| `code_parent` | text FK vers `territoire` | Nul pour les régions |
| `nature` | text | `URBAINE` ou `RURALE`, communes uniquement |
| `version_decoupage` | text FK | |
| `code_equivalent_anterieur` | text | Correspondance ancien vers nouveau |
| `actif` | boolean | Faux si supprimé par une réforme |

### `version_decoupage`

| Champ | Type | Note |
|---|---|---|
| `code` | text, PK | Exemple `V2026-08` |
| `libelle` | text | |
| `source` | text | Autorité émettrice |
| `date_effet` | date | |
| `courante` | boolean | Une seule vraie à la fois |

Cette table est ce qui permet d'expliquer, dans deux ans, pourquoi deux exports diffèrent.

### `territoire_variante`

| Champ | Type |
|---|---|
| `id` | uuid, PK |
| `code_territoire` | text FK |
| `variante` | text |

Alimente le rattachement automatique lors des imports et la normalisation des destinations saisies par les visiteurs.

### `territoire_geometrie`

| Champ | Type | Note |
|---|---|---|
| `code_territoire` | text, PK, FK | |
| `geometrie` | jsonb | Contour GeoJSON |
| `centroide_lat`, `centroide_lng` | numeric | Point de repli si le contour manque |
| `source` | text | |
| `version_decoupage` | text FK | |

Table séparée volontairement : les contours sont volumineux et ne doivent pas alourdir les requêtes du référentiel. Au démarrage elle sera partiellement vide, les contours du découpage du 20 août 2026 n'existant dans aucune source publique. **L'application doit fonctionner sans, en se rabattant sur les centroïdes.**

### `territoire_accessibilite`

Une ligne par territoire, saisie une fois puis mise à jour ponctuellement. Détermine si un déficit d'offre est un problème d'investissement ou un problème de désenclavement.

| Champ | Type | Note |
|---|---|---|
| `code_territoire` | text, PK, FK | Niveau préfecture ou commune |
| `distance_conakry_km` | integer | |
| `temps_trajet_conakry_min` | integer | Trajet routier en conditions normales |
| `etat_route` | text FK | |
| `praticabilite_saison_pluies` | text FK | Point décisif en Guinée |
| `infrastructures_transport` | text[] | Valeurs de l'énumération `INFRA_TRANSPORT` |
| `aeroport_le_plus_proche` | text | |
| `distance_aeroport_km` | integer | |
| `source` | text | |
| `date_maj` | date | |

Une commune en déficit d'offre à trois heures de Conakry et une commune en déficit à onze heures, impraticable six mois par an, ne posent pas le même problème. Sans cette table, le module Tension produit un classement que l'on ne sait pas interpréter.

---

## 3. Tables d'énumération

### `enumeration`

Modèle unique pour toutes les listes du document 2.

| Champ | Type |
|---|---|
| `domaine` | text, PK composite |
| `code` | text, PK composite |
| `libelle_fr` | text |
| `libelle_en` | text |
| `ordre` | integer |
| `actif` | boolean |

**Domaines :** `NIVEAU_TERRITOIRE`, `TYPOLOGIE`, `GAMME`, `STATUT_RELATION`, `STATUT_RESULTAT`, `STATUT_DONNEE`, `FIABILITE`, `SOURCE_RECENSEMENT`, `STATUT_VERIFICATION`, `PROFIL`, `NIVEAU_GEO`, `MODULE`, `CANAL`, `APPAREIL`, `MOTIF_SEJOUR`, `LANGUE`, `CONSENTEMENT`, `TYPE_EVENEMENT`, `RECURRENCE`, `PORTEE_EVENEMENT`, `STATUT_TERRAIN`, `EQUIPEMENT`, `TYPE_DEMANDE_INST`, `STATUT_DEMANDE_INST`, `ETAT_ROUTE`, `PRATICABILITE`, `INFRA_TRANSPORT`.

Une seule table plutôt que vingt-sept. Les clés étrangères pointent sur le couple domaine et code.

### `gamme_tarifaire_borne`

Les gammes ont besoin de bornes chiffrées et versionnées, ce que la table générique ne porte pas.

| Champ | Type |
|---|---|
| `code_gamme` | text |
| `borne_min_gnf` | integer |
| `borne_max_gnf` | integer |
| `date_effet` | date |
| `courante` | boolean |

---

## 4. Établissements

### `etablissement`

Table pivot de tout l'Observatoire. Elle contient aussi bien les établissements simplement recensés que les partenaires commercialisés.

| Champ | Type | Note |
|---|---|---|
| `id` | uuid, PK | |
| `id_externe` | text | Identifiant sur la plateforme, nul avant raccordement |
| `nom` | text | |
| `typologie` | text FK | |
| `statut_relation` | text FK | Distingue recensé et partenaire |
| `code_commune` | text FK vers `territoire` | Niveau le plus fin renseigné |
| `quartier` | text | Texte libre, jamais agrégé |
| `adresse_texte` | text | Repère local |
| `latitude`, `longitude` | numeric | |
| `precision_geo` | text | `RELEVE`, `ESTIME`, `ABSENT` |
| `capacite_unites` | integer | |
| `capacite_source` | text | `DECLAREE`, `ESTIMEE`, `VERIFIEE` |
| `gamme_tarifaire` | text FK | |
| `tarif_min_gnf`, `tarif_max_gnf` | integer | Observés |
| `site_web`, `facebook`, `instagram` | text | |
| `reservation_en_ligne` | boolean | Canal réel, pas simple présence |
| `presence_ota` | text[] | |
| `telephone_1`, `telephone_2`, `whatsapp` | text | Format international |
| `email` | text | |
| `source_recensement` | text FK | |
| `statut_verification` | text FK | |
| `date_derniere_verification` | date | |
| `consentement_publication` | text FK | |
| `actif` | boolean | |
| `notes` | text | |
| `created_at`, `updated_at` | timestamptz | |

**Champ calculé, non stocké :** `completude_fiche`, score de 0 à 100 défini dans le dictionnaire des indicateurs. Calculé en vue, jamais figé en base.

**Contrainte :** un établissement en `PARTENAIRE_ACTIF` doit avoir `capacite_unites` non nul. Sans capacité, aucun taux d'occupation n'est calculable.

### `etablissement_equipement`

Services et équipements. Alimente la conformité, la maturité numérique et la réponse aux besoins événementiels.

| Champ | Type | Note |
|---|---|---|
| `id_etablissement` | uuid, PK composite, FK | |
| `code_equipement` | text, PK composite, FK | |
| `disponible` | boolean | |
| `capacite` | integer | Nombre de places, pour les salles de réunion |
| `source` | text FK | |
| `date_verification` | date | |

Le champ `capacite` est ce qui permet de répondre à la question d'un organisateur de sommet : combien de salles de cent places existent à Kankan.

### `etablissement_historique`

Trace les changements de statut de relation et de capacité.

| Champ | Type |
|---|---|
| `id` | uuid, PK |
| `id_etablissement` | uuid FK |
| `champ` | text |
| `valeur_avant`, `valeur_apres` | text |
| `date_effet` | timestamptz |

Sans cette table, un établissement passé de recensé à partenaire fausse rétroactivement tout l'historique de couverture.

### `retour_terrain`

Enregistre ce que les collecteurs constatent et qui ne tient pas dans une fiche : établissement fermé, numéro invalide, adresse introuvable, refus motivé.

| Champ | Type | Note |
|---|---|---|
| `id` | uuid, PK | |
| `id_etablissement` | uuid FK | Nul si l'établissement s'est révélé inexistant |
| `nom_declare` | text | Renseigné quand aucune fiche n'existe |
| `code_territoire` | text FK | |
| `statut_terrain` | text FK | |
| `commentaire` | text | |
| `collecteur` | text | |
| `source_recensement` | text FK | |
| `horodatage` | timestamptz | |

Deux usages. Elle pilote la qualité du recensement en interne. Et elle produit un résultat publiable : « vingt-trois établissements figurant sur la liste administrative se sont révélés définitivement fermés » est une information que l'État n'a pas.

---

## 5. Demande exprimée

### `recherche`

Un enregistrement par recherche soumise.

| Champ | Type | Note |
|---|---|---|
| `id` | uuid, PK | |
| `id_session` | text | |
| `horodatage` | timestamptz | |
| `destination_saisie` | text | Brut, non normalisé |
| `code_territoire_normalise` | text FK | Nul si non reconnu |
| `destination_non_reconnue` | boolean | |
| `date_arrivee`, `date_depart` | date | |
| `nb_nuits` | integer | |
| `nb_voyageurs`, `nb_unites` | integer | |
| `budget_min_gnf`, `budget_max_gnf` | integer | Nuls si non filtré |
| `typologie_filtree` | text FK | |
| `motif_sejour` | text FK | |
| `pays_utilisateur` | text | Code ISO, dérivé de l'adresse réseau |
| `geo_fine_lat`, `geo_fine_lng` | numeric | Position navigateur si accordée. **Stockée, jamais publiée** |
| `type_appareil` | text FK | |
| `langue_interface` | text FK | |
| `canal` | text FK | |
| `source_trafic` | text | Direct, moteur, social, campagne |
| `utilisateur_connecte` | boolean | |
| `source_donnee` | text | |

L'adresse réseau brute n'est jamais stockée. Seul le pays dérivé l'est.

### `resultat_recherche`

Un enregistrement par recherche. Table séparée car elle porte le module Tension et sa logique évoluera.

| Champ | Type |
|---|---|
| `id_recherche` | uuid, PK, FK |
| `nb_resultats_total` | integer |
| `nb_resultats_disponibles` | integer |
| `nb_etablissements_recenses_zone` | integer |
| `statut_resultat` | text FK |

`statut_resultat` prend une des cinq valeurs du document 2. Il est **calculé au moment de l'enregistrement**, jamais déduit ultérieurement : le nombre d'établissements recensés dans une zone évolue, une reconstitution a posteriori serait fausse.

### `consultation_etablissement`

| Champ | Type |
|---|---|
| `id` | uuid, PK |
| `id_recherche` | uuid FK |
| `id_etablissement` | uuid FK |
| `position_liste` | integer |
| `horodatage` | timestamptz |

---

## 6. Demande institutionnelle déclarée

Second visage de la demande. La demande institutionnelle ne passe presque jamais par une plateforme : elle s'annonce par courrier, par réunion ou par appel. Sans cette table, le module Événementiel n'a rien à comparer à la capacité disponible.

### `demande_institutionnelle`

| Champ | Type | Note |
|---|---|---|
| `id` | uuid, PK | |
| `libelle` | text | Nom de l'événement ou de la mission |
| `id_institution` | uuid FK | Nul si l'organisation n'est pas un compte |
| `organisation_declarante` | text | |
| `type_demande` | text FK | |
| `code_territoire` | text FK | |
| `date_debut`, `date_fin` | date | |
| `nb_personnes` | integer | |
| `nb_unites_demandees` | integer | |
| `gamme_souhaitee` | text FK | |
| `besoin_salle` | boolean | |
| `capacite_salle_requise` | integer | |
| `nb_unites_couvertes` | integer | Renseigné après coup |
| `statut` | text FK | |
| `date_declaration` | date | |
| `source` | text | |
| `notes` | text | |

L'écart entre `nb_unites_demandees` et la capacité mobilisable du territoire aux dates concernées est l'indicateur produit par cette table. Le champ `nb_unites_couvertes` documente ce qui a effectivement été absorbé.

---

## 7. Contexte de la demande

Sans contexte, un pic de recherches sur Beyla en novembre est une courbe sans explication. Cette table transforme des variations en récits lisibles par une institution.

### `evenement_calendrier`

| Champ | Type | Note |
|---|---|---|
| `id` | uuid, PK | |
| `libelle` | text | |
| `type_evenement` | text FK | Sommet, fête, vacances, saison, compétition |
| `portee` | text FK | Locale, nationale, internationale |
| `code_territoire` | text FK | Nul égale national |
| `date_debut`, `date_fin` | date | |
| `recurrence` | text FK | `PONCTUEL` ou `ANNUEL` |
| `description` | text | |
| `source` | text | |
| `created_at` | timestamptz | |

Alimentée manuellement. Contient aussi bien les sommets et forums que les jours fériés, les vacances scolaires, les fêtes religieuses et les saisons sèche et des pluies.

---

## 8. Activité observée

### `reservation`

| Champ | Type | Note |
|---|---|---|
| `id` | uuid, PK | |
| `id_externe` | text | |
| `id_etablissement` | uuid FK | |
| `id_recherche` | uuid FK | Nul si réservation hors parcours de recherche |
| `date_reservation` | timestamptz | |
| `date_arrivee`, `date_depart` | date | |
| `nb_nuits`, `nb_unites` | integer | |
| `montant_hebergement_gnf` | integer | **Hébergement seul** |
| `pays_origine` | text | Déclaré, non dérivé |
| `motif_sejour` | text FK | |
| `statut` | text | `CONFIRMEE`, `ANNULEE`, `NON_PRESENTATION`, `HONOREE` |
| `date_changement_statut` | timestamptz | |
| `source_donnee` | text | |

Aucun champ de commission, de marge, de frais ni de moyen de paiement. Le montant hébergement seul est ce qui rend l'ADR comparable aux référentiels du secteur.

### `inventaire_quotidien`

Table sans laquelle aucun taux d'occupation n'existe.

| Champ | Type |
|---|---|
| `id_etablissement` | uuid, PK composite, FK |
| `date` | date, PK composite |
| `unites_disponibles` | integer |
| `unites_vendues` | integer |
| `tarif_moyen_gnf` | integer |
| `etablissement_actif` | boolean |
| `source_donnee` | text |

`etablissement_actif` évite qu'une fermeture temporaire soit comptée comme de l'invendu et effondre artificiellement le taux d'occupation du périmètre.

---

## 9. Conformité et classification

### `conformite_etablissement`

Conteneur destiné au profil Tutelle. Vide au lancement, alimenté si l'administration transmet ses données.

| Champ | Type |
|---|---|
| `id_etablissement` | uuid, PK, FK |
| `enregistrement_administratif` | boolean |
| `reference_enregistrement` | text |
| `statut_classification` | text |
| `date_classification` | date |
| `date_dernier_controle` | date |
| `source` | text |

Le module vide est l'offre faite au ministère, pas un défaut.

---

## 10. Accès institutionnels

### `institution`

| Champ | Type |
|---|---|
| `id` | uuid, PK |
| `denomination` | text |
| `type` | text |
| `logo_url` | text |
| `convention_reference` | text |
| `convention_debut`, `convention_fin` | date |
| `actif` | boolean |

**Aucun nom d'institution n'est écrit dans le code.** Tout passe par cette table.

### `compte_institutionnel`

| Champ | Type | Note |
|---|---|---|
| `id` | uuid, PK | Correspond à l'identifiant Supabase Auth |
| `id_institution` | uuid FK | |
| `nom`, `prenom` | text | Compte nominatif obligatoire |
| `fonction` | text | |
| `email` | text | |
| `profil` | text FK | |
| `code_territoire_perimetre` | text FK | Nul égale national |
| `granularite_max` | text FK | |
| `langue` | text FK | |
| `date_expiration` | date | |
| `statut` | text | `ACTIF`, `SUSPENDU`, `EXPIRE` |

Aucun compte générique, aucun compte au nom d'une direction. **Inscription libre désactivée, création par invitation uniquement.**

### `compte_module`

| Champ | Type |
|---|---|
| `id_compte` | uuid, PK composite, FK |
| `code_module` | text, PK composite, FK |
| `actif` | boolean |

À implémenter dès maintenant même si tous les modules sont ouverts. Quelques heures aujourd'hui, une refonte plus tard.

### `journal_acces`

| Champ | Type |
|---|---|
| `id` | uuid, PK |
| `id_compte` | uuid FK |
| `horodatage` | timestamptz |
| `module` | text FK |
| `filtres` | jsonb |
| `action` | text |
| `adresse_connexion` | text |

Renseigne aussi sur ce qui intéresse réellement chaque institution, ce qui orientera les développements suivants mieux qu'une réunion.

### `export`

| Champ | Type | Note |
|---|---|---|
| `id` | uuid, PK | |
| `reference` | text | Identifiant imprimé en pied de document |
| `id_compte` | uuid FK | |
| `horodatage` | timestamptz | |
| `module` | text FK | |
| `perimetre` | jsonb | |
| `empreinte_contenu` | text | |
| `version_indicateurs` | text | |

Si un document fuite, la référence dit d'où il vient. Si un chiffre est contesté six mois plus tard, l'empreinte et la version permettent de régénérer l'état exact de la donnée.

---

## 11. Indicateurs et méthodologie

### `indicateur`

Le dictionnaire vit en base, pas seulement dans un fichier. C'est ce qui alimente le module Méthodologie visible dans l'outil.

| Champ | Type |
|---|---|
| `code` | text, PK |
| `libelle_fr`, `libelle_en` | text |
| `definition_fr`, `definition_en` | text |
| `formule` | text |
| `unite` | text |
| `decimales` | integer |
| `statut_donnee` | text FK |
| `regle_masquage` | text |
| `seuil_consolide`, `seuil_indicatif` | integer |
| `frequence_rafraichissement` | text |
| `pieges` | text |

### `version_indicateur`

| Champ | Type |
|---|---|
| `code_indicateur` | text FK |
| `version` | text |
| `formule` | text |
| `date_debut`, `date_fin` | date |

Le jour où une formule est affinée, les exports antérieurs doivent rester explicables.

---

## 12. Agrégats

Aucun agrégat n'est stocké en table. Vues matérialisées, rafraîchies par tâche planifiée, une par couple module et niveau géographique.

Nommage : `mv_<module>_<niveau>`, par exemple `mv_offre_commune`, `mv_tension_prefecture`.

Chaque vue applique la règle de masquage et expose systématiquement trois colonnes de contexte : effectif de l'échantillon, niveau de fiabilité, horodatage du calcul. L'application n'a jamais à recalculer un seuil, la vue lui livre le verdict.

Restent en lecture directe, sans matérialisation, les compteurs de volume brut des modules Offre et Demande, qui doivent apparaître en temps réel.

---

## 13. Sécurité

RLS activée sur **toutes** les tables. Aucune exception.

Politique générale : un compte institutionnel n'accède qu'aux vues matérialisées, jamais aux tables de faits. Les tables `etablissement`, `recherche`, `reservation`, `inventaire_quotidien` et `retour_terrain` ne sont lisibles par aucun rôle institutionnel.

Le filtrage par périmètre géographique et par module s'applique au niveau de la base et non de l'application. Un oubli dans un écran ne doit jamais pouvoir exposer une donnée : la base refuse la ligne.

Trois rôles : `role_institutionnel` en lecture sur les vues uniquement, `role_admin` interne, `role_ingestion` en écriture sur les tables de faits pour le futur flux d'alimentation.

---

## 14. Points ouverts

1. Bornes GNF des gammes tarifaires, prérequis à `gamme_tarifaire_borne`.
2. Format d'échange du futur flux d'alimentation, à définir au moment du raccordement.
3. Source des contours géographiques du découpage du 20 août 2026, non disponible publiquement à ce jour.
4. Source des distances et temps de trajet pour `territoire_accessibilite`.
5. Durée de conservation des enregistrements de recherche, à trancher au regard du cadre guinéen de protection des données.

---

*Document 3 sur 12. Documents précédents : note de cadrage produit, taxonomies et référentiels. Document suivant : dictionnaire des indicateurs.*
