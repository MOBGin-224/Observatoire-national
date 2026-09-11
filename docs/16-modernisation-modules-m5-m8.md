# Document 16. Modernisation des modules M5, M6, M7 et M8

**Projet :** Observatoire National de l'Hospitalité Guinéenne
**Maître d'ouvrage :** SIMANDOU SEJOUR
**Version :** 1.0
**Statut :** Prescriptif. Amende les documents 2, 3, 4, 5, 9 bis et 10.

> **Objet.** Ce document fournit les libellés manquants des quatre modules non modernisés, tranche les six arbitrages en attente, et corrige une lacune d'alimentation qui rendrait une zone définitivement vide.

---

# Partie A. Corrections préalables

## A.1 Le statut de demande institutionnelle existe déjà

L'inventaire signale qu'aucune énumération ne définit la colonne « Statut » de la zone 7 de `M7`.

**Elle existe.** Document 2, section 13.2, domaine `STATUT_DEMANDE_INST` :

`ANNONCEE`, `CONFIRMEE`, `SATISFAITE`, `PARTIELLEMENT_SATISFAITE`, `NON_SATISFAITE`, `ANNULEE`.

Les libellés français et anglais figurent au document 10, section 13. Rien à créer, seulement à charger si la table `enumeration` ne l'est pas encore.

## A.2 Les pondérations existent, elles sont ici confirmées

Le point ouvert 1 du document 4 porte sur le caractère définitif des pondérations, non sur leur absence. Elles sont définies aux fiches `MAT_INDICE` et `OFF_COMPLETUDE_FICHE`.

**`OFF_COMPLETUDE_FICHE`, confirmé sans changement :**

| Composante | Poids |
|---|---|
| Contact téléphonique valide | 30 |
| Localisation géographique | 20 |
| Tarifs renseignés | 20 |
| Typologie et capacité | 20 |
| Présence en ligne | 10 |

**`MAT_INDICE`, une révision.**

| Composante | Poids antérieur | Poids définitif |
|---|---|---|
| Présence en ligne | 20 | 20 |
| Canal de réservation en ligne | 30 | 30 |
| Tarifs publiés | 20 | 20 |
| Coordonnées jointes valides | 10 | 10 |
| Paiement par carte | 10 | **5** |
| Paiement mobile money | 10 | **15** |

**Pourquoi cette révision.** En Guinée, le mobile money est le canal de paiement numérique dominant, la carte bancaire reste marginale hors haut de gamme. Les pondérer à parts égales pénaliserait des établissements numériquement matures selon les usages réels du pays, et surévaluerait quelques établissements haut de gamme de Conakry.

Un indice de maturité numérique doit mesurer la maturité dans le contexte où il s'applique, pas dans un contexte importé.

**Le point ouvert 1 du document 4 est clos.**

---

# Partie B. Les six arbitrages

## B.1 Seuils de fiabilité, règle transverse

Clôt le point ouvert 5 du document 4. **Applicable aux onze modules.**

### Règle générale par nature d'indicateur

| Nature | `CONSOLIDE` | `INDICATIF` | `SIGNAL` |
|---|---|---|---|
| Inventaire, comptages et ratios sur établissements | 30 établissements et plus | 10 à 29 | Moins de 10 |
| Demande, calculs sur recherches | 30 recherches et plus | 10 à 29 | Moins de 10 |
| Performance, calculs sur réservations | 30 réservations et 5 établissements | 10 à 29 réservations et 3 établissements | En dessous : masqué, règle M1 |
| Demande institutionnelle | 5 demandes et plus | 2 à 4 | 1 |

### Règle des indicateurs composites

**Un indicateur composite hérite du niveau de fiabilité le plus faible de ses composantes.**

`TEN_INDICE_TENSION` croise une mesure de demande et une mesure d'inventaire : si la demande est `CONSOLIDE` et l'inventaire `SIGNAL`, l'indice est `SIGNAL`.

