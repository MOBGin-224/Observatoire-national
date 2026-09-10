# Document 4. Dictionnaire des indicateurs

**Projet :** Observatoire National de l'Hospitalité Guinéenne
**Maître d'ouvrage :** SIMANDOU SEJOUR
**Version :** 1.0
**Statut :** Prescriptif. Aucun indicateur ne peut être affiché s'il ne figure pas dans ce document.
**Prérequis :** documents 1, 2 et 3.

> Ce document alimente également le module `M10_METHODO` visible dans l'outil. Il est donc rédigé pour être publiable en l'état.

---

## 1. Conventions générales

**Médiane plutôt que moyenne** pour toute durée ou tout délai. Une observation atypique déforme une moyenne sur faible effectif.

**Règle de masquage M1, dite de confidentialité.**
Un agrégat de performance hôtelière n'est affiché que si l'échantillon comporte au moins 3 établissements et qu'aucun ne représente plus de la moitié des unités. Sinon, afficher exactement :
> Non publié : effectif insuffisant pour préserver la confidentialité des établissements.

**Règle de masquage M0, dite d'absence.**
Un volume brut est toujours affiché, y compris à zéro. Zéro établissement recensé à Karala est une information, pas un vide.

**Ratios sur très faible effectif.**
En dessous de 10 observations, un ratio s'affiche en effectifs et non en pourcentage : « 2 sur 3 », jamais « 66,7 % ».

**Exclusions permanentes.**
Les établissements en `DOUBLON` sont exclus de tous les calculs. Les établissements en `REFUS` comptent dans les inventaires mais ne sont jamais nommés.

**Fuseau.** Tous les découpages temporels en Africa/Conakry.

**Format de fiche.** Code, libellé, définition, formule, unité, statut de donnée, masquage, fréquence, exemple, pièges.

---

## 2. Indicateurs d'offre (statut `RECENSE`)

### `OFF_ETAB_RECENSES`
**Établissements recensés**

Nombre d'établissements d'hébergement inventoriés sur le territoire considéré, quelle que soit leur relation commerciale avec Simandou Séjour.

- Formule : comptage des établissements actifs, hors `DOUBLON`
- Unité : entier
- Masquage : M0
- Fréquence : temps réel
- Exemple : commune de Kaloum, 47 établissements recensés
- Piège : ne jamais confondre avec le nombre de partenaires. C'est la confusion la plus dommageable de tout l'outil.

### `OFF_CAPACITE_RECENSEE`
**Capacité recensée**

Somme des unités d'hébergement commercialisables des établissements recensés.

- Formule : somme de `capacite_unites`
- Unité : entier
- Masquage : M0
- Piège : les capacités déclarées et estimées se mélangent. Afficher en regard la part de capacités vérifiées, sans quoi le total est fragile.

### `OFF_ETAB_PARTENAIRES`
**Établissements partenaires**

- Formule : comptage des établissements en `PARTENAIRE_ACTIF`
- Unité : entier
- Masquage : M0

### `OFF_TAUX_COUVERTURE`
**Taux de couverture plateforme**

Part de la capacité recensée effectivement réservable via Simandou Séjour.

- Formule : capacité des `PARTENAIRE_ACTIF` / capacité recensée totale
- Unité : pourcentage, 1 décimale
- Masquage : M0
- Exemple : 214 unités partenaires sur 3 180 recensées, soit 6,7 %
- Piège : cet indicateur sera très bas au lancement. C'est voulu. Il mesure la marge de progression du secteur, pas la performance de l'entreprise. Le libeller comme tel.

### `OFF_TAUX_NUMERISATION`
**Taux de numérisation de l'offre**

Part des établissements disposant d'au moins un canal en ligne : site, Facebook ou Instagram.

- Formule : établissements avec au moins un canal renseigné / établissements recensés
- Unité : pourcentage
- Masquage : M0
- Piège : une page inactive depuis deux ans compte comme présence. Le préciser en méthodologie.

