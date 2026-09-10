# Document 11. Architecture technique et conventions de code

**Projet :** Observatoire National de l'Hospitalité Guinéenne
**Maître d'ouvrage :** SIMANDOU SEJOUR
**Version :** 1.0
**Statut :** Prescriptif. Cadre technique et conventions applicables à toute session de développement.
**Prérequis :** documents 1 à 10.

> **À lire au début de chaque session de développement.** Ce document existe pour qu'un agent de développement reprenant le projet après plusieurs jours retrouve les mêmes conventions et ne reparte pas dans une direction différente.

---

## 1. Pile technique

| Couche | Choix | Justification |
|---|---|---|
| Cadre applicatif | Next.js, App Router | Rendu serveur nécessaire pour la lisibilité en projection et la performance sur connexion faible |
| Langage | TypeScript, mode strict | Le modèle de données est complexe, le typage prévient les erreurs d'agrégat |
| Style | Tailwind CSS | Jetons de design en variables CSS, voir document 8 |
| Base de données | PostgreSQL via Supabase | Row Level Security native, vues matérialisées, tâches planifiées |
| Authentification | Supabase Auth | Comptes nominatifs, second facteur |
| Hébergement | Vercel | Cohérent avec la plateforme existante |
| Versionnement | Git et GitHub | |

### Hors périmètre

Aucune fonction de paiement. Aucune application mobile. Aucun rendu mobile. Aucune dépendance à un service tiers pour les polices ou les fonds de carte.

**Aucune partie publique.** L'application se compose d'un écran de connexion et d'un tableau de bord. Ne jamais créer de page d'accueil publique, de page vitrine, de section « à propos », de page de contact, de pied de page institutionnel, de bandeau de cookies, de tunnel d'inscription, de blog ni de documentation publique.

### Routage

| Adresse | Comportement |
|---|---|
| `/` | Écran de connexion si session absente, redirection vers `/synthese` si session valide |
| Toute adresse sous `(observatoire)` ou `(admin)` | Redirection vers `/` si session absente |
| `/auth/*` | Seules routes accessibles sans session : connexion, second facteur, réinitialisation |

La protection est assurée par un intergiciel appliqué à l'ensemble des routes, en liste blanche : tout est protégé par défaut, seules les routes d'authentification sont ouvertes. Une route nouvelle est donc protégée sans action particulière.

L'écran d'atterrissage après connexion est `M9_SYNTHESE`.

---

## 2. Isolement par rapport à la plateforme

**L'Observatoire est une application distincte**, déployée sur son propre sous-domaine, avec sa propre base, sa propre authentification et son propre cycle de livraison.

Cinq raisons, à connaître avant toute tentation de mutualisation :

1. **Rayon d'impact.** Une faille sur l'Observatoire ne doit pas exposer la plateforme commerciale, et réciproquement.
2. **Cadence de livraison.** Corriger un écran la veille d'une réunion ministérielle ne doit pas impliquer de redéployer un moteur de réservation.
3. **Authentification étrangère.** Comptes institutionnels nominatifs, sans aucun rapport avec les comptes voyageurs.
4. **Charge.** Les requêtes analytiques sont lourdes et irrégulières.
5. **Lisibilité institutionnelle.** L'outil se présente comme une infrastructure, pas comme un site marchand doté d'une page de statistiques.

**Interdit :** partager une session, un cookie, un jeton ou une table avec la plateforme.

---

## 3. Structure du dépôt

```
/app
  /(auth)                    écrans d'authentification
  /(observatoire)
    /layout.tsx              chrome, navigation, bandeau de périmètre
    /synthese                M9
    /offre                   M1
    /demande                 M2
    /activite                M3
    /tension                 M4
    /conformite              M5
    /maturite                M6
    /evenementiel            M7
    /retombees               M8
    /methodologie            M10
  /(admin)                   M11
/components
  /chrome                    en-tête, navigation, bandeau de périmètre
  /controls                  sélecteur géographique, période, filtres, export
  /data-display              bloc d'indicateur, badges, tableau
  /charts                    bibliothèque de visualisations
  /map                       carte et repli centroïde
  /states                    les cinq états
/lib
  /supabase                  clients serveur et navigateur
  /queries                   accès aux vues matérialisées
  /indicators                résolution des métadonnées d'indicateurs
  /masking                   application des règles M0, M1, M2
  /geo                       hiérarchie territoriale, fil d'Ariane
  /format                    nombres, dates, devises
  /i18n                      chargement des libellés
/locales
  fr.json
  en.json
/supabase
  /migrations                fichiers SQL numérotés
  /seed                      référentiels et énumérations
  /functions                 tâches planifiées
/docs                        les documents du projet, 1 à 12 et lots 9 bis, 9 ter, 9 quater
/types                       types générés depuis le schéma
```

