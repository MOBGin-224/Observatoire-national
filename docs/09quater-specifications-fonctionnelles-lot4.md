# Document 9 quater. Spécifications fonctionnelles, lot 4

**Projet :** Observatoire National de l'Hospitalité Guinéenne
**Maître d'ouvrage :** SIMANDOU SEJOUR
**Version :** 1.0
**Statut :** Prescriptif. Complète les documents 9, 9 bis et 9 ter. **Dernier lot.**
**Prérequis :** documents 1 à 12, et document 9 partie A.

> **Portée.** Fiches des modules `M3_ACTIVITE`, `M5_CONFORMITE` et `M8_RETOMBEES`.
>
> **Point commun aux trois.** Ce sont les modules qui seront vides ou quasi vides au lancement. Chacun attend une source de données qui n'existe pas encore : le raccordement à la plateforme pour `M3`, une convention avec la tutelle pour `M5`, une méthodologie validée pour `M8`.
>
> **Ils se spécifient et se construisent malgré tout.** Un module vide dont l'écran existe se remplit le jour où la donnée arrive. Un module non construit reste un projet. Et dans le cas de `M5`, le conteneur vide est l'offre faite au ministère, pas un défaut.
>
> Le cadre commun de la partie A du document 9 s'applique intégralement.

---

# Partie K. Fiche module `M3_ACTIVITE`

## K.1 Identité

| Attribut | Valeur |
|---|---|
| Code | `M3_ACTIVITE` |
| Libellé | Activité observée |
| Statut de donnée dominant | `OBSERVE` |
| Profils | `ATTRACTIVITE`, `TUTELLE` |
| Sélecteur de période | Oui |
| Disponibilité | Après raccordement à la plateforme |
| Priorité de développement | Après le raccordement |

## K.2 Question métier

Que se passe-t-il réellement sur le périmètre commercialisé : combien de réservations, quel taux d'occupation, à quel prix moyen.

## K.3 Nature particulière de ce module

**C'est le module le plus exposé et le moins solide.** Il porte les indicateurs de référence du secteur hôtelier, ceux qu'un interlocuteur venu de l'hôtellerie connaît par réflexe. Et il repose sur le périmètre le plus étroit de l'Observatoire.

Trois conséquences :

- La règle M1 s'applique presque partout. La majorité des cellules territoriales seront masquées.
- Ce module ne doit jamais porter la démonstration devant une institution. Les modules `M1`, `M2` et `M4` la portent.
- Sa présence sert la crédibilité de l'ensemble : un observatoire qui ignore l'ADR et le RevPAR passerait pour un outil d'amateur.

## K.4 Indicateurs affichés

| Zone | Indicateurs |
|---|---|
| Blocs clés | `ACT_RESERVATIONS`, `ACT_NUITEES`, `ACT_TAUX_OCCUPATION`, `ACT_ADR`, `ACT_REVPAR`, `ACT_ALOS`, `ACT_LEAD_TIME`, `ACT_TAUX_ANNULATION` |
| Évolution | `ACT_TAUX_OCCUPATION`, `ACT_ADR` et `ACT_REVPAR` dans le temps |
| Répartitions | Réservations et nuitées par typologie et par gamme |
| Conversion | `ACT_TAUX_CONVERSION`, avec `OFF_TAUX_COUVERTURE` en regard |
| Qualité de la demande | `ACT_TAUX_ANNULATION`, `ACT_TAUX_NON_PRESENTATION` |
| Tableau territorial | Indicateurs `ACT_` par territoire enfant, sous règle M1 |

## K.5 Composition de l'écran