C'est la seule règle qui empêche un indicateur dérivé de paraître plus solide que ce sur quoi il repose.

### Seuils spécifiques conservés

Les seuils déjà fixés au document 4 pour un indicateur particulier priment sur la règle générale. Ils sont explicitement mentionnés dans la fiche concernée.

## B.2 Paliers de capacité de salle

Nouvelle énumération `PALIER_SALLE`, à ajouter au document 2.

| Code | Français | Anglais | Borne |
|---|---|---|---|
| `P1` | Moins de 20 places | Under 20 seats | 1 à 19 |
| `P2` | 20 à 49 places | 20 to 49 seats | 20 à 49 |
| `P3` | 50 à 99 places | 50 to 99 seats | 50 à 99 |
| `P4` | 100 à 199 places | 100 to 199 seats | 100 à 199 |
| `P5` | 200 à 499 places | 200 to 499 seats | 200 à 499 |
| `P6` | 500 places et plus | 500 seats and over | 500 et plus |

**Usage.** Filtre de capacité minimale et répartition de la zone 6 de `M7`. Le palier est calculé à partir du champ `capacite` de `etablissement_equipement`, jamais saisi.

## B.3 Compteur de la carte Méthodologie

`M10_METHODO` et `M11_ADMIN` ne portent aucun indicateur en propre. Leur carte d'accès en zone 4 de la synthèse ne peut afficher un compteur d'indicateurs.

**Décision : le compteur est contextuel, déterminé par la nature du module.**

| Module | Compteur affiché |
|---|---|
| `M1` à `M9` | Nombre d'indicateurs rattachés via `indicateur_module` |
| `M10` | Nombre d'indicateurs documentés, tous modules confondus |
| `M11` | Nombre de sections d'administration |

| Clé | Français | Anglais |
|---|---|---|
| `module.compteur.indicateurs` | {n} indicateurs | {n} indicators |
| `module.compteur.documentes` | {n} indicateurs documentés | {n} documented indicators |
| `module.compteur.sections` | {n} sections | {n} sections |

## B.4 Coefficient de retombées : décision de ne pas décider

**Le coefficient n'est pas fourni, et il ne doit pas l'être par estimation.**

C'est le seul point de tout le projet où produire un chiffre plausible sans source ferait plus de dégâts que l'absence du module. Un multiplicateur de retombées repris dans un communiqué officiel, puis contesté par un économiste, atteindrait la crédibilité de l'ensemble de l'Observatoire, pas seulement celle de `M8`.

**`M8_RETOMBEES` reste désactivé pour tous les comptes**, conformément au document 13 section 3 et au document 9 quater section M.3.

### Trois voies pour obtenir une source défendable

**1. Une source nationale.** Enquête ou compte satellite du tourisme produit par l'Institut National de la Statistique ou par le ministère. C'est la source la plus solide si elle existe.

**2. Une source institutionnelle régionale.** Compte satellite d'un pays comparable de la sous-région, ou publication d'une organisation internationale du tourisme. Utilisable à condition de nommer le pays de référence et d'assumer la transposition dans la fiche méthodologique.

**3. Une source produite par l'Observatoire lui-même.** À terme, le champ `motif_sejour` et les données de séjour permettront d'objectiver une part d'hébergement dans la dépense totale. C'est la voie la plus longue et la plus solide, puisqu'elle s'appuierait sur des données guinéennes réelles.

### Structure d'accueil, à créer dès maintenant

Le module `M8` exige d'afficher le coefficient, sa source et sa date de validation. Aucune table du modèle ne peut les accueillir.

**Nouvelle table `coefficient_retombees`, document 3, section 11.**

| Champ | Type | Note |
|---|---|---|
| `id` | uuid, PK | |
| `valeur` | numeric | Multiplicateur appliqué à la dépense d'hébergement |
| `source_libelle` | text | Nom de la source, affiché à l'écran |
| `source_reference` | text | Référence complète, publication et année |
| `perimetre_source` | text | Pays ou zone couverte par la source |
| `date_validation` | date | Date de validation par la direction |
| `date_effet`, `date_fin` | date | Versionnage |
| `courante` | boolean | Une seule vraie à la fois |
| `notes` | text | Réserves méthodologiques éventuelles |

