# Document 9. Spécifications fonctionnelles par module

**Projet :** Observatoire National de l'Hospitalité Guinéenne
**Maître d'ouvrage :** SIMANDOU SEJOUR
**Version :** 1.0
**Statut :** Prescriptif. Une fiche par module.
**Prérequis :** documents 1 à 8.

> **Portée de cette version.** Ce document contient le cadre commun applicable à toutes les fiches, puis les fiches des trois modules prioritaires : `M1_OFFRE`, `M2_DEMANDE` et `M4_TENSION`. Ce sont les seuls modules qui ne dépendent pas du raccordement à la plateforme.
>
> **Les huit autres fiches existent.** Elles sont réparties dans trois documents complémentaires :
>
> - **9 bis** : `M9_SYNTHESE`, `M10_METHODO`, `M11_ADMIN`
> - **9 ter** : `M6_MATURITE`, `M7_EVENEMENTIEL`
> - **9 quater** : `M3_ACTIVITE`, `M5_CONFORMITE`, `M8_RETOMBEES`
>
> La partie A de ce document s'applique intégralement aux onze fiches.
>
> **Règle de référence.** Aucune formule n'est redéfinie ici. Les indicateurs sont désignés par leur code du document 4. Si un écran a besoin d'un indicateur absent du document 4, il ne s'affiche pas : le document 4 est modifié d'abord.

---

# Partie A. Cadre commun à toutes les fiches

## A.0 Périmètre applicatif

**L'application comporte deux surfaces, et deux seulement.**

| Surface | Contenu |
|---|---|
| Écran de connexion | Titre, accroche, formulaire, second facteur |
| Tableau de bord | Chrome, navigation latérale, écrans de modules |

**Il n'existe aucune partie publique.** Ne jamais créer de page d'accueil, de page de présentation, de section « à propos » ou « nos services », de page de contact, de pied de page institutionnel avec liens de navigation, de bandeau de cookies, de formulaire de contact, de tunnel d'inscription, de blog, d'actualités ni de documentation publique.

**Routage**

- La racine du domaine affiche l'écran de connexion.
- Toute adresse consultée sans session valide redirige vers l'écran de connexion.
- Après authentification, l'utilisateur atterrit directement sur `M9_SYNTHESE`.
- Seules exceptions accessibles sans session : connexion, second facteur, réinitialisation de mot de passe.

### Écran de connexion

**Révisé le 9 septembre 2026.** La prescription d'origine (« écran unique, centré, sobre, fond clair, aucune image d'illustration ») produisait un écran sans qualité, et la maîtrise d'ouvrage a demandé sa refonte. Ce qui change et ce qui ne change pas :

| | |
|---|---|
| **Change** | Composition en deux volets. Volet de marque à gauche, sur aplat `--color-primary-900`, portant le titre, l'accroche et une composition graphique. Volet clair à droite, portant le formulaire |
| **Ne change pas** | Le contenu, au mot près. Titre, accroche, mention d'accès réservé, formulaire, mot de passe oublié, mention d'attribution. **Rien n'a été ajouté** |
| **Ne change pas** | Aucune animation |
| **Ne change pas** | Aucun lien ne quitte l'écran, hormis la réinitialisation de mot de passe |
| **Ne change pas** | Aucune partie publique, aucun contenu descriptif ou marketing du produit |

**La composition est tracée en SVG, jamais une photographie.** Trois raisons, aucune n'est esthétique : le poids d'une image pénalise la connexion à faible débit visée par la section 9 du document 8 ; une photographie pose une question de droits sur un outil destiné à des institutions ; et un tracé vectoriel reste net à toutes les tailles et se recolore par les jetons de la charte.

Sujet retenu : quatre plans de relief sous un ciel de courbes de niveau et d'une trame de points de mesure. **La deuxième crête porte ses points de mesure et son sommet marqué** : on lit un paysage, puis on reconnaît une courbe. C'est ce que fait l'Observatoire, regarder un territoire et en tirer une mesure.

Deux voiles dégradés, posés sur le volet et non dans le tracé, garantissent la lisibilité du titre en haut et de l'accroche en bas quelle que soit la hauteur de la fenêtre. Posés dans le tracé, ils suivraient le recadrage et rateraient leur cible.

En dessous de 1024 px, le volet de marque disparaît et le titre revient au-dessus du formulaire : le document 8 borne l'outil à l'ordinateur et à la tablette, et un volet décoratif empilé au-dessus d'un formulaire ne sert personne.

