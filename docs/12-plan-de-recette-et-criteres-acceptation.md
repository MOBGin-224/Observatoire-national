# Document 12. Plan de recette et critères d'acceptation

**Projet :** Observatoire National de l'Hospitalité Guinéenne
**Maître d'ouvrage :** SIMANDOU SEJOUR
**Version :** 1.0
**Statut :** Prescriptif. Aucune livraison n'est acceptée sans passage de ce plan.
**Prérequis :** documents 1 à 11.

> **Principe.** Tout critère de ce document se vérifie par une action et une observation, sans lire de code. C'est ce qui permet à la maîtrise d'ouvrage de refuser une livraison sans entrer dans une discussion technique.
>
> **Règle de blocage.** Un critère marqué **bloquant** interdit la mise en service tant qu'il n'est pas satisfait. Aucune dérogation, aucun contournement temporaire.

---

## 1. Organisation de la recette

### 1.1 Trois niveaux

| Niveau | Objet | Quand |
|---|---|---|
| R1. Recette de socle | Fondations transverses | Avant tout module |
| R2. Recette de module | Un module donné | À chaque livraison de module |
| R3. Recette de mise en service | Ouverture d'un accès institutionnel | Avant chaque nouvel accès |

### 1.2 Jeu de données de recette

Les tests s'exécutent sur un jeu synthétique, explicitement identifié comme tel, jamais sur des données de production.

Le jeu doit couvrir les situations suivantes, sans lesquelles les états dégradés ne sont pas testables :

| Situation | Nécessaire pour tester |
|---|---|
| Un territoire avec zéro établissement | État vide |
| Un territoire avec 1 établissement | Règle M1, masquage |
| Un territoire avec 2 établissements | Règle M1, masquage |
| Un territoire avec 3 établissements équilibrés | Règle M1, affichage |
| Un territoire avec 3 établissements dont un pèse 80 % des unités | Règle M1, seconde condition |
| Un territoire avec capacité réservable nulle | Indice de tension indéfini |
| Un territoire sans contour géographique | Repli sur centroïde |
| Un territoire sans données d'accessibilité | Mention « non renseigné » |
| Une commune de Conakry | Fil d'Ariane sans niveau préfectoral |
| Moins de 10 recherches sur un territoire | Règle M2, affichage en effectifs |
| Zéro recherche sur la période | État vide généralisé |
| Une recherche sur une localité hors référentiel | Statut `HORS_PERIMETRE` |
| Un établissement en `DOUBLON` | Exclusion des agrégats |
| Un établissement en `REFUS` | Comptage sans nommage |
| Un établissement fermé sur une période | Champ `etablissement_actif` |

### 1.3 Traçabilité

Chaque passage de recette produit un relevé daté, signé, mentionnant la version livrée, les critères vérifiés, les critères non satisfaits et la décision.

---

## 2. R1. Recette de socle

À exécuter avant la livraison du premier module.

### 2.1 Référentiel territorial

| Réf | Critère | Bloquant |
|---|---|---|
| S01 | Les 10 régions sont présentes et rattachées à la version de découpage du 20 août 2026 | Oui |
| S02 | Les 44 préfectures sont présentes et rattachées à leur région | Oui |
| S03 | Conakry ne comporte aucune préfecture, ses communes sont rattachées à la région | Oui |
| S04 | La table de correspondance avec le découpage antérieur est renseignée | Oui |
| S05 | Une commune saisie sous une variante orthographique connue est rattachée au bon territoire | Oui |
| S06 | Aucun libellé de territoire n'est saisi en texte libre dans une table de faits | Oui |

### 2.2 Énumérations

| Réf | Critère | Bloquant |
|---|---|---|
| S07 | Toutes les énumérations du document 2 sont chargées, avec libellés français et anglais | Oui |
| S08 | Aucun champ énuméré n'accepte une valeur absente de la table `enumeration` | Oui |
| S09 | Les bornes de gamme tarifaire sont renseignées et versionnées | Oui |