### `OFF_TAUX_RESERVABILITE`
**Taux de réservabilité en ligne**

Part des établissements disposant d'un canal de réservation en ligne réel, toutes plateformes confondues, pas seulement Simandou Séjour.

- Formule : établissements avec `reservation_en_ligne` vrai / établissements recensés
- Unité : pourcentage
- Masquage : M0
- Piège : ne pas confondre avec `OFF_TAUX_COUVERTURE`. Celui-ci mesure la numérisation du secteur, l'autre la part captée par la plateforme. Un écart important signale une concurrence, un écart nul signale un secteur non numérisé.

### `OFF_COMPLETUDE_FICHE`
**Complétude documentaire**

Score de qualité de la fiche établissement.

- Formule : somme pondérée des champs renseignés. Contact valide 30, localisation GPS 20, tarifs 20, typologie et capacité 20, présence en ligne 10
- Unité : score sur 100, sans décimale
- Masquage : M0
- Usage : prérequis technique de toute classification. Argument direct auprès de la tutelle.

### `OFF_TAUX_VERIFICATION`
**Taux de fiches vérifiées**

- Formule : établissements en `VERIFIE_TEL` ou `VERIFIE_TERRAIN` / établissements recensés
- Unité : pourcentage
- Masquage : M0
- Usage : documente la fiabilité de l'inventaire. À afficher systématiquement à côté des totaux d'offre.

### `OFF_REPARTITION_TYPOLOGIE` et `OFF_REPARTITION_GAMME`
**Répartition par typologie et par gamme**

- Formule : comptage et capacité par valeur d'énumération
- Unité : entier et pourcentage
- Masquage : M0

### `OFF_ECART_LISTE_ADMIN`
**Écart entre liste administrative et terrain**

Nombre d'établissements figurant sur une liste administrative et invalidés par le terrain.

- Formule : comptage des retours terrain en `FERME_DEFINITIF`, `INEXISTANT` ou `RECLASSEMENT`, dont `source_recensement` vaut `ADMINISTRATION`
- Unité : entier
- Masquage : M0
- Usage : information que l'État ne détient pas. Fort effet institutionnel, à manier sans triomphalisme.

---

## 3. Indicateurs de maturité numérique (statut `RECENSE`)

### `MAT_INDICE`
**Indice de maturité numérique**

Score composite mesurant le degré de numérisation d'un établissement.

- Formule : présence en ligne 20, canal de réservation en ligne 30, tarifs publiés 20, coordonnées jointes valides 10, paiement par carte 10, paiement mobile money 10
- Unité : score sur 100. Agrégation par moyenne territoriale
- Masquage : M0
- Usage : mesure chiffrée du problème que l'entreprise existe pour résoudre. Très lisible par un ministère ou un bailleur.
- Piège : ne jamais présenter cet indice comme une note de qualité de l'établissement. C'est une mesure de numérisation, rien d'autre.

### `MAT_TAUX_PAIEMENT_NUMERIQUE`
**Taux d'acceptation du paiement numérique**

- Formule : établissements acceptant carte ou mobile money / établissements recensés
- Unité : pourcentage
- Masquage : M0

---

## 4. Indicateurs de demande exprimée (statut `EXPRIME`)

### `DEM_VOLUME_RECHERCHES`
**Volume de recherches**

- Formule : comptage des enregistrements de `recherche`
- Unité : entier
- Masquage : M0
- Fréquence : temps réel
- Exemple : Boké, 19 recherches sur 7 jours
- Piège : compter les recherches, pas les sessions. Un visiteur qui affine trois fois exprime trois intentions, ce qui est l'information utile.

### `DEM_DESTINATIONS_TOP`
**Destinations les plus recherchées**

- Formule : classement des territoires par volume de recherches
- Unité : entier
- Masquage : M0
- Point de méthode : construit sur la destination recherchée, jamais sur la localisation de l'utilisateur.

### `DEM_ORIGINE_PAYS`
**Origine des connexions par pays**