La maquette ci-dessous reste la référence du **contenu** ; elle ne décrit plus la disposition.

```
+----------------------------------------------------------+
|                                                          |
|            Observatoire National                         |
|            de l'Hospitalité Guinéenne                    |
|                                                          |
|            Mesurer l'offre.                              |
|            Comprendre la demande.                        |
|            Éclairer la décision.                         |
|                                                          |
|            Accès réservé aux institutions.   |
|                                                          |
|            [ Adresse professionnelle          ]          |
|            [ Mot de passe                     ]          |
|            [          Se connecter            ]          |
|                                                          |
|            Mot de passe oublié                           |
|                                                          |
|            Une infrastructure Simandou Séjour            |
|                                                          |
+----------------------------------------------------------+
```

Aucun lien ne quitte cet écran, hormis la réinitialisation de mot de passe. Pas de lien vers simandousejour.com, pas de mention légale déployée, pas de sélecteur de langue avant connexion : la langue est celle du compte.

Le message affiché en cas de tentative sans compte renvoie au point focal, jamais à un formulaire d'inscription. Voir `auth.pas_de_compte` au document 10.

## A.1 Structure d'écran invariante

Tout écran de module respecte la même ossature.

```
+----------------------------------------------------------------------+
| EN-TÊTE                                                              |
| Observatoire National de l'Hospitalité Guinéenne                     |
| logo institution · nom du compte · langue · déconnexion              |
+----------------------------------------------------------------------+
| BANDEAU DE PÉRIMÈTRE (non masquable)                                 |
| N établissements recensés · N partenaires · X % de capacité couverte |
| Données au JJ/MM/AAAA à HH:MM                                        |
+-------------+--------------------------------------------------------+
|             | BARRE DE CONTRÔLE (collante)                           |
| NAVIGATION  | [Niveau géographique] [Période] [Filtres] [Exporter]   |
| LATÉRALE    +--------------------------------------------------------+
| permanente  |                                                        |
| 240 px      | ZONE DE CONTENU                                        |
|             | Blocs d'indicateurs, graphiques, carte, tableaux       |
| Module actif|                                                        |
| en évidence |                                                        |
+-------------+--------------------------------------------------------+
```

## A.2 Barre de contrôle

**Sélecteur de niveau géographique.** Mécanisme unique de navigation territoriale. National, puis région, puis préfecture, puis commune. Fil d'Ariane cliquable pour remonter. Aucun autre filtre géographique n'existe sur aucun écran.

**Sélecteur de période.** Valeurs : 7 jours, 30 jours, 90 jours, 12 mois, période personnalisée. Défaut : 30 jours. Les modules d'inventaire, qui décrivent un état et non un flux, n'affichent pas ce sélecteur.

**Filtres de module.** Propres à chaque module, décrits dans sa fiche.

**Bouton d'export.** Un seul par écran. PDF et image.

## A.3 Comportement au changement de niveau géographique

Toute la zone de contenu se recalcule. Le fil d'Ariane s'allonge. Les filtres de module sont conservés. La période est conservée.

Lorsqu'un indicateur devient masqué en descendant d'un niveau, le bloc bascule en état 4 sans disparaître. **Un bloc ne disparaît jamais de la mise en page.** Il change d'état.

## A.4 Les cinq états, rappel opérationnel

Toute zone affichant une donnée implémente les cinq états du document 8.

| État | Déclencheur | Traitement |
|---|---|---|
| 1. Chargement | Requête en cours | Squelette aux dimensions finales |
| 2. Données présentes | Cas nominal | Affichage |
| 3. Données vides | Requête aboutie, aucun résultat | Phrase explicative, jamais zéro ni tiret |
| 4. Données masquées | Seuil de confidentialité atteint | Libellé invariable, traitement neutre |
| 5. Erreur | Échec technique | Message court, action de reprise |

Libellé invariable de l'état 4 :

> Non publié : effectif insuffisant pour préserver la confidentialité des établissements.

## A.5 Éléments présents sur tout bloc de donnée

- Badge de statut de donnée
- Badge de niveau de fiabilité
- Horodatage de fraîcheur
- Lien vers la fiche méthodologique de l'indicateur

## A.6 Format des critères d'acceptation

Chaque fiche se termine par des critères vérifiables sans lire de code. Un critère se teste par une action et une observation.