**Le champ `perimetre_source` est le plus important.** Si le coefficient provient d'un pays voisin, l'écran doit le dire. Une transposition assumée est défendable, une transposition tue ne l'est pas.

**Règle d'activation.** `M8` ne s'ouvre à aucun compte tant que `coefficient_retombees` ne contient pas une ligne courante avec `source_libelle`, `perimetre_source` et `date_validation` renseignés.

## B.5 Ordre de modernisation

**Recommandation retenue : M5 et M6 d'abord, M7 ensuite, M8 en dernier.**

| Rang | Module | Motif |
|---|---|---|
| 1 | `M6_MATURITE` | Données entièrement disponibles, dérivées du recensement |
| 2 | `M5_CONFORMITE` | Zones 4 et 5 alimentées par le recensement |
| 3 | `M7_EVENEMENTIEL` | Après correction de l'alimentation des équipements, partie C |
| 4 | `M8_RETOMBEES` | Bloqué par le coefficient |

`M6` passe devant `M5` : ses six zones sont toutes alimentables immédiatement, alors que quatre des six zones de `M5` resteront vides tant qu'aucune donnée administrative n'est transmise.

---

# Partie C. Correction d'une lacune d'alimentation

## C.1 Le constat est juste et il est bloquant

La table `etablissement_equipement` alimente la zone 6 de `M7`, les salles de réunion. Le format d'import du recensement ne comporte aucune colonne d'équipement.

**Cette table ne se remplirait donc jamais par le canal prévu.** Moderniser la zone 6 sans corriger ce point reviendrait à soigner un écran qui n'affichera rien.

Le document 5, section 4, prévoit pourtant que les équipements sont renseignés pendant l'appel de qualification, en même temps que la fiche. La lacune est dans le format de fichier, pas dans l'intention.

## C.2 Décision : colonnes d'équipement dans le même fichier

**Un seul fichier d'import, avec des colonnes d'équipement à plat.**

| Colonne | Valeurs |
|---|---|
| `equip_restauration` | O, N, vide |
| `equip_salle_reunion` | O, N, vide |
| `equip_salle_capacite` | Entier, renseigné si `equip_salle_reunion` vaut O |
| `equip_groupe_electrogene` | O, N, vide |
| `equip_wifi` | O, N, vide |
| `equip_climatisation` | O, N, vide |
| `equip_eau_chaude` | O, N, vide |
| `equip_parking` | O, N, vide |
| `equip_piscine` | O, N, vide |
| `equip_navette_aeroport` | O, N, vide |
| `equip_blanchisserie` | O, N, vide |
| `equip_securite_24h` | O, N, vide |
| `equip_acces_pmr` | O, N, vide |
| `equip_paiement_carte` | O, N, vide |
| `equip_paiement_mobile_money` | O, N, vide |

**Pourquoi un fichier unique et non un second import.** Les équipements sont collectés pendant le même appel que la fiche. Deux fichiers imposeraient au collecteur de tenir deux tableurs cohérents entre eux, ce qui produirait des désynchronisations.

**Pourquoi trois valeurs et non deux.** Une cellule vide signifie « non demandé », ce qui est différent de « absent ». Un équipement non renseigné ne doit pas peser dans `MAT_INDICE` comme une absence avérée.

### Règles de traitement à l'import

- Une colonne vide ne crée aucune ligne dans `etablissement_equipement`.
- `equip_salle_capacite` renseigné alors que `equip_salle_reunion` vaut N ou est vide déclenche une erreur de ligne.
- `equip_salle_reunion` valant O sans capacité renseignée crée la ligne avec une capacité nulle et un avertissement au rapport de contrôle.
- Les valeurs acceptées sont `O`, `N`, `o`, `n`, `OUI`, `NON`, vide. Toute autre valeur déclenche une erreur de ligne.

