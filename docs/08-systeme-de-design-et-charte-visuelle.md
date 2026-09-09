# Document 8. Système de design et charte visuelle

**Projet :** Observatoire National de l'Hospitalité Guinéenne
**Maître d'ouvrage :** SIMANDOU SEJOUR
**Version :** 1.1, révisée le 8 septembre 2026
**Statut :** Prescriptif. Aucune valeur visuelle hors de ce document.
**Prérequis :** documents 1, 4, 6 et 7.

> **Principe directeur.** Un tableau de bord institutionnel qui ressemble à une application grand public perd en autorité. La densité, la sobriété et la lisibilité en projection priment sur l'effet visuel.
>
> **Règle absolue.** Aucune couleur, aucune taille, aucun espacement ne doit être écrit en dur dans un composant. Tout passe par les jetons de design définis ci-dessous.

---

## 1. Contexte d'usage

L'outil est consulté par des cadres institutionnels, sur ordinateur ou tablette, souvent projeté en salle de réunion.

| Paramètre | Décision |
|---|---|
| Plateformes | Web uniquement |
| Appareils | Ordinateur et tablette |
| Mobile | **Hors périmètre.** Aucun travail d'adaptation mobile |
| Largeurs cibles | 1920, 1440, 1280 en ordinateur ; 1366 et 1024 en tablette paysage |
| Tablette portrait | 768, en dégradé acceptable |
| Connexion | Faible débit à prévoir. Chargement progressif obligatoire |
| Projection | Cible de validation obligatoire avant toute présentation |

**Test de recette non négociable :** validation en projection sur vidéoprojecteur de salle de réunion, lisibilité vérifiée à trois mètres. C'est l'échec le plus banal de ce type d'outil et le plus facile à éviter.

---

## 2. Couleurs

### 2.1 Palette de marque

| Jeton | Valeur | Rôle |
|---|---|---|
| `--color-primary` | `#0B3B66` | Bleu structurant. Titres, navigation, en-têtes de tableaux, éléments de structure |
| `--color-success` | `#228C22` | Vert. États positifs, données recensées, filets d'accent |
| `--color-alert` | `#F34300` | Orange. **Signaux de tension et de déficit exclusivement** |

### 2.2 La règle de l'orange

`--color-alert` est réservé aux signaux de tension, de saturation et de déficit d'offre. Il n'apparaît nulle part ailleurs.

**Interdit :** boutons, liens, en-têtes, icônes décoratives, états de survol, éléments de navigation, badges neutres.

**Pourquoi :** sa rareté est ce qui le rend lisible sur la carte du module Tension. Un développeur qui l'utilise pour un bouton détruit le seul dispositif visuel qui porte l'information la plus importante de l'outil.

### 2.3 Neutres

| Jeton | Valeur | Rôle |
|---|---|---|
| `--color-text` | `#000000` | Texte courant |
| `--color-text-secondary` | `#3C4C5C` | Texte secondaire, légendes |
| `--color-text-muted` | `#5A6B7B` | Métadonnées, horodatages |
| `--color-bg` | `#FFFFFF` | Fond principal |
| `--color-bg-subtle` | `#F7F9FB` | Fond de bloc, lignes alternées |
| `--color-bg-panel` | `#F2F5F8` | Panneaux de filtres, en-têtes de formulaire |
| `--color-border` | `#D6DEE6` | Séparateurs |
| `--color-border-strong` | `#B9C6D2` | Bordures de tableau et de bloc |
| `--color-border-faint` | `#E6ECF2` | Filets internes d'un bloc, séparateurs de ligne |

### 2.3 bis Déclinaisons du bleu structurant

Ajoutées le 8 septembre 2026. Dérivées du primaire par mélange avec le blanc ou le noir, aucune teinte nouvelle.

