# Document 8. Système de design et charte visuelle

**Projet :** Observatoire National de l'Hospitalité Guinéenne
**Maître d'ouvrage :** SIMANDOU SEJOUR
**Version :** 1.0
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

Pour les cartes de densité, une échelle séquentielle en cinq paliers dérivée du bleu primaire, du plus clair au plus foncé.

Pour la carte de tension du module `M4`, une échelle en cinq paliers du neutre vers `--color-alert`.

Les territoires sans donnée sont hachurés, jamais colorés en clair. **Un territoire sans donnée ne doit jamais ressembler à un territoire à valeur faible.**

### 2.6 Accessibilité

Contraste minimum de 4,5 pour 1 sur tout texte. La couleur ne porte jamais seule une information : elle est toujours doublée d'un libellé, d'un motif ou d'une icône.

---

## 3. Typographie

**Famille unique : Montserrat.** Poids 400, 500, 600, 700. Aucune autre famille, aucune police décorative.

| Jeton | Taille | Poids | Usage |
|---|---|---|---|
| `--text-display` | 32 px | 700 | Valeur d'indicateur clé |
| `--text-h1` | 24 px | 700 | Titre d'écran |
| `--text-h2` | 18 px | 600 | Titre de bloc |
| `--text-h3` | 15 px | 600 | Sous-titre |
| `--text-body` | 14 px | 400 | Texte courant |
| `--text-small` | 13 px | 400 | Légendes, cellules de tableau dense |
| `--text-meta` | 11 px | 500 | Horodatages, statuts, mentions |
| `--text-label` | 11 px | 600 | Étiquettes, majuscules, interlettrage 0,08 em |

Interligne : 1,5 pour le texte courant, 1,25 pour les titres, 1,4 pour les tableaux.

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

```
+--------------------------------------------------------------+
| En-tête : titre outil · logo institution · compte · langue    |
+--------------------------------------------------------------+
| Bandeau de périmètre (non masquable)                          |
+------------+-------------------------------------------------+
|            | Barre de contrôle : niveau géo · période · export|
| Navigation +-------------------------------------------------+
| latérale   |                                                  |
| permanente | Zone de contenu                                  |
|            |                                                  |
+------------+-------------------------------------------------+
```

- Navigation latérale **permanente**, jamais repliée. 240 px de large. Le module actif est toujours visible.
- Bandeau de périmètre fixe, présent sur tous les écrans, repris sur tous les exports.
- Barre de contrôle collante en haut de la zone de contenu.
- Rayon de bordure : 4 px partout. Aucun angle très arrondi.
- Ombres portées : aucune. La hiérarchie passe par la bordure et le fond.

---

## 5. Composants

### 5.1 Bloc d'indicateur clé

Contient : étiquette, valeur, unité, badge de statut de donnée, badge de fiabilité, horodatage de fraîcheur.

Huit blocs tiennent sur une ligne en 1440 px. C'est la densité visée, elle est permise par l'abandon du mobile.

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
| Indicateur simple | Valeur unique en évidence | |

### Règles communes

- **Un graphique, une idée.**
- **Aucun double axe.** Illisible en projection.
- **Aucun camembert ni anneau.** Ils sont impossibles à comparer d'un écran à l'autre et donnent une fausse impression de précision sur faible effectif.
- **Aucune 3D, aucune animation d'entrée.**
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
- Utiliser un camembert, un anneau, un double axe ou une visualisation en trois dimensions.
- Colorer en clair un territoire sans donnée.
- Écrire une chaîne de caractères en dur.
- Écrire le nom d'une institution dans le code.

---

## 12. Points ouverts

1. Icônographie retenue, jeu unique à choisir.
2. Valeurs exactes des cinq paliers des échelles cartographiques.
3. Comportement du fil d'Ariane à Conakry, qui n'a pas de niveau préfectoral.
4. Traitement visuel du basculement entre versions du découpage territorial.

---

*Document 8 sur 12. Document précédent : règles de confidentialité et de gouvernance. Document suivant : spécifications fonctionnelles par module.*