### 2.3 Sécurité

| Réf | Critère | Bloquant |
|---|---|---|
| S10 | RLS est activée sur toutes les tables du schéma, sans exception | Oui |
| S11 | Un compte institutionnel ne peut lire aucune table de faits, testé par requête directe | Oui |
| S12 | Le rôle d'ingestion ne peut lire aucune vue | Oui |
| S13 | La clé de service n'apparaît dans aucune variable exposée au client | Oui |
| S14 | Aucun secret ne figure dans le dépôt | Oui |
| S15 | L'inscription libre est désactivée, la création de compte se fait par invitation | Oui |
| S16 | Le second facteur est exigé à chaque connexion | Oui |
| S17 | Un compte suspendu perd l'accès immédiatement | Oui |
| S18 | Un compte expiré perd l'accès automatiquement à sa date | Oui |
| S18a | Aucune adresse de l'application n'est accessible sans session, hors connexion, second facteur et réinitialisation. Vérifié en parcourant toutes les routes en session fermée | Oui |
| S18b | La racine du domaine affiche l'écran de connexion, jamais une page d'accueil | Oui |
| S18c | L'application ne comporte aucune page publique : accueil, présentation, à propos, contact, tarifs, blog, actualités, documentation | Oui |
| S18d | L'écran de connexion ne comporte aucun lien sortant hors réinitialisation de mot de passe | Oui |
| S18e | Aucun tunnel d'inscription n'existe. Une tentative sans compte renvoie au point focal | Oui |
| S18f | Après authentification, l'utilisateur atterrit directement sur la synthèse | Non |

### 2.4 Cloisonnement des données

| Réf | Critère | Bloquant |
|---|---|---|
| S19 | Aucun champ de commission, marge ou revenu net n'existe dans le schéma | Oui |
| S20 | Aucun champ d'identité ou de coordonnées de voyageur n'existe dans le schéma | Oui |
| S21 | Aucune adresse réseau brute n'est conservée après dérivation du pays | Oui |
| S22 | Une recherche du mot `commission` dans le dépôt ne retourne aucune occurrence fonctionnelle | Oui |

### 2.5 Chrome et navigation

| Réf | Critère | Bloquant |
|---|---|---|
| S23 | Le bandeau de périmètre est présent sur tous les écrans et reste visible après défilement | Oui |
| S24 | Le bandeau de périmètre n'est ni masquable ni paramétrable | Oui |
| S25 | La mention d'attribution est présente et non paramétrable | Oui |
| S26 | Le logo de l'institution provient de la base et non du code | Oui |
| S27 | Le sélecteur de niveau géographique est le seul mécanisme de navigation territoriale | Oui |
| S28 | Le fil d'Ariane à Conakry passe de la région aux communes sans niveau préfectoral | Oui |
| S29 | La navigation latérale est permanente et signale le module actif | Non |
| S23a | La variante institutionnelle du bandeau ne comporte ni le nombre de partenaires ni la capacité couverte | Oui |
| S23b | Les trois éléments communs sont présents dans les deux variantes | Oui |
| S23c | En mode prévisualisation, le bandeau bascule sur la variante institutionnelle | Oui |

### 2.6 Socle de composants

| Réf | Critère | Bloquant |
|---|---|---|
| S30 | Chaque composant de données implémente les cinq états | Oui |
| S31 | Le libellé de l'état masqué est identique partout, au caractère près | Oui |
| S32 | L'état masqué n'est pas traité visuellement comme une erreur | Oui |
| S33 | Chaque bloc affiche son statut de donnée, son niveau de fiabilité et sa fraîcheur | Oui |
| S34 | Le verdict de masquage provient de la vue et n'est pas recalculé par l'application | Oui |

### 2.7 Internationalisation