- Formule : répartition des recherches par `pays_utilisateur`
- Unité : entier et pourcentage
- Masquage : M0
- Piège : intituler « origine des connexions » et non « origine des voyageurs ». La géolocalisation par adresse réseau est fiable au niveau du pays, jamais en dessous. La localisation fine est stockée mais jamais publiée.

### `DEM_BOOKING_WINDOW`
**Délai de projection**

Délai médian entre la recherche et la date d'arrivée souhaitée.

- Formule : médiane de (`date_arrivee` moins date de la recherche)
- Unité : jours, sans décimale
- Seuils : `CONSOLIDE` à partir de 30 recherches, `INDICATIF` de 10 à 29, `SIGNAL` en dessous de 10
- Masquage : M0
- Fréquence : hebdomadaire
- Piège : médiane obligatoire. Une recherche à un an fausse toute moyenne.

### `DEM_DUREE_SEJOUR_RECHERCHEE`
**Durée de séjour recherchée**

- Formule : médiane de `nb_nuits`
- Unité : nuits, 1 décimale
- Seuils : identiques à `DEM_BOOKING_WINDOW`

### `DEM_BUDGET_RECHERCHE`
**Budget recherché**

- Formule : médiane de la borne haute du budget, sur les recherches où un filtre budget est appliqué
- Unité : GNF
- Masquage : minimum 10 recherches
- Piège : afficher systématiquement la part des recherches ayant utilisé le filtre. Sur 12 % des recherches, la médiane ne décrit pas le marché.

### `DEM_SAISONNALITE`
**Saisonnalité de l'intention**

- Formule : volume de recherches par mois de date d'arrivée souhaitée
- Unité : entier
- Fréquence : hebdomadaire
- Enrichissement : superposer les événements du calendrier. Une courbe sans contexte n'explique rien.

### `DEM_REPARTITION_APPAREIL` et `DEM_REPARTITION_CANAL`
**Répartition par appareil et par canal**

- Formule : comptage par valeur
- Unité : pourcentage
- Masquage : M0

### `DEM_DESTINATIONS_NON_RECONNUES`
**Destinations recherchées hors référentiel**

- Formule : comptage des recherches avec `destination_non_reconnue` vrai, groupées par texte saisi normalisé
- Unité : entier
- Masquage : M0
- Usage : révèle les localités où une demande existe sans figurer au référentiel. Signal d'opportunité que rien d'autre ne produit.

---

## 5. Indicateurs de tension (croisement `EXPRIME` et `RECENSE`)

Module à plus fort impact institutionnel.

### `TEN_TAUX_INFRUCTUEUX`
**Taux de recherche infructueuse**

- Formule : recherches dont `statut_resultat` est différent de `RESULTATS_DISPONIBLES` / total des recherches
- Unité : pourcentage
- Masquage : M0
- Fréquence : temps réel
- Piège : cet indicateur sera très élevé au lancement. Ne pas le masquer. C'est la démonstration du problème, pas un aveu de faiblesse.

### `TEN_REPARTITION_ECHEC`
**Nature des recherches infructueuses**

- Formule : répartition sur les quatre états d'échec
- Unité : entier et pourcentage
- Masquage : M0
- Usage : indicateur le plus important de l'Observatoire. Il sépare trois problèmes de politique publique :
  - `AUCUNE_OFFRE` appelle de l'investissement
  - `NON_RESERVABLE` appelle de la numérisation
  - `OFFRE_INDISPONIBLE` appelle de la capacité additionnelle

### `TEN_INDICE_TENSION`
**Indice de tension**

Rapport entre demande exprimée et capacité réservable sur un territoire, ramené en base 100 par rapport à la moyenne nationale.