**Règle :** un module correspond à un dossier de route et à un seul. Aucun écran ne mélange deux modules.

---

## 4. Conventions de nommage

| Élément | Convention | Exemple |
|---|---|---|
| Tables et colonnes | `snake_case`, français | `etablissement`, `capacite_unites` |
| Vues matérialisées | `mv_<module>_<niveau>` | `mv_offre_commune` |
| Codes d'énumération | `MAJUSCULES_SNAKE` | `PARTENAIRE_ACTIF` |
| Codes d'indicateur | `MAJUSCULES_SNAKE` | `OFF_TAUX_COUVERTURE` |
| Composants React | `PascalCase`, anglais | `IndicatorBlock`, `MaskedState` |
| Fonctions et variables | `camelCase`, anglais | `resolveTerritoryPath` |
| Fichiers de composant | `PascalCase.tsx` | `IndicatorBlock.tsx` |
| Fichiers utilitaires | `kebab-case.ts` | `apply-masking.ts` |
| Clés de traduction | points, minuscules | `state.masque` |
| Jetons de design | `--kebab-case` | `--color-alert` |

**Le domaine métier est en français, le code est en anglais.** Les noms de tables, colonnes, codes et libellés reflètent le vocabulaire métier guinéen. Les noms de composants et de fonctions suivent la convention de l'écosystème.

---

## 5. Base de données

### 5.1 Schéma

Toutes les tables dans un schéma applicatif dédié nommé `observatoire`. Jamais dans `public`.

### 5.2 Migrations

Fichiers SQL numérotés, jamais modifiés après application. Une migration corrige une migration, elle ne la réécrit pas.

Ordre d'application initial :

| Rang | Migration |
|---|---|
| 1 | Schéma, extensions, rôles |
| 2 | `version_decoupage`, `territoire`, `territoire_variante`, `territoire_geometrie`, `territoire_accessibilite` |
| 3 | `enumeration`, `gamme_tarifaire_borne` |
| 4 | `etablissement`, `etablissement_equipement`, `etablissement_historique`, `retour_terrain` |
| 5 | `recherche`, `resultat_recherche`, `consultation_etablissement` |
| 6 | `reservation`, `inventaire_quotidien` |
| 7 | `demande_institutionnelle`, `evenement_calendrier` |
| 8 | `conformite_etablissement` |
| 9 | `institution`, `compte_institutionnel`, `compte_module`, `journal_acces`, `export` |
| 10 | `indicateur`, `version_indicateur` |
| 11 | Vues matérialisées |
| 12 | Politiques RLS |

### 5.3 Rôles

| Rôle | Droits |
|---|---|
| `role_institutionnel` | `SELECT` sur les vues matérialisées uniquement |
| `role_admin` | `SELECT`, `INSERT`, `UPDATE` sur le schéma applicatif |
| `role_ingestion` | `INSERT`, `UPDATE` sur les tables de faits. **Aucun `SELECT` sur les vues** |

### 5.4 Row Level Security

**Activée sur toutes les tables, sans exception, dès leur création.**

Une table créée sans politique RLS est inaccessible par défaut. C'est le comportement voulu : un oubli produit une absence de données, jamais une fuite.

### 5.5 Vues matérialisées

Une vue par couple module et niveau géographique.

Chaque vue expose obligatoirement, en plus de ses indicateurs :

| Colonne | Contenu |
|---|---|
| `effectif_echantillon` | Nombre d'établissements ou d'observations |
| `niveau_fiabilite` | `CONSOLIDE`, `INDICATIF` ou `SIGNAL` |
| `masque` | Booléen, verdict de la règle M1 |
| `calcule_a` | Horodatage du rafraîchissement |

**L'application ne recalcule jamais un seuil.** La vue lui livre le verdict. Cette règle est ce qui garantit qu'un même indicateur ne sera jamais masqué sur un écran et affiché sur un autre.

### 5.6 Rafraîchissement

Tâches planifiées Supabase.

| Fréquence | Concernés |
|---|---|
| Temps réel, lecture directe | Volumes bruts de `M1_OFFRE` et `M2_DEMANDE` |
| Toutes les heures | Vues de `M4_TENSION` |
| Quotidien | Vues de `M3_ACTIVITE`, après clôture des annulations |
| Quotidien | Relevé d'inventaire, une exécution par nuit |
| Hebdomadaire | Saisonnalité, médianes |

