# Document 2. Taxonomies et référentiels

**Projet :** Observatoire National de l'Hospitalité Guinéenne
**Maître d'ouvrage :** SIMANDOU SEJOUR
**Version :** 1.1
**Statut :** Source de vérité unique pour toutes les listes de valeurs. Bloquant pour le modèle de données.

---

## 1. Objet et règle générale

Ce document fige toutes les listes de valeurs autorisées de l'Observatoire. Il est la source de vérité unique pour les énumérations et le découpage territorial.

**Règle absolue :** toute valeur absente de ce document est interdite en base. Aucune saisie libre sur un champ énuméré, aucune valeur créée à la volée, aucune valeur « autre » ajoutée sans passer par une mise à jour de ce document.

Raison : ces listes sont ce sur quoi tous les agrégats se calculent. Une valeur non prévue ne produit pas une erreur visible, elle produit un chiffre faux que personne ne détecte.

Chaque énumération est identifiée par un **code stable**. Le code est ce qui est stocké en base et manipulé par le code. Le libellé est ce qui s'affiche, il est traduisible, il peut changer. **Le code ne change jamais.**

**Implémentation :** les énumérations sont stockées en tables de correspondance avec clés étrangères, jamais en types ENUM natifs. Un type ENUM Postgres est coûteux à faire évoluer, or le référentiel territorial est versionné et amené à changer.

---

## 2. Référentiel administratif de la Guinée

### 2.1 Structure

| Niveau | Nom | Nombre | Usage dans l'Observatoire |
|---|---|---|---|
| 1 | Région | 10 | Restitution nationale et régionale |
| 2 | Préfecture | 44, Conakry exceptée | Restitution préfectorale |
| 3 | Commune | environ 366 | Niveau de restitution le plus fin |
| 4 | Quartier ou district | non référencé | Texte libre, jamais agrégé |

Conakry, zone spéciale, ne comporte pas de préfecture. Ses communes se rattachent directement à la région.

Le niveau 4 est volontairement hors référentiel. Il est stocké comme texte libre à titre de repère d'adresse, il n'est jamais utilisé pour un calcul ni pour un filtre.

### 2.2 Les dix régions

Le découpage résulte des décrets présidentiels du **20 août 2026**, qui ont créé deux nouvelles régions administratives et onze nouvelles préfectures, faisant passer la Guinée de huit à dix régions et de trente-trois à quarante-quatre préfectures. Siguiri et Beyla ont été érigées en régions administratives.

Les dix régions retenues par la carte administrative du ministère de l'Administration du Territoire et de la Décentralisation :

| Région |
|---|
| Conakry |
| Kindia |
| Boké |
| Mamou |
| Labé |
| Faranah |
| Kankan |
| Siguiri |
| Beyla |
| Nzérékoré |

Codification à deux chiffres, de `01` à `10`. La correspondance exacte entre code et région est à établir sur les textes officiels, les codes antérieurs allant de `01` à `08`.

### 2.3 Les préfectures

44 préfectures : les 33 antérieures, auxquelles s'ajoutent onze anciennes sous-préfectures érigées en préfectures.

**Les onze nouvelles préfectures :** Kamsar, Timbo, Tokounou, Djalakoro, Sabadou-Baranama, Doko, Siguirini, Kintinian, Sinko, Kouankan, Karala.

Elles se répartissent entre Boké, Mamou, Kankan, Siguiri et Beyla. Beyla relevait auparavant de la région de Nzérékoré, et Siguiri de celle de Kankan.

La liste nominative complète des 44 préfectures et leur rattachement régional sont à relever sur la carte administrative du MATD.

Codification : code région sur deux chiffres, puis numéro d'ordre sur deux chiffres. Forme : `05-03`.

### 2.4 Les communes

Environ 366 communes, chacune portant un attribut de nature : urbaine ou rurale.

Codification : code préfecture, puis numéro d'ordre. Forme : `05-03-02`.

### 2.5 Avertissement sur les sources et la fraîcheur du découpage

Le découpage a changé le 20 août 2026. Trois conséquences opérationnelles, toutes bloquantes si elles ne sont pas anticipées.