- Formule : (recherches sur le territoire / capacité réservable du territoire) divisé par (recherches nationales / capacité réservable nationale), multiplié par 100
- Unité : indice, sans décimale
- Seuils : `CONSOLIDE` à partir de 50 recherches sur le territoire, `INDICATIF` de 15 à 49, `SIGNAL` en dessous
- Piège : sur un territoire à capacité réservable nulle, le rapport est indéfini. Ne pas afficher l'infini, basculer sur `TEN_CAPACITE_MANQUANTE`.

### `TEN_CAPACITE_MANQUANTE`
**Capacité manquante estimée**

Nombre d'unités qui auraient été nécessaires pour satisfaire la demande exprimée non servie.

- Formule : somme des unités demandées dans les recherches en échec, sur la période de pointe du territoire
- Unité : unités, entier
- Statut : `ESTIME`
- Masquage : minimum 10 recherches en échec
- Usage : phrase qu'un chargé d'investissement peut porter devant un investisseur. Seul indicateur de l'outil qui produit directement du pipeline.
- Piège : une même personne cherchant trois fois compte trois fois. Dédoublonner par session avant sommation, et publier cette règle.

### `TEN_CLASSEMENT_DEFICIT`
**Territoires en déficit d'offre**

- Formule : classement décroissant sur `TEN_CAPACITE_MANQUANTE`
- Unité : classement
- Masquage : M0
- Point de méthode : afficher `distance_conakry_km`, `temps_trajet_conakry_min` et `praticabilite_saison_pluies` à côté de chaque ligne. Un déficit à 11 heures de route impraticable six mois par an n'appelle pas la même réponse qu'un déficit à 3 heures.

### `TEN_FENETRES_SATURATION`
**Fenêtres de saturation**

- Formule : semaines de `date_arrivee` souhaitée où la part de `OFFRE_INDISPONIBLE` atteint 40 % des recherches du territoire, avec au moins 10 recherches sur l'intervalle
- Agrégation : par semaine de date d'arrivée souhaitée, jamais par date de recherche
- Unité : plages de dates
- Fréquence : hebdomadaire
- Seuils : `INDICATIF` de 10 à 29 recherches, `CONSOLIDE` au delà. En dessous de 10, aucune fenêtre n'est produite
- Enrichissement : rapprochement automatique avec `evenement_calendrier`
- Piège : agréger par date de recherche décale les fenêtres de plusieurs semaines et les rend inexploitables

*Seuil arrêté par le document 15, section 2.*

---

## 6. Indicateurs de demande institutionnelle (statut `DECLARE`)

### `INS_VOLUME_DEMANDE`
**Unités demandées**

- Formule : somme de `nb_unites_demandees` sur la période et le territoire
- Unité : entier
- Masquage : M0

### `INS_TAUX_COUVERTURE`
**Taux de couverture des besoins institutionnels**

- Formule : `nb_unites_couvertes` / `nb_unites_demandees`
- Unité : pourcentage
- Masquage : minimum 3 demandes

### `INS_DEFICIT`
**Déficit institutionnel**

Écart entre les unités demandées et la capacité mobilisable du territoire aux dates concernées.

- Formule : unités demandées moins capacité recensée disponible sur la période
- Unité : entier
- Statut : `ESTIME`
- Usage : la donnée qui manque à toute institution organisant un sommet. Un pays qui ne sait pas s'il peut loger trois cents délégués ne peut pas se porter candidat à un événement.

---

## 7. Indicateurs d'activité observée (statut `OBSERVE`)

Périmètre partenaire uniquement. Masquage M1 systématique en dessous du niveau national.

### `ACT_RESERVATIONS`
**Réservations confirmées**

- Formule : comptage des réservations hors `ANNULEE`
- Unité : entier
- Masquage : M0 au national, M1 en dessous

### `ACT_NUITEES`
**Nuitées générées**

- Formule : somme de (`nb_nuits` multiplié par `nb_unites`) sur les réservations honorées
- Unité : entier

### `ACT_TAUX_OCCUPATION`
**Taux d'occupation**