```
+----------------------------------------------------------------------+
| [Niveau ▾] [Période ▾] [Typologie ▾] [Gamme ▾]             [Export]  |
+----------------------------------------------------------------------+
| Z1  Blocs clés                                                       |
| [Réservations] [Nuitées] [Occupation] [ADR]                          |
| [RevPAR] [ALOS] [Lead time] [Annulation]                             |
+----------------------------------------------------------------------+
| Z2  Évolution dans le temps                                          |
| Courbes : occupation, ADR, RevPAR. Indice base 100 si effectif faible|
+---------------------------------------+------------------------------+
| Z3  Répartitions                      | Z4  Conversion               |
| Par typologie, par gamme              | Taux de conversion et taux   |
|                                       | de couverture en regard      |
+---------------------------------------+------------------------------+
| Z5  Tableau territorial                                              |
| Territoire · Réservations · Nuitées · Occupation · ADR · RevPAR      |
| Cellules masquées sous seuil de confidentialité                      |
+----------------------------------------------------------------------+
```

## K.6 Filtres de module

| Filtre | Valeurs | Défaut |
|---|---|---|
| Typologie | Multi-sélection sur `TYPOLOGIE` | Toutes |
| Gamme tarifaire | Multi-sélection sur `GAMME` | Toutes |
| Motif de séjour | Multi-sélection sur `MOTIF_SEJOUR` | Tous |

## K.7 Comportements attendus

**Deux taux d'occupation distincts.** `ACT_TAUX_OCCUPATION` et `ACT_TAUX_OCCUPATION_CONTRACTUALISE` sont deux indicateurs différents, avec deux codes, deux libellés et deux fiches méthodologiques. Ils ne s'affichent jamais sous le même nom.

Tant que `inventaire_quotidien` n'est pas alimenté, seul le second est calculable. Le bloc affiche alors le libellé « Taux d'occupation sur capacité contractualisée » et non « Taux d'occupation ».

**Faible effectif.** En dessous de trente réservations sur la période, les courbes de la zone 2 s'affichent en indice base 100 plutôt qu'en valeurs absolues. Une courbe d'ADR sur douze réservations est illisible et trompeuse.

**Zone 4, contexte obligatoire.** `ACT_TAUX_CONVERSION` s'affiche systématiquement avec `OFF_TAUX_COUVERTURE` à côté. Un taux de conversion de 1,2 % lu seul se comprend comme une contre-performance commerciale. Lu à côté d'un taux de couverture de 6,7 %, il se comprend comme une conséquence mécanique de la couverture.

**Zone 5.** La majorité des cellules seront masquées. Le tableau reste affiché avec ses lignes, chaque cellule masquée portant le libellé court « Non publié ». Les volumes bruts, réservations et nuitées, restent visibles.

## K.8 États par zone

| Zone | État 3, vide | État 4, masqué |
|---|---|---|
| Z1 réservations, nuitées | Affiche zéro | Sans objet |
| Z1 occupation, ADR, RevPAR, ALOS, lead time, annulation | « Aucune réservation sur la période. » | Règle M1 |
| Z2 évolution | « Pas encore assez de réservations pour tracer une évolution. » | Règle M1 |
| Z3 répartitions | « Aucune réservation à répartir. » | Sans objet |
| Z4 conversion | « Aucune recherche sur la période. » | Moins de 100 recherches |
| Z5 tableau | « Ce territoire n'a pas de subdivision référencée. » | Cellules sous seuil |

**État au lancement.** Tant que le raccordement à la plateforme n'est pas fait, l'ensemble du module est en état vide. L'écran s'affiche entièrement, sans erreur, avec ses libellés d'état vide. Il ne comporte aucun message annonçant une fonctionnalité à venir.

## K.9 Ce que l'écran ne fait jamais

- Nommer un établissement, ni dans un tableau, ni dans une infobulle, ni dans un classement.
- Afficher un taux d'occupation, un ADR ou un RevPAR sous le seuil de la règle M1.
- Confondre les deux taux d'occupation sous un même libellé.
- Afficher `ACT_TAUX_CONVERSION` sans `OFF_TAUX_COUVERTURE` en regard.
- Afficher une donnée financière de Simandou Séjour. Le montant hébergement est un revenu d'établissement, pas un revenu d'entreprise.
- Afficher un message du type « module en cours de développement ».