### Conséquence sur `MAT_INDICE`

Les deux composantes de paiement passent de « non renseigné » à mesurables. L'indice reste calculable même avec des équipements partiellement renseignés : une composante non renseignée compte pour zéro, et le niveau de fiabilité en rend compte.

## C.3 Amendements

**Document 5, section 3.** Ajouter les quinze colonnes à la liste des champs complémentaires de la fiche de collecte, avec la mention qu'elles sont renseignées pendant l'appel de qualification.

**Document 9 bis, section H.4.1.** Ajouter les règles de traitement ci-dessus aux contrôles appliqués à l'import.

---

# Partie D. Libellés des quatre modules

À charger au document 10.

## D.1 Codes et questions métier

| Clé | Français | Anglais |
|---|---|---|
| `module.m5.code` | M5 · Conformité | M5 · Compliance |
| `module.m5.question` | Quel est l'état d'enregistrement et de classification du parc d'hébergement guinéen. | What is the registration and classification status of Guinea's accommodation stock? |
| `module.m6.code` | M6 · Maturité numérique | M6 · Digital maturity |
| `module.m6.question` | Quel est le degré de numérisation du secteur de l'hébergement, et où se situent les retards. | How digitalised is the accommodation sector, and where are the gaps? |
| `module.m7.code` | M7 · Événementiel | M7 · Events |
| `module.m7.question` | Le pays peut-il héberger un événement donné, à des dates données, sur un territoire donné. | Can the country accommodate a given event, on given dates, in a given territory? |
| `module.m8.code` | M8 · Retombées estimées | M8 · Estimated impact |
| `module.m8.question` | Quelles retombées économiques l'activité d'hébergement génère-t-elle. | What economic impact does accommodation activity generate? |

## D.2 Module M5, zones

| Clé | Français | Anglais |
|---|---|---|
| `m5.z1.titre` | Indicateurs clés | Key indicators |
| `m5.z1.aide` | État d'enregistrement et de classification sur le périmètre consulté. | Registration and classification status for the selected scope. |
| `m5.z2.titre` | Taux d'enregistrement par territoire | Registration rate by territory |
| `m5.z2.aide` | Part des établissements recensés disposant d'un enregistrement administratif documenté. | Share of surveyed establishments with documented administrative registration. |
| `m5.z3.titre` | Répartition par typologie et par gamme | Breakdown by type and price range |
| `m5.z3.aide` | Enregistrement et classification selon la nature et le niveau de prix des établissements. | Registration and classification by establishment type and price level. |
| `m5.z4.titre` | Préparation à la classification | Classification readiness |
| `m5.z4.aide` | Établissements dont la fiche est suffisamment complète pour entrer dans un processus de classification. Cette zone repose sur le recensement et ne dépend d'aucune transmission administrative. | Establishments whose record is complete enough to enter a classification process. This section draws on the survey and requires no administrative transmission. |
| `m5.z5.titre` | Écart entre liste administrative et terrain | Gap between official list and field |
| `m5.z5.aide` | Établissements figurant sur une liste administrative et invalidés par la collecte de terrain. | Establishments listed by the administration and invalidated by field collection. |
| `m5.z6.titre` | Détail par territoire | Territory breakdown |
| `m5.z6.aide` | Recensement, enregistrement et classification, territoire par territoire. | Survey, registration and classification, territory by territory. |

### En-têtes de colonnes M5

**Zone 4**

| Clé | Français | Anglais |
|---|---|---|
| `m5.z4.col.territoire` | Territoire | Territory |
| `m5.z4.col.recenses` | Recensés | Surveyed |
| `m5.z4.col.completes` | Fiches complètes | Complete records |
| `m5.z4.col.verifiees` | Fiches vérifiées | Verified records |
| `m5.z4.col.prets` | Prêts pour classification | Ready for classification |

**Zone 5**