- Formule : unités vendues / unités disponibles, sur les établissements actifs de la période
- Unité : pourcentage, 1 décimale
- Masquage : M1
- Fréquence : quotidien consolidé
- Piège majeur : un établissement fermé doit sortir du dénominateur. Sans le champ `etablissement_actif`, une fermeture de deux semaines effondre artificiellement le taux du périmètre.

### `ACT_TAUX_OCCUPATION_CONTRACTUALISE`
**Taux d'occupation sur capacité contractualisée**

Variante calculable sans relevé quotidien d'inventaire.

- Formule : nuitées vendues / (capacité des partenaires multipliée par le nombre de jours)
- Unité : pourcentage
- Masquage : M1
- Point de méthode : indicateur distinct, avec son propre code et son propre libellé. Il ignore les fermetures et les blocages. Ne jamais laisser deux calculs différents porter le même nom.

### `ACT_ADR`
**Prix moyen journalier (ADR)**

- Formule : revenu hébergement / nuitées vendues
- Unité : GNF
- Masquage : M1
- Point favorable : aucune taxe n'étant appliquée, le montant de la réservation égale le revenu hébergement. Les ADR sont donc directement comparables aux référentiels du secteur, ce qui est rare.

### `ACT_REVPAR`
**Revenu par unité disponible (RevPAR)**

- Formule : revenu hébergement / unités disponibles, ce qui équivaut à `ACT_ADR` multiplié par `ACT_TAUX_OCCUPATION`
- Unité : GNF
- Masquage : M1

### `ACT_ALOS`
**Durée moyenne de séjour (ALOS)**

- Formule : médiane des nuits par réservation
- Unité : nuits, 1 décimale
- Masquage : M1

### `ACT_LEAD_TIME`
**Délai de réservation réalisé**

- Formule : médiane de (`date_arrivee` moins `date_reservation`)
- Unité : jours
- Masquage : M1
- Usage : comparé à `DEM_BOOKING_WINDOW`, il mesure l'écart entre intention et passage à l'acte.

### `ACT_TAUX_ANNULATION` et `ACT_TAUX_NON_PRESENTATION`
**Taux d'annulation et de non-présentation**

- Formule : annulations, ou non-présentations, / réservations confirmées
- Unité : pourcentage
- Masquage : M1

### `ACT_TAUX_CONVERSION`
**Taux de conversion recherche vers réservation**

- Formule : réservations rattachées à une recherche / volume de recherches
- Unité : pourcentage
- Masquage : minimum 100 recherches
- Piège : très bas tant que la couverture est faible. À présenter avec `OFF_TAUX_COUVERTURE` en regard, sans quoi il se lit comme une contre-performance commerciale.

---

## 8. Indicateurs de conformité (statut administratif)

Conteneur vide au lancement.

### `CONF_TAUX_ENREGISTREMENT`
**Taux d'enregistrement administratif**

- Formule : établissements avec enregistrement administratif / établissements recensés
- Unité : pourcentage

### `CONF_TAUX_CLASSIFICATION`
**Taux de classification**

- Formule : établissements classés / établissements recensés
- Unité : pourcentage

### `CONF_ECART_ENREGISTREMENT`
**Écart d'enregistrement**

Nombre d'établissements recensés sans enregistrement administratif connu.

- Unité : entier
- Piège politique : ne jamais présenter cet indicateur comme une dénonciation. Le libeller « établissements dont l'enregistrement n'est pas documenté », et non « établissements informels ». Les partenaires hôteliers doivent pouvoir lire l'Observatoire sans s'y sentir accusés.

---

## 9. Indicateurs événementiels (croisement `DECLARE`, `RECENSE`, `OBSERVE`)

### `EVE_CAPACITE_MOBILISABLE`
**Capacité mobilisable sur une fenêtre**

- Formule : capacité recensée du territoire moins la capacité déjà vendue chez les partenaires sur les dates
- Unité : unités
- Piège : la capacité des non-partenaires est théorique, leur disponibilité réelle étant inconnue. Afficher les deux composantes séparément.

