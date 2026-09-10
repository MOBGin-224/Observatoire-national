# Document 15. Module Synthèse et bandeau de périmètre

**Projet :** Observatoire National de l'Hospitalité Guinéenne
**Maître d'ouvrage :** SIMANDOU SEJOUR
**Version :** 1.0
**Statut :** Prescriptif. Amende les documents 3, 4, 7, 8, 9 bis, 10 et 12.

> **Objet.** Ce document répond aux quatre questions posées sur le module `M9_SYNTHESE`, corrige une proposition de modèle de données, et redéfinit le bandeau de périmètre en deux variantes.

---

## 1. Blocs clés du profil `ADMIN`

La section F.4 du document 9 bis couvre les cinq profils institutionnels et omet le profil interne. Lacune comblée ici.

**Décision.** `ADMIN` n'est ni un miroir de `TUTELLE`, ni un profil institutionnel. C'est un profil de pilotage interne. Sa synthèse mesure l'avancement et la qualité de l'inventaire, qui est le chantier déterminant du projet.

| Rang | Indicateur | Ce qu'il pilote |
|---|---|---|
| 1 | `OFF_ETAB_RECENSES` | Volume de l'inventaire |
| 2 | `OFF_CAPACITE_RECENSEE` | Capacité inventoriée |
| 3 | `CTX_RECENSEMENT_PROGRESSION` | Rythme de collecte |
| 4 | `OFF_TAUX_VERIFICATION` | Fiabilité de l'inventaire |
| 5 | `OFF_COMPLETUDE_FICHE` | Qualité documentaire |
| 6 | `OFF_TAUX_COUVERTURE` | Part commercialisée |
| 7 | `DEM_VOLUME_RECHERCHES` | Montée du signal de demande |
| 8 | `TEN_TAUX_INFRUCTUEUX` | Écart offre et demande |

Les cinq premiers mesurent l'avancement et la qualité du recensement. Les trois derniers indiquent si le signal de demande commence à monter.

### 1.1 Prévisualisation par profil

**Ajout non prévu par la fiche, à implémenter.**

Le profil `ADMIN` dispose d'un sélecteur « Voir comme », qui affiche l'écran exactement tel qu'un profil institutionnel le verra.

| Élément | Règle |
|---|---|
| Portée | Tous les modules, pas seulement la synthèse |
| Mode | Lecture seule stricte |
| Signalisation | Bandeau visible en permanence indiquant le mode et le profil simulé |
| Sortie | Un bouton de retour, toujours accessible |
| Traçabilité | L'entrée en prévisualisation écrit une ligne au journal |

**Pourquoi.** Cela ne contredit pas la règle d'absence de personnalisation, qui vise l'utilisateur institutionnel. C'est un outil de vérification.

Avant chaque démonstration, il faut pouvoir voir exactement ce que verra l'interlocuteur, pas une approximation. Un bloc masqué, une zone vide ou un module absent se découvrent en salle si personne ne les a vus avant.

**Interdit :** que la prévisualisation permette une action d'écriture, ou qu'elle donne accès à un module que le profil simulé n'a pas.

---

## 2. Seuil de `TEN_FENETRES_SATURATION`

Clôt le point ouvert 2 du document 4.

### 2.1 Décision

Une fenêtre de saturation est déclenchée sur un territoire lorsque **les deux conditions sont réunies** sur un même intervalle :

| Condition | Valeur |
|---|---|
| Part de `OFFRE_INDISPONIBLE` dans les recherches du territoire | Au moins 40 % |
| Nombre de recherches sur l'intervalle | Au moins 10 |

**Pourquoi deux conditions.** Sans plancher absolu, une recherche unique produirait 100 % et déclencherait une fenêtre. Sans part minimale, une saturation ponctuelle passerait pour structurelle.

**Pourquoi 40 %.** En dessous, il s'agit de friction normale : une personne cherche un week-end déjà complet. Au-dessus, le territoire ne suit plus la demande.

### 2.2 Règle d'agrégation, impérative

**L'agrégation se fait par semaine de `date_arrivee` souhaitée, jamais par semaine de date de recherche.**

