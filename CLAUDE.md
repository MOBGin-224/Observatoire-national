# CLAUDE.md

Fichier d'instructions permanent. **À relire au début de chaque session.**

---

## Le projet en dix lignes

SIMANDOU SEJOUR est une entreprise guinéenne qui opère **simandousejour.com**, plateforme de réservation d'hébergement en Guinée. Cette plateforme existe, elle est en production, **elle n'est pas à développer**.

Nous construisons un produit distinct : l'**Observatoire National de l'Hospitalité Guinéenne**. Application web en accès réservé, destinée aux institutions publiques et aux bailleurs, qui restitue une lecture chiffrée du secteur de l'hébergement : ce qui existe, ce qui est demandé, et l'écart entre les deux.

L'entreprise se positionne comme l'infrastructure numérique de l'hospitalité guinéenne, avec une ambition panafricaine. La Guinée est le marché de démonstration, pas la limite.

**État actuel : rien n'est développé.** Ni base, ni écran, ni code.

---

## Les trois questions auxquelles l'outil répond

Toute fonctionnalité doit servir l'une de ces trois questions. Sinon elle est hors périmètre.

1. **Quelle est l'offre d'hébergement en Guinée ?**
2. **Quelle est la demande ?** Exprimée par les visiteurs de la plateforme, et déclarée par les institutions.
3. **Où se situe l'écart entre les deux ?**

---

## Les douze documents

| N° | Document | Rôle |
|---|---|---|
| 1 | Note de cadrage produit | Ce qu'est le projet, et ce qu'il n'est pas |
| 2 | Taxonomies et référentiels | Toutes les listes de valeurs autorisées |
| 3 | Modèle de données | Schéma prescriptif |
| 4 | Dictionnaire des indicateurs | Formules, seuils, règles de masquage |
| 5 | Plan de captation des données | Ce qui est capté, quand, par quel canal |
| 6 | Matrice profils, modules, permissions | Qui voit quoi |
| 7 | Règles de confidentialité et gouvernance | **Prime sur tout le reste** |
| 8 | Système de design et charte visuelle | Jetons, composants, cinq états |
| 9 | Spécifications fonctionnelles par module | Cadre commun, `M1`, `M2`, `M4` |
| 9 bis | Spécifications, lot 2 | `M9`, `M10`, `M11` |
| 9 ter | Spécifications, lot 3 | `M6`, `M7` |
| 9 quater | Spécifications, lot 4 | `M3`, `M5`, `M8` |
| 10 | Charte des libellés bilingue | Tous les textes de l'interface |
| 11 | Architecture technique et conventions | Pile, structure, nommage |
| 12 | Plan de recette | Critères d'acceptation |

Tous dans `/docs`. **Les onze modules sont spécifiés.** La partie A du document 9 s'applique aux onze fiches.

---

## Les six règles qui ne se discutent pas

### 1. Trois interdictions structurelles

L'Observatoire n'expose **jamais** :

- de donnée financière de Simandou Séjour (commission, marge, revenu net) ;
- de donnée nominative par établissement (occupation, prix, revenu) ;
- de donnée personnelle de voyageur.

Ces interdictions se garantissent par l'architecture. Le modèle de données ne prévoit aucun champ pour les accueillir.

### 2. La donnée est servie, jamais cédée

Exports en PDF et image uniquement. **Aucun CSV, aucun JSON, aucune API ouverte**, quel que soit le profil.

### 3. Un petit chiffre vrai vaut mieux qu'un grand chiffre approximatif

Les volumes bruts s'affichent toujours, y compris à zéro.

**Aucune donnée n'est jamais inventée, simulée ou générée pour illustration**, y compris pendant le développement. Un jeu de test synthétique explicitement identifié est la seule exception.

### 4. L'état dégradé est l'état normal

Au lancement, la majorité des cellules seront vides ou masquées. Ces états se conçoivent avec autant de soin que les états nominaux.

Un composant sans ses cinq états n'est pas terminé.