| Jeton | Valeur | Rôle |
|---|---|---|
| `--color-primary-900` | `#072A4A` | Fond de la navigation latérale |
| `--color-primary-800` | `#09335A` | Survol dans la navigation |
| `--color-primary-700` | `#0B3B66` | Identique à `--color-primary` |
| `--color-primary-600` | `#14507F` | Réservé |
| `--color-primary-500` | `#2C6291` | Micro-barres de tableau, code de module |
| `--color-primary-200` | `#B8CBDC` | Numéros de section |
| `--color-primary-100` | `#DFE8F0` | Piste des jauges radiales |
| `--color-primary-050` | `#F2F6FA` | Réservé |
| `--color-on-primary` | `#FFFFFF` | Texte sur aplat bleu |
| `--color-on-primary-muted` | `#9DB8D1` | Texte secondaire sur aplat bleu |
| `--color-on-primary-faint` | `#5B7D9C` | Étiquettes et mentions sur aplat bleu |

**Pourquoi une navigation sur aplat sombre.** Onze entrées de menu doivent se distinguer entre elles et de la zone de contenu. Le point 12.1 interdisant toute icône, il ne reste que le contraste de surface. L'aplat sombre laisse par ailleurs 100 % de la zone de contenu en blanc, ce qui est la condition de la lisibilité en projection.

### 2.4 Couleurs sémantiques de données

Chaque statut de donnée et chaque niveau de fiabilité porte une couleur dédiée. Elles ne servent à rien d'autre.

| Jeton | Valeur | Application |
|---|---|---|
| `--data-recense` | `#228C22` | Statut `RECENSE` |
| `--data-observe` | `#0B3B66` | Statut `OBSERVE` |
| `--data-exprime` | `#6B4E9E` | Statut `EXPRIME` |
| `--data-declare` | `#B8860B` | Statut `DECLARE` |
| `--data-estime` | `#8A9BA8` | Statut `ESTIME` |

| Jeton | Valeur | Application |
|---|---|---|
| `--fiab-consolide` | `#228C22` | Niveau `CONSOLIDE` |
| `--fiab-indicatif` | `#B8860B` | Niveau `INDICATIF` |
| `--fiab-signal` | `#8A9BA8` | Niveau `SIGNAL` |

**Le gris de `ESTIME` et de `SIGNAL` est volontaire.** Une valeur moins solide doit être visuellement moins affirmée qu'une valeur consolidée.

### 2.5 Échelle cartographique

Pour les cartes de densité, une échelle séquentielle en cinq paliers dérivée du bleu primaire, du plus clair au plus foncé. **Valeurs arrêtées le 8 septembre 2026**, résolution du point ouvert 12.2 :

| Jeton | Valeur | Palier |
|---|---|---|
| `--seq-1` | `#CFDAE4` | 1, le plus clair |
| `--seq-2` | `#A2B9CC` | 2 |
| `--seq-3` | `#7599B5` | 3 |
| `--seq-4` | `#4E7A9E` | intermédiaire, réservé aux répartitions |
| `--seq-5` | `#2C5A82` | 4 |
| `--seq-6` | `#0B3B66` | 5, le plus foncé, égal au primaire |

L'échelle de densité utilise `--seq-1`, `--seq-2`, `--seq-3`, `--seq-5`, `--seq-6` : sauter un palier au milieu écarte visuellement les classes hautes des classes basses, ce qui est ce qu'on demande à une carte de densité.

**Les seuils entre paliers sont pris sur les quantiles des valeurs non nulles**, jamais à intervalles égaux. Sur une distribution où Conakry pèse dix fois la région suivante, une échelle à intervalles égaux écrase neuf régions dans la première classe et ne montre plus rien.

Le texte posé sur un aplat passe en blanc à partir du palier 4.

Trame des territoires sans donnée : hachures à 45 degrés, trait `#B9C6D2` sur fond `#F7F9FB`, jeton `--hachure-trait` et `--hachure-fond`.

Pour la carte de tension du module `M4`, une échelle en cinq paliers du neutre vers `--color-alert`.

Les territoires sans donnée sont hachurés, jamais colorés en clair. **Un territoire sans donnée ne doit jamais ressembler à un territoire à valeur faible.**

### 2.6 Accessibilité

Contraste minimum de 4,5 pour 1 sur tout texte. La couleur ne porte jamais seule une information : elle est toujours doublée d'un libellé, d'un motif ou d'une icône.

---

## 3. Typographie

**Deux familles, rôles séparés.** `--font-titre` (Montserrat) pour les titres, les valeurs d'indicateur et les éléments de structure, `--font-texte` (Inter) pour le texte courant et les données. Aucune autre famille, aucune police décorative.