---

# Partie B. Fiche module `M1_OFFRE`

## B.1 Identité

| Attribut | Valeur |
|---|---|
| Code | `M1_OFFRE` |
| Libellé | Offre nationale d'hébergement |
| Statut de donnée dominant | `RECENSE` |
| Profils | `ATTRACTIVITE`, `INVESTISSEMENT`, `TUTELLE`, `BAILLEUR`, `EVENEMENTIEL` |
| Sélecteur de période | Non. Ce module décrit un état, pas un flux |
| Priorité de développement | 1 |

## B.2 Question métier

Quelle est l'offre d'hébergement existant en Guinée, où se trouve-t-elle, de quelle nature, de quelle capacité, et quelle part en est réellement réservable en ligne.

## B.3 Pourquoi ce module est prioritaire

Il ne dépend ni des ventes de Simandou Séjour ni du raccordement à la plateforme. Il repose entièrement sur le recensement. C'est le seul module qui peut être pleinement fonctionnel dès le lancement, et c'est la base de tous les autres.

## B.4 Indicateurs affichés

| Zone | Indicateurs |
|---|---|
| Blocs clés | `OFF_ETAB_RECENSES`, `OFF_CAPACITE_RECENSEE`, `OFF_ETAB_PARTENAIRES`, `OFF_TAUX_COUVERTURE`, `OFF_TAUX_NUMERISATION`, `OFF_TAUX_RESERVABILITE`, `OFF_TAUX_VERIFICATION`, `OFF_COMPLETUDE_FICHE` |
| Carte | `OFF_ETAB_RECENSES` et `OFF_CAPACITE_RECENSEE` par territoire |
| Répartitions | `OFF_REPARTITION_TYPOLOGIE`, `OFF_REPARTITION_GAMME` |
| Tableau territorial | Ensemble des indicateurs `OFF_` par territoire enfant |
| Qualité de l'inventaire | `OFF_TAUX_VERIFICATION`, `OFF_COMPLETUDE_FICHE`, `OFF_ECART_LISTE_ADMIN` |

## B.5 Composition de l'écran

```
+----------------------------------------------------------------------+
| [Niveau : National ▾]  [Typologie ▾] [Gamme ▾] [Statut ▾]  [Export]  |
+----------------------------------------------------------------------+
| Z1  Blocs clés, 8 sur une ligne en 1440 px                           |
| [Établ.] [Capacité] [Partenaires] [Couverture]                       |
| [Numérisation] [Réservabilité] [Vérification] [Complétude]           |
+---------------------------------------+------------------------------+
| Z2  Carte de densité                  | Z3  Répartitions             |
| 2/3 de largeur                        | Typologie, barres            |
| Clic pour descendre d'un niveau       | Gamme, barres                |
+---------------------------------------+------------------------------+
| Z4  Tableau des territoires enfants                                  |
| Territoire · Établ. · Capacité · Partenaires · Couverture ·          |
| Numérisation · Réservabilité · Vérification                          |
+----------------------------------------------------------------------+
| Z5  Qualité de l'inventaire                                          |
| Complétude moyenne · Fiches vérifiées · Écart liste administrative   |
+----------------------------------------------------------------------+
```

## B.6 Filtres de module

| Filtre | Valeurs | Défaut |
|---|---|---|
| Typologie | Multi-sélection sur `TYPOLOGIE` | Toutes |
| Gamme tarifaire | Multi-sélection sur `GAMME` | Toutes |
| Statut de relation | Tous, recensés seuls, partenaires seuls | Tous |

Le filtre de statut de relation est le plus important de l'écran. Il permet de passer de la lecture « offre nationale » à la lecture « offre commercialisée ».

## B.7 Comportements attendus

**Carte.** Clic sur un territoire pour descendre d'un niveau. Territoires sans donnée hachurés, jamais colorés en clair. Si le contour d'un territoire est absent, un point au centroïde est affiché. **L'écran doit rester utilisable sans aucun contour**, situation qui sera celle du lancement.

**Tableau.** Tri sur toute colonne. Clic sur une ligne pour descendre d'un niveau. Aucune pagination en dessous de 50 lignes.

**Blocs clés.** Aucun bloc ne disparaît lors d'un changement de filtre ou de niveau. Il bascule en état 3 ou 4.

## B.8 États par zone