| Clé | Français | Anglais |
|---|---|---|
| `m5.z5.col.territoire` | Territoire | Territory |
| `m5.z5.col.fermes` | Fermés définitivement | Permanently closed |
| `m5.z5.col.inexistants` | Inexistants | Non-existent |
| `m5.z5.col.reclasses` | Reclassés | Reclassified |
| `m5.z5.col.total` | Total de l'écart | Total gap |

**Zone 6**

| Clé | Français | Anglais |
|---|---|---|
| `m5.z6.col.territoire` | Territoire | Territory |
| `m5.z6.col.recenses` | Recensés | Surveyed |
| `m5.z6.col.enregistres` | Enregistrés | Registered |
| `m5.z6.col.classes` | Classés | Classified |
| `m5.z6.col.non_documentes` | Enregistrement non documenté | Registration undocumented |

## D.3 Module M6, zones

| Clé | Français | Anglais |
|---|---|---|
| `m6.z1.titre` | Indicateurs clés | Key indicators |
| `m6.z1.aide` | Degré de numérisation du secteur sur le périmètre consulté. | Sector digitalisation level for the selected scope. |
| `m6.z2.titre` | Indice de maturité par territoire | Maturity index by territory |
| `m6.z2.aide` | Score de numérisation moyen des établissements recensés, sur 100. | Average digitalisation score of surveyed establishments, out of 100. |
| `m6.z3.titre` | Décomposition de l'indice | Index breakdown |
| `m6.z3.aide` | Part des établissements disposant de chacune des six composantes de l'indice. | Share of establishments having each of the index's six components. |
| `m6.z4.titre` | Maturité par typologie | Maturity by establishment type |
| `m6.z4.aide` | Indice moyen selon la nature des établissements. | Average index by establishment type. |
| `m6.z5.titre` | Maturité par gamme tarifaire | Maturity by price range |
| `m6.z5.aide` | Indice moyen selon le niveau de prix. | Average index by price level. |
| `m6.z6.titre` | Classement des territoires | Territory ranking |
| `m6.z6.aide` | Territoires classés par indice de maturité. L'ordre croissant identifie les zones en retard, l'ordre décroissant les zones de référence. | Territories ranked by maturity index. Ascending order identifies lagging areas, descending order reference areas. |

### Composantes de l'indice, zone 3

| Clé | Français | Anglais | Poids |
|---|---|---|---|
| `m6.comp.presence` | Présence en ligne | Online presence | 20 |
| `m6.comp.reservation` | Canal de réservation en ligne | Online booking channel | 30 |
| `m6.comp.tarifs` | Tarifs publiés | Published rates | 20 |
| `m6.comp.contact` | Coordonnées valides | Valid contact details | 10 |
| `m6.comp.carte` | Paiement par carte | Card payment | 5 |
| `m6.comp.mobile` | Paiement mobile money | Mobile money payment | 15 |

### En-têtes de colonnes M6, zone 6

| Clé | Français | Anglais |
|---|---|---|
| `m6.z6.col.territoire` | Territoire | Territory |
| `m6.z6.col.etablissements` | Établissements | Establishments |
| `m6.z6.col.indice` | Indice | Index |
| `m6.z6.col.presence` | Présence en ligne | Online presence |
| `m6.z6.col.reservation` | Réservable en ligne | Bookable online |
| `m6.z6.col.paiement` | Paiement numérique | Digital payment |

### Mention obligatoire M6

| Clé | Français | Anglais |
|---|---|---|
| `m6.avertissement` | Cet indice mesure le degré de numérisation. Il ne constitue en aucun cas une note de qualité des établissements. | This index measures digitalisation only. It is in no way a quality rating of establishments. |

Cette mention est affichée en permanence sous le titre du module, non masquable.

## D.4 Module M7, zones