## K.10 Critères d'acceptation

1. Sans aucune réservation en base, l'écran s'affiche entièrement en états vides, sans erreur ni message d'attente.
2. Les deux taux d'occupation portent des libellés distincts et ne sont jamais confondus.
3. Tant que `inventaire_quotidien` est vide, seul le taux sur capacité contractualisée s'affiche, sous son propre libellé.
4. Un territoire à deux établissements affiche le libellé de masquage exact sur les indicateurs de performance, et ses volumes bruts en clair.
5. Un territoire à trois établissements dont un pèse 80 % des unités reste masqué.
6. En dessous de trente réservations, les courbes s'affichent en indice base 100.
7. Le taux de conversion apparaît systématiquement avec le taux de couverture.
8. Aucun nom d'établissement n'apparaît sur l'écran.
9. Aucune donnée financière de Simandou Séjour n'est accessible.
10. Le tableau territorial reste affiché avec toutes ses lignes même si toutes ses cellules de performance sont masquées.

---

# Partie L. Fiche module `M5_CONFORMITE`

## L.1 Identité

| Attribut | Valeur |
|---|---|
| Code | `M5_CONFORMITE` |
| Libellé | Conformité et classification |
| Statut de donnée | Administratif |
| Profils | `TUTELLE` exclusivement |
| Sélecteur de période | Non |
| Disponibilité | Conditionnée à une transmission de l'administration |
| Priorité de développement | Après `M1_OFFRE` |

## L.2 Question métier

Quel est l'état d'enregistrement et de classification du parc d'hébergement guinéen.

## L.3 Nature particulière de ce module

**Le module vide est l'offre, pas le défaut.**

L'Observatoire ne détient aucune donnée de conformité et n'en détiendra jamais par ses propres moyens : l'enregistrement et la classification relèvent de l'autorité publique. Ce module est le conteneur qui accueillera ces données si la tutelle les transmet.

Le montrer vide à la Direction nationale du Tourisme et de l'Hôtellerie, c'est lui montrer un instrument déjà construit qui n'attend que sa matière. C'est une proposition, pas une lacune.

**Le Code du tourisme prévoit la classification des établissements hôteliers.** Une classification suppose un recensement, un référentiel, une fiche par établissement et un mécanisme de mise à jour. L'Observatoire dispose déjà des trois premiers. Ce module est la jonction.

## L.4 Indicateurs affichés

| Zone | Indicateurs |
|---|---|
| Blocs clés | `CONF_TAUX_ENREGISTREMENT`, `CONF_TAUX_CLASSIFICATION`, `CONF_ECART_ENREGISTREMENT`, `OFF_ETAB_RECENSES` |
| Carte | `CONF_TAUX_ENREGISTREMENT` par territoire |
| Croisements | Enregistrement et classification par typologie et par gamme |
| Prérequis techniques | `OFF_COMPLETUDE_FICHE`, `OFF_TAUX_VERIFICATION` |
| Écart terrain | `OFF_ECART_LISTE_ADMIN` |
| Tableau territorial | Indicateurs `CONF_` par territoire enfant |

## L.5 Composition de l'écran

```
+----------------------------------------------------------------------+
| [Niveau ▾]  [Typologie ▾] [Gamme ▾]                        [Export]  |
+----------------------------------------------------------------------+
| Z1  Blocs clés                                                       |
| [Établ. recensés] [Enregistrement] [Classification] [Écart]          |
+---------------------------------------+------------------------------+
| Z2  Carte du taux d'enregistrement    | Z3  Répartitions             |
|                                       | Par typologie, par gamme     |
+---------------------------------------+------------------------------+
| Z4  Préparation à la classification                                  |
| Complétude documentaire · Fiches vérifiées · Établissements prêts    |
+---------------------------------------+------------------------------+
| Z5  Écart entre liste administrative et terrain                      |
| Fermés définitivement · Inexistants · Reclassés                      |
+----------------------------------------------------------------------+
| Z6  Tableau territorial                                              |
| Territoire · Recensés · Enregistrés · Classés · Écart                |
+----------------------------------------------------------------------+
```