### 5. Toute donnée porte son statut, sa fiabilité et son périmètre

Statut de donnée : `RECENSE`, `OBSERVE`, `EXPRIME`, `DECLARE`, `ESTIME`.
Fiabilité : `CONSOLIDE`, `INDICATIF`, `SIGNAL`.
Bandeau de périmètre : non masquable, sur tous les écrans et tous les exports.

Un graphique ne mélange jamais deux statuts de donnée.

### 6. Aucune institution n'existe dans le code

Nom, logo, périmètre, convention sont des données de configuration en base. Le même code doit servir n'importe quelle institution sans modification.

---

## Les cinq états, à implémenter partout

| État | Traitement |
|---|---|
| 1. Chargement | Squelette aux dimensions finales |
| 2. Données présentes | Nominal |
| 3. Données vides | Phrase explicative. **Jamais zéro, jamais un tiret, jamais du blanc** |
| 4. Données masquées | Libellé invariable, traitement neutre. **Ce n'est pas une erreur** |
| 5. Erreur | Message court, action de reprise |

Libellé invariable de l'état 4, au caractère près :

> Non publié : effectif insuffisant pour préserver la confidentialité des établissements.

---

## Règles de masquage

**M0, volumes bruts.** Toujours affichés, quel que soit l'effectif, y compris zéro.

**M1, confidentialité.** Un agrégat de performance hôtelière n'est affiché que si l'échantillon comporte au moins 3 établissements **et** qu'aucun ne représente plus de la moitié des unités.

**M2, très faible effectif.** En dessous de 10 observations, un ratio s'affiche en effectifs : « 2 sur 3 », jamais « 66,7 % ».

Le verdict de masquage **vient de la vue matérialisée**, il n'est jamais recalculé par l'application.

---

## Pile technique

Next.js App Router, TypeScript strict, Tailwind, Supabase (Postgres, Auth, RLS, vues matérialisées), Vercel.

Application **distincte** de la plateforme : sous-domaine propre, base propre, authentification propre. Aucun partage de session, de cookie, de jeton ou de table.

Raccordement futur à simandousejour.com prévu par un flux d'alimentation isolé. **Hors périmètre actuel**, mais le modèle de données en est déjà la cible.

---

## Conventions

| Élément | Convention |
|---|---|
| Tables, colonnes | `snake_case`, français |
| Codes d'énumération et d'indicateur | `MAJUSCULES_SNAKE` |
| Vues matérialisées | `mv_<module>_<niveau>` |
| Composants | `PascalCase`, anglais |
| Fonctions, variables | `camelCase`, anglais |
| Clés de traduction | `domaine.sous_domaine.element` |

Le domaine métier est en français, le code est en anglais.

---

## Déroulé d'une session

**Avant d'écrire du code**

1. Lire le document 1, section 7 : ce que l'Observatoire n'est pas.
2. Lire le document 7 : il prime sur toute autre spécification.
3. Lire la fiche du module concerné, document 9.

**Pendant**

- Ne jamais inventer un indicateur. S'il manque, modifier le document 4 d'abord.
- Ne jamais inventer un libellé. S'il manque, modifier le document 10 d'abord.
- Ne jamais inventer une valeur d'énumération. S'il en manque, modifier le document 2 d'abord.
- Ne jamais générer de données d'illustration.
- Implémenter les cinq états avant de considérer un composant terminé.

**En cas de doute**

- Sur l'affichage d'une donnée : **ne pas l'afficher**. Une donnée manquante se corrige, une donnée exposée ne se retire pas.
- Sur un champ à intégrer : **ne pas l'intégrer**.
- Sur une contradiction entre une demande fonctionnelle et le document 7 : **appliquer la règle et signaler la contradiction**.

---

## Ordre de développement