| Réf | Critère | Bloquant |
|---|---|---|
| S35 | Le passage en anglais ne laisse subsister aucune chaîne française sur aucun écran | Oui |
| S36 | Les libellés d'énumération proviennent de la base et non des fichiers de traduction | Oui |
| S37 | Les formats de date, nombre et devise sont localisés | Non |
| S38 | ADR, RevPAR et ALOS ne sont pas traduits | Non |
| S39 | Aucune étiquette n'est tronquée en anglais | Non |

### 2.8 Design et rendu

| Réf | Critère | Bloquant |
|---|---|---|
| S40 | Aucune couleur, taille ou espacement n'est écrit en dur dans un composant | Oui |
| S41 | `--color-alert` n'apparaît que sur les signaux de tension et de déficit | Oui |
| S42 | Aucun camembert, anneau, double axe ou visualisation en trois dimensions | Oui |
| S43 | Aucun territoire sans donnée n'est coloré en clair, tous sont hachurés | Oui |
| S44 | L'écran de synthèse s'affiche en moins de 2 secondes sur 3 Mb/s | Non |
| S45 | Aucun défilement horizontal en 1024 px de large | Non |
| S46 | Les polices sont auto-hébergées | Oui |
| S47 | Aucune dépendance externe pour les fonds de carte | Oui |
| S48 | Lisibilité vérifiée en projection à trois mètres | Oui |

### 2.9 Cartographie

| Réf | Critère | Bloquant |
|---|---|---|
| S49 | La suppression de tous les contours n'empêche pas l'affichage de la carte | Oui |
| S50 | Un territoire sans contour affiche un point au centroïde | Oui |
| S51 | Le clic sur un territoire descend d'un niveau géographique | Non |

---

## 3. R2. Recette de module

À exécuter à chaque livraison de module, en complément des critères propres au module figurant dans sa fiche du document 9.

### 3.1 Critères communs à tout module

| Réf | Critère | Bloquant |
|---|---|---|
| M01 | Tous les indicateurs affichés figurent au document 4 | Oui |
| M02 | Aucun indicateur du document 4 n'est calculé différemment de sa formule | Oui |
| M03 | Les indicateurs prescrits en médiane ne sont pas calculés en moyenne | Oui |
| M04 | Les cinq états sont observables sur chaque zone du module | Oui |
| M05 | Un bloc ne disparaît jamais de la mise en page, il change d'état | Oui |
| M06 | Aucun nom d'établissement n'apparaît, y compris en infobulle | Oui |
| M07 | Les établissements en `DOUBLON` sont exclus de tous les agrégats | Oui |
| M08 | Les établissements en `REFUS` sont comptés mais jamais nommés | Oui |
| M09 | Un même graphique ne mélange jamais deux statuts de donnée | Oui |
| M10 | Le module est accessible aux seuls profils prévus au document 6 | Oui |
| M11 | Le changement de niveau géographique recalcule toutes les zones | Oui |
| M12 | Le changement de période recalcule toutes les zones concernées | Non |
| M13 | Les filtres sont conservés lors d'un changement de niveau | Non |
| M14 | Chaque indicateur donne accès à sa fiche méthodologique | Non |
| M15 | Toutes les chaînes proviennent du document 10 | Oui |

### 3.2 Cohérence arithmétique

| Réf | Critère | Bloquant |
|---|---|---|
| M16 | La somme des valeurs d'un tableau territorial égale la valeur du bloc clé correspondant | Oui |
| M17 | Un même indicateur affiche la même valeur sur deux écrans différents pour le même périmètre | Oui |
| M18 | Un ratio n'est jamais affiché comme un pourcentage en dessous de 10 observations | Oui |
| M19 | Aucune division par zéro n'est affichée, ni sous forme d'infini ni sous forme d'erreur | Oui |

### 3.3 Exports