---

## 6. Accès aux données depuis l'application

### 6.1 Règle unique

**Un composant institutionnel n'interroge jamais une table de faits.** Il interroge une vue matérialisée, et rien d'autre.

Cette règle est vérifiable par inspection : aucune occurrence des noms de tables de faits ne doit apparaître dans `/app` ni dans `/components`.

### 6.2 Couche `/lib/queries`

Une fonction par vue. Signature homogène :

```
(territoire: string | null, periode: Periode, filtres: Filtres) => Promise<Resultat>
```

Toute fonction retourne, avec les données, l'effectif, le niveau de fiabilité, le verdict de masquage et l'horodatage.

### 6.3 Couche `/lib/masking`

Applique le verdict rendu par la vue. Ne le recalcule pas.

Trois fonctions : appliquer M0, appliquer M1, appliquer M2. Aucun composant n'implémente sa propre logique de masquage.

### 6.4 Couche `/lib/indicators`

Résout les métadonnées d'un indicateur depuis la table `indicateur` : libellé, unité, décimales, statut de donnée, lien méthodologique.

**Un bloc d'indicateur ne connaît jamais son libellé en dur.** Il connaît son code et interroge cette couche.

---

## 7. Rendu

| Type d'écran | Stratégie |
|---|---|
| Synthèse, cartes, tableaux | Rendu serveur |
| Blocs consolidés | Revalidation incrémentale |
| Compteurs temps réel | Interrogation périodique légère côté client |
| Authentification | Serveur |

Chargement progressif obligatoire. Les blocs apparaissent au fur et à mesure, aux dimensions finales, sans saut de mise en page.

---

## 8. Internationalisation

- Deux fichiers, `fr.json` et `en.json`, structurés selon les clés du document 10.
- Les libellés d'énumération viennent de la table `enumeration`, jamais des fichiers.
- Aucune chaîne en dur dans un composant. Cette règle est vérifiable par recherche.
- Formats de date, nombre et devise localisés, voir document 10 section 2.

---

## 9. Cartographie

- Contours au format GeoJSON, stockés en base dans `territoire_geometrie`.
- **Repli obligatoire sur le centroïde** quand un contour est absent. L'application doit rester pleinement fonctionnelle sans aucun contour, ce qui sera la situation du lancement.
- Fonds de carte servis depuis l'infrastructure de l'entreprise ou un fournisseur léger. Aucune dépendance externe lourde.
- Territoires sans donnée hachurés, jamais colorés en clair.

---

## 10. Environnements

| Environnement | Base | Données |
|---|---|---|
| Production | Projet Supabase de production | Données réelles |
| Préproduction | Projet Supabase distinct | Jeu de test synthétique |
| Développement local | Supabase local ou projet dédié | Jeu de test synthétique |

**Aucune donnée de production dans un environnement de développement.**

Les jeux de test sont synthétiques et identifiables comme tels. Ils ne quittent jamais l'environnement de développement.

---

## 11. Variables d'environnement

| Variable | Portée |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client |
| `SUPABASE_SERVICE_ROLE_KEY` | Serveur uniquement |
| `INGESTION_API_KEY` | Serveur uniquement, futur flux d'alimentation |

**La clé de service ne doit jamais apparaître dans un composant client**, ni dans une variable préfixée `NEXT_PUBLIC_`.

Aucun secret dans le dépôt. Fichier `.env.example` sans valeurs.

---

## 12. Interdictions applicables au code

Liste vérifiable par inspection ou par recherche textuelle.

| Interdiction | Vérification |
|---|---|
| Chaîne de caractères en dur dans un composant | Recherche de littéraux dans `/components` et `/app` |
| Couleur, taille ou espacement en dur | Recherche de valeurs hexadécimales et de pixels hors `/lib` et jetons |
| Nom d'institution en dur | Recherche du nom de toute institution dans le dépôt |
| Interrogation d'une table de faits depuis un composant | Recherche des noms de tables de faits dans `/app` et `/components` |
| Champ financier de Simandou Séjour | Recherche de `commission`, `marge`, `revenu_net` dans le dépôt |
| Donnée personnelle de voyageur | Aucun champ correspondant dans le modèle |
| Recalcul d'un seuil de masquage côté application | Le verdict vient de la vue |
| Moyenne là où le document 4 prescrit une médiane | Revue des fonctions d'agrégat |
| Camembert, anneau, double axe, visualisation en trois dimensions | Revue de `/components/charts` |
| Usage de `--color-alert` hors signal de tension | Recherche du jeton dans le dépôt |
| Donnée simulée ou générée pour illustration | Revue des jeux de test |