**Aucune source de données existante ne reflète encore ce découpage.**
OpenStreetMap, les annuaires statistiques, les fonds cartographiques publics, les listes détenues par les administrations : tout est encore sur l'ancien maillage à 8 régions et 33 préfectures. Les contours géographiques des deux nouvelles régions et des onze nouvelles préfectures n'existent probablement dans aucun fichier réutilisable. La carte publiée par le MATD est la seule référence, et il faudra la transposer manuellement.

**Le versionnage du référentiel est immédiatement opérationnel.**
Deux versions doivent coexister : l'ancien découpage, car toute liste obtenue d'une administration ou d'une source ouverte y sera exprimée, et le nouveau, qui est celui de restitution. Plus une table de correspondance entre les deux. Sans cela, une liste d'établissements fournie par un ministère est inexploitable.

**Une seule source de vérité, nommée et datée.**
Le MATD est l'autorité compétente. Le référentiel de l'Observatoire est constitué à partir de sa carte, avec mention de sa date de publication. Aucun mélange avec une autre source.

Le cas de **Conakry** est à vérifier séparément : son découpage communal a lui aussi évolué et les sources divergent entre cinq, six et treize communes. Conakry étant la zone prioritaire de recensement, ce point doit être tranché avant tout import.

### 2.6 Champs du référentiel

| Champ | Rôle |
|---|---|
| Code stable | Identifiant, jamais modifié |
| Libellé officiel | Affichage |
| Code du parent | Rattachement hiérarchique |
| Nature | Urbaine ou rurale, communes uniquement |
| Variantes orthographiques | Rattachement automatique lors des imports |
| Version du découpage | Date d'entrée en vigueur |
| Code équivalent version antérieure | Table de correspondance ancien / nouveau |

Les deux derniers champs rendent le rattrapage possible. Le champ des variantes évite que « Nzérékoré », « N'Zérékoré » et « Nzerekore » créent trois territoires distincts.

---

## 3. Typologie des établissements

| Code | Libellé | Critère de départage |
|---|---|---|
| `HOTEL` | Hôtel | Établissement commercial avec réception et services quotidiens |
| `RESIDENCE` | Résidence meublée | Logement autonome équipé, location courte ou moyenne durée, sans service quotidien |
| `AUBERGE` | Auberge | Hébergement économique, services réduits |
| `MAISON_HOTES` | Maison d'hôtes | Structure de petite taille, accueil personnalisé, souvent chez l'habitant |
| `LODGE` | Lodge | Hébergement en site naturel ou touristique isolé |
| `RECEPTIF` | Réceptif événementiel | Hébergement combiné à une capacité d'accueil de groupes ou d'événements |

**Règle de départage :** en cas d'ambiguïté, la typologie est déterminée par la présence ou l'absence d'une réception permanente et de services quotidiens, puis par la taille.

Liste fermée. Un établissement inclassable est enregistré selon la typologie la plus proche, avec mention en champ de notes.

---

## 4. Gamme tarifaire

Quatre paliers, exprimés en francs guinéens, sur la base du **tarif le plus bas** pratiqué par l'établissement pour une nuit en occupation standard.

| Code | Libellé | Borne |
|---|---|---|
| `G1` | Économique | Palier 1 |
| `G2` | Intermédiaire | Palier 2 |
| `G3` | Supérieur | Palier 3 |
| `G4` | Haut de gamme | Palier 4 |

Les bornes chiffrées en GNF sont à arrêter avant le démarrage du recensement. Elles sont fixées une fois pour toutes et versionnées : un changement de bornes rend incomparables les données collectées avant et après.

**Point de méthode :** la gamme se calcule sur le tarif le plus bas et non sur le tarif moyen, afin d'être reproductible par un collecteur au téléphone.

---

## 5. Statut de relation

Décrit la nature du lien entre l'établissement et Simandou Séjour. C'est le champ qui permet de distinguer l'offre nationale de l'offre commercialisée, et donc de produire l'indicateur central de l'Observatoire.

