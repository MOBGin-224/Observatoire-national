# Document 17. Arbitrages, corrections et dette technique

**Projet :** Observatoire National de l'Hospitalité Guinéenne
**Maître d'ouvrage :** SIMANDOU SEJOUR
**Version :** 1.0
**Statut :** Prescriptif. Amende les documents 3, 4, 9 bis, 9 ter, 9 quater, 10, 12, 15 et 16.

> **Objet.** Ce document tranche les cinq interprétations signalées, répond à la question restée ouverte sur la fenêtre des blocs événementiels, traite les défauts connus, et fixe l'ordre de traitement.
>
> **Priorité.** Le trou de migration de la partie A passe avant tout le reste, y compris avant toute modernisation visuelle.

---

# Partie A. Le trou de migration

## A.1 Constat

Deux objets vivent dans la base de production sans exister dans aucun fichier de migration : `mv_evenementiel_national` et la vue d'accès `acces_evenementiel_national`.

**Conséquence.** Un déploiement sur base neuve produit un schéma incomplet, et l'écran de synthèse échoue à la lecture.

La détection est juste et le croisement méthodique. Ce type d'écart ne peut pas être révélé par une procédure de déploiement jamais éprouvée.

## A.2 Réparation immédiate

Recréer les deux objets dans une migration, à l'identique de ce qui existe en base.

## A.3 La réparation ne suffit pas

Ce trou signifie que des objets de base ont été créés en dehors du flux de migration. Sans règle, le cas se reproduira.

### Règle, applicable sans exception

**Aucun objet de base de données n'est créé, modifié ou supprimé autrement que par un fichier de migration.**

Cela vaut pour les tables, les vues, les vues matérialisées, les fonctions, les politiques de sécurité, les index et les tâches planifiées.

**Aucune exception, y compris pour un correctif urgent.** Un correctif appliqué directement en base est une dette invisible : il fonctionne, rien ne le signale, et il disparaît au premier déploiement propre.

### Contrôle automatique

Un script compare les objets présents en base aux objets créés par les migrations, et signale tout écart dans les deux sens.

**Exécution : avant chaque livraison.** C'est exactement le croisement effectué à la main lors de cette revue. Il doit devenir automatique.

**Amendement au document 12, section 6.** Ajouter une dixième vérification par inspection :

> | I10 | Croisement des objets présents en base avec ceux créés par les migrations | Aucun écart dans les deux sens |

### Procédure de déploiement à éprouver

La procédure de déploiement sur base neuve doit être exécutée au moins une fois, sur un environnement dédié.

Tant qu'elle ne l'a pas été, d'autres écarts du même type peuvent subsister sans être détectables.

---

# Partie B. Les cinq interprétations

## B.1 Masquage des indicateurs de performance

**Interprétation confirmée, avec une précision de formulation.**

Il ne s'agit pas d'un masquage supplémentaire qui s'ajouterait à la règle M1. Les indicateurs de performance n'ont pas de niveau `SIGNAL` : en dessous du seuil `INDICATIF`, ils sont masqués.

### Formulation retenue

**Un indicateur de performance s'affiche si les deux conditions sont réunies :**

1. La règle M1 est satisfaite : au moins 3 établissements dans l'agrégat, et aucun ne représentant plus de la moitié des unités.
2. L'agrégat compte au moins 10 réservations.

Sinon, l'indicateur est masqué avec le libellé M1 habituel, sans distinction de motif à l'écran.

**Pourquoi ne pas distinguer les deux motifs.** Afficher « effectif de réservations insuffisant » plutôt que le libellé de confidentialité informerait sur le volume d'activité d'un territoire, ce qui est précisément ce que la règle M1 protège.

Concernés : `M3_ACTIVITE` et `M8_RETOMBEES`.

## B.2 Fiabilité de `MAT_INDICE`

**Interprétation logique, mais l'effet est mauvais. Correction.**

### Ce qui a été appliqué

La fiabilité a été calculée sur l'effectif des établissements dont les deux composantes de paiement sont renseignées, en application de la règle des indicateurs composites du document 16, section B.1.

Résultat : `SIGNAL` partout tant que les équipements ne sont pas collectés.

### Pourquoi c'est une mauvaise application de la règle

La règle du composant le plus faible vise les indicateurs qui croisent **deux bases de mesure distinctes**. `TEN_INDICE_TENSION` rapporte de la demande à de l'inventaire : ce sont deux échantillons différents, et le plus faible commande.

`MAT_INDICE` n'est pas de ce type. Ses six composantes sont des **attributs des mêmes établissements**, pas six échantillons distincts. L'échantillon est unique : le nombre d'établissements de l'agrégat.