**Révision du 8 septembre 2026 : Inter remplace Arial sur `--font-texte`.** Arial reste en repli dans la pile. Deux raisons, aucune n'est esthétique :

1. Arial n'a pas de chiffres tabulaires. La section « Chiffres » ci-dessous exige des colonnes alignées ; avec Arial, `font-variant-numeric: tabular-nums` n'a aucun effet et les colonnes de tableau ne s'alignent pas. C'est précisément le défaut que cette section cherchait à éviter.
2. Arial perd en lisibilité aux petites tailles en projection, là où l'outil est validé.

Les deux familles sont auto-hébergées par `next/font`, donc téléchargées au build et servies depuis notre domaine, conformément à la section 9.

| Jeton | Taille | Poids | Famille | Usage |
|---|---|---|---|---|
| `--text-display-xl` | 44 px | 700 | `--font-titre` | Valeur d'indicateur de tête, trois par écran au plus |
| `--text-display` | 32 px | 700 | `--font-titre` | Valeur d'indicateur clé |
| `--text-h1` | 24 px | 700 | `--font-titre` | Titre d'écran |
| `--text-h2` | 18 px | 600 | `--font-titre` | Titre de bloc |
| `--text-h3` | 15 px | 600 | `--font-titre` | Sous-titre |
| `--text-body` | 14 px | 400 | `--font-texte` | Texte courant |
| `--text-small` | 13 px | 400 | `--font-texte` | Légendes, cellules de tableau dense |
| `--text-meta` | 11 px | 500 | `--font-texte` | Horodatages, statuts, mentions |
| `--text-label` | 11 px | 600 | `--font-texte` | Étiquettes, majuscules, interlettrage 0,08 em |

Interligne : 1,5 pour le texte courant, 1,25 pour les titres, 1,4 pour les tableaux.

### Interlettrage

Ajouté le 8 septembre 2026. Sans lui, un nombre de 44 px paraît délavé et une petite capitale de 11 px illisible.

| Jeton | Valeur | Usage |
|---|---|---|
| `--tracking-display` | -0,022 em | Valeurs d'indicateur et grands nombres |
| `--tracking-titre` | -0,01 em | Titres |
| `--tracking-label` | 0,09 em | Étiquettes en petites capitales |

### Chiffres

Chiffres tabulaires activés partout où des nombres sont alignés en colonne. Sans cela, les colonnes de tableau ne s'alignent pas et l'outil paraît approximatif.

Séparateur de milliers : espace insécable. Séparateur décimal : virgule.

---

## 4. Espacement et grille

Échelle de base 4 px.

| Jeton | Valeur |
|---|---|
| `--space-1` | 4 px |
| `--space-2` | 8 px |
| `--space-3` | 12 px |
| `--space-4` | 16 px |
| `--space-6` | 24 px |
| `--space-8` | 32 px |
| `--space-12` | 48 px |

### Structure d'écran

Structure révisée le 8 septembre 2026.

```
+--------------------------------------------------------------+
| Logo éditeur | Titre de l'outil        institution · compte   |
+------------+-------------------------------------------------+
|            | Bandeau de périmètre (non masquable, collant)   |
| Navigation +-------------------------------------------------+
| latérale   | Barre de contrôle : niveau géo · filtres · export|
| permanente +-------------------------------------------------+
| bleu foncé | Cartouche de module : code · titre · question    |
|            +-------------------------------------------------+
| 240 px     | 01 —— SECTION ————————————————————————————————— |
|            | Zone de contenu                                  |
| attribution|                                                  |
+------------+-------------------------------------------------+
```