## L.6 Zones spécifiques

**Zone 4, préparation à la classification.** Zone la plus utile à la tutelle avant même toute transmission de données. Elle indique combien d'établissements disposent d'une fiche suffisamment complète pour entrer dans un processus de classification : coordonnées valides, localisation, capacité, typologie, tarifs.

Elle fonctionne dès le premier jour, sans aucune donnée administrative. C'est ce qui rend le module utile avant même la convention.

**Zone 5, écart terrain.** Alimentée par `retour_terrain`. Nombre d'établissements figurant sur une liste administrative et invalidés par la collecte : fermés définitivement, inexistants, ou relevant d'une autre typologie.

## L.7 Comportements attendus

**Vocabulaire.** `CONF_ECART_ENREGISTREMENT` s'affiche sous le libellé « Établissements dont l'enregistrement n'est pas documenté ». Jamais « établissements informels ». Les partenaires hôteliers doivent pouvoir lire l'Observatoire sans s'y sentir accusés, et la tutelle doit y voir un constat, pas une dénonciation.

**Statut de donnée.** Les zones 1, 2, 3 et 6 portent le statut administratif et affichent la source et la date de la transmission. Les zones 4 et 5 portent le statut `RECENSE`, elles proviennent du recensement de Simandou Séjour.

**Absence de transmission.** Tant qu'aucune donnée de conformité n'a été transmise, les zones 1, 2, 3 et 6 sont en état vide avec un libellé explicite, tandis que les zones 4 et 5 fonctionnent normalement.

## L.8 États par zone

| Zone | État 3, vide |
|---|---|
| Z1 enregistrement, classification, écart | « Aucune donnée de conformité transmise à ce jour. » |
| Z1 établissements recensés | Affiche la valeur du recensement |
| Z2 carte | Carte hachurée, légende « Aucune donnée de conformité » |
| Z3 répartitions | « Aucune donnée de conformité transmise à ce jour. » |
| Z4 préparation | « Aucun établissement recensé sur ce territoire. » |
| Z5 écart terrain | « Aucun écart constaté sur ce territoire. » |
| Z6 tableau | « Aucune donnée de conformité transmise à ce jour. » |

## L.9 Ce que l'écran ne fait jamais

- Nommer un établissement, y compris pour signaler une absence d'enregistrement. **Point critique :** une liste nominative d'établissements non enregistrés serait un signalement à l'administration. Ce n'est ni le rôle de l'Observatoire, ni compatible avec la confiance des partenaires hôteliers.
- Employer le mot « informel ».
- Attribuer un classement ou proposer un classement à un établissement. Classer relève de l'autorité publique.
- Afficher un message annonçant une fonctionnalité à venir.

## L.10 Critères d'acceptation

1. Sans aucune donnée de conformité transmise, les zones 4 et 5 fonctionnent et affichent des valeurs réelles.
2. Les zones 1, 2, 3 et 6 affichent le libellé d'absence de transmission, sans erreur.
3. Aucun nom d'établissement n'apparaît, y compris dans la zone d'écart d'enregistrement.
4. Le mot « informel » n'apparaît nulle part, dans aucune langue.
5. Le libellé de `CONF_ECART_ENREGISTREMENT` est exactement celui du document 10.
6. Le module est inaccessible à tout profil autre que `TUTELLE`, y compris par saisie directe d'adresse.
7. Les zones portant le statut administratif affichent la source et la date de transmission.
8. Aucun classement ni aucune proposition de classement n'est produit.
9. Aucun message du type « module en cours de développement » n'apparaît.
10. L'export PDF distingue visuellement les zones de statut administratif et les zones de statut recensé.

---

# Partie M. Fiche module `M8_RETOMBEES`

## M.1 Identité

