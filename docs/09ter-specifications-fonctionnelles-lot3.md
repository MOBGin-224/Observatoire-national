# Document 9 ter. Spécifications fonctionnelles, lot 3

**Projet :** Observatoire National de l'Hospitalité Guinéenne
**Maître d'ouvrage :** SIMANDOU SEJOUR
**Version :** 1.0
**Statut :** Prescriptif. Complète les documents 9 et 9 bis.
**Prérequis :** documents 1 à 12, et document 9 partie A.

> **Portée.** Fiches des modules `M6_MATURITE` et `M7_EVENEMENTIEL`.
>
> Le cadre commun de la partie A du document 9 s'applique intégralement.
>
> **Rappel.** Aucun indicateur n'est défini ici. Tous proviennent du document 4. Aucun libellé n'est inventé : ils proviennent du document 10.

---

# Partie I. Fiche module `M6_MATURITE`

## I.1 Identité

| Attribut | Valeur |
|---|---|
| Code | `M6_MATURITE` |
| Libellé | Maturité numérique du secteur |
| Statut de donnée dominant | `RECENSE` |
| Profils | `ATTRACTIVITE`, `INVESTISSEMENT`, `TUTELLE`, `BAILLEUR` |
| Sélecteur de période | Non. Ce module décrit un état, pas un flux |
| Priorité de développement | Après `M1_OFFRE` |

## I.2 Question métier

Quel est le degré de numérisation du secteur de l'hébergement en Guinée, et où se situent les retards.

## I.3 Pourquoi ce module compte

**Il mesure le problème que l'entreprise existe pour résoudre.** L'offre guinéenne se commercialise par bouche-à-oreille, par appel direct et par intermédiaire informel. Tout le monde le constate, personne ne le chiffre.

**Il est presque gratuit.** Il ne demande aucune collecte supplémentaire : tous ses indicateurs dérivent des champs déjà renseignés par le recensement et par la table `etablissement_equipement`. Quelques requêtes suffisent.

**Il parle le langage des bailleurs.** Un indice de maturité numérique par territoire est un objet qu'un chargé de programme comprend immédiatement, sait comparer d'une année sur l'autre et sait inscrire dans un cadre logique.

## I.4 Indicateurs affichés

| Zone | Indicateurs |
|---|---|
| Blocs clés | `MAT_INDICE`, `OFF_TAUX_NUMERISATION`, `OFF_TAUX_RESERVABILITE`, `MAT_TAUX_PAIEMENT_NUMERIQUE` |
| Carte | `MAT_INDICE` par territoire |
| Décomposition | Les six composantes de `MAT_INDICE`, taux de présence de chacune |
| Croisements | `MAT_INDICE` par typologie et par gamme tarifaire |
| Classement | `MAT_INDICE` par territoire enfant, croissant et décroissant |

## I.5 Rappel de la composition de `MAT_INDICE`

Score sur 100, défini au document 4. Reproduit ici pour la lecture de l'écran, jamais recalculé par l'application.

| Composante | Poids |
|---|---|
| Présence en ligne | 20 |
| Canal de réservation en ligne | 30 |
| Tarifs publiés | 20 |
| Coordonnées jointes valides | 10 |
| Paiement par carte | 5 |
| Paiement mobile money | 15 |

Pondération définitive arrêtée par le document 16, section A.2 : le mobile money est le canal de paiement numérique dominant en Guinée, la carte bancaire y reste marginale hors haut de gamme.

## I.6 Composition de l'écran

```
+----------------------------------------------------------------------+
| [Niveau ▾]  [Typologie ▾] [Gamme ▾]                        [Export]  |
+----------------------------------------------------------------------+
| Z1  Blocs clés                                                       |
| [Indice de maturité] [Numérisation] [Réservabilité] [Paiement num.]  |
+---------------------------------------+------------------------------+
| Z2  Carte de l'indice de maturité     | Z3  Décomposition de l'indice|
| Échelle séquentielle bleue            | Six barres horizontales,     |
| Territoires sans donnée hachurés      | taux de présence par         |
|                                       | composante                   |
+---------------------------------------+------------------------------+
| Z4  Maturité par typologie            | Z5  Maturité par gamme       |
| Barres horizontales                   | Barres horizontales          |
+---------------------------------------+------------------------------+
| Z6  Classement des territoires                                       |
| Territoire · Établ. · Indice · Numérisation · Réservabilité ·        |
| Paiement numérique                                                   |
+----------------------------------------------------------------------+
```