### Correction

**La fiabilité de `MAT_INDICE` se calcule sur le nombre d'établissements de l'agrégat**, selon la règle d'inventaire du document 16, section B.1 : `CONSOLIDE` à partir de 30, `INDICATIF` de 10 à 29, `SIGNAL` en dessous.

Une composante non renseignée continue de compter pour zéro dans le score, ce qui est conservateur et honnête. Mais elle ne dégrade pas la fiabilité, sinon l'indicateur est pénalisé deux fois pour la même raison.

### Ajout : trois états par composante

La zone 3 de `M6` distingue trois états, et non deux.

| État | Signification |
|---|---|
| Présente | Composante vérifiée présente |
| Absente | Composante vérifiée absente |
| Non renseignée | Information non collectée |

### Mention de plancher

Tant que le taux de renseignement d'une composante est inférieur à 50 %, une mention permanente accompagne l'indice.

| Clé | Français | Anglais |
|---|---|---|
| `module.m6.plancher` | Certaines composantes ne sont pas encore renseignées pour tous les établissements. L'indice constitue un plancher, non une valeur définitive. | Some components are not yet recorded for all establishments. The index is a floor value, not a final one. |

### Amendement au document 16, section B.1

Préciser la portée de la règle des composites :

> **La règle du composant le plus faible s'applique aux indicateurs croisant deux bases de mesure distinctes**, comme `TEN_INDICE_TENSION` qui rapporte des recherches à de la capacité.
>
> Elle ne s'applique pas aux indicateurs composites dont les composantes sont des attributs d'un même échantillon, comme `MAT_INDICE` ou `OFF_COMPLETUDE_FICHE`. Ceux-ci suivent la règle d'inventaire, sur l'effectif d'établissements de l'agrégat.

## B.3 Module M5

### Confirmé sans changement

**Fiche complète définie sur quatre composantes, hors présence en ligne.** La présence en ligne n'est pas un prérequis de classification administrative.

**« Prêt » égale complète et vérifiée.** C'est le bon niveau d'exigence : une fiche complète mais non vérifiée ne peut pas fonder un acte administratif.

**`CONF_TAUX_*` rapportés aux recensés.** Conforme au document 4, et c'est le chiffre qui intéresse la tutelle : la part du parc réel disposant d'un enregistrement documenté.

### Correction : une mention obligatoire

**La formule est juste, mais elle est trompeuse si elle est affichée seule.**

Si l'administration n'a transmis de données que pour une partie du parc, le dénominateur confond deux situations différentes : l'établissement non enregistré et l'établissement dont l'enregistrement n'a pas été transmis.

Un établissement parfaitement en règle apparaîtrait alors comme non documenté, ce que la règle de vocabulaire du document 4 cherche précisément à éviter.

**Ajout obligatoire en zone 1 de `M5`**, mention permanente non masquable :

| Clé | Français | Anglais |
|---|---|---|
| `module.m5.transmission` | Données de conformité transmises pour {n} établissements sur {total} recensés. | Compliance data provided for {n} of {total} surveyed establishments. |
| `module.m5.transmission.aucune` | Aucune donnée de conformité transmise à ce jour. Les taux affichés sont nuls par absence de transmission, non par absence d'enregistrement. | No compliance data provided to date. The rates shown are zero due to absence of transmission, not absence of registration. |

La seconde formulation s'affiche tant que la table `conformite_etablissement` est vide.

## B.4 Module M7

### Confirmé

**Demande annulée listée mais non cumulée.** Une demande en `ANNULEE` apparaît dans la zone 7 pour mémoire, sans entrer dans le cumul des besoins.

### À formaliser explicitement

**Le pic nocturne est la bonne unité, et la règle doit être écrite.**

**Les trois parts de la décomposition de capacité s'expriment en unités par nuit, à la nuit de pointe de la fenêtre.**

Sans cette règle, une part exprimée en stock et une autre en cumul de nuitées seraient incomparables, et leur somme n'aurait aucun sens. C'est le genre d'erreur qui produit un total plausible et faux.

**Amendement au document 9 ter, section J.8**, à ajouter aux comportements attendus.

### Correction : règle M1 sur la part partenaires

**La règle M1 appliquée à la part partenaires vide la décomposition de son seul élément fiable**, alors que cette décomposition est la raison d'être de l'écran.

### Comportement retenu

| Situation | Affichage |
|---|---|
| Règle M1 satisfaite | Trois parts distinctes : partenaires disponibles, déjà vendu, recensés non réservables |
| Règle M1 non satisfaite | Deux parts : capacité partenaire recensée, recensés non réservables |