| Zone | État 3, vide | État 4, masqué |
|---|---|---|
| Z1 blocs | « Aucun établissement recensé sur ce territoire. » | Sans objet, volumes bruts toujours affichés |
| Z2 carte | Carte affichée, tous territoires hachurés, légende « Aucune donnée » | Sans objet |
| Z3 répartitions | « Aucun établissement à répartir. » | Sans objet |
| Z4 tableau | « Ce territoire n'a pas de subdivision référencée. » | Sans objet |
| Z5 qualité | « Aucune fiche à évaluer. » | Sans objet |

**Aucun indicateur de ce module n'est soumis à la règle M1.** Ce sont des volumes et des ratios d'inventaire, non des données de performance commerciale. Tout s'affiche, y compris à zéro.

## B.9 Ce que l'écran ne fait jamais

- Nommer un établissement.
- Afficher une liste d'établissements.
- Permettre une recherche par nom d'établissement.
- Afficher une donnée de performance ou de prix pratiqué par établissement.

## B.10 Critères d'acceptation

1. Sur un territoire sans aucun établissement, les blocs affichent zéro et non un tiret ni une zone blanche.
2. Le filtre de statut de relation modifie tous les blocs, la carte, les répartitions et le tableau de manière cohérente.
3. La suppression de tous les contours géographiques n'empêche pas l'affichage de la carte, qui se rabat sur les centroïdes.
4. Le clic sur un territoire de la carte et le clic sur une ligne du tableau produisent le même résultat.
5. Aucun nom d'établissement n'apparaît nulle part sur l'écran, y compris dans une infobulle.
6. Le bandeau de périmètre reste visible après défilement.
7. Le passage du français à l'anglais ne laisse subsister aucune chaîne française.
8. L'export PDF reproduit les cinq zones avec le bandeau de périmètre et la référence unique.
9. En 1024 px de large, aucun défilement horizontal n'apparaît sur le tableau.
10. La somme des capacités du tableau territorial égale la capacité affichée dans le bloc clé.

---

# Partie C. Fiche module `M2_DEMANDE`

## C.1 Identité

| Attribut | Valeur |
|---|---|
| Code | `M2_DEMANDE` |
| Libellé | Demande exprimée |
| Statut de donnée dominant | `EXPRIME` |
| Profils | `ATTRACTIVITE`, `INVESTISSEMENT`, `TUTELLE`, `BAILLEUR` |
| Sélecteur de période | Oui |
| Priorité de développement | 2 |

## C.2 Question métier

Qui cherche à venir en Guinée, depuis quel pays, vers quelle destination, à quelles dates, pour quelle durée et avec quel budget.

## C.3 Pourquoi ce module compte

C'est la donnée que Simandou Séjour est seule à pouvoir produire dans le pays. Aucune institution guinéenne ne dispose d'une mesure de l'intention de séjour. C'est l'actif différenciant de l'Observatoire.

## C.4 Indicateurs affichés

| Zone | Indicateurs |
|---|---|
| Blocs clés | `DEM_VOLUME_RECHERCHES`, `DEM_BOOKING_WINDOW`, `DEM_DUREE_SEJOUR_RECHERCHEE`, `DEM_BUDGET_RECHERCHE` |
| Carte des destinations | `DEM_DESTINATIONS_TOP` |
| Origine | `DEM_ORIGINE_PAYS` |
| Saisonnalité | `DEM_SAISONNALITE`, enrichie du calendrier événementiel |
| Contexte d'usage | `DEM_REPARTITION_APPAREIL`, `DEM_REPARTITION_CANAL` |
| Signal | `DEM_DESTINATIONS_NON_RECONNUES` |

## C.5 Composition de l'écran

```
+----------------------------------------------------------------------+
| [Niveau ▾] [Période : 30 jours ▾] [Motif ▾] [Typologie ▾] [Export]   |
+----------------------------------------------------------------------+
| Z1  Blocs clés                                                       |
| [Recherches] [Délai de projection] [Durée souhaitée] [Budget médian] |
+---------------------------------------+------------------------------+
| Z2  Carte des destinations recherchées| Z3  Origine des connexions   |
| Densité par territoire                | Barres horizontales, pays    |
+---------------------------------------+------------------------------+
| Z4  Saisonnalité de l'intention                                      |
| Courbe par mois d'arrivée souhaitée, événements en repères verticaux |
+---------------------------------------+------------------------------+
| Z5  Contexte d'usage                  | Z6  Destinations hors        |
| Appareil, canal                       |     référentiel              |
+---------------------------------------+------------------------------+
```