---

## 13. Conventions de commit et de branche

- Branches : `feat/<module>`, `fix/<sujet>`, `chore/<sujet>`.
- Commits en français, à l'impératif, une intention par commit.
- Toute migration de base fait l'objet d'un commit distinct.
- Aucune fusion sans que les critères d'acceptation du module concerné soient vérifiés.

---

## 14. Consignes pour une session de développement assistée

Ces règles s'adressent à un agent de développement travaillant sur le projet.

**Avant d'écrire du code**

1. Relire le document 1, section 7, ce que l'Observatoire n'est pas.
2. Relire le document 7, qui prime sur toute autre spécification.
3. Relire la fiche du module concerné, document 9.
4. **Consulter les guides fournis avec le cadre applicatif avant d'écrire du code, plutôt que d'écrire de mémoire.** Les guides de Next.js livrés dans `node_modules/next/dist/docs/` font foi sur la version installée. Cela vaut en particulier pour le téléversement de fichier, les routes planifiées et l'intergiciel. *Règle ajoutée par le document 14, section 7.*

**Pendant le développement**

- Ne jamais inventer un indicateur. S'il manque, modifier le document 4 d'abord.
- Ne jamais inventer un libellé. S'il manque, l'ajouter au document 10 d'abord.
- Ne jamais inventer une valeur d'énumération. S'il en manque une, modifier le document 2 d'abord.
- Ne jamais générer de données d'illustration, y compris pour tester un écran. Utiliser un jeu de test synthétique explicitement identifié.
- Implémenter les cinq états de chaque zone avant de considérer un composant terminé.

**En cas de doute**

- Sur l'affichage d'une donnée : ne pas l'afficher.
- Sur un champ à intégrer : ne pas l'intégrer.
- Sur une contradiction entre une demande fonctionnelle et une règle du document 7 : appliquer la règle et signaler la contradiction.

**La source de vérité est le dépôt**

Les documents du dépôt évoluent au fil du développement. Un fichier régénéré hors du dépôt écrase les amendements déjà validés. Deux modes acceptés, dans cet ordre : amendement textuel appliqué dans le dépôt, ou régénération complète d'un document dont la version en vigueur a été transmise au préalable. **Un fichier régénéré sans que sa version en vigueur ait été fournie ne s'installe pas.** *Règle ajoutée par le document 14, section 1.*

**Ce qui constitue un composant terminé**

Un composant est terminé lorsqu'il implémente ses cinq états, qu'il affiche son statut de donnée, son niveau de fiabilité et sa fraîcheur, qu'il ne contient aucune chaîne ni aucune valeur visuelle en dur, et qu'il est lisible en projection à trois mètres.

---

## 15. Ordre de développement

| Rang | Élément | Motif |
|---|---|---|
| 1 | Schéma, rôles, RLS | Fondation |
| 2 | Référentiel territorial et énumérations | Rien ne fonctionne sans eux |
| 3 | Authentification et gestion des comptes | Conditionne tout accès |
| 4 | Chrome, navigation, bandeau de périmètre | Cadre commun à tous les écrans |
| 5 | Couches `queries`, `masking`, `indicators`, `format`, `i18n` | Socle transverse |
| 6 | Bibliothèque de composants et cinq états | Réutilisé partout |
| 7 | `M11_ADMIN` | **Back-office de saisie. Sans lui, aucune donnée n'entre** |
| 8 | `M1_OFFRE` | Premier module de restitution |
| 9 | `M2_DEMANDE` | |
| 10 | `M4_TENSION` | |
| 11 | `M9_SYNTHESE` et `M10_METHODO` | Agrégation et méthode |
| 12 | Modules restants | Selon dépendances |

Le rang 6 est celui que l'on est tenté de sauter pour aller plus vite. Le sauter produit onze écrans aux comportements divergents.

---

## 16. Points ouverts

1. Format d'échange du futur flux d'alimentation depuis la plateforme.
2. Bibliothèque de cartographie retenue.
3. Bibliothèque de graphiques retenue, conforme aux interdictions du document 8.
4. Outil de génération des exports PDF.
5. Modalité de second facteur retenue.

---

*Document 11 sur 12. Document précédent : charte des libellés bilingue. Document suivant : plan de recette et critères d'acceptation.*