En mode dégradé, les parts « partenaires disponibles » et « déjà vendu » fusionnent en une part unique intitulée « capacité partenaire recensée ».

**Ce que cela préserve.** Le message essentiel de l'écran, la distinction entre disponibilité connue et disponibilité inconnue, reste lisible.

**Ce que cela protège.** Les unités vendues, qui sont la donnée de performance, ne sont pas déduites.

| Clé | Français | Anglais |
|---|---|---|
| `module.m7.z3.partenaire_global` | Capacité partenaire recensée | Surveyed partner capacity |
| `module.m7.z3.partenaire_global.aide` | Détail non publié : effectif insuffisant pour préserver la confidentialité des établissements. | Breakdown not published: sample size too small to protect establishment confidentiality. |

## B.5 Clés de libellés

**L'incohérence vient du document 16. Harmonisation vers la convention existante.**

| Forme actuelle | Forme retenue |
|---|---|
| `m5.z1.titre` | `module.m5.z1.titre` |
| `m6.comp.presence` | `module.m6.comp.presence` |
| `m7.fenetre.format` | `module.m7.fenetre.format` |
| `m8.methode.format` | `module.m8.methode.format` |

Toutes les clés introduites par le document 16, partie D, sont préfixées `module.`, comme celles de `M1` à `M4`.

**Le coût est faible maintenant**, les quatre écrans n'étant pas encore refondus. Il deviendrait élevé une fois la modernisation faite.

**Amendement au document 16, partie D.** Toutes les clés sont préfixées `module.`.

---

# Partie C. Fenêtre des blocs événementiels en synthèse

Question restée sans réponse, tranchée ici.

## C.1 Distinction entre les deux blocs

**`EVE_CAPACITE_SALLES` est un comptage d'inventaire.** Il n'a besoin d'aucune fenêtre temporelle. Il reste tel quel.

**`EVE_CAPACITE_MOBILISABLE` n'a aucun sens sans fenêtre.** Mobilisable quand.

## C.2 Décision

**En synthèse, `EVE_CAPACITE_MOBILISABLE` applique une fenêtre par défaut des 90 prochains jours**, et le libellé du bloc l'indique explicitement.

| Clé | Français | Anglais |
|---|---|---|
| `module.m9.eve.fenetre` | Capacité mobilisable, 90 prochains jours | Mobilisable capacity, next 90 days |

**Pourquoi 90 jours.** C'est l'horizon sur lequel une institution prépare un événement. Plus court, il manquerait les sommets en préparation. Plus long, la disponibilité partenaire connue deviendrait trop incertaine pour être informative.

**Pourquoi le dire dans le libellé.** Un chiffre de capacité sans horizon est ininterprétable. L'utilisateur qui veut une autre fenêtre passe par le module `M7`, qui offre les deux modes de sélection.

**Amendement au document 9 bis, section F.4**, profil `EVENEMENTIEL`.

---

# Partie D. Défauts connus

## D.1 `TEN_INDICE_TENSION` à 100 en dur

**À diagnostiquer avant de corriger.**

L'indice est normalisé sur la moyenne nationale. Si un seul territoire porte de la demande, il vaut mécaniquement 100. Ce serait alors un comportement correct sur des données pauvres, non un défaut de code.

**Test.** Charger de la demande sur deux territoires de capacités réservables différentes. Si les deux valent encore 100, le défaut est dans la vue.

**Si le défaut est confirmé**, la cause la plus probable est un dénominateur national calculé sur le territoire courant plutôt que sur l'ensemble.

## D.2 `etablissement` sans date de création

**Ce n'est pas un amendement au document 3, c'est un écart de conformité.**

Le document 3 spécifie `created_at` et `updated_at` sur toute table de fait. La migration les a omis sur `etablissement`.

**Correction :** ajouter les deux colonnes, avec valeur par défaut à l'horodatage courant et déclencheur de mise à jour sur `updated_at`.

Les lignes existantes prennent la date d'application de la migration. `CTX_RECENSEMENT_PROGRESSION` devient calculable à partir de cette date, ce qui est acceptable puisque l'indicateur mesure un rythme et non un historique.

## D.3 `libelle_en` nul sur les énumérations

**Tâche de chargement, aucune décision requise.**

Toutes les traductions existent : document 10, section 7, et document 16, partie D. Elles sont à charger dans la table `enumeration`.

## D.4 Pluriel des décomptes

**Le défaut dépasse le cas signalé.**

Toute clé de libellé comportant un décompte a besoin de ses deux formes. Le document 10, section 9, liste déjà les unités au singulier et au pluriel ; c'est le mécanisme de sélection qui manque.

