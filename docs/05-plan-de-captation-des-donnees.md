# Document 5. Plan de captation des données

**Projet :** Observatoire National de l'Hospitalité Guinéenne
**Maître d'ouvrage :** SIMANDOU SEJOUR
**Version :** 1.0
**Statut :** Prescriptif. Définit ce qui est capté, quand, et par quel canal.
**Prérequis :** documents 1 à 4.

---

## 1. Objet

Ce document décrit comment chaque donnée entre dans l'Observatoire.

Il est organisé **par question métier** et non par champ technique. Chaque bloc énonce la question à laquelle la donnée sert, la source, le déclencheur, les champs, les indicateurs alimentés, et ce qui devient impossible sans elle.

Ce format oblige à justifier chaque champ par un usage. Il élimine la collecte inutile, qui est un risque juridique gratuit, et il empêche l'oubli d'un champ dont on ne mesure la nécessité qu'au moment de construire l'écran, c'est à dire trop tard.

---

## 2. Les quatre canaux d'alimentation

| Canal | Nature | Disponible au lancement |
|---|---|---|
| C1. Recensement | Collecte terrain et téléphonique, saisie et import | Oui |
| C2. Saisie institutionnelle | Saisie manuelle interne | Oui |
| C3. Flux plateforme | Alimentation continue depuis simandousejour.com | Non, phase ultérieure |
| C4. Transmission administrative | Données remises par une administration | Non, conditionné à une convention |

**Conséquence majeure de conception.** Au lancement, seuls C1 et C2 fonctionnent. Toute table alimentée par C3 doit donc être vide et l'application doit rester lisible dans cet état. Les modules `M3_ACTIVITE` et une partie de `M2_DEMANDE` seront vides ou quasi vides, ce qui est normal et prévu.

**Règle d'idempotence.** Toute alimentation par C3 et C4 doit pouvoir être rejouée sans créer de doublon. Clé de rapprochement : `id_externe` pour les entités issues de la plateforme, `reference_enregistrement` pour les données administratives.

---

## 3. Recensement de l'offre (canal C1)

### Question métier
Quelle est l'offre d'hébergement existant en Guinée, indépendamment de toute relation commerciale.

### Source
Listes administratives, sources ouvertes, pages sociales des établissements, qualification téléphonique, vérification terrain.

### Déclencheur
Création ou mise à jour d'une fiche par un collecteur, ou import d'un lot.

### Table cible
`etablissement`, plus `etablissement_equipement` et `retour_terrain`.

### Champs obligatoires pour qu'une fiche compte comme recensée

| Champ | Raison |
|---|---|
| `nom` | Identification |
| `typologie` | Toute répartition par nature |
| `code_commune` | Tout agrégat géographique |
| `latitude`, `longitude` | Cartographie |
| `telephone_1` | Vérifiabilité de la fiche |
| `capacite_unites` | Toute mesure de capacité |
| `gamme_tarifaire` | Répartition par niveau de prix |
| `reservation_en_ligne` | Indicateur central de numérisation |
| `source_recensement` | Traçabilité |
| `statut_relation` | Distinction recensé / partenaire |

Une fiche à laquelle manque l'un de ces champs est enregistrée mais comptée comme incomplète. Elle apparaît dans `OFF_ETAB_RECENSES` et pèse sur `OFF_COMPLETUDE_FICHE`.

### Champs complémentaires
`quartier`, `adresse_texte`, `precision_geo`, `capacite_source`, `tarif_min_gnf`, `tarif_max_gnf`, `site_web`, `facebook`, `instagram`, `presence_ota`, `telephone_2`, `whatsapp`, `email`, `statut_verification`, `date_derniere_verification`, `consentement_publication`, `notes`.

### Indicateurs alimentés
Toute la famille `OFF_`, toute la famille `MAT_`, et le dénominateur de `TEN_INDICE_TENSION`.

### Sans cette collecte
Le module `M1_OFFRE` est vide, le module `M6_MATURITE` est impossible, et le module `M4_TENSION` ne peut pas distinguer `AUCUNE_OFFRE` de `NON_RESERVABLE`. C'est à dire que l'Observatoire n'existe pas.

### Règles de collecte