- **Le logo de l'éditeur occupe le coin supérieur gauche**, suivi d'un filet vertical puis du titre du produit. C'est la marque de l'éditeur, pas celle d'une institution partenaire : elle fait partie du produit, comme la mention d'attribution de la section 10, et son libellé vient du catalogue.
- Navigation latérale **permanente**. 240 px de large dépliée, 60 px repliée, aplat `--color-primary-900`. Le module actif porte un filet vert de 3 px et un fond plus clair : deux signaux, jamais la couleur seule.
- **Le rail est repliable depuis le 8 septembre 2026**, par un bouton posé à côté du titre « Modules ». « Permanente » veut dire jamais escamotée toute seule : le rail ne disparaît jamais, il se resserre, et le module courant reste visible dans les deux états. Le choix est conservé par navigateur et partagé entre les onglets ouverts.
- **Repliée, chaque entrée cède son libellé à une icône.** C'est la seule exception au point 12.1, et elle est bornée : voir section 5.9.
- La déconnexion est en pied de navigation, avec la mention d'attribution. Elle appartient à la colonne de session, pas à la barre de titre du produit.
- La mention d'attribution disparaît quand le rail est replié, faute de largeur pour l'écrire. Elle revient avec le rail, et l'export la porte de toute façon en pied de page.
- **Le bandeau de périmètre est passé sous la navigation, dans la colonne de contenu.** Il décrit le périmètre des données affichées, pas l'outil. Il reste collant au défilement et se présente en couples étiquette/valeur, la seule forme lisible à trois mètres.
- Barre de contrôle collante, retirée des exports.
- **Cartouche de module** : code du module, titre, et la question métier à laquelle l'écran répond. Un cadre qui découvre l'outil en réunion sait en deux secondes ce qu'il regarde.
- **Titre de section** : numéro d'ordre en `--color-primary-200`, intitulé en petites capitales, filet horizontal jusqu'au bord droit. C'est le vocabulaire d'une publication institutionnelle, et c'est ce qui remplace les icônes de section.
- Largeur maximale de la zone de contenu : 1680 px, centrée. Au-delà, une rangée de blocs clés s'étire jusqu'à l'illisibilité.
- Rayon de bordure : 4 px partout. Aucun angle très arrondi.
- Ombres portées : aucune. La hiérarchie passe par la bordure, le fond, et le filet d'accent supérieur de 3 px des blocs de premier rang.

---

## 5. Composants

### 5.1 Bloc d'indicateur clé

Contient : étiquette, valeur, unité, badge de statut de donnée, badge de fiabilité, horodatage de fraîcheur, lien vers la méthodologie.

Trois variantes, une seule logique de donnée. **Révision du 8 septembre 2026.**

| Variante | Forme de la valeur | Usage |
|---|---|---|
| `compact` | 32 px | Forme par défaut. Huit blocs tiennent sur une ligne en 1440 px |
| `volume` | 44 px, filet d'accent supérieur | Les trois ou quatre chiffres de tête d'un écran |
| `jauge` | Jauge radiale de 116 px | Un taux, lu sur une échelle fixe de zéro à cent |

**Pourquoi ne plus aligner huit blocs identiques.** Un volume et un taux ne se lisent pas de la même façon : l'un se compare à lui-même dans le temps, l'autre se compare à cent. Les poser côte à côte dans huit rectangles identiques oblige l'œil à refaire le tri à chaque consultation. Les huit indicateurs restent présents et aucun ne disparaît lors d'un changement de filtre : ils sont répartis en deux lignes de lecture, volumes puis ratios.

**Une jauge sans donnée conserve son anneau et ses dimensions**, centre portant la mention d'absence. Cinq fois la même phrase côte à côte ne compose pas un écran ; cinq anneaux éteints, si.

### 5.2 Badge de statut de donnée

Petit, en `--text-label`, couleur sémantique de la section 2.4, présent sur chaque bloc et chaque graphique.

### 5.3 Badge de fiabilité

Même traitement. Trois valeurs seulement.

### 5.4 Bandeau de périmètre

Fond `--color-bg-panel`, texte `--text-small`. **Non masquable, non désactivable, non paramétrable.**

Contenu : établissements recensés, partenaires, part de capacité couverte, date d'observation.

### 5.5 Sélecteur de niveau géographique

**Mécanisme unique de navigation territoriale.** National, puis région, puis préfecture, puis commune, avec fil d'Ariane cliquable.

Ne jamais multiplier les filtres géographiques. Ils produisent des états incohérents et des captures d'écran contradictoires.

### 5.6 Tableau

Douze à quinze colonnes sans défilement horizontal en 1440 px. En-tête `--color-primary`, texte blanc. Lignes alternées en `--color-bg-subtle`. Tri par colonne. Aucune pagination en dessous de 50 lignes.

### 5.7 Carte

Deux tiers de la largeur, panneau de filtres fixe à côté. Clic sur un territoire pour descendre d'un niveau. Légende toujours visible. Territoires sans donnée hachurés.