| Code | Libellé | Signification |
|---|---|---|
| `RECENSE` | Recensé | Établissement inventorié, aucune relation commerciale |
| `PARTENAIRE_ACTIF` | Partenaire actif | Sous contrat, offre commercialisée |
| `PARTENAIRE_INACTIF` | Partenaire inactif | Contrat suspendu ou établissement temporairement retiré |
| `REFUS` | Refus | A refusé le recensement ou la publication |
| `DOUBLON` | Doublon | Fiche redondante, conservée mais exclue de tout calcul |

**Règles de calcul :**

- Les établissements en `DOUBLON` sont exclus de tous les agrégats.
- Les établissements en `REFUS` comptent dans l'inventaire mais ne sont jamais affichés nominativement.
- Le taux de couverture plateforme se calcule sur `PARTENAIRE_ACTIF` rapporté à l'ensemble hors doublons.

---

## 6. Statut de résultat de recherche

Énumération centrale de l'Observatoire. Elle porte à elle seule le module Tension et déficit d'offre.

| Code | Libellé | Signification institutionnelle |
|---|---|---|
| `RESULTATS_DISPONIBLES` | Résultats disponibles | Offre trouvée et réservable aux dates demandées |
| `OFFRE_INDISPONIBLE` | Offre existante indisponible | Offre réservable présente, mais complète aux dates. Signal de **saturation** |
| `NON_RESERVABLE` | Offre recensée non réservable | Établissements connus dans la zone, aucun réservable en ligne. Signal de **sous-numérisation** |
| `AUCUNE_OFFRE` | Aucune offre référencée | Aucun établissement connu dans la zone. Signal de **déficit d'offre** |
| `HORS_PERIMETRE` | Hors périmètre | Localité non reconnue dans le référentiel |

Ces cinq états ne doivent **jamais** être réduits à un simple indicateur binaire de résultat vide. Ils portent trois messages institutionnels distincts : ici il manque des établissements, ici il manque de la numérisation, ici il manque de la capacité aux dates demandées.

`HORS_PERIMETRE` a une valeur propre : il révèle les localités où une demande s'exprime alors qu'elles ne figurent pas encore au référentiel.

---

## 7. Statut de donnée

Qualifie l'origine de toute donnée affichée. Chaque indicateur en porte un, visible à l'écran.

| Code | Libellé | Origine |
|---|---|---|
| `RECENSE` | Recensé | Inventaire de l'offre, collecté par Simandou Séjour |
| `OBSERVE` | Observé | Transactions et disponibilités réelles sur le périmètre commercialisé |
| `EXPRIME` | Exprimé | Demande mesurée par les recherches des visiteurs |
| `DECLARE` | Déclaré | Besoin d'hébergement annoncé par une institution |
| `ESTIME` | Estimé | Valeur calculée par application d'un coefficient, avec méthode publiée |

**Un même graphique ne mélange jamais deux statuts de donnée.**

---

## 8. Niveau de fiabilité

Qualifie la robustesse d'un chiffre au regard de son effectif. Affiché sur chaque bloc d'indicateurs.

| Code | Libellé | Lecture |
|---|---|---|
| `CONSOLIDE` | Consolidé | Effectif suffisant, valeur stable |
| `INDICATIF` | Indicatif | Effectif faible, tendance à interpréter avec prudence |
| `SIGNAL` | Signal | Effectif très faible, valeur d'alerte et non de mesure |

Les seuils de bascule sont définis dans le dictionnaire des indicateurs, indicateur par indicateur.

---

## 9. Source de recensement

| Code | Libellé |
|---|---|
| `ADMINISTRATION` | Liste administrative |
| `SOURCE_OUVERTE` | Source ouverte |
| `TELEPHONE` | Qualification téléphonique |
| `TERRAIN` | Vérification terrain |
| `DECLARATIF` | Déclaration de l'établissement |

---

## 10. Statut de vérification

| Code | Libellé |
|---|---|
| `NON_VERIFIE` | Non vérifié |
| `VERIFIE_TEL` | Vérifié par téléphone |
| `VERIFIE_TERRAIN` | Vérifié sur site |

Le taux de fiches vérifiées est lui-même un indicateur publiable : il documente la qualité de l'inventaire et se défend devant une institution.

---

## 11. Statut de retour terrain

Constats des collecteurs qui ne tiennent pas dans une fiche établissement.