| Attribut | Valeur |
|---|---|
| Code | `M8_RETOMBEES` |
| Libellé | Retombées économiques estimées |
| Statut de donnée | `OBSERVE` et `ESTIME` |
| Profils | `ATTRACTIVITE`, `INVESTISSEMENT`, `TUTELLE`, `BAILLEUR` |
| Sélecteur de période | Oui |
| Disponibilité | Après validation de la méthodologie |
| Priorité de développement | **En dernier** |

## M.2 Question métier

Quelles retombées économiques l'activité d'hébergement génère-t-elle.

## M.3 Avertissement de conception

**Ce module est le plus dangereux de l'Observatoire.**

Un chiffre de retombées économiques est ce qu'une institution reprendra le plus volontiers dans un communiqué. C'est aussi ce qu'un économiste contestera le plus facilement. Un chiffre repris officiellement puis démenti publiquement ferait plus de dégâts à Simandou Séjour que l'absence totale du module.

**Trois conditions impératives avant activation :**

1. Le coefficient multiplicateur est arrêté et sa source est nommée.
2. La méthodologie est rédigée et publiée dans `M10_METHODO`.
3. Le module est validé par la direction de l'entreprise, pas seulement livré.

**Tant que ces trois conditions ne sont pas réunies, le module reste désactivé pour tous les comptes** via `compte_module`. Il peut être construit, il n'est pas ouvert.

## M.4 Indicateurs affichés

| Zone | Indicateurs |
|---|---|
| Blocs clés | `RET_DEPENSE_HEBERGEMENT`, `RET_DEPENSE_TOTALE_ESTIMEE`, `ACT_NUITEES` |
| Évolution | `RET_DEPENSE_HEBERGEMENT` dans le temps |
| Répartitions | Dépense par typologie, par gamme, par origine déclarée |
| Méthode | Coefficient appliqué, source, date de validation |
| Tableau territorial | Dépense observée et estimée par territoire |

## M.5 Composition de l'écran

```
+----------------------------------------------------------------------+
| [Niveau ▾] [Période ▾] [Typologie ▾] [Gamme ▾]             [Export]  |
+----------------------------------------------------------------------+
| Z1  Bandeau de méthode, permanent et non masquable                   |
| Estimation. Coefficient {x} appliqué à la dépense d'hébergement      |
| observée. Source : {source}. Voir la méthodologie.                   |
+----------------------------------------------------------------------+
| Z2  Blocs clés                                                       |
| [Dépense hébergement observée] [Dépense totale estimée] [Nuitées]    |
+---------------------------------------+------------------------------+
| Z3  Évolution de la dépense observée  | Z4  Répartitions             |
|                                       | Typologie, gamme, origine    |
+---------------------------------------+------------------------------+
| Z5  Tableau territorial                                              |
| Territoire · Nuitées · Dépense observée · Dépense estimée            |
+----------------------------------------------------------------------+
```

## M.6 Le bandeau de méthode

**Zone 1, non masquable, non désactivable, présente en haut de l'écran et reprise sur tout export.**

Elle affiche le coefficient utilisé, sa source, la date de sa validation, et un lien vers sa fiche méthodologique.

C'est ce qui distingue une estimation assumée d'un chiffre lancé sans preuve. Un lecteur qui voit le coefficient et sa source peut discuter la méthode. Un lecteur qui ne voit qu'un total peut seulement contester le résultat.

## M.7 Comportements attendus

**Séparation stricte entre observé et estimé.** La dépense d'hébergement observée porte le statut `OBSERVE` et la couleur sémantique correspondante. La dépense totale estimée porte le statut `ESTIME` et sa couleur grise. **Elles ne figurent jamais dans le même graphique.**

**Le mot « estimation » figure dans le titre du module et dans le bandeau.** Il n'est jamais omis pour raccourcir un intitulé.

**Règle M1 applicable.** La dépense observée est une donnée de performance sur périmètre partenaire. Elle est masquée sous le seuil de confidentialité, comme l'ADR ou le RevPAR.