**Repli obligatoire :** quand le contour d'un territoire est absent, afficher un point au centroïde. L'application doit rester fonctionnelle sans aucun contour, situation qui sera celle du lancement.

**Repli de lancement, arrêté le 8 septembre 2026 : la grille de tuiles.** Aucun contour du découpage refondu le 20 août 2026 n'existe dans un fichier réutilisable, et aucun centroïde n'est chargé. Tant que c'est le cas, la carte de densité est remplacée par une grille de tuiles : un territoire, une tuile, un aplat de l'échelle de densité, l'effectif écrit en clair sur la tuile.

Les deux règles cartographiques tiennent telles quelles : un territoire sans donnée est hachuré et jamais coloré en clair, et la légende reste visible en permanence. La grille n'est pas géographique, et le panneau le dit explicitement (`carte.sans_contour`).

**Toutes les subdivisions du référentiel figurent dans la grille et dans le tableau, y compris à zéro.** Une vue matérialisée agrège des établissements et ne produit donc aucune ligne pour un territoire vide ; la liste complète vient du référentiel. C'est ce qui tient le critère d'acceptation B.10.1 du document 9, et au lancement l'absence est souvent l'information la plus utile de l'écran.

### 5.9 Icônes, exception unique

**Aucune icône dans l'interface, sauf dans le rail de navigation replié.** Le point 12.1 est maintenu partout ailleurs, sans exception : ni dans les titres, ni dans les blocs, ni dans les tableaux, ni dans les graphiques, ni dans les messages d'état.

Ce qui rend l'exception acceptable :

- **Nécessité.** À 60 px de large, le libellé ne peut plus s'écrire. L'icône n'est pas un ornement posé à côté d'un mot, elle est le dernier porteur d'information disponible.
- **Doublage systématique.** Chaque entrée conserve son `title` et son `aria-label` avec le libellé exact du catalogue. La forme ne porte jamais l'information seule.
- **Réversibilité.** L'icône disparaît dès que le rail est déplié. Un utilisateur qui ne veut pas d'icônes travaille rail déplié et n'en voit aucune.
- **Tracé maison.** Aucune bibliothèque d'icônes. Une dépendance défaillante produirait une colonne de carrés vides le jour de la démonstration (section 9). Grille commune 20 × 20, trait de 1,5, jamais d'aplat.

Une icône ne peut jamais être ajoutée ailleurs sans réviser cette section.

### 5.8 Bouton d'export

Un seul par écran, dans la barre de contrôle. Formats PDF et image uniquement.

---

## 6. Bibliothèque de visualisations

Sans cette section, chaque écran adoptera son propre rendu graphique.

| Type | Usage | Interdit |
|---|---|---|
| Barres verticales | Comparaison entre catégories, 12 valeurs maximum | Au delà de 12 catégories |
| Barres horizontales | Classement de territoires | |
| Courbe | Évolution temporelle, 4 séries maximum | Au delà de 4 séries |
| Aires empilées | Répartition d'un total dans le temps | Sur données de faible effectif |
| Carte de densité | Répartition géographique | |
| Barres empilées | Répartition des états d'échec de recherche | |
| Barre de répartition à 100 % | Répartition d'une variable **ordonnée**, 6 paliers maximum | Sur une variable nominale |
| Indicateur simple | Valeur unique en évidence | |
| Jauge radiale | Un **taux**, sur une échelle fixe de 0 à 100 | Sur une grandeur non bornée |
| Anneau de répartition | Répartition d'une variable **nominale**, 6 catégories maximum | Sans total au centre ni légende chiffrée |
| Compteur segmenté | Mesure de qualité bornée, lue comme une réglette | Sur une grandeur non bornée |
| Grille de tuiles territoriales | Densité par territoire, en l'absence de contours | Comme substitut permanent à une carte |
| Treemap | Catégories **nombreuses, sans ordre et très inégales**, 24 pavés maximum | En dessous de 8 catégories, où des barres suffisent |
| Sparkline | Micro-tendance posée à côté d'un chiffre, sans axe ni légende | Comme seule représentation d'une série |
| Petits multiples | Plusieurs grandeurs **d'unités différentes** suivies dans le temps | Quand une seule échelle suffirait |
| Bullet graph | Une mesure et **son repère de comparaison** sur la même règle | Sans repère : ce serait une barre |