| Code | Libellé | Usage |
|---|---|---|
| `FERME_DEFINITIF` | Fermé définitivement | Sort de l'offre active, reste tracé |
| `FERME_TEMPORAIRE` | Fermé temporairement | Rénovation, saison, autre |
| `INEXISTANT` | Établissement inexistant | Figurait sur une liste, n'existe pas |
| `NUMERO_INVALIDE` | Numéro invalide | |
| `INJOIGNABLE` | Injoignable après relances | |
| `ADRESSE_INTROUVABLE` | Adresse introuvable | |
| `REFUS_MOTIVE` | Refus motivé | Commentaire obligatoire |
| `DOUBLON_DETECTE` | Doublon détecté | |
| `RECLASSEMENT` | Typologie erronée | Ce n'est pas un hébergement, ou pas la typologie annoncée |

Cette énumération produit un résultat publiable : l'écart entre une liste administrative et la réalité du terrain est une information que l'État ne détient pas.

---

## 12. Équipements et services

| Code | Libellé |
|---|---|
| `RESTAURATION` | Restauration sur place |
| `SALLE_REUNION` | Salle de réunion ou de conférence |
| `GROUPE_ELECTROGENE` | Groupe électrogène |
| `WIFI` | Connexion internet |
| `CLIMATISATION` | Climatisation |
| `EAU_CHAUDE` | Eau chaude |
| `PARKING` | Parking |
| `PISCINE` | Piscine |
| `NAVETTE_AEROPORT` | Navette aéroport |
| `BLANCHISSERIE` | Blanchisserie |
| `SECURITE_24H` | Sécurité permanente |
| `ACCES_PMR` | Accès aux personnes à mobilité réduite |
| `PAIEMENT_CARTE` | Paiement par carte |
| `PAIEMENT_MOBILE_MONEY` | Paiement mobile money |

`SALLE_REUNION` porte une capacité chiffrée en nombre de places. Les autres équipements sont binaires.

`PAIEMENT_CARTE` et `PAIEMENT_MOBILE_MONEY` alimentent l'indice de maturité numérique.

---

## 13. Demande institutionnelle

### 13.1 Type de demande

| Code | Libellé |
|---|---|
| `SOMMET` | Sommet ou forum |
| `CONFERENCE` | Conférence ou séminaire |
| `MISSION` | Mission officielle |
| `DELEGATION` | Délégation ou visite d'État |
| `FORMATION` | Formation ou atelier |
| `COMPETITION` | Compétition sportive ou culturelle |
| `AUTRE` | Autre besoin institutionnel |

### 13.2 Statut de la demande

| Code | Libellé |
|---|---|
| `ANNONCEE` | Annoncée |
| `CONFIRMEE` | Confirmée |
| `SATISFAITE` | Satisfaite |
| `PARTIELLEMENT_SATISFAITE` | Partiellement satisfaite |
| `NON_SATISFAITE` | Non satisfaite |
| `ANNULEE` | Annulée |

`NON_SATISFAITE` et `PARTIELLEMENT_SATISFAITE` sont les deux valeurs qui documentent un déficit de capacité nationale. Ce sont les plus utiles.

---

## 14. Contexte de la demande

### 14.1 Type d'événement

| Code | Libellé |
|---|---|
| `SOMMET` | Sommet ou forum |
| `CONFERENCE` | Conférence ou salon |
| `FOIRE` | Foire ou salon commercial |
| `COMPETITION` | Compétition sportive ou culturelle |
| `FETE_RELIGIEUSE` | Fête religieuse |
| `JOUR_FERIE` | Jour férié |
| `VACANCES_SCOLAIRES` | Vacances scolaires |
| `SAISON` | Saison sèche ou saison des pluies |
| `MISSION_OFFICIELLE` | Mission ou visite officielle |
| `AUTRE` | Autre |

### 14.2 Portée

| Code | Libellé |
|---|---|
| `LOCALE` | Locale |
| `NATIONALE` | Nationale |
| `INTERNATIONALE` | Internationale |

### 14.3 Récurrence

| Code | Libellé |
|---|---|
| `PONCTUEL` | Ponctuel |
| `ANNUEL` | Annuel |

---

## 15. Accessibilité des territoires

### 15.1 État de la route