| Clé | Français | Anglais |
|---|---|---|
| `m7.z1.titre` | Fenêtre analysée | Analysed window |
| `m7.z2.titre` | Indicateurs clés | Key indicators |
| `m7.z2.aide` | Capacité d'accueil et tension sur la fenêtre sélectionnée. | Accommodation capacity and pressure over the selected window. |
| `m7.z3.titre` | Décomposition de la capacité mobilisable | Mobilisable capacity breakdown |
| `m7.z3.aide` | La capacité mobilisable se décompose en trois parts de fiabilité différente. Seule la première correspond à une disponibilité réellement connue. | Mobilisable capacity breaks down into three parts of differing reliability. Only the first reflects genuinely known availability. |
| `m7.z4.titre` | Capacité mobilisable par territoire | Mobilisable capacity by territory |
| `m7.z5.titre` | Capacité par gamme tarifaire | Capacity by price range |
| `m7.z5.aide` | Répartition de la capacité recensée selon le niveau de prix. | Breakdown of surveyed capacity by price level. |
| `m7.z6.titre` | Salles de réunion | Meeting rooms |
| `m7.z6.aide` | Établissements disposant d'une salle, répartis par palier de capacité. | Establishments with a meeting room, by capacity bracket. |
| `m7.z7.titre` | Demandes institutionnelles sur la fenêtre | Institutional requests over the window |
| `m7.z7.aide` | Besoins d'hébergement déclarés dont les dates chevauchent la fenêtre analysée. | Declared accommodation needs whose dates overlap the analysed window. |

### Bandeau de fenêtre, zone 1

| Clé | Français | Anglais |
|---|---|---|
| `m7.fenetre.format` | {evenement} · {territoire} · du {debut} au {fin} · {nuits} nuits | {evenement} · {territoire} · {debut} to {fin} · {nuits} nights |
| `m7.fenetre.dates_libres` | Dates libres · {territoire} · du {debut} au {fin} · {nuits} nuits | Custom dates · {territoire} · {debut} to {fin} · {nuits} nights |
| `m7.fenetre.aucune` | Aucun événement enregistré. Sélectionnez des dates libres. | No event on record. Select custom dates. |

### Sélecteur de fenêtre

| Clé | Français | Anglais |
|---|---|---|
| `m7.selecteur.titre` | Fenêtre | Window |
| `m7.selecteur.evenement` | Événement enregistré | Recorded event |
| `m7.selecteur.dates_libres` | Dates libres | Custom dates |
| `m7.selecteur.choisir_evenement` | Choisir un événement | Choose an event |
| `m7.selecteur.date_debut` | Date de début | Start date |
| `m7.selecteur.date_fin` | Date de fin | End date |
| `m7.filtre.capacite_salle` | Capacité de salle minimale | Minimum room capacity |

### Décomposition de la capacité, zone 3

| Clé | Français | Anglais |
|---|---|---|
| `m7.z3.partenaires` | Partenaires disponibles | Available partners |
| `m7.z3.partenaires.aide` | Disponibilité réelle connue. | Actual availability known. |
| `m7.z3.recenses` | Recensés non réservables | Surveyed, not bookable |
| `m7.z3.recenses.aide` | Capacité théorique. La disponibilité de ces établissements n'est pas connue. | Theoretical capacity. Availability of these establishments is unknown. |
| `m7.z3.vendu` | Déjà vendu | Already sold |
| `m7.z3.vendu.aide` | Retiré du disponible sur la fenêtre. | Removed from availability over the window. |

### En-têtes de colonnes M7

**Zone 6**

| Clé | Français | Anglais |
|---|---|---|
| `m7.z6.col.palier` | Palier de capacité | Capacity bracket |
| `m7.z6.col.etablissements` | Établissements | Establishments |
| `m7.z6.col.places` | Places totales | Total seats |

**Zone 7**

| Clé | Français | Anglais |
|---|---|---|
| `m7.z7.col.libelle` | Libellé | Title |
| `m7.z7.col.type` | Type | Type |
| `m7.z7.col.dates` | Dates | Dates |
| `m7.z7.col.demandees` | Unités demandées | Units requested |
| `m7.z7.col.couvertes` | Unités couvertes | Units covered |
| `m7.z7.col.statut` | Statut | Status |