### Règle

| Langue | Singulier | Pluriel |
|---|---|---|
| Français | n vaut 0 ou 1 | n supérieur ou égal à 2 |
| Anglais | n vaut 1 | tout autre cas, y compris 0 |

**Attention à l'écart entre les deux langues sur zéro.** En français, « 0 nuit » est au singulier. En anglais, « 0 nights » est au pluriel. Une règle unique produirait une faute dans l'une des deux langues.

### Clés concernées

Toutes celles comportant un paramètre de décompte, notamment `module.m7.fenetre.format`, `perimetre.etablissements`, `perimetre.partenaires`, `module.compteur.indicateurs`, et les unités de la section 9 du document 10.

## D.5 Import non transactionnel

**Défaut sérieux. À corriger avant tout import réel.**

Un import appliqué à moitié corrompt l'inventaire en silence : des établissements créés sans leurs équipements, sans trace de l'échec, et sans moyen de distinguer un équipement absent d'un équipement non importé.

### Correction

**Transaction unique, tout ou rien.** Établissements et équipements sont écrits dans la même transaction. Un échec en seconde passe annule la première.

**Rapport d'échec explicite.** En cas d'échec, l'écran indique qu'aucune ligne n'a été écrite, et le motif.

**Amendement au document 9 bis, section H.4.1**, à ajouter aux règles de traitement de l'import.

## D.6 Import sans équipements

Déjà tranché au document 16, partie C. Les quinze colonnes sont spécifiées.

**Reste à implémenter.** Tant que ce n'est pas fait, la zone 6 de `M7` ne se remplira pas, et les deux composantes de paiement de `MAT_INDICE` resteront non renseignées.

---

# Partie E. Ordre de traitement

Les cinq premiers points sont des dettes dont le coût augmente chaque jour. La modernisation visuelle peut attendre une semaine, un import corrompu non.

| Rang | Tâche | Motif |
|---|---|---|
| 1 | Trou de migration et contrôle automatique | Un déploiement sur base neuve échoue aujourd'hui |
| 2 | Caractère transactionnel de l'import | Avant tout import réel, sous peine de corruption silencieuse |
| 3 | `created_at` et `updated_at` sur `etablissement` | Écart de conformité au document 3 |
| 4 | Colonnes d'équipement à l'import | Débloque `M7` zone 6 et deux composantes de `MAT_INDICE` |
| 5 | Chargement des `libelle_en` | Tâche mécanique, aucun arbitrage |
| 6 | Correction de fiabilité de `MAT_INDICE`, harmonisation des clés | Avant la modernisation, coût faible maintenant |
| 7 | Modernisation de `M6`, puis `M5` | Données disponibles |
| 8 | Vue `TEN_FENETRES_SATURATION` | Seuil arrêté au document 15 |
| 9 | Modernisation de `M7`, puis `M11` | |
| 10 | Prévisualisation « Voir comme » | Touche tous les modules |
| 11 | Phase 2 de `M9` | Suspendue à la reprise des vues matérialisées |

**Le rang 6 avant le rang 7 n'est pas négociable.** Harmoniser les clés après la refonte des quatre écrans coûterait plusieurs fois plus cher.

---

# Partie F. Récapitulatif des amendements

| Document | Amendement |
|---|---|
| 3 | `created_at` et `updated_at` sur `etablissement`, écart de conformité à corriger |
| 4 | Formulation du masquage des indicateurs de performance, section B.1 |
| 9 bis | Fenêtre de 90 jours pour `EVE_CAPACITE_MOBILISABLE` en synthèse, section F.4. Caractère transactionnel de l'import, section H.4.1 |
| 9 ter | Pic nocturne comme unité de la décomposition et mode dégradé de la zone 3, section J.8 |
| 10 | Clés de la partie B.2, B.3, B.4 et C.2 du présent document. Règle de pluriel |
| 12 | Vérification I10, croisement base et migrations |
| 15 | Sans objet |
| 16 | Portée de la règle des composites, section B.1. Préfixe `module.` sur toutes les clés de la partie D |

---

# Partie G. Ce qui reste ouvert

| Sujet | Effet |
|---|---|
| **Bornes de gamme tarifaire en GNF** | **Bloque le démarrage du recensement** |
| **Coefficient de retombées et sa source** | **Bloque l'activation de `M8`** |
| Dimensions de période et de territoire des vues matérialisées | Bloque la phase 2 de `M9` |
| Confirmation MATD du découpage | Bloque la mise en production |

---

*Document 17. Amende les documents 3, 4, 9 bis, 9 ter, 10, 12 et 16.*