- **Une ligne, un établissement.** Aucune cellule fusionnée, aucune couleur porteuse de sens.
- **Listes fermées obligatoires** sur tous les champs énumérés. Sans validation de saisie, `Hotel`, `hôtel` et `Hôtel ` deviennent trois typologies.
- **Identifiant temporaire attribué à la création, jamais renuméroté.**
- Distinguer « non renseigné » de « absent ».
- Ordre de priorité géographique : Conakry de manière exhaustive, puis Kindia, Boké, Mamou, Labé, Kankan, Nzérékoré, Siguiri, Beyla, Faranah.

### Migration préalable impérative

Le champ `statut_relation` doit exister **avant** tout import de recensement. Sans lui, les établissements recensés et les partenaires deviennent indiscernables, et `OFF_TAUX_COUVERTURE`, indicateur central de l'Observatoire, devient impossible à produire.

---

## 4. Équipements et services (canal C1)

### Question métier
Que propose concrètement chaque établissement, et le pays peut il accueillir un événement.

### Déclencheur
Renseigné pendant l'appel de qualification, en même temps que la fiche.

### Table cible
`etablissement_equipement`, une ligne par équipement.

### Champs
`code_equipement`, `disponible`, `capacite` pour les salles de réunion, `source`, `date_verification`.

### Indicateurs alimentés
`MAT_INDICE`, `MAT_TAUX_PAIEMENT_NUMERIQUE`, `EVE_CAPACITE_SALLES`.

### Sans cette collecte
Aucune réponse possible à la question d'un organisateur de sommet, et l'indice de maturité numérique perd ses deux composantes de paiement.

### Règle
Le champ `capacite` n'est renseigné que pour `SALLE_REUNION`. Les autres équipements sont strictement binaires.

---

## 5. Retours de terrain (canal C1)

### Question métier
Quel est l'écart entre les listes existantes et la réalité du secteur.

### Déclencheur
Constat d'un collecteur qui ne tient pas dans une fiche : établissement fermé, numéro invalide, adresse introuvable, refus motivé, doublon détecté.

### Table cible
`retour_terrain`.

### Champs
`id_etablissement` s'il existe, `nom_declare` sinon, `code_territoire`, `statut_terrain`, `commentaire`, `collecteur`, `source_recensement`, `horodatage`.

### Indicateurs alimentés
`OFF_ECART_LISTE_ADMIN`, `CTX_RECENSEMENT_PROGRESSION`.

### Sans cette collecte
Les échecs de collecte disparaissent. On ne sait plus distinguer un territoire sans offre d'un territoire mal prospecté, ce qui rend `AUCUNE_OFFRE` ininterprétable.

### Règle
Un `REFUS_MOTIVE` exige un commentaire non vide.

---

## 6. Demande exprimée par les visiteurs (canal C3)

Bloc le plus important du document. Il alimente l'actif que Simandou Séjour est seule à pouvoir produire en Guinée.

### 6.1 Événement `recherche_effectuee`

**Question métier :** qui cherche à venir, d'où, vers où, quand, pour combien de temps, avec quel budget.

**Déclencheur :** à chaque soumission d'une recherche sur la plateforme, y compris les recherches successives d'une même session.

**Table cible :** `recherche`.

**Champs**

| Champ | Question à laquelle il répond |
|---|---|
| `horodatage`, `id_session` | Quand, et rattachement des événements entre eux |
| `destination_saisie` | Ce que la personne a écrit, sans interprétation |
| `code_territoire_normalise` | Rattachement au référentiel |
| `destination_non_reconnue` | Localités absentes du référentiel |
| `date_arrivee`, `date_depart`, `nb_nuits` | Quand et combien de temps |
| `nb_voyageurs`, `nb_unites` | Volume de la demande |
| `budget_min_gnf`, `budget_max_gnf` | Segment de prix recherché |
| `typologie_filtree` | Nature d'hébergement recherchée |
| `motif_sejour` | Nature du déplacement |
| `pays_utilisateur` | Origine des connexions |
| `geo_fine_lat`, `geo_fine_lng` | Stocké, jamais publié |
| `type_appareil`, `langue_interface`, `canal` | Contexte d'usage |
| `source_trafic` | Rattachement à une campagne de promotion |
| `utilisateur_connecte` | Distinction visiteur et compte |

**Indicateurs alimentés :** toute la famille `DEM_`, et le numérateur de `TEN_INDICE_TENSION`.

**Sans cet événement :** le module `M2_DEMANDE` est vide et le module `M4_TENSION` est impossible.

**Règles**