## I.7 Filtres de module

| Filtre | Valeurs | Défaut |
|---|---|---|
| Typologie | Multi-sélection sur `TYPOLOGIE` | Toutes |
| Gamme tarifaire | Multi-sélection sur `GAMME` | Toutes |

Aucun filtre de statut de relation. **Raison :** filtrer sur les partenaires actifs produirait un indice artificiellement élevé, puisqu'un partenaire de Simandou Séjour dispose par construction d'un canal de réservation en ligne. L'indice mesure le secteur, pas le portefeuille de l'entreprise.

## I.8 Comportements attendus

**Zone 3, la plus instructive.** Elle montre où le retard se concentre. Un territoire peut afficher un taux de présence en ligne élevé et un taux de réservabilité nul : c'est la situation guinéenne typique, une offre visible mais non réservable. La décomposition rend ce diagnostic immédiat.

**Zone 6, double lecture.** Le classement est basculable entre ordre croissant et décroissant. Le croissant identifie les territoires en retard, qui appellent un programme d'appui. Le décroissant identifie les territoires avancés, qui servent de référence.

**Aucun établissement n'est jamais nommé**, y compris dans le classement, qui porte sur des territoires.

## I.9 États par zone

| Zone | État 3, vide |
|---|---|
| Z1 blocs | « Aucun établissement recensé sur ce territoire. » |
| Z2 carte | Carte hachurée, légende « Aucune donnée » |
| Z3 décomposition | « Aucun établissement à évaluer. » |
| Z4 et Z5 | « Aucun établissement à répartir. » |
| Z6 classement | « Ce territoire n'a pas de subdivision référencée. » |

**Aucun indicateur de ce module n'est soumis à la règle M1.** Ce sont des ratios d'inventaire, non des données de performance commerciale. Tout s'affiche, y compris à zéro.

**Point de vigilance.** Sur un territoire comptant peu d'établissements, l'indice reste calculable mais peu significatif. Le niveau de fiabilité `INDICATIF` ou `SIGNAL` s'applique, et il doit être visible.

## I.10 Ce que l'écran ne fait jamais

- **Présenter l'indice comme une note de qualité.** C'est une mesure de numérisation, rien d'autre. Le libellé et la fiche méthodologique doivent le dire.
- Nommer un établissement, sous aucune forme.
- Classer des établissements. Le classement porte sur des territoires.
- Filtrer sur le statut de relation.
- Recalculer l'indice côté application.

## I.11 Critères d'acceptation

1. L'indice affiché provient de la vue matérialisée et n'est pas recalculé par l'application.
2. Aucun filtre de statut de relation n'est proposé.
3. La décomposition affiche les six composantes avec leurs poids respectifs.
4. Un territoire à forte présence en ligne et à réservabilité nulle est visuellement identifiable en zone 3.
5. Le classement est basculable entre ordre croissant et décroissant.
6. Aucun nom d'établissement n'apparaît, y compris en infobulle.
7. Le niveau de fiabilité est visible sur chaque bloc et suit l'effectif du territoire.
8. Avec zéro établissement recensé, l'écran s'affiche entièrement en états vides.
9. Le libellé de l'indice ne comporte aucun terme évoquant une note ou une qualité.
10. L'export PDF reproduit les six zones avec les mentions obligatoires.

---

# Partie J. Fiche module `M7_EVENEMENTIEL`

## J.1 Identité

| Attribut | Valeur |
|---|---|
| Code | `M7_EVENEMENTIEL` |
| Libellé | Événementiel et pics de demande |
| Statut de donnée | Croisement `DECLARE`, `RECENSE` et `OBSERVE` |
| Profils | `ATTRACTIVITE`, `EVENEMENTIEL` |
| Sélecteur de période | Remplacé par un sélecteur de fenêtre. Voir J.5 |
| Priorité de développement | Après `M4_TENSION` |