| Code | Libellé |
|---|---|
| `BITUMEE_BONNE` | Route bitumée en bon état |
| `BITUMEE_DEGRADEE` | Route bitumée dégradée |
| `PISTE_AMENAGEE` | Piste aménagée |
| `PISTE_SOMMAIRE` | Piste sommaire |
| `INCONNU` | Non renseigné |

### 15.2 Praticabilité en saison des pluies

| Code | Libellé |
|---|---|
| `TOUTE_ANNEE` | Praticable toute l'année |
| `DIFFICILE_PLUIES` | Difficile en saison des pluies |
| `IMPRATICABLE_PLUIES` | Impraticable en saison des pluies |
| `INCONNU` | Non renseigné |

Cette énumération est décisive en Guinée : un déficit d'offre dans une zone accessible six mois par an ne se traite pas comme un déficit dans une zone desservie toute l'année.

### 15.3 Infrastructures de transport

| Code | Libellé |
|---|---|
| `AEROPORT_INTERNATIONAL` | Aéroport international |
| `AERODROME` | Aérodrome |
| `PORT` | Port maritime ou fluvial |
| `GARE_ROUTIERE` | Gare routière |
| `VOIE_FERREE` | Desserte ferroviaire |
| `AUCUNE` | Aucune infrastructure notable |

Champ multivalué.

---

## 16. Profils institutionnels

| Code | Libellé |
|---|---|
| `ATTRACTIVITE` | Attractivité et promotion |
| `INVESTISSEMENT` | Investissement |
| `TUTELLE` | Tutelle sectorielle |
| `BAILLEUR` | Bailleur et partenaire technique |
| `EVENEMENTIEL` | Organisateur d'événement |
| `ADMIN` | Administration Simandou Séjour |

---

## 17. Niveaux de restitution géographique

| Code | Libellé |
|---|---|
| `NATIONAL` | National |
| `REGION` | Régional |
| `PREFECTURE` | Préfectoral |
| `COMMUNE` | Communal |

Tous les profils institutionnels disposent des quatre niveaux.

---

## 18. Modules

| Code | Libellé |
|---|---|
| `M1_OFFRE` | Offre nationale d'hébergement |
| `M2_DEMANDE` | Demande exprimée |
| `M3_ACTIVITE` | Activité observée |
| `M4_TENSION` | Tension et déficit d'offre |
| `M5_CONFORMITE` | Conformité et classification |
| `M6_MATURITE` | Maturité numérique du secteur |
| `M7_EVENEMENTIEL` | Événementiel et pics de demande |
| `M8_RETOMBEES` | Retombées économiques estimées |
| `M9_SYNTHESE` | Synthèse institutionnelle |
| `M10_METHODO` | Méthodologie |
| `M11_ADMIN` | Administration |

---

## 19. Autres énumérations

**Niveau de territoire :** `REGION`, `PREFECTURE`, `COMMUNE`

**Canal d'entrée :** `WEB`, `WHATSAPP`, `AUTRE`

**Type d'appareil :** `DESKTOP`, `TABLETTE`, `MOBILE`

**Motif de séjour :** `AFFAIRES`, `LOISIRS`, `FAMILIAL`, `EVENEMENTIEL`, `MISSION`, `NON_DECLARE`

**Langue d'interface :** `FR`, `EN`

**Consentement à la publication :** `OUI`, `NON`, `NON_DEMANDE`

**Précision géographique :** `RELEVE`, `ESTIME`, `ABSENT`

**Source de capacité :** `DECLAREE`, `ESTIMEE`, `VERIFIEE`

---

## 20. Décisions à arrêter avant intégration

1. Source officielle retenue pour le référentiel administratif, nommée et datée.
2. Correspondance exacte entre codes `01` à `10` et régions, à vérifier sur les décrets du 20 août 2026.
3. Liste nominative des 44 préfectures et de leur rattachement régional, relevée sur la carte du MATD.
4. Nombre et liste des communes de Conakry, à confirmer auprès du MATD.
5. Bornes chiffrées en GNF des quatre gammes tarifaires.

---

*Document 2 sur 12. Document précédent : note de cadrage produit. Document suivant : modèle de données.*