Une fenêtre de saturation décrit **quand les gens veulent venir**, pas quand ils ont cherché. Regrouper par date de recherche produirait des fenêtres décalées de plusieurs semaines, sans rapport avec la période réellement saturée, et donc inexploitables.

C'est le point le plus facile à implémenter de travers, et l'erreur serait invisible à l'écran.

### 2.3 Fiabilité

| Recherches sur l'intervalle | Niveau |
|---|---|
| 10 à 29 | `INDICATIF` |
| 30 et plus | `CONSOLIDE` |
| Moins de 10 | Aucune fenêtre produite |

### 2.4 Amendement au document 4

Fiche `TEN_FENETRES_SATURATION`, remplacer la ligne de formule par :

> - Formule : semaines de `date_arrivee` souhaitée où la part de `OFFRE_INDISPONIBLE` atteint 40 % des recherches du territoire, avec au moins 10 recherches sur l'intervalle
> - Agrégation : par semaine de date d'arrivée souhaitée, jamais par date de recherche
> - Seuils : `INDICATIF` de 10 à 29 recherches, `CONSOLIDE` au delà
> - Piège : agréger par date de recherche décale les fenêtres de plusieurs semaines et les rend inexploitables

Le point ouvert 2 de la section 13 du document 4 est clos.

---

## 3. Descriptions des modules

Les onze phrases pour les cartes d'accès de la zone 4. À charger au document 10, clés `module.mX.description`.

Elles ne sont pas à rédiger : elles découlent des questions métier des documents 1, 9, 9 bis, 9 ter et 9 quater.

| Clé | Français | Anglais |
|---|---|---|
| `module.m1.description` | Ce que la Guinée compte en établissements d'hébergement, où, de quelle capacité, et quelle part en est réservable en ligne. | What Guinea has in accommodation establishments, where, at what capacity, and how much of it is bookable online. |
| `module.m2.description` | Qui cherche à venir en Guinée, depuis quel pays, vers quelle destination, à quelles dates et avec quel budget. | Who is looking to come to Guinea, from which country, to which destination, on what dates and with what budget. |
| `module.m3.description` | Ce qui se passe après la recherche : réservations, nuitées, taux d'occupation et prix moyens sur le périmètre commercialisé. | What happens after the search: bookings, room nights, occupancy and average rates across the commercialised scope. |
| `module.m4.description` | Où la demande s'exprime sans trouver d'offre, et de quelle nature est le manque. | Where demand goes unmet, and what kind of gap lies behind it. |
| `module.m5.description` | L'état d'enregistrement et de classification du parc d'hébergement. | Registration and classification status of the accommodation stock. |
| `module.m6.description` | Le degré de numérisation du secteur, établissement par établissement et territoire par territoire. | The sector's level of digitalisation, establishment by establishment and territory by territory. |
| `module.m7.description` | La capacité d'accueil mobilisable sur les dates d'un événement, et l'écart avec les besoins annoncés. | Accommodation capacity that can be mobilised for an event's dates, and the gap with declared needs. |
| `module.m8.description` | Estimation des retombées économiques de l'activité d'hébergement, méthode et coefficient publiés. | Estimated economic impact of accommodation activity, with published method and multiplier. |
| `module.m9.description` | L'essentiel du secteur en un écran, adapté à votre mandat. | The sector's essentials on one screen, tailored to your mandate. |
| `module.m10.description` | Comment chaque chiffre est produit, sur quel périmètre, avec quelles limites. | How each figure is produced, over what scope, and with what limitations. |
| `module.m11.description` | Saisie des données, gestion des accès et journal d'activité. | Data entry, access management and activity log. |

---

## 4. Sélecteurs de la synthèse : réalisation en deux temps

### 4.1 Décision

**La recommandation formulée est retenue.** Le module `M9_SYNTHESE` est construit au niveau national, sans sélecteur de période ni sélecteur de niveau géographique, et ceux-ci seront ajoutés lorsque les vues matérialisées auront leurs dimensions.

**Pourquoi.** Brancher les deux sélecteurs aujourd'hui produirait un écran qui se vide dès le premier changement de niveau, et une période sans effet sur la majorité des blocs. Ce serait exactement l'incohérence entre la synthèse et les modules d'origine que le critère F.10.3 interdit, et ce critère est bloquant.