## J.2 Question métier

Le pays peut-il héberger un événement donné, à des dates données, sur un territoire donné.

## J.3 Nature particulière de ce module

**Ce module ne raisonne pas en période, il raisonne en fenêtre.** Les autres modules regardent en arrière sur trente ou quatre-vingt-dix jours. Celui-ci regarde en avant, sur les dates d'un événement précis.

Il répond à une question qu'aucune institution guinéenne ne sait traiter aujourd'hui : un pays qui ignore s'il peut loger trois cents délégués ne peut pas se porter candidat à l'accueil d'un sommet.

## J.4 Indicateurs affichés

| Zone | Indicateurs |
|---|---|
| Blocs clés | `EVE_CAPACITE_MOBILISABLE`, `EVE_CAPACITE_SALLES`, `EVE_TAUX_TENSION_EVENEMENT`, `INS_DEFICIT` |
| Capacité par gamme | `OFF_CAPACITE_RECENSEE` filtrée sur la fenêtre et la gamme |
| Salles | `EVE_CAPACITE_SALLES` avec filtre de capacité minimale |
| Demandes déclarées | `INS_VOLUME_DEMANDE`, `INS_TAUX_COUVERTURE` |
| Tension sur la fenêtre | `TEN_FENETRES_SATURATION` |
| Carte | `EVE_CAPACITE_MOBILISABLE` par territoire |

## J.5 Sélecteur de fenêtre

Remplace le sélecteur de période de la barre de contrôle.

Deux modes :

**Mode événement.** Choix d'un événement existant, issu de `demande_institutionnelle` ou de `evenement_calendrier`. Les dates et le territoire se renseignent automatiquement.

**Mode dates libres.** Saisie d'une date de début, d'une date de fin, et sélection du territoire par le sélecteur géographique habituel.

Le mode événement est le défaut lorsqu'au moins un événement futur existe. Sinon, mode dates libres.

## J.6 Composition de l'écran

```
+----------------------------------------------------------------------+
| [Niveau ▾]  [Fenêtre : événement ▾ | dates libres]         [Export]  |
| [Gamme ▾] [Capacité de salle minimale ▾]                             |
+----------------------------------------------------------------------+
| Z1  Bandeau de fenêtre                                               |
| Événement · Territoire · du JJ/MM au JJ/MM · N nuits                 |
+----------------------------------------------------------------------+
| Z2  Blocs clés                                                       |
| [Capacité mobilisable] [Salles] [Tension] [Déficit]                  |
+---------------------------------------+------------------------------+
| Z3  Décomposition de la capacité      | Z4  Carte de la capacité     |
| Partenaires disponibles               | mobilisable par territoire   |
| Recensés non réservables              |                              |
| Déjà vendu                            |                              |
+---------------------------------------+------------------------------+
| Z5  Capacité par gamme tarifaire      | Z6  Salles de réunion        |
| Barres, quatre gammes                 | Nombre d'établissements et   |
|                                       | total de places par palier   |
+---------------------------------------+------------------------------+
| Z7  Demandes institutionnelles sur la fenêtre                        |
| Libellé · Type · Unités demandées · Unités couvertes · Statut        |
+----------------------------------------------------------------------+
```

## J.7 Filtres de module

| Filtre | Valeurs | Défaut |
|---|---|---|
| Gamme tarifaire | Multi-sélection sur `GAMME` | Toutes |
| Capacité de salle minimale | 20, 50, 100, 200, 500 places | Aucune |

Ces valeurs sont les bornes basses des paliers `PALIER_SALLE`, document 2, section 12.1.

## J.8 Comportements attendus

**Zone 3, décomposition obligatoire.** La capacité mobilisable se décompose toujours en trois parts, jamais présentée en total unique :

| Part | Nature | Fiabilité |
|---|---|---|
| Partenaires disponibles | Disponibilité réelle connue | Élevée |
| Recensés non réservables | Capacité théorique, disponibilité inconnue | Faible |
| Déjà vendu | Retiré du disponible | Élevée |

**Raison :** annoncer une capacité mobilisable de mille unités dont neuf cents relèvent d'établissements dont on ignore la disponibilité serait un engagement que Simandou Séjour ne peut pas tenir. La décomposition rend l'incertitude visible.