| Réf | Critère | Bloquant |
|---|---|---|
| M20 | L'export ne produit que du PDF ou de l'image | Oui |
| M21 | Aucun export de données structurées n'est proposé à un compte institutionnel, quel que soit son profil. L'export CSV interne est accessible au seul profil `ADMIN`, fermé au niveau de la base, tracé au journal, et ne contient aucune donnée de recherche, de réservation ni d'inventaire | Oui |
| M22 | L'export porte le filigrane au nom du compte émetteur | Oui |
| M23 | L'export porte une référence unique, imprimée en pied de page | Oui |
| M24 | L'export porte le bandeau de périmètre et l'horodatage | Oui |
| M25 | L'export porte la mention d'attribution et la version des indicateurs | Oui |
| M26 | Chaque export crée une ligne dans la table `export` avec l'empreinte du contenu | Oui |
| M27 | Le PDF est un rendu dédié, sans navigation ni contrôles | Non |
| M28 | Les graphiques du PDF sont rendus en vectoriel | Non |

---

## 4. Scénarios de recette

Ces scénarios se jouent en séquence. Ils testent ce que des critères isolés ne couvrent pas.

### SC1. Base vide

**Action.** Vider entièrement le jeu de données, puis parcourir tous les écrans.

**Attendu.** Tous les écrans s'affichent, sans erreur, avec des états vides explicites. Aucun zéro isolé, aucun tiret, aucune zone blanche, aucun message technique.

**Motif.** C'est l'état dans lequel l'outil sera présenté pour la première fois.

### SC2. Un seul établissement

**Action.** Charger un unique établissement sur une commune, puis parcourir `M1_OFFRE` et `M3_ACTIVITE`.

**Attendu.** `M1_OFFRE` affiche 1 établissement et sa capacité. `M3_ACTIVITE` affiche l'état masqué avec le libellé exact. Aucun indicateur de performance n'est calculé.

### SC3. Le seuil de prépondérance

**Action.** Charger trois établissements sur une commune, dont un représentant 80 % des unités.

**Attendu.** Les indicateurs de performance restent masqués malgré les trois établissements. La seconde condition de la règle M1 s'applique.

**Motif.** C'est le critère que l'on oublie d'implémenter. Trois établissements dont un prépondérant ne protègent personne.

### SC4. Capacité réservable nulle

**Action.** Sélectionner un territoire comptant des établissements recensés mais aucun partenaire, avec des recherches enregistrées.

**Attendu.** `TEN_INDICE_TENSION` n'affiche ni infini ni erreur, mais le message prévu. `TEN_REPARTITION_ECHEC` classe ces recherches en `NON_RESERVABLE`, jamais en `AUCUNE_OFFRE`.

### SC5. Taux d'échec élevé

**Action.** Constituer un jeu où 90 % des recherches échouent.

**Attendu.** `TEN_TAUX_INFRUCTUEUX` affiche 90 %, sans avertissement, sans lissage, sans message d'excuse.

**Motif.** C'est la démonstration du problème, pas un défaut à masquer.

### SC6. Absence totale de contours

**Action.** Vider `territoire_geometrie`.

**Attendu.** Toutes les cartes restent affichées, en points au centroïde. Aucun écran ne casse.

**Motif.** C'est la situation du lancement, les contours du découpage du 20 août 2026 n'existant dans aucune source publique.

### SC7. Fermeture temporaire

**Action.** Marquer un établissement inactif sur quinze jours dans `inventaire_quotidien`.

**Attendu.** `ACT_TAUX_OCCUPATION` du périmètre ne baisse pas du fait de cette fermeture. L'établissement sort du dénominateur.

### SC8. Cloisonnement des profils

**Action.** Ouvrir un compte de chacun des cinq profils et parcourir l'ensemble de l'application.

**Attendu.** Chaque profil ne voit que les modules prévus au document 6. Une tentative d'accès direct à l'adresse d'un module non autorisé est refusée par la base, pas seulement masquée dans la navigation.

### SC9. Bascule linguistique complète

**Action.** Parcourir tous les écrans en anglais, dans tous les états, y compris vides et masqués.