1. Schéma, rôles, RLS
2. Référentiel territorial et énumérations
3. Authentification et comptes
4. Chrome, navigation, bandeau de périmètre
5. Couches transverses : `queries`, `masking`, `indicators`, `format`, `i18n`
6. **Bibliothèque de composants et cinq états**
7. **`M11_ADMIN`**, back-office de saisie. Sans lui, aucune donnée n'entre
8. `M1_OFFRE`
9. `M2_DEMANDE`
10. `M4_TENSION`
11. `M9_SYNTHESE` et `M10_METHODO`
12. Modules restants

**Le rang 6 est celui qu'on est tenté de sauter pour voir un écran plus vite.** Le sauter produit onze écrans aux comportements divergents.

---

## Interdictions vérifiables

| Interdiction | Vérification |
|---|---|
| Chaîne de caractères en dur | Recherche de littéraux dans `/components` et `/app` |
| Couleur ou taille en dur | Recherche de valeurs hexadécimales et de pixels |
| Nom d'institution en dur | Recherche dans le dépôt |
| Table de faits interrogée depuis un composant | Recherche des noms de tables dans `/app` |
| Champ financier de l'entreprise | Recherche de `commission`, `marge`, `revenu_net` |
| `--color-alert` hors signal de tension | Recherche du jeton |
| Camembert, anneau, double axe, 3D | Revue de `/components/charts` |
| Moyenne là où une médiane est prescrite | Revue des agrégats |

---

## Vocabulaire imposé

| Ne jamais écrire | Écrire |
|---|---|
| Origine des voyageurs | Origine des connexions |
| Établissements informels | Établissements dont l'enregistrement n'est pas documenté |
| Note, score, classement d'établissement | Ces notions n'existent pas dans l'outil |
| Délai moyen, durée moyenne | Délai médian, durée médiane |
| Taux de remplissage | Taux d'occupation |
| Données indisponibles, erreur | Non publié : effectif insuffisant... |

---

## Contexte guinéen à connaître

**Découpage administratif refondu le 20 août 2026.** 10 régions, 44 préfectures, environ 366 communes. Aucune source de données publique ne reflète encore ce découpage : les contours géographiques du nouveau maillage n'existent probablement dans aucun fichier réutilisable. Le référentiel est donc versionné, avec correspondance vers l'ancien découpage.

**Conakry est une zone spéciale sans niveau préfectoral.** Le fil d'Ariane passe directement de la région aux communes.

**L'application doit fonctionner sans aucun contour cartographique**, en se rabattant sur les centroïdes. Ce sera la situation du lancement.

**La praticabilité en saison des pluies est une donnée décisive.** Un déficit d'offre dans une zone accessible six mois par an ne se traite pas comme un déficit dans une zone desservie toute l'année.

---

## Ce que l'Observatoire n'est pas

- Pas la plateforme de réservation
- Pas un outil de pilotage commercial de Simandou Séjour
- Pas un outil de gestion de réservation de groupe
- Pas une base de données livrable
- Pas un outil grand public
- Pas une application mobile
- Pas un produit propre à une institution
- Pas un outil de notation des établissements

### Pas de site public. Aucun.

**L'application n'a pas de partie publique.** Elle se compose d'un écran de connexion et d'un tableau de bord. Rien d'autre.

Ne jamais créer :

- page d'accueil publique, page vitrine, page de présentation ;
- section « à propos », « nos services », « fonctionnalités », « tarifs », « contact » ;
- pied de page institutionnel avec liens de navigation ;
- bandeau de cookies, formulaire de contact, tunnel d'inscription ;
- blog, actualités, documentation publique ;
- contenu marketing de quelque nature que ce soit.

**Comportement attendu :** la racine du domaine affiche l'écran de connexion. Toute adresse consultée sans session valide redirige vers cet écran. Une fois authentifié, l'utilisateur atterrit directement sur le tableau de bord.

Un visiteur non invité n'a aucune raison d'arriver ici et ne doit rien y trouver.

---

## Un composant est terminé quand

- ses cinq états sont implémentés ;
- il affiche son statut de donnée, son niveau de fiabilité et sa fraîcheur ;
- il ne contient aucune chaîne ni aucune valeur visuelle en dur ;
- il est lisible en projection à trois mètres.