**Périmètre affiché en permanence.** La dépense observée ne couvre que les réservations passées par Simandou Séjour. Le bandeau de périmètre de l'application le rappelle déjà, mais ce module ajoute une mention explicite : l'estimation porte sur le périmètre observé, non sur l'ensemble du secteur.

## M.8 États par zone

| Zone | État 3, vide | État 4, masqué |
|---|---|---|
| Z1 bandeau | Toujours affiché | Sans objet |
| Z2 dépense observée | « Aucune réservation sur la période. » | Règle M1 |
| Z2 dépense estimée | « Estimation non produite en l'absence de dépense observée. » | Suit la zone observée |
| Z3 évolution | « Pas encore assez de données pour tracer une évolution. » | Règle M1 |
| Z4 répartitions | « Aucune dépense à répartir. » | Règle M1 |
| Z5 tableau | « Ce territoire n'a pas de subdivision référencée. » | Cellules sous seuil |

## M.9 Ce que l'écran ne fait jamais

- Afficher une estimation sans son coefficient et sa source visibles à l'écran.
- Mêler dépense observée et dépense estimée dans un même graphique.
- Omettre le mot « estimation » du titre du module.
- Présenter la dépense observée comme une mesure du secteur. Elle porte sur le seul périmètre partenaire.
- Afficher une donnée financière de Simandou Séjour. La dépense d'hébergement est un revenu d'établissement.
- Produire une estimation d'emplois. Cet indicateur est écarté au document 4 et le reste.
- S'ouvrir à un compte avant validation des trois conditions de la section M.3.

## M.10 Critères d'acceptation

1. Le module est désactivé pour tous les comptes tant que les trois conditions de M.3 ne sont pas réunies.
2. Le bandeau de méthode est présent, affiche le coefficient et sa source, et n'est pas masquable.
3. Le bandeau de méthode figure sur tout export.
4. Le mot « estimation » figure dans le titre du module et dans le bandeau.
5. Aucun graphique ne mêle la dépense observée et la dépense estimée.
6. La dépense observée est masquée sous le seuil de la règle M1.
7. Sans dépense observée, aucune estimation n'est produite.
8. Aucune donnée financière de Simandou Séjour n'est accessible.
9. Aucune estimation d'emplois n'est produite.
10. La mention de périmètre précise que l'estimation porte sur le périmètre observé et non sur l'ensemble du secteur.

---

## Points ouverts

1. Coefficient multiplicateur de `RET_DEPENSE_TOTALE_ESTIMEE` et sa source. **Bloquant pour l'activation de `M8`.**
2. Seuil d'effectif retenu pour le basculement des courbes de `M3` en indice base 100. Proposé à 30, à confirmer.
3. Faut-il afficher dans `M5` la liste des territoires sans aucune donnée de conformité transmise.
4. Format de transmission attendu de l'administration pour les données de conformité.

---

## Récapitulatif des onze fiches

| Module | Document | Disponibilité au lancement |
|---|---|---|
| `M1_OFFRE` | 9, partie B | Oui |
| `M2_DEMANDE` | 9, partie C | Oui, après journalisation |
| `M4_TENSION` | 9, partie D | Oui |
| `M9_SYNTHESE` | 9 bis, partie F | Partielle |
| `M10_METHODO` | 9 bis, partie G | Oui |
| `M11_ADMIN` | 9 bis, partie H | Oui, prérequis à tout le reste |
| `M6_MATURITE` | 9 ter, partie I | Oui, dérivé du recensement |
| `M7_EVENEMENTIEL` | 9 ter, partie J | Partielle |
| `M3_ACTIVITE` | 9 quater, partie K | Non, attend le raccordement |
| `M5_CONFORMITE` | 9 quater, partie L | Partielle, zones 4 et 5 seulement |
| `M8_RETOMBEES` | 9 quater, partie M | Non, désactivé |

---

*Document 9 quater. Lot 4 sur 4. Les onze modules sont spécifiés.*