- Compter les recherches, pas les sessions.
- `destination_saisie` est conservé brut, sans normalisation, sans correction orthographique.
- La normalisation vers `code_territoire_normalise` s'appuie sur `territoire_variante`.
- **L'adresse réseau brute n'est jamais stockée.** Seul le pays dérivé l'est, puis l'adresse est écartée.
- La position navigateur, quand elle est accordée, prime sur la géolocalisation par adresse réseau. Elle est stockée mais n'est jamais publiée à un niveau inférieur au pays.

### 6.2 Événement `resultat_recherche`

**Question métier :** la demande a t elle trouvé une offre, et sinon pourquoi.

**Déclencheur :** à chaque affichage d'une page de résultats, immédiatement après `recherche_effectuee`.

**Table cible :** `resultat_recherche`.

**Champs :** `id_recherche`, `nb_resultats_total`, `nb_resultats_disponibles`, `nb_etablissements_recenses_zone`, `statut_resultat`.

**Indicateurs alimentés :** `TEN_TAUX_INFRUCTUEUX`, `TEN_REPARTITION_ECHEC`, `TEN_CAPACITE_MANQUANTE`, `TEN_CLASSEMENT_DEFICIT`, `TEN_FENETRES_SATURATION`.

**Logique de détermination de `statut_resultat`**

```
si territoire non reconnu                        -> HORS_PERIMETRE
sinon si nb_resultats_disponibles > 0            -> RESULTATS_DISPONIBLES
sinon si nb_resultats_total > 0                  -> OFFRE_INDISPONIBLE
sinon si nb_etablissements_recenses_zone > 0     -> NON_RESERVABLE
sinon                                            -> AUCUNE_OFFRE
```

**Règle impérative :** `statut_resultat` est calculé **au moment de l'enregistrement**, jamais déduit ultérieurement. Le nombre d'établissements recensés dans une zone évolue avec le recensement ; une reconstitution a posteriori produirait un historique faux.

**Piège à éviter absolument :** ne pas réduire cet événement à un booléen « résultat vide ». Les cinq états portent trois messages de politique publique distincts. Un développeur sans cette spécification implémentera un booléen et l'essentiel de la valeur de l'Observatoire sera perdu.

### 6.3 Événement `consultation_etablissement`

**Question métier :** quelles offres retiennent l'attention, et à quel rang.

**Déclencheur :** ouverture de la fiche d'un établissement depuis une page de résultats.

**Table cible :** `consultation_etablissement`.

**Champs :** `id_recherche`, `id_etablissement`, `position_liste`, `horodatage`.

**Priorité :** basse. Utile mais non bloquant.

---

## 7. Activité de réservation (canal C3)

### Question métier
Que se passe t il réellement après la recherche, et quelle est la performance du périmètre commercialisé.

### Déclencheur
Confirmation d'une réservation, puis tout changement de statut.

### Table cible
`reservation`.

### Champs
`id_externe`, `id_etablissement`, `id_recherche`, `date_reservation`, `date_arrivee`, `date_depart`, `nb_nuits`, `nb_unites`, `montant_hebergement_gnf`, `pays_origine`, `motif_sejour`, `statut`, `date_changement_statut`.

### Indicateurs alimentés
`ACT_RESERVATIONS`, `ACT_NUITEES`, `ACT_ADR`, `ACT_ALOS`, `ACT_LEAD_TIME`, `ACT_TAUX_ANNULATION`, `ACT_TAUX_NON_PRESENTATION`, `ACT_TAUX_CONVERSION`, `RET_DEPENSE_HEBERGEMENT`.

### Règles

- **Le montant transmis est le montant hébergement seul.** Aucun champ de commission, de marge, de frais ou de moyen de paiement n'est transmis ni accepté. Le flux d'alimentation applique une liste blanche de champs, jamais une liste d'exclusions.
- `pays_origine` est la valeur déclarée par le voyageur, jamais une valeur dérivée d'une adresse réseau. Les deux ne portent pas la même fiabilité et ne doivent pas être confondus.
- Le rattachement à `id_recherche` conditionne `ACT_TAUX_CONVERSION`. Quand il est impossible, le champ reste nul plutôt que d'être approximé.

---

## 8. Relevé quotidien des disponibilités (canal C3)

### Question métier
Quel est le taux d'occupation réel du périmètre commercialisé.

### Déclencheur
Tâche planifiée, une exécution par nuit.

### Table cible
`inventaire_quotidien`, une ligne par établissement partenaire et par date.

### Champs
`id_etablissement`, `date`, `unites_disponibles`, `unites_vendues`, `tarif_moyen_gnf`, `etablissement_actif`.