### Règles communes

- **Un graphique, une idée.**
- **Aucun double axe.** Illisible en projection. **Quand plusieurs grandeurs d'unités différentes doivent être suivies ensemble, on les pose en petits multiples**, côte à côte, chacune avec sa propre échelle et son unité écrite. L'œil compare les formes, ce qui est la lecture recherchée, et aucune échelle n'est falsifiée pour tenir dans le cadre de l'autre. C'est la réponse du système au besoin qui pousse ailleurs vers le double axe.
- **Une absence de valeur coupe la courbe.** On ne relie jamais deux points de part et d'autre d'un trou : ce serait inventer la donnée manquante.
- **Aucun camembert.** Un disque plein découpé en parts est impossible à comparer d'un écran à l'autre et donne une fausse impression de précision sur faible effectif. L'interdiction est maintenue sans exception.

- **L'anneau et la jauge radiale sont autorisés depuis le 8 septembre 2026, sous conditions strictes.** La réserve qui les frappait visait la lecture d'un angle, pas la forme circulaire. Elle est levée dès lors que la lecture ne repose plus sur l'angle :

  | Forme | Conditions cumulatives |
  |---|---|
  | Jauge radiale | Une seule grandeur. Échelle fixe de 0 à 100. Valeur écrite au centre. Jamais deux jauges superposées |
  | Anneau de répartition | Effectif total écrit au centre. Légende portant l'effectif **et** la part de chaque secteur. 6 catégories au plus. Secteurs ordonnés du plus grand au plus petit. Rampe séquentielle, du plus foncé au plus clair |

  **Ce qui rend ces formes lisibles, c'est la légende chiffrée, pas le cercle.** Un anneau sans total central ni légende chiffrée reste un camembert et reste interdit.

- **La couleur ne remplace jamais un chiffre.** Toute tuile, tout secteur, tout segment porte sa valeur en clair ou dans sa légende.
- **Une sparkline ne remplace jamais la courbe complète.** Elle dit le sens, pas la valeur. Elle n'apparaît qu'à côté d'un chiffre qui, lui, est exact.
- **Aucune bibliothèque de graphiques.** Toutes les formes sont tracées en SVG dans `/components/charts`. Une dépendance externe défaillante produit un écran blanc de trente secondes le jour de la démonstration (section 9), et un rendu SVG maison sort vectoriel à l'export sans travail supplémentaire (section 10).
- **Aucune 3D, aucune animation d'entrée.** Un graphique ne se construit jamais sous les yeux d'une salle. En revanche, une transition **déclenchée par un geste de l'utilisateur** (repli du rail, survol d'un panneau, sélection dans une liste) est un accusé de réception et non un effet : autorisée, courte, `--transition-douce`, et neutralisée sous `prefers-reduced-motion`.
- Axe des ordonnées démarrant à zéro pour toute barre.
- Étiquettes de données affichées quand l'effectif est inférieur à 15 points.
- Une infobulle rappelle systématiquement l'effectif de l'échantillon.
- Un graphique ne mélange jamais deux statuts de donnée.

---

## 7. Les cinq états de chaque zone

**Section la plus importante du document.**

Avec la volumétrie du lancement, les états dégradés ne sont pas des cas limites, ce sont les états normaux. Ce sont les premiers qu'une institution verra.

Toute zone affichant une donnée implémente les cinq états suivants, sans exception.

### État 1, chargement
Squelette de la structure attendue, aux dimensions du contenu final. Jamais de tourniquet centré, jamais de saut de mise en page à l'arrivée des données.

### État 2, données présentes
État nominal.

### État 3, données vides
La requête a abouti, il n'y a rien à montrer.

Libellé type : « Aucun établissement recensé sur ce territoire. »

**Jamais zéro, jamais un tiret, jamais une zone blanche.** Une phrase qui dit ce que l'absence signifie.

### État 4, données masquées
Le seuil de confidentialité s'applique.

Libellé exact et invariable :

> Non publié : effectif insuffisant pour préserver la confidentialité des établissements.

Traitement visuel : fond `--color-bg-subtle`, texte `--color-text-secondary`, icône neutre. **Jamais un traitement d'erreur.** Ce n'est pas une panne, c'est une règle déontologique appliquée.