Un écran de synthèse national et juste vaut mieux qu'un écran complet dont la moitié des cases se vident au premier clic.

### 4.2 Deux conditions

**Condition 1. L'absence de sélecteurs est explicite à l'écran.**

La barre de contrôle affiche la mention « Vue nationale ». Un utilisateur qui ne trouve pas le sélecteur de période doit comprendre qu'il n'existe pas, et non croire à un défaut d'affichage.

| Clé | Français | Anglais |
|---|---|---|
| `ctrl.vue_nationale` | Vue nationale | National view |

**Condition 2. L'écart est inscrit dans la fiche, pas seulement constaté.**

Les sections F.5 et F.6 du document 9 bis sont amendées pour décrire une réalisation en deux temps. Un écart non documenté devient un défaut au premier audit.

### 4.3 Amendement au document 9 bis, sections F.5 et F.6

À insérer avant la composition de l'écran :

> ### F.4 bis Réalisation en deux temps
>
> **Phase 1, actuelle.** Le module est construit au niveau national, sans sélecteur de période ni sélecteur de niveau géographique. La barre de contrôle affiche la mention « Vue nationale ». Cette limitation résulte de l'absence de dimension temporelle et territoriale dans les vues matérialisées agrégées.
>
> **Phase 2, ultérieure.** Les deux sélecteurs sont ajoutés lorsque les vues matérialisées disposent de leurs dimensions de période et de territoire. Cette évolution touche les huit modules et constitue un chantier à décider pour lui-même.
>
> **Le critère F.10.3 reste applicable en phase 1** : une valeur affichée en synthèse est identique à celle du module d'origine, au niveau national.

### 4.4 La reprise des vues est un chantier distinct

Donner aux vues matérialisées leurs dimensions de période et de territoire touche les huit modules concernés.

**Ce chantier se décide pour lui-même, pas comme préalable à un écran.** Il appelle sa propre estimation, son propre ordre de réalisation et sa propre recette.

---

## 5. Correction : table `indicateur_module`

### 5.1 La proposition de colonne `module` est incorrecte

Ajouter une colonne `module` à la table `indicateur` ne fonctionne pas : **un indicateur appartient à plusieurs modules.**

| Indicateur | Modules |
|---|---|
| `OFF_ETAB_RECENSES` | `M1`, `M5`, `M6`, `M7`, `M9` |
| `OFF_CAPACITE_RECENSEE` | `M1`, `M7`, `M9` |
| `OFF_COMPLETUDE_FICHE` | `M1`, `M5`, `M9` |
| `OFF_TAUX_VERIFICATION` | `M1`, `M5`, `M9` |
| `TEN_TAUX_INFRUCTUEUX` | `M4`, `M7`, `M9` |
| `MAT_INDICE` | `M6`, `M9` |
| `EVE_CAPACITE_SALLES` | `M7`, `M9` |

Une colonne unique n'en retiendrait qu'un et fausserait précisément le comptage recherché.

### 5.2 Structure retenue

**Table d'association `indicateur_module`.**

| Champ | Type | Note |
|---|---|---|
| `code_indicateur` | text, PK composite, FK vers `indicateur` | |
| `code_module` | text, PK composite, FK vers `enumeration` domaine `MODULE` | |
| `ordre` | integer | Rang d'affichage dans le module |
| `principal` | boolean | Vrai pour le module d'origine de l'indicateur |

Le champ `principal` distingue le module où l'indicateur est défini de ceux où il est repris. `OFF_ETAB_RECENSES` est principal dans `M1`, repris ailleurs.

### 5.3 Ce que cette table débloque

**Le nombre d'indicateurs par module**, pour les cartes de la zone 4 de la synthèse. C'est la demande initiale.

**Le champ « Modules où il apparaît »** de la fiche méthodologique du document 4, aujourd'hui marqué « Calculé » sans qu'aucune source ne l'alimente. Le module `M10_METHODO` en dépend.

**Le contrôle de cohérence** entre le dictionnaire des indicateurs et les écrans réellement construits. Un indicateur défini au document 4 mais rattaché à aucun module signale un oubli.

### 5.4 Amendement au document 3

Ajouter la table `indicateur_module` en section 11, après `version_indicateur`.

Migration de rang 10.

---