**Zone 7.** Liste des demandes institutionnelles chevauchant la fenêtre. L'écart entre unités demandées et unités couvertes est mis en évidence. Une demande en `NON_SATISFAITE` ou `PARTIELLEMENT_SATISFAITE` est signalée.

**Tension.** `EVE_TAUX_TENSION_EVENEMENT` dépassant cent pour cent signifie que le besoin déclaré excède la capacité mobilisable. C'est le seul cas où `--color-alert` apparaît sur cet écran.

**Cumul des demandes.** Lorsque plusieurs demandes institutionnelles chevauchent la même fenêtre et le même territoire, leurs besoins se cumulent avant comparaison à la capacité. Deux sommets simultanés à Conakry se concurrencent.

## J.9 États par zone

| Zone | État 3, vide |
|---|---|
| Z1 bandeau | « Aucun événement enregistré. Sélectionnez des dates libres. » |
| Z2 capacité mobilisable | « Aucun établissement recensé sur ce territoire. » |
| Z2 salles | « Aucune salle de réunion recensée sur ce territoire. » |
| Z2 tension et déficit | « Aucune demande institutionnelle sur cette fenêtre. » |
| Z3 décomposition | « Aucune capacité à décomposer. » |
| Z4 carte | Carte hachurée, légende « Aucune capacité recensée » |
| Z5 gammes | « Aucun établissement à répartir. » |
| Z6 salles | « Aucune salle recensée répondant au critère. » |
| Z7 demandes | « Aucune demande institutionnelle sur cette fenêtre. » |

**État attendu au lancement.** La part « partenaires disponibles » sera très faible et la part « recensés non réservables » très élevée. C'est la réalité du secteur, et c'est précisément ce que l'écran doit rendre visible.

## J.10 Ce que l'écran ne fait jamais

- **Présenter la capacité mobilisable en total unique**, sans décomposition entre disponibilité connue et capacité théorique.
- Nommer un établissement, y compris dans la zone des salles de réunion.
- Proposer de réserver, de contacter un établissement ou de constituer un dossier. **Ce n'est pas un outil de réservation de groupe.**
- Afficher un contact d'établissement.
- Utiliser `--color-alert` ailleurs que sur un dépassement de capacité.
- Garantir une disponibilité. L'écran mesure, il ne promet pas.

## J.11 Critères d'acceptation

1. La capacité mobilisable est toujours décomposée en trois parts, jamais présentée en total unique.
2. La part « recensés non réservables » porte une mention indiquant que la disponibilité y est inconnue.
3. Le passage du mode événement au mode dates libres conserve le territoire sélectionné.
4. Deux demandes institutionnelles chevauchant la même fenêtre et le même territoire voient leurs besoins cumulés.
5. Un taux de tension supérieur à cent pour cent déclenche l'affichage en `--color-alert`.
6. `--color-alert` n'apparaît nulle part ailleurs sur l'écran.
7. Le filtre de capacité de salle minimale modifie la zone 6 et le bloc clé correspondant.
8. Aucun nom ni contact d'établissement n'apparaît sur l'écran.
9. Aucune action de réservation, de contact ou de constitution de dossier n'est proposée.
10. Sans aucune demande institutionnelle enregistrée, l'écran reste utilisable en mode dates libres.
11. Avec zéro établissement recensé, l'écran s'affiche entièrement en états vides.
12. L'export PDF conserve la décomposition de la zone 3 et le bandeau de fenêtre.

---

## Points ouverts

1. ~~Paliers retenus pour le filtre de capacité de salle minimale.~~ **Clos par le document 16, section B.2** : énumération `PALIER_SALLE`.
2. Faut-il permettre la comparaison de deux territoires sur une même fenêtre, pour arbitrer un lieu d'accueil.
3. Horizon maximal de projection en mode dates libres.
4. Traitement d'une fenêtre chevauchant deux saisons, sèche et des pluies, au regard de l'accessibilité.

---

*Document 9 ter. Lot 3 sur 4. Lot suivant : `M3_ACTIVITE`, `M5_CONFORMITE` et `M8_RETOMBEES`.*