### Indicateurs alimentés
`ACT_TAUX_OCCUPATION`, `ACT_REVPAR`, `EVE_CAPACITE_MOBILISABLE`.

### Sans ce relevé
Aucun taux d'occupation, aucun RevPAR. Ce sont les indicateurs de référence du secteur hôtelier, connus de tout interlocuteur venu de l'hôtellerie.

### Règles

- **Aucun effet rétroactif.** Ce relevé ne produit de la donnée qu'à partir du jour de sa mise en service. Chaque journée de retard est perdue définitivement.
- `etablissement_actif` distingue une unité invendue d'une unité non proposée à la vente. Sans ce champ, une fermeture de deux semaines effondre artificiellement le taux d'occupation de tout le périmètre.
- Le relevé porte sur les établissements en `PARTENAIRE_ACTIF` uniquement.

### Solution transitoire

Tant que ce relevé n'existe pas, seul `ACT_TAUX_OCCUPATION_CONTRACTUALISE` est calculable, à partir de la capacité des partenaires et des réservations datées. Il est affiché sous son propre libellé, avec sa note de méthode, et jamais présenté comme un taux d'occupation au sens strict.

---

## 9. Demande institutionnelle déclarée (canal C2)

### Question métier
Quels besoins d'hébergement les institutions annoncent elles, et le pays peut il les absorber.

### Déclencheur
Saisie interne à réception d'une information : courrier, réunion, appel, annonce publique d'un événement.

### Table cible
`demande_institutionnelle`.

### Champs
`libelle`, `id_institution` ou `organisation_declarante`, `type_demande`, `code_territoire`, `date_debut`, `date_fin`, `nb_personnes`, `nb_unites_demandees`, `gamme_souhaitee`, `besoin_salle`, `capacite_salle_requise`, `statut`, `date_declaration`, `source`, `notes`. Puis `nb_unites_couvertes`, renseigné après l'événement.

### Indicateurs alimentés
`INS_VOLUME_DEMANDE`, `INS_TAUX_COUVERTURE`, `INS_DEFICIT`, `EVE_TAUX_TENSION_EVENEMENT`.

### Sans cette collecte
La demande institutionnelle reste invisible. Elle ne transite jamais par une plateforme, elle ne peut donc pas être captée par le canal C3, et le module `M7_EVENEMENTIEL` n'a rien à comparer à la capacité disponible.

### Règles

- Une demande est enregistrée **dès qu'elle est annoncée**, sans attendre confirmation. Le statut porte l'incertitude.
- `nb_unites_couvertes` est renseigné après coup. L'écart entre demandé et couvert est l'information utile.
- Cette table est une donnée de demande, jamais un dossier commercial. Aucun champ de suivi de vente, de contact commercial ou de relance n'y est ajouté.

---

## 10. Contexte de la demande (canal C2)

### Question métier
Pourquoi la demande varie t elle.

### Déclencheur
Saisie interne, par lots. Le calendrier de l'année à venir est saisi en une fois, puis complété.

### Table cible
`evenement_calendrier`.

### Champs
`libelle`, `type_evenement`, `portee`, `code_territoire`, `date_debut`, `date_fin`, `recurrence`, `description`, `source`.

### Contenu attendu
Sommets, forums, foires, compétitions, jours fériés, vacances scolaires, fêtes religieuses, saison sèche, saison des pluies, missions et visites officielles.

### Indicateurs alimentés
Enrichissement de `DEM_SAISONNALITE` et de `TEN_FENETRES_SATURATION`.

### Sans cette collecte
Les courbes de demande n'ont aucune explication visible. Un pic de recherches devient une anomalie plutôt qu'un fait interprétable.

---

## 11. Accessibilité des territoires (canal C2)

### Question métier
Un déficit d'offre relève t il d'un problème d'investissement ou d'un problème de désenclavement.

### Déclencheur
Saisie initiale unique, puis mise à jour ponctuelle.

### Table cible
`territoire_accessibilite`, une ligne par préfecture au minimum, par commune si possible.

### Champs
`distance_conakry_km`, `temps_trajet_conakry_min`, `etat_route`, `praticabilite_saison_pluies`, `infrastructures_transport`, `aeroport_le_plus_proche`, `distance_aeroport_km`, `source`, `date_maj`.

### Indicateurs alimentés
Qualification de `TEN_CLASSEMENT_DEFICIT`.