## 6. Bandeau de périmètre : deux variantes

### 6.1 Constat

Le bandeau actuel affiche, pour tous les profils :

> **Périmètre observé**
> Établissements recensés : 142
> dont partenaires : 33
> Capacité couverte : 21,3 %
> Données au 08/09/2026 23:04
> *Les indicateurs de conjoncture portent sur le périmètre observé et ne constituent pas une statistique nationale exhaustive.*

Deux de ces informations relèvent du pilotage interne de SIMANDOU SEJOUR plus que de l'information institutionnelle : le nombre de partenaires et la part de capacité couverte décrivent le portefeuille commercial de l'entreprise.

### 6.2 Ce qui ne peut pas disparaître

**La fonction du bandeau est la probité, pas la décoration.** Trois éléments restent présents pour tous les profils, sans exception.

| Élément | Raison |
|---|---|
| Taille du périmètre recensé | Sans elle, aucun chiffre n'est interprétable |
| Date et heure d'observation | Fraîcheur de la donnée |
| Mention de non-exhaustivité | C'est ce qui distingue l'Observatoire d'un acteur qui promet des chiffres nationaux qu'il n'a pas |

**La mention de non-exhaustivité renforce la position de l'entreprise, elle ne l'affaiblit pas.** Elle est non masquable et non paramétrable, quel que soit le profil.

### 6.3 Variante institutionnelle

Applicable aux profils `ATTRACTIVITE`, `INVESTISSEMENT`, `TUTELLE`, `BAILLEUR`, `EVENEMENTIEL`.

> **Périmètre observé**
> Établissements recensés : 142
> dont réservables en ligne : 47
> Territoires couverts : 9 communes sur 13
> Données au 08/09/2026 à 23:04
> *Les données portent sur le périmètre recensé ci-dessus et ne constituent pas une statistique nationale exhaustive.*

**Substitution 1 : « dont réservables en ligne » remplace « dont partenaires ».**

`OFF_TAUX_RESERVABILITE` compte tous les établissements disposant d'un canal de réservation en ligne, toutes plateformes confondues. C'est une mesure du secteur, pas du portefeuille de l'entreprise.

Elle dit la même chose sur l'état de numérisation du pays, sans révéler la part captée par Simandou Séjour.

**Substitution 2 : « Territoires couverts » remplace « Capacité couverte ».**

Nombre de territoires du niveau inférieur comportant au moins un établissement recensé, rapporté au total.

C'est une information de portée plus utile à une institution : elle indique quelle part du pays l'inventaire couvre. Une capacité couverte à 21,3 % ne lui apprend rien sur la représentativité de ce qu'elle consulte.

### 6.4 Variante interne

Applicable au seul profil `ADMIN`.

> **Périmètre observé**
> Établissements recensés : 142
> dont partenaires : 33
> Capacité couverte : 21,3 %
> Fiches vérifiées : 61 %
> Données au 08/09/2026 à 23:04
> *Les données portent sur le périmètre recensé ci-dessus et ne constituent pas une statistique nationale exhaustive.*

Ajout de `OFF_TAUX_VERIFICATION`, qui est un indicateur de pilotage du recensement.

**En mode prévisualisation** décrit en section 1.1, le bandeau bascule sur la variante institutionnelle. La prévisualisation doit montrer exactement ce que verra l'interlocuteur.

### 6.5 Ce que cette décision ne fait pas

**Elle ne masque pas `OFF_TAUX_COUVERTURE` aux institutions.**

Cet indicateur reste affiché dans le module `M1_OFFRE`, pour tous les profils, conformément au document 6.

**La différence tient au cadrage.** Dans le bandeau, la capacité couverte est un nombre brut, sans libellé explicatif, sans lien méthodologique, dans un espace où l'utilisateur ne cherche pas d'explication. Dans `M1_OFFRE`, elle porte son libellé complet, son statut de donnée, son niveau de fiabilité, et un lien vers sa fiche méthodologique qui précise qu'elle mesure la marge de progression du secteur et non la performance de l'entreprise.

Un même chiffre bien cadré informe, mal cadré interroge.

**Si vous souhaitez retirer cet indicateur de `M1_OFFRE` également**, c'est une décision distincte qui touche le document 6, et je la déconseille : une institution qui ne peut pas juger de la représentativité des données de performance ne peut pas les utiliser.