## C.6 Filtres de module

| Filtre | Valeurs | Défaut |
|---|---|---|
| Motif de séjour | Multi-sélection sur `MOTIF_SEJOUR` | Tous |
| Typologie recherchée | Multi-sélection sur `TYPOLOGIE` | Toutes |
| Canal | Multi-sélection sur `CANAL` | Tous |

## C.7 Comportements attendus

**La carte est construite sur la destination recherchée, jamais sur l'origine de la connexion.** C'est le point de méthode le plus important de ce module. La destination est saisie par l'utilisateur, elle est donc fiable. La géolocalisation par adresse réseau ne l'est qu'au niveau du pays.

**Zone 3.** Intitulée « Origine des connexions », jamais « Origine des voyageurs ». Aucune granularité inférieure au pays n'est proposée, sous aucun profil.

**Zone 4.** Les événements du calendrier apparaissent en repères verticaux sur la courbe, avec leur libellé en infobulle. Une courbe de demande sans contexte n'explique rien.

**Bloc budget.** Affiche systématiquement, sous la valeur, la part des recherches ayant utilisé le filtre budget. Une médiane calculée sur 12 % des recherches ne décrit pas le marché.

**Délai de projection et durée de séjour.** Médianes, jamais moyennes. Le libellé affiche le mot « médian ».

## C.8 États par zone

| Zone | État 3, vide | État 4, masqué |
|---|---|---|
| Z1 recherches | Affiche zéro | Sans objet |
| Z1 délai, durée | « Pas encore assez de recherches pour calculer une médiane. » | Sans objet |
| Z1 budget | « Aucune recherche avec filtre budget sur la période. » | Moins de 10 recherches avec filtre |
| Z2 carte | Carte hachurée, légende « Aucune recherche sur la période » | Sans objet |
| Z3 origine | « Aucune connexion enregistrée sur la période. » | Sans objet |
| Z4 saisonnalité | « L'historique est encore trop court pour dégager une saisonnalité. » | Sans objet |
| Z6 hors référentiel | « Aucune destination hors référentiel sur la période. » | Sans objet |

**État attendu au lancement.** L'historique étant nul au démarrage de la journalisation, ce module affichera pendant plusieurs semaines des volumes très faibles et une zone 4 vide. C'est prévu. Les libellés d'état vide sont rédigés pour l'exprimer sans donner l'impression d'un dysfonctionnement.

## C.9 Ce que l'écran ne fait jamais

- Afficher une localisation d'utilisateur plus fine que le pays.
- Afficher une donnée individuelle de session ou de visiteur.
- Présenter l'origine des connexions comme l'origine des voyageurs.
- Calculer une moyenne là où le document 4 prescrit une médiane.

## C.10 Critères d'acceptation

1. Avec zéro recherche enregistrée, l'écran s'affiche entièrement, sans erreur, avec ses six zones en état 3.
2. Le bloc budget affiche la part des recherches ayant utilisé le filtre.
3. Les blocs de délai et de durée portent le mot « médian » dans leur libellé.
4. La carte se recalcule sur la destination recherchée, vérifiable en comparant avec la zone 3 qui doit donner une répartition différente.
5. Aucun niveau géographique inférieur au pays n'est proposé sur la zone 3.
6. Les événements du calendrier apparaissent sur la courbe de saisonnalité et leur libellé est lisible en infobulle.
7. Le changement de période recalcule les six zones.
8. Une recherche sur une localité inconnue apparaît en zone 6 dans les cinq minutes.
9. L'export PDF conserve les repères d'événements de la zone 4.
10. Le passage du français à l'anglais ne laisse subsister aucune chaîne française.

---

# Partie D. Fiche module `M4_TENSION`

## D.1 Identité

| Attribut | Valeur |
|---|---|
| Code | `M4_TENSION` |
| Libellé | Tension et déficit d'offre |
| Statut de donnée dominant | Croisement `EXPRIME` et `RECENSE` |
| Profils | `ATTRACTIVITE`, `INVESTISSEMENT`, `TUTELLE`, `BAILLEUR`, `EVENEMENTIEL` |
| Sélecteur de période | Oui |
| Priorité de développement | 3 |

## D.2 Question métier