### État 5, erreur
Message court, action de reprise, aucune information technique exposée.

---

## 8. Bilingue

Français et anglais, bascule par compte.

- Aucune chaîne de caractères écrite en dur dans un composant. Tout passe par les clés de la charte des libellés, document 10.
- Les libellés d'énumération viennent de la base, colonnes `libelle_fr` et `libelle_en`.
- Prévoir 30 % d'allongement en anglais sur les étiquettes courtes.
- Formats de date, de nombre et de devise localisés.
- La terminologie hôtelière normalisée n'est pas traduite : ADR, RevPAR, ALOS restent tels quels dans les deux langues.

L'export anglais sera utilisé pour démarcher des partenaires internationaux, donc diffusé, donc attribué à la marque.

---

## 9. Performance

| Contrainte | Cible |
|---|---|
| Affichage de l'écran de synthèse | Moins de 2 secondes sur 3 Mb/s, avec 500 établissements en base |
| Chargement | Progressif. Les blocs apparaissent au fur et à mesure |
| Fonds de carte | Servis depuis l'infrastructure de l'entreprise ou un fournisseur léger |
| Dépendances externes lourdes | Aucune |
| Polices | Auto-hébergées, jamais appelées depuis un service tiers |

**Pourquoi les fonds de carte comptent.** Une dépendance externe défaillante produit un écran blanc de trente secondes le jour de la démonstration.

---

## 10. Impression et export

Le PDF n'est pas une capture d'écran. C'est un rendu dédié.

- Format A4 paysage.
- Navigation et contrôles retirés.
- Bandeau de périmètre conservé.
- Filigrane au nom du compte émetteur.
- Référence unique d'export en pied de page.
- Mention d'attribution et logo de l'institution.
- Graphiques rendus en vectoriel.

---

## 11. Ce qui est interdit

- Écrire une couleur, une taille ou un espacement en dur dans un composant.
- Utiliser `--color-alert` ailleurs que sur un signal de tension ou de déficit.
- Afficher un graphique sans son statut de donnée et son niveau de fiabilité.
- Masquer ou rendre paramétrable le bandeau de périmètre.
- Masquer ou rendre paramétrable la mention d'attribution.
- Livrer un composant sans ses cinq états.
- Utiliser un camembert, un double axe ou une visualisation en trois dimensions.
- Utiliser un anneau sans total central et sans légende chiffrée, ou une jauge radiale sur une grandeur non bornée.
- Placer une icône ailleurs que dans le rail de navigation replié (section 5.9).
- Animer l'entrée d'un graphique ou d'un bloc. Seules les transitions déclenchées par un geste sont admises.
- Colorer une tuile territoriale sans y écrire l'effectif.
- Colorer en clair un territoire sans donnée.
- Écrire une chaîne de caractères en dur.
- Écrire le nom d'une institution dans le code.

---

## 12. Points ouverts

1. ~~Icônographie retenue, jeu unique à choisir.~~ **Résolu le 2026-09-08 : aucune icône nulle part dans l'outil**, y compris la navigation latérale. Direction retenue « Rapport d'État » : hiérarchie visuelle portée par la typographie (contraste Montserrat/Inter, échelle de 11 à 44 px, interlettrage), par le filet, par le contraste de surface et par la visualisation de données. Jamais par un pictogramme, une couleur décorative ou une ombre portée. C'est la direction la plus proche d'une publication institutionnelle de référence (type Banque mondiale, données FMI).
2. ~~Valeurs exactes des cinq paliers des échelles cartographiques.~~ **Résolu le 2026-09-08 :** voir section 2.5. Paliers `--seq-1` à `--seq-6`, seuils pris sur les quantiles des valeurs non nulles, trame de hachures pour l'absence de donnée. Reste à arrêter l'échelle du neutre vers `--color-alert` du module `M4`, qui n'a pas encore de données.
3. Comportement du fil d'Ariane à Conakry, qui n'a pas de niveau préfectoral.
4. Traitement visuel du basculement entre versions du découpage territorial.

---

*Document 8 sur 12. Document précédent : règles de confidentialité et de gouvernance. Document suivant : spécifications fonctionnelles par module.*