**Attendu.** Aucune chaîne française. Aucune étiquette tronquée. Formats de date et de nombre localisés.

### SC10. Traçabilité d'un export

**Action.** Générer un export, relever sa référence, la rechercher dans la table `export`.

**Attendu.** La ligne existe, avec le compte émetteur, l'horodatage, le périmètre, l'empreinte et la version des indicateurs. La référence figure en pied du document.

### SC11. Cohérence entre écrans

**Action.** Relever la valeur d'un même indicateur sur `M9_SYNTHESE` et sur son module d'origine, au même périmètre et à la même période.

**Attendu.** Valeurs identiques, y compris dans leur état de masquage.

### SC12. Révocation immédiate

**Action.** Suspendre un compte alors qu'une session est ouverte.

**Attendu.** L'accès cesse au prochain appel, sans attendre l'expiration de la session.

---

## 5. R3. Recette de mise en service

À exécuter avant l'ouverture de chaque nouvel accès institutionnel.

| Réf | Critère | Bloquant |
|---|---|---|
| V01 | L'institution existe en base, avec sa convention et ses dates | Oui |
| V02 | Le compte est nominatif, rattaché à une personne physique identifiée | Oui |
| V03 | Le profil correspond au mandat de l'institution, document 6 | Oui |
| V04 | La date d'expiration est alignée sur la durée de la convention | Oui |
| V05 | Le second facteur est configuré | Oui |
| V06 | Les modules activés correspondent au profil | Oui |
| V07 | Le logo de l'institution est chargé et s'affiche | Non |
| V08 | La langue par défaut du compte est définie | Non |
| V09 | Le titulaire a reçu la matrice de gouvernance, document 6 | Oui |
| V10 | Les règles de confidentialité, document 7, sont annexées à la convention | Oui |
| V11 | Le point focal de chaque partie est nommé par écrit | Oui |
| V12 | Un parcours complet a été effectué sous ce compte avant remise | Oui |

---

## 6. Vérifications par inspection du dépôt

Vérifications textuelles, exécutables en une commande, sans lecture de code.

| Réf | Recherche | Résultat attendu |
|---|---|---|
| I01 | Noms des tables de faits dans `/app` et `/components` | Aucune occurrence |
| I02 | `commission`, `marge`, `revenu_net` | Aucune occurrence fonctionnelle |
| I03 | Nom de toute institution partenaire | Aucune occurrence |
| I04 | Valeurs hexadécimales de couleur hors jetons | Aucune occurrence |
| I05 | `--color-alert` hors composants de tension | Aucune occurrence |
| I06 | Littéraux de texte affichable dans `/components` | Aucune occurrence |
| I07 | `SUPABASE_SERVICE_ROLE_KEY` dans un composant client | Aucune occurrence |
| I08 | Fichier `.env` versionné | Absent du dépôt |
| I09 | Jeu de données de production dans le dépôt | Absent |

---

## 7. Conditions de refus d'une livraison

Une livraison est refusée, sans discussion, si l'une de ces conditions est constatée.

- Un critère bloquant n'est pas satisfait.
- Une donnée simulée, générée ou inventée apparaît dans l'application.
- Un nom d'établissement apparaît dans un agrégat.
- Une donnée financière de Simandou Séjour est accessible à un profil institutionnel.
- Un export de données structurées est possible.
- Le bandeau de périmètre ou la mention d'attribution est masquable.
- Une page publique a été créée, ou une adresse est accessible sans session.
- Un composant est livré sans ses cinq états.
- Un indicateur affiche une valeur différente de la formule du document 4.
- Une chaîne de caractères ou une valeur visuelle est écrite en dur.

---

## 8. Points ouverts

1. Constitution du jeu de données de recette synthétique.
2. Outil de mesure de performance pour le critère S44.
3. Périodicité des recettes de socle après la mise en service initiale.
4. Modalité de conservation des relevés de recette.

---

*Document 12 sur 12. Document précédent : architecture technique et conventions de code.*