### 6.6 Libellés à ajouter au document 10

| Clé | Français | Anglais |
|---|---|---|
| `perimetre.reservables` | dont réservables en ligne : {n} | of which bookable online: {n} |
| `perimetre.territoires` | Territoires couverts : {n} sur {total} | Territories covered: {n} of {total} |
| `perimetre.verifiees` | Fiches vérifiées : {p} | Verified records: {p} |
| `perimetre.avertissement` | Les données portent sur le périmètre recensé ci-dessus et ne constituent pas une statistique nationale exhaustive. | The data covers the surveyed scope above and does not constitute exhaustive national statistics. |

Le libellé `perimetre.avertissement` remplace la formulation antérieure, qui employait le terme « indicateurs de conjoncture », peu lisible pour un lecteur non spécialiste.

### 6.7 Amendements

**Document 7, section 5.2.** Remplacer la description du bandeau par :

> ### 5.2 Bandeau de périmètre
>
> Présent en haut de chaque écran, **non masquable**, repris sur tous les exports.
>
> **Deux variantes.** Une variante institutionnelle, applicable aux cinq profils institutionnels, et une variante interne applicable au seul profil `ADMIN`. Leur composition est définie au document 15, section 6.
>
> **Trois éléments sont communs aux deux variantes et ne peuvent en aucun cas être retirés :** la taille du périmètre recensé, la date et l'heure d'observation, et la mention de non-exhaustivité.
>
> La variante institutionnelle ne comporte aucune donnée relative au portefeuille commercial de SIMANDOU SEJOUR.

**Document 8, section 5.4.** Ajouter que le composant accepte une variante déterminée par le profil du compte, et que les trois éléments communs ne sont jamais conditionnels.

**Document 6.** Ajouter la composition des deux variantes à la note de gouvernance remise aux institutions. Ce qu'une institution voit doit lui être déclaré.

**Document 12.** Ajouter les critères de recette suivants en section 2.5 :

> | S23a | La variante institutionnelle du bandeau ne comporte ni le nombre de partenaires ni la capacité couverte | Oui |
> | S23b | Les trois éléments communs sont présents dans les deux variantes | Oui |
> | S23c | En mode prévisualisation, le bandeau bascule sur la variante institutionnelle | Oui |

---

## 7. Points mineurs

### 7.1 `INS_DEFICIT` vide

Comportement normal tant qu'aucune demande institutionnelle n'est saisie. La table `demande_institutionnelle` s'alimente par saisie manuelle dans `M11_ADMIN`, canal C2 du document 5.

Aucune correction.

### 7.2 Repli de la zone 2 sur les tuiles territoriales

Conforme au document 3, qui impose que l'application fonctionne sans contour géographique.

Aucune correction.

---

## 8. Récapitulatif des amendements

| Document | Amendement |
|---|---|
| 3 | Ajout de la table `indicateur_module`, section 11, migration de rang 10 |
| 4 | Fiche `TEN_FENETRES_SATURATION` complétée. Point ouvert 2 clos |
| 6 | Composition des deux variantes de bandeau ajoutée à la note de gouvernance |
| 7 | Section 5.2 remplacée |
| 8 | Section 5.4 complétée sur les variantes du bandeau |
| 9 bis | Section F.4 complétée du profil `ADMIN`. Section F.4 bis ajoutée sur la réalisation en deux temps. Section 1.1 du présent document ajoutée sur la prévisualisation |
| 10 | Onze descriptions de module, quatre libellés de bandeau, `ctrl.vue_nationale` |
| 12 | Trois critères de recette S23a, S23b, S23c |

---

## 9. Ce qui reste ouvert

| Sujet | Effet |
|---|---|
| **Bornes de gamme tarifaire en GNF** | **Bloque le démarrage du recensement** |
| Dimensions de période et de territoire des vues matérialisées | Bloque la phase 2 de `M9`, chantier à décider pour lui-même |
| Confirmation MATD du découpage | Bloque la mise en production |
| Coefficient de retombées | Bloque l'activation de `M8` |

---

*Document 15. Amende les documents 3, 4, 6, 7, 8, 9 bis, 10 et 12.*