Où une demande s'exprime-t-elle sans trouver d'offre, et de quelle nature est le manque : absence d'établissements, absence de numérisation, ou saturation de la capacité existante.

## D.3 Pourquoi ce module est le plus important

C'est le seul écran de l'outil qui produit directement du pipeline d'investissement. Il transforme une donnée d'usage en information de politique publique. Il sépare trois problèmes qui appellent trois réponses différentes.

| État d'échec | Ce qui manque | Qui doit agir |
|---|---|---|
| `AUCUNE_OFFRE` | Des établissements | Investisseurs |
| `NON_RESERVABLE` | De la numérisation | Opérateurs et programmes d'appui |
| `OFFRE_INDISPONIBLE` | De la capacité additionnelle | Investisseurs et exploitants |

## D.4 Indicateurs affichés

| Zone | Indicateurs |
|---|---|
| Blocs clés | `TEN_TAUX_INFRUCTUEUX`, `TEN_CAPACITE_MANQUANTE`, `TEN_INDICE_TENSION` |
| Nature des échecs | `TEN_REPARTITION_ECHEC` |
| Carte de tension | `TEN_INDICE_TENSION` par territoire |
| Classement | `TEN_CLASSEMENT_DEFICIT`, enrichi de l'accessibilité |
| Fenêtres | `TEN_FENETRES_SATURATION` |

## D.5 Composition de l'écran

```
+----------------------------------------------------------------------+
| [Niveau ▾] [Période ▾] [Nature de l'échec ▾] [Gamme ▾]     [Export]  |
+----------------------------------------------------------------------+
| Z1  Blocs clés                                                       |
| [Taux infructueux] [Capacité manquante] [Indice de tension]          |
+----------------------------------------------------------------------+
| Z2  Nature des recherches infructueuses                              |
| Barres empilées : aucune offre / non réservable / indisponible       |
+---------------------------------------+------------------------------+
| Z3  Carte de tension                   | Z4  Fenêtres de saturation  |
| Échelle neutre vers orange             | Plages de dates par         |
| Territoires sans donnée hachurés       | territoire                  |
+---------------------------------------+------------------------------+
| Z5  Territoires en déficit d'offre                                   |
| Territoire · Recherches · Échecs · Capacité manquante ·              |
| Distance Conakry · Temps de trajet · Praticabilité saison des pluies |
+----------------------------------------------------------------------+
```

## D.6 Filtres de module

| Filtre | Valeurs | Défaut |
|---|---|---|
| Nature de l'échec | Multi-sélection sur les quatre états d'échec | Tous |
| Gamme recherchée | Multi-sélection sur `GAMME` | Toutes |
| Motif de séjour | Multi-sélection sur `MOTIF_SEJOUR` | Tous |

## D.7 Comportements attendus

**Zone 2, la plus importante de l'outil.** Les trois natures d'échec sont toujours distinguées visuellement, jamais agrégées en un total unique. Le libellé de chaque segment énonce ce qui manque, pas seulement l'état technique.

**Zone 5, l'accessibilité en regard.** Chaque ligne du classement affiche la distance à Conakry, le temps de trajet et la praticabilité en saison des pluies. Un déficit à onze heures de route impraticable six mois par an et un déficit à trois heures n'appellent pas la même réponse. Sans ces colonnes, le classement produit un ordre que personne ne sait interpréter.

**Indice de tension indéfini.** Sur un territoire à capacité réservable nulle, le rapport est indéfini. **Ne jamais afficher l'infini.** Le bloc bascule sur `TEN_CAPACITE_MANQUANTE` avec la mention « Capacité réservable nulle sur ce territoire ».

**Usage de l'orange.** `--color-alert` apparaît sur cet écran et sur lui presque exclusivement. C'est ce qui le rend lisible. Aucun bouton, aucun en-tête, aucune icône décorative de cet écran n'utilise cette couleur.

**Zone 4.** Rapprochement automatique avec le calendrier événementiel. Une fenêtre de saturation coïncidant avec un événement affiche son libellé.

## D.8 États par zone