### Mention obligatoire M7

| Clé | Français | Anglais |
|---|---|---|
| `m7.avertissement` | Cet écran mesure une capacité, il ne garantit aucune disponibilité et ne permet aucune réservation. | This screen measures capacity. It guarantees no availability and enables no booking. |

## D.5 Module M8, zones

| Clé | Français | Anglais |
|---|---|---|
| `m8.z1.titre` | Méthode appliquée | Method applied |
| `m8.z2.titre` | Indicateurs clés | Key indicators |
| `m8.z2.aide` | Dépense d'hébergement observée et estimation de la dépense totale. | Observed accommodation spending and total spending estimate. |
| `m8.z3.titre` | Évolution de la dépense observée | Observed spending over time |
| `m8.z3.aide` | Dépense d'hébergement sur le périmètre commercialisé. Donnée observée, non estimée. | Accommodation spending across the commercialised scope. Observed data, not estimated. |
| `m8.z4.titre` | Répartitions | Breakdowns |
| `m8.z4.aide` | Dépense observée par typologie, par gamme et par origine déclarée. | Observed spending by type, price range and declared origin. |
| `m8.z5.titre` | Détail par territoire | Territory breakdown |

### Bandeau de méthode, zone 1

| Clé | Français | Anglais |
|---|---|---|
| `m8.methode.format` | Estimation. Coefficient {valeur} appliqué à la dépense d'hébergement observée. Source : {source}, périmètre {perimetre}. Validé le {date}. | Estimate. Multiplier {valeur} applied to observed accommodation spending. Source: {source}, scope {perimetre}. Validated on {date}. |
| `m8.methode.lien` | Voir la méthodologie | View methodology |
| `m8.methode.absent` | Module désactivé : aucun coefficient validé n'est enregistré. | Module disabled: no validated multiplier on record. |

### En-têtes de colonnes M8, zone 5

| Clé | Français | Anglais |
|---|---|---|
| `m8.z5.col.territoire` | Territoire | Territory |
| `m8.z5.col.nuitees` | Nuitées | Room nights |
| `m8.z5.col.observee` | Dépense observée | Observed spending |
| `m8.z5.col.estimee` | Dépense estimée | Estimated spending |

### Mention obligatoire M8

| Clé | Français | Anglais |
|---|---|---|
| `m8.avertissement` | La dépense observée porte sur le seul périmètre commercialisé par Simandou Séjour. L'estimation en dérive et ne mesure pas l'ensemble du secteur. | Observed spending covers only the scope commercialised by Simandou Séjour. The estimate derives from it and does not measure the entire sector. |

---

# Partie E. Récapitulatif des amendements

| Document | Amendement |
|---|---|
| 2 | Énumération `PALIER_SALLE` ajoutée |
| 3 | Table `coefficient_retombees` ajoutée, section 11 |
| 4 | Pondération de `MAT_INDICE` révisée. Points ouverts 1 et 5 clos. Règle transverse de fiabilité ajoutée |
| 5 | Quinze colonnes d'équipement ajoutées à la fiche de collecte, section 3 |
| 9 bis | Règles de traitement des équipements à l'import, section H.4.1 |
| 10 | Libellés de la partie D. Compteurs contextuels de la section B.3 |

---

# Partie F. Ce qui reste ouvert

| Sujet | Effet |
|---|---|
| **Bornes de gamme tarifaire en GNF** | **Bloque le démarrage du recensement** |
| **Coefficient de retombées et sa source** | **Bloque l'activation de `M8`.** Voir les trois voies en B.4 |
| Dimensions de période et de territoire des vues matérialisées | Bloque la phase 2 de `M9` |
| Confirmation MATD du découpage | Bloque la mise en production |

---

*Document 16. Amende les documents 2, 3, 4, 5, 9 bis et 10.*