### Sans cette collecte
Le classement des territoires en déficit produit un ordre que personne ne sait interpréter. Une commune impraticable six mois par an et une commune desservie toute l'année apparaîtraient comme deux opportunités équivalentes.

### Priorité
Les 44 préfectures avant toute chose. Le niveau communal peut attendre.

---

## 12. Conformité administrative (canal C4)

### Question métier
Quel est l'état d'enregistrement et de classification du parc.

### Déclencheur
Transmission par une administration, dans le cadre d'une convention.

### Table cible
`conformite_etablissement`.

### Champs
`enregistrement_administratif`, `reference_enregistrement`, `statut_classification`, `date_classification`, `date_dernier_controle`, `source`.

### Indicateurs alimentés
Famille `CONF_`.

### État au lancement
Vide. Le conteneur existe et il est montré comme tel. **Le module vide est l'offre faite à la tutelle, pas un défaut du produit.**

---

## 13. Usage de l'Observatoire (canal interne)

### Question métier
Qui consulte quoi, et que devient chaque document sorti de l'outil.

### Tables cibles
`journal_acces` et `export`.

### `journal_acces`
Écrit à chaque consultation : compte, horodatage, module, filtres appliqués, action, adresse de connexion.

### `export`
Écrit à chaque génération de document : référence unique, compte émetteur, horodatage, module, périmètre, empreinte du contenu, version des indicateurs.

### Usages

- Traçabilité : si un document circule, la référence imprimée en pied de page dit d'où il vient.
- Reproductibilité : si un chiffre est contesté six mois plus tard, l'empreinte et la version permettent de régénérer l'état exact de la donnée.
- Renseignement produit : le journal indique ce qui intéresse réellement chaque institution, mieux qu'une réunion.

---

## 14. Ce qui n'est jamais capté

Liste fermée. Aucun de ces éléments ne doit apparaître dans une table, un flux d'alimentation ou un champ de commentaire.

**Données financières de Simandou Séjour.** Commission, taux de commission, marge, revenu net, moyen de paiement, statut de paiement.

**Données personnelles de voyageur.** Identité, coordonnées, historique individuel, moyen de paiement.

**Adresses réseau brutes.** Seul le pays dérivé est conservé, puis l'adresse est écartée.

**Notes internes ou appréciations sur les établissements partenaires.** Le champ `notes` de la fiche établissement porte des précisions factuelles de collecte, jamais un jugement.

**Toute donnée nominative d'établissement destinée à être publiée dans un agrégat.**

---

## 15. Ordre de mise en service

| Rang | Élément | Motif |
|---|---|---|
| 1 | Migration de `statut_relation` sur `etablissement` | Bloque tout import de recensement |
| 2 | Journalisation `recherche_effectuee` et `resultat_recherche` | Aucun effet rétroactif, chaque jour de retard est perdu |
| 3 | Relevé quotidien des disponibilités | Aucun effet rétroactif |
| 4 | Recensement | Poste le plus long en durée calendaire, démarre en parallèle |
| 5 | Accessibilité des 44 préfectures | Saisie unique, rapide |
| 6 | Calendrier événementiel | Saisie par lots |
| 7 | Demande institutionnelle | Au fil de l'eau |
| 8 | Flux de réservation | Avec le raccordement C3 |
| 9 | Conformité | Conditionné à une convention |

Les rangs 2 et 3 passent avant tout le reste dans l'ordre chronologique réel, quelle que soit l'avancée du développement des écrans. Ils accumulent de la donnée pendant que le reste se construit.

---

## 16. Conservation et protection des données

- Aucune adresse réseau brute conservée au delà de la dérivation du pays.
- Une mention d'information est affichée sur la plateforme concernant la mesure d'audience et la géolocalisation.
- La durée de conservation des enregistrements de recherche reste à trancher au regard du cadre guinéen de protection des données à caractère personnel.
- Le consentement à la publication est demandé aux établissements avant toute publication nominative. En son absence, l'établissement compte dans les agrégats mais n'est jamais nommé.

---

## 17. Points ouverts

1. Format d'échange du flux C3 : appels directs, file de messages, ou export périodique.
2. Fréquence d'alimentation du flux C3.
3. Durée de conservation des enregistrements de recherche.
4. Source des distances et temps de trajet pour `territoire_accessibilite`.
5. Modalités pratiques de recueil du consentement à la publication pendant la qualification téléphonique.

---

*Document 5 sur 12. Document précédent : dictionnaire des indicateurs. Document suivant : matrice profils, modules et permissions.*