### `EVE_CAPACITE_SALLES`
**Capacité de salles de réunion**

- Formule : nombre d'établissements disposant d'une salle, et somme des places, avec filtre par capacité minimale
- Unité : entier
- Usage : répond à la question d'un organisateur de sommet. Peu coûteux, très concret.

### `EVE_TAUX_TENSION_EVENEMENT`
**Tension sur la fenêtre événementielle**

- Formule : besoin déclaré / capacité mobilisable
- Unité : pourcentage
- Statut : `ESTIME`

---

## 10. Indicateurs de retombées (statut `ESTIME`)

Module à n'activer qu'après validation de la méthodologie.

### `RET_DEPENSE_HEBERGEMENT`
**Dépense d'hébergement observée**

- Formule : somme des revenus hébergement sur le périmètre partenaire
- Unité : GNF
- Masquage : M1

### `RET_DEPENSE_TOTALE_ESTIMEE`
**Dépense touristique totale estimée**

- Formule : `RET_DEPENSE_HEBERGEMENT` multipliée par un coefficient multiplicateur
- Unité : GNF
- Statut : `ESTIME`
- Exigences impératives : le coefficient et sa source sont affichés à l'écran, à côté du chiffre. Le mot « estimation » figure dans le titre du module.
- Piège : un chiffre de retombées repris dans un communiqué officiel puis contesté publiquement ferait plus de dégâts que l'absence du module. Ne pas l'activer avant que la méthode soit écrite et assumée.

---

## 11. Indicateurs de contexte

### `CTX_RECENSEMENT_PROGRESSION`
**Progression du recensement**

- Formule : fiches créées par semaine, par territoire et par source
- Unité : entier
- Usage : pilotage interne, mais publiable. Montrer à une institution la progression de l'inventaire national transforme un effort commercial en indicateur suivi conjointement.

### `CTX_FRAICHEUR_DONNEE`
**Fraîcheur de la donnée**

- Formule : date et heure du dernier rafraîchissement, par module
- Affichage : sur chaque bloc, non masquable

### `CTX_PERIMETRE`
**Périmètre observé**

Affiché en bandeau permanent : nombre d'établissements recensés, nombre de partenaires, part de la capacité couverte, date d'observation.

Ce bandeau n'est jamais masquable et est repris sur tous les exports.

---

## 12. Indicateurs explicitement écartés

À ne pas implémenter, même sur demande.

**Note ou score de qualité des établissements.** Classer est un pouvoir régalien. Un score maison mettrait Simandou Séjour en conflit simultané avec ses clients et avec l'État.

**Classement nominatif des établissements, quel qu'en soit le critère.** Occupation, prix, remplissage. Aucun établissement n'est jamais nommé dans un agrégat.

**Emplois directs déclarés par les établissements.** Très demandés, très mal déclarés, invérifiables. Si le sujet est incontournable, il relève de la famille `RET_` avec coefficient publié, jamais d'une collecte directe.

**Parts de marché entre plateformes.** Non mesurable de manière fiable et sans intérêt institutionnel.

**Tout indicateur financier propre à Simandou Séjour.** Commission, marge, revenu net. Le modèle de données ne prévoit d'ailleurs aucun champ pour les accueillir.

---

## 13. Points ouverts

1. Pondérations définitives de `OFF_COMPLETUDE_FICHE` et `MAT_INDICE`.
2. ~~Seuil de déclenchement de `TEN_FENETRES_SATURATION`.~~ **Clos par le document 15, section 2.**
3. Coefficient multiplicateur de `RET_DEPENSE_TOTALE_ESTIMEE` et sa source.
4. Règle de dédoublonnage par session pour `TEN_CAPACITE_MANQUANTE`.
5. Seuils chiffrés de bascule entre `CONSOLIDE`, `INDICATIF` et `SIGNAL` pour les indicateurs où ils ne sont pas encore fixés.

---

*Document 4 sur 12. Document précédent : modèle de données. Document suivant : plan de captation des données.*