| Zone | État 3, vide | État 4, masqué |
|---|---|---|
| Z1 taux infructueux | « Aucune recherche enregistrée sur la période. » | Sans objet |
| Z1 capacité manquante | « Moins de 10 recherches en échec, estimation non produite. » | Moins de 10 recherches en échec |
| Z1 indice de tension | « Capacité réservable nulle sur ce territoire. » | Moins de 15 recherches |
| Z2 nature des échecs | « Aucune recherche infructueuse sur la période. » | Sans objet |
| Z3 carte | Carte hachurée, légende « Aucune tension mesurée » | Sans objet |
| Z4 fenêtres | « Aucune fenêtre de saturation détectée. » | Sans objet |
| Z5 classement | « Aucun territoire en déficit sur la période. » | Sans objet |

**Point à ne pas contourner.** Au lancement, `TEN_TAUX_INFRUCTUEUX` sera très élevé, probablement au-dessus de 70 %. Ne pas le masquer, ne pas le lisser, ne pas le contextualiser par un message d'excuse. C'est la démonstration du problème que l'entreprise existe pour résoudre.

## D.9 Ce que l'écran ne fait jamais

- Agréger les quatre états d'échec en un total unique sans détail.
- Afficher un indice de tension infini ou une division par zéro.
- Afficher un classement de déficit sans les colonnes d'accessibilité.
- Utiliser `--color-alert` pour un élément d'interface non lié à la tension.
- Masquer ou atténuer un taux d'échec élevé.

## D.10 Critères d'acceptation

1. Sur un territoire sans capacité réservable, l'indice de tension n'affiche ni infini ni erreur, mais le message prévu.
2. Les quatre états d'échec sont distinguables visuellement et par leur libellé dans la zone 2.
3. Chaque ligne de la zone 5 affiche les trois colonnes d'accessibilité, ou la mention « non renseigné » si `territoire_accessibilite` est vide.
4. Le filtre de nature d'échec modifie de manière cohérente les blocs, la carte et le classement.
5. Une inspection de l'écran ne révèle aucune occurrence de `--color-alert` hors des éléments de tension.
6. Une fenêtre de saturation coïncidant avec un événement du calendrier affiche son libellé.
7. Avec moins de 10 recherches en échec, la capacité manquante n'est pas produite et le message prévu s'affiche.
8. Le taux infructueux s'affiche même au-dessus de 90 %, sans avertissement ni atténuation.
9. Le clic sur une ligne du classement descend d'un niveau géographique.
10. L'export PDF conserve l'échelle de couleur de la carte et les colonnes d'accessibilité.

---

# Partie E. Les huit autres fiches

Les onze modules sont spécifiés. Les huit fiches non contenues dans ce document se trouvent dans les documents complémentaires suivants, qui appliquent le même format et le même cadre commun.

| Module | Document | Partie |
|---|---|---|
| `M9_SYNTHESE` | 9 bis | F |
| `M10_METHODO` | 9 bis | G |
| `M11_ADMIN` | 9 bis | H |
| `M6_MATURITE` | 9 ter | I |
| `M7_EVENEMENTIEL` | 9 ter | J |
| `M3_ACTIVITE` | 9 quater | K |
| `M5_CONFORMITE` | 9 quater | L |
| `M8_RETOMBEES` | 9 quater | M |

Ordre de développement recommandé :

| Rang | Module | Motif |
|---|---|---|
| 1 | `M11_ADMIN` | Back-office de saisie. Sans lui, aucune donnée n'entre |
| 2 | `M1_OFFRE` | Premier module de restitution |
| 3 | `M2_DEMANDE` | |
| 4 | `M4_TENSION` | |
| 5 | `M9_SYNTHESE` | Écran d'atterrissage |
| 6 | `M10_METHODO` | Aucune dépendance de données, coût faible, forte valeur institutionnelle |
| 7 | `M6_MATURITE` | Dérivé du recensement |
| 8 | `M7_EVENEMENTIEL` | |
| 9 | `M5_CONFORMITE` | Zones 4 et 5 fonctionnelles dès le recensement |
| 10 | `M3_ACTIVITE` | Attend le raccordement à la plateforme |
| 11 | `M8_RETOMBEES` | Désactivé tant que la méthodologie n'est pas validée |

---

## Points ouverts

1. Comportement du fil d'Ariane à Conakry, qui n'a pas de niveau préfectoral.
2. Seuil de déclenchement d'une fenêtre de saturation.
3. Faut-il permettre la comparaison de deux territoires côte à côte sur un même écran.
4. Nombre de lignes affichées par défaut dans le classement de déficit.

---

*Document 9 sur 12. Document précédent : système de design et charte visuelle. Document suivant : charte des libellés bilingue.*
