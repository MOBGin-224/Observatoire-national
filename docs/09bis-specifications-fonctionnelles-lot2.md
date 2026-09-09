# Document 9 bis. Spécifications fonctionnelles, lot 2

**Projet :** Observatoire National de l'Hospitalité Guinéenne
**Maître d'ouvrage :** SIMANDOU SEJOUR
**Version :** 1.0
**Statut :** Prescriptif. Complète le document 9.
**Prérequis :** documents 1 à 12, et document 9 partie A.

> **Portée.** Fiches des modules `M9_SYNTHESE`, `M10_METHODO` et `M11_ADMIN`.
>
> Le cadre commun de la partie A du document 9 s'applique intégralement : structure d'écran, barre de contrôle, cinq états, éléments présents sur tout bloc de donnée.
>
> **Rappel.** Aucun indicateur n'est défini ici. Tous proviennent du document 4. Aucun libellé n'est inventé : ils proviennent du document 10.

---

# Partie F. Fiche module `M9_SYNTHESE`

## F.1 Identité

| Attribut | Valeur |
|---|---|
| Code | `M9_SYNTHESE` |
| Libellé | Synthèse institutionnelle |
| Statut de donnée | Multiple, chaque bloc porte le sien |
| Profils | Tous |
| Sélecteur de période | Oui |
| Écran d'atterrissage après connexion | Oui |
| Priorité de développement | Haute |

## F.2 Question métier

En un écran, où en est le secteur de l'hébergement en Guinée sur le périmètre consulté.

## F.3 Nature particulière de ce module

**Cet écran ne produit aucun indicateur qui lui soit propre.** Il agrège des indicateurs définis dans les autres modules et les présente en un seul écran.

C'est l'écran qui sera projeté dans des réunions où Simandou Séjour n'est pas présent. Chaque projection porte le nom de l'entreprise. Il est donc le plus exposé et le plus soigné.

**Règle de cohérence absolue :** une valeur affichée ici est strictement identique à celle affichée dans son module d'origine, au même périmètre et à la même période, y compris dans son état de masquage. Une divergence entre les deux écrans est un défaut bloquant.

## F.4 Composition par profil

Huit blocs clés, sélectionnés selon le profil. Un bloc dont le module d'origine n'est pas autorisé pour le profil n'apparaît jamais.

### Profil `ATTRACTIVITE`

`OFF_ETAB_RECENSES`, `OFF_CAPACITE_RECENSEE`, `OFF_TAUX_COUVERTURE`, `MAT_INDICE`, `DEM_VOLUME_RECHERCHES`, `DEM_BOOKING_WINDOW`, `TEN_TAUX_INFRUCTUEUX`, `TEN_CAPACITE_MANQUANTE`

### Profil `INVESTISSEMENT`

`OFF_ETAB_RECENSES`, `OFF_CAPACITE_RECENSEE`, `OFF_TAUX_RESERVABILITE`, `MAT_INDICE`, `DEM_VOLUME_RECHERCHES`, `TEN_CAPACITE_MANQUANTE`, `TEN_TAUX_INFRUCTUEUX`, `INS_DEFICIT`

### Profil `TUTELLE`

`OFF_ETAB_RECENSES`, `OFF_CAPACITE_RECENSEE`, `OFF_TAUX_NUMERISATION`, `OFF_TAUX_RESERVABILITE`, `OFF_TAUX_VERIFICATION`, `OFF_COMPLETUDE_FICHE`, `CONF_TAUX_ENREGISTREMENT`, `CONF_TAUX_CLASSIFICATION`

### Profil `BAILLEUR`

`OFF_ETAB_RECENSES`, `OFF_CAPACITE_RECENSEE`, `OFF_TAUX_NUMERISATION`, `MAT_INDICE`, `OFF_TAUX_VERIFICATION`, `DEM_VOLUME_RECHERCHES`, `TEN_TAUX_INFRUCTUEUX`, `TEN_CAPACITE_MANQUANTE`

### Profil `EVENEMENTIEL`

`OFF_ETAB_RECENSES`, `OFF_CAPACITE_RECENSEE`, `EVE_CAPACITE_MOBILISABLE`, `EVE_CAPACITE_SALLES`, `TEN_TAUX_INFRUCTUEUX`, `TEN_FENETRES_SATURATION`

Six blocs seulement pour ce profil, qui est le plus restreint. Ne pas compléter artificiellement jusqu'à huit.

## F.5 Composition de l'écran

```
+----------------------------------------------------------------------+
| [Niveau ▾] [Période ▾]                                    [Export]   |
+----------------------------------------------------------------------+
| Z1  Blocs clés, 8 sur une ligne en 1440 px, 4 par ligne en 1024 px   |
+---------------------------------------+------------------------------+
| Z2  Carte du périmètre                | Z3  Deux graphiques empilés  |
| Densité d'établissements recensés     | Évolution des recherches     |
| Clic pour descendre d'un niveau       | Nature des échecs            |
+---------------------------------------+------------------------------+
| Z4  Accès aux modules                                                |
| Cartes de navigation vers les modules autorisés pour le profil       |
+----------------------------------------------------------------------+
```

En 1024 px, les blocs clés passent sur deux lignes de quatre, et les zones 2 et 3 s'empilent.

## F.6 Filtres de module

Aucun filtre propre. Seuls le niveau géographique et la période.

**Raison :** un écran de synthèse filtré n'est plus une synthèse. Les filtres fins appartiennent aux modules.

## F.7 Comportements attendus

**Zone 4.** Chaque carte de navigation porte le titre du module, une phrase de description issue du document 10, et le nombre d'indicateurs qu'il contient. Elle mène au module. Les modules non autorisés pour le profil n'apparaissent pas.

**Adaptation au profil.** La sélection des blocs est déterminée par le profil du compte, jamais par un choix de l'utilisateur. Il n'existe aucune personnalisation d'écran.

**Export.** C'est la fonction la plus utilisée de cet écran. Le PDF reproduit les quatre zones, en A4 paysage, avec bandeau de périmètre, filigrane, référence unique, mention d'attribution et version des indicateurs.

## F.8 Ce que l'écran ne fait jamais

- **Produire un commentaire ou une interprétation automatique.** Aucune phrase du type « la demande progresse » ni « le déficit se creuse ». Un texte généré repris dans un communiqué officiel engagerait Simandou Séjour sur une lecture qu'elle n'a pas validée.
- Afficher une valeur différente de celle de son module d'origine.
- Permettre à l'utilisateur de choisir ou de réorganiser ses blocs.
- Afficher un bloc issu d'un module non autorisé pour le profil.
- Compléter artificiellement jusqu'à huit blocs quand le profil en compte moins.

## F.9 États

Chaque bloc porte l'état de son module d'origine. Un bloc vide affiche le libellé d'état vide de son indicateur, jamais un zéro isolé.

Si tous les blocs sont en état vide, l'écran s'affiche entièrement, sans message global d'erreur. C'est la situation du premier jour.

## F.10 Critères d'acceptation

1. Après connexion, l'utilisateur atterrit sur cet écran.
2. La sélection des blocs correspond exactement au profil du compte.
3. Une valeur relevée ici est identique à celle du module d'origine, au même périmètre et à la même période, état de masquage compris.
4. Un profil `EVENEMENTIEL` voit six blocs et non huit complétés artificiellement.
5. La zone 4 ne propose que les modules autorisés pour le profil.
6. Aucun texte interprétatif n'apparaît sur l'écran.
7. Avec une base vide, l'écran s'affiche entièrement en états vides, sans erreur.
8. L'export PDF reproduit les quatre zones avec l'ensemble des mentions obligatoires.
9. En 1024 px, aucun défilement horizontal.
10. Le passage du français à l'anglais ne laisse subsister aucune chaîne française.

---

# Partie G. Fiche module `M10_METHODO`

## G.1 Identité

| Attribut | Valeur |
|---|---|
| Code | `M10_METHODO` |
| Libellé | Méthodologie |
| Statut de donnée | Sans objet, module documentaire |
| Profils | Tous |
| Sélecteur de période | Non |
| Sélecteur de niveau géographique | Non |
| Priorité de développement | Haute |

## G.2 Question métier

Comment chaque chiffre de l'Observatoire est-il produit, sur quel périmètre, avec quelles limites.

## G.3 Pourquoi ce module compte plus qu'il n'y paraît

**Il ne dépend d'aucune donnée.** Il restitue le contenu des tables `indicateur` et `version_indicateur`, alimentées par le document 4. Il peut donc être construit et livré à tout moment, y compris avant que le moindre établissement soit recensé.

**Il rend les chiffres citables.** Un statisticien de ministère ou un chargé de programme d'un bailleur demandera comment le taux d'occupation est calculé. Répondre par un lien intégré à l'outil distingue radicalement l'Observatoire d'un prestataire ordinaire. Un chiffre dont la méthode est publiée ne peut pas être retourné contre son auteur.

**Il est le seul module dont le contenu est entièrement écrit à l'avance.** Le document 4 en est la source.

## G.4 Composition de l'écran

```
+----------------------------------------------------------------------+
| [Rechercher un indicateur                                  ]         |
+------------------------+---------------------------------------------+
| Z1  Sommaire           | Z2  Contenu                                 |
|                        |                                             |
| Principes généraux     | Fiche de l'indicateur sélectionné           |
| Sources et canaux      | ou page de principes                        |
| Règles de masquage     |                                             |
| Référentiel territorial|                                             |
| Limites connues        |                                             |
| ---------------------- |                                             |
| Indicateurs par famille|                                             |
|   Offre                |                                             |
|   Maturité numérique   |                                             |
|   Demande exprimée     |                                             |
|   Tension              |                                             |
|   Demande institution. |                                             |
|   Activité observée    |                                             |
|   Conformité           |                                             |
|   Événementiel         |                                             |
|   Retombées            |                                             |
+------------------------+---------------------------------------------+
```

## G.5 Contenu de la fiche d'indicateur

Alimentée par la table `indicateur`. Chaque fiche affiche, dans cet ordre :

| Élément | Source |
|---|---|
| Libellé | `indicateur.libelle_fr` ou `libelle_en` |
| Code | `indicateur.code` |
| Définition | `indicateur.definition_fr` ou `definition_en` |
| Formule | `indicateur.formule` |
| Unité et précision d'affichage | `indicateur.unite`, `decimales` |
| Statut de donnée | `indicateur.statut_donnee` |
| Règle de masquage applicable | `indicateur.regle_masquage` |
| Seuils de fiabilité | `indicateur.seuil_consolide`, `seuil_indicatif` |
| Fréquence de rafraîchissement | `indicateur.frequence_rafraichissement` |
| Pièges d'interprétation | `indicateur.pieges` |
| Modules où il apparaît | Calculé |
| Historique des versions de formule | `version_indicateur` |

## G.6 Pages de principes

Cinq pages statiques, alimentées depuis les documents du projet.

**Principes généraux.** Ce que l'Observatoire mesure, ce qu'il ne mesure pas, les trois questions auxquelles il répond. Source : document 1.

**Sources et canaux.** Recensement, saisie institutionnelle, flux plateforme, transmission administrative. Ce que chaque canal apporte. Source : document 5.

**Règles de masquage.** M0, M1, M2, et la raison de chacune. Source : document 7.

**Référentiel territorial.** Version en vigueur, date d'effet, source, avertissement sur le découpage du 20 août 2026 et sur l'absence de contours dans les sources publiques. Source : document 2.

**Limites connues.** Section rédigée, non générée. Elle énonce ce que l'Observatoire ne sait pas encore faire : couverture partielle, historique court, données de conformité absentes, géolocalisation fiable au pays seulement.

Cette dernière page est celle qui inspire le plus confiance. Un outil qui déclare ses limites est plus crédible qu'un outil qui les tait.

## G.7 Comportements attendus

**Accès contextuel.** Chaque indicateur affiché dans n'importe quel module ouvre sa fiche méthodologique. Le retour ramène à l'écran d'origine, au même périmètre.

**Recherche.** Sur le libellé, le code et la définition. Insensible à la casse et aux accents.

**Historique de version.** Quand un indicateur compte plusieurs versions de formule, la fiche les affiche toutes avec leurs dates d'effet. C'est ce qui permet d'expliquer un écart entre deux exports produits à six mois d'intervalle.

**Export.** La fiche d'un indicateur et les pages de principes sont exportables en PDF, avec les mêmes mentions obligatoires que les autres modules.

## G.8 Ce que l'écran ne fait jamais

- Afficher une donnée chiffrée du secteur. Ce module documente la méthode, il ne restitue aucune mesure.
- Afficher un indicateur absent de la table `indicateur`.
- Contenir un texte écrit en dur dans le code plutôt que provenant de la base ou des fichiers de traduction.

## G.9 Critères d'acceptation

1. Le module s'affiche entièrement avec une base de données de faits totalement vide.
2. Tous les indicateurs du document 4 sont présents et consultables.
3. Chaque indicateur affiché dans un autre module donne accès à sa fiche.
4. Le retour depuis une fiche ramène à l'écran d'origine, au même périmètre.
5. La recherche fonctionne sur le libellé, le code et la définition, sans sensibilité aux accents.
6. Un indicateur à plusieurs versions de formule affiche son historique avec les dates d'effet.
7. La page de référentiel territorial mentionne la version en vigueur et sa date d'effet.
8. La page des limites connues est présente et non vide.
9. Aucune donnée chiffrée du secteur n'apparaît dans le module.
10. Les fiches sont disponibles en français et en anglais.

---

# Partie H. Fiche module `M11_ADMIN`

## H.1 Identité

| Attribut | Valeur |
|---|---|
| Code | `M11_ADMIN` |
| Libellé | Administration |
| Profils | `ADMIN` exclusivement |
| Priorité de développement | **Haute. Voir H.3** |

## H.2 Question métier

Comment les données entrent dans l'Observatoire, et qui y accède.

## H.3 Correction de priorité

Le document 11 classe ce module au rang 11 de l'ordre de développement. **C'est une erreur.**

Ce module n'est pas un panneau de configuration accessoire. Il est le **back-office de saisie de l'Observatoire**. Sans lui :

- le recensement ne peut pas être importé ;
- la demande institutionnelle ne peut pas être saisie ;
- le calendrier événementiel ne peut pas être renseigné ;
- l'accessibilité des territoires ne peut pas être documentée ;
- les retours terrain ne peuvent pas être enregistrés ;
- aucun compte institutionnel ne peut être créé autrement qu'en SQL.

Trois des quatre canaux d'alimentation du document 5 passent par ce module. Sans lui, l'Observatoire est une coquille.

**Nouvelle position dans l'ordre de développement : rang 7, avant `M1_OFFRE`.** Le module Offre a besoin de données, et ces données entrent par ici.

## H.4 Sections du module

Neuf sections, dans cet ordre de priorité de réalisation.

### H.4.1 Import du recensement

**Priorité 1.** C'est ce qui remplit la table pivot de l'Observatoire.

- Import de fichier tabulaire, format et colonnes conformes au document 5 section 3.
- **Prévisualisation avant validation**, jamais d'import direct.
- Rapport de contrôle avant validation : lignes valides, lignes en erreur, motif ligne par ligne.
- Contrôles appliqués : champs obligatoires présents, valeurs énumérées conformes au document 2, rattachement territorial résolu ou signalé, coordonnées dans les bornes de la Guinée, doublons potentiels signalés.
- **Rattachement territorial automatique** via `territoire_variante`, avec liste des libellés non résolus à traiter manuellement.
- Détection de doublons sur le nom et la proximité géographique. Signalement, jamais fusion automatique.
- Historique des imports : date, opérateur, nombre de lignes, fichier source.

### H.4.2 Fiche établissement

**Priorité 2.**

- Création, consultation et modification d'une fiche.
- Tous les champs du document 3 table `etablissement`.
- Équipements en sous-formulaire, avec capacité pour les salles de réunion.
- Champs énumérés en listes fermées, jamais en saisie libre.
- **Toute modification de `statut_relation` ou de `capacite_unites` écrit une ligne dans `etablissement_historique`.**
- Recherche par nom, territoire, typologie, statut de relation, statut de vérification.

### H.4.3 Retours terrain

**Priorité 2.**

- Saisie d'un constat, rattaché à une fiche ou libre si l'établissement s'est révélé inexistant.
- Commentaire obligatoire pour un `REFUS_MOTIVE`.
- Liste consultable, filtrable par territoire, statut et collecteur.

### H.4.4 Demande institutionnelle

**Priorité 3.**

- Création et suivi d'une demande, tous champs du document 3 table `demande_institutionnelle`.
- Mise à jour du statut au fil du temps.
- Renseignement de `nb_unites_couvertes` après l'événement.
- **Aucun champ de suivi commercial.** Pas de contact, pas de relance, pas de devis, pas d'étape de vente. C'est une donnée de demande, pas un dossier commercial.

### H.4.5 Calendrier événementiel

**Priorité 3.**

- Saisie unitaire et saisie par lots.
- Duplication d'une année sur l'autre pour les événements en récurrence annuelle.
- Vue calendrier annuelle par territoire.

### H.4.6 Accessibilité des territoires

**Priorité 3.**

- Saisie ou modification pour un territoire.
- Vue de couverture indiquant les territoires non encore documentés.
- Priorité affichée sur les 44 préfectures.

### H.4.7 Institutions et comptes

**Priorité 1.** Sans cette section, aucun accès ne peut être ouvert.

**Institutions.** Création, dénomination, type, logo, référence et dates de convention, activation.

**Comptes.** Création par invitation nominative, avec nom, prénom, fonction, adresse professionnelle, profil, périmètre territorial, granularité maximale, langue, date d'expiration.

**Actions.** Renvoyer une invitation. Suspendre, effet immédiat. Réactiver. Prolonger l'expiration.

**Modules.** Activation ou désactivation par compte, dans la limite de ce que le profil autorise au document 6.

**Interdits :** création d'un compte non nominatif, création d'un compte sans date d'expiration, attribution d'un module non autorisé par le profil.

### H.4.8 Référentiels

**Priorité 2.**

- Consultation de la hiérarchie territoriale, par version de découpage.
- Ajout et modification de variantes orthographiques.
- Import des contours géographiques.
- Saisie et modification des bornes de gamme tarifaire, avec date d'effet et versionnage.
- Consultation et modification des libellés d'énumération, français et anglais.

**Interdit :** supprimer une valeur d'énumération utilisée. Elle se désactive, elle ne se supprime pas.

### H.4.9 Journal et exports

**Priorité 4.**

- Consultation du journal d'accès, filtrable par compte, institution, module et période.
- Consultation du registre des exports, avec recherche par référence.
- Consultation en lecture seule. Aucune suppression possible, quel que soit l'opérateur.

## H.5 Comportements attendus

**Aucune suppression définitive.** Tout se désactive. Un établissement en doublon passe en `DOUBLON`, il n'est jamais effacé. Un compte se suspend, il ne se supprime pas.

**Confirmation explicite** pour toute action affectant un accès : suspension, prolongation, changement de profil.

**Traçabilité.** Toute action d'administration écrit une ligne au journal, y compris les imports et les modifications de référentiel.

## H.6 Ce que le module ne fait jamais

- Exposer une donnée à un profil institutionnel. Ce module est fermé au niveau de la base, pas seulement dans la navigation.
- Permettre la suppression d'une ligne de journal ou d'export.
- Permettre la création d'un compte générique ou sans date d'expiration.
- Permettre l'attribution d'un module non autorisé par le profil.
- Contenir une fonction de suivi commercial.
- Importer un fichier sans prévisualisation ni rapport de contrôle.

## H.7 Critères d'acceptation

1. Un compte institutionnel, quel que soit son profil, ne peut accéder à aucune adresse de ce module, y compris en saisie directe.
2. Un import de recensement affiche un rapport de contrôle avant validation, avec le motif de chaque ligne en erreur.
3. Un libellé territorial non résolu est signalé et n'est jamais rattaché arbitrairement.
4. Un doublon potentiel est signalé et jamais fusionné automatiquement.
5. Une modification de `statut_relation` écrit une ligne dans `etablissement_historique`.
6. Un `REFUS_MOTIVE` sans commentaire est refusé.
7. La création d'un compte sans date d'expiration est impossible.
8. La création d'un compte non nominatif est impossible.
9. L'attribution à un compte d'un module non autorisé par son profil est impossible.
10. La suspension d'un compte prend effet immédiatement sur une session ouverte.
11. Aucune ligne de journal ni d'export ne peut être supprimée.
12. La suppression d'une valeur d'énumération utilisée est impossible, seule la désactivation l'est.
13. Le formulaire de demande institutionnelle ne comporte aucun champ de suivi commercial.
14. Toute action d'administration apparaît au journal.

---

## Points ouverts

1. ~~Format de fichier accepté pour l'import du recensement : tableur, valeurs séparées, ou les deux.~~ **Résolu (implémentation lot 1) : CSV, délimiteur point-virgule.**
2. ~~Seuil de proximité géographique retenu pour la détection de doublons.~~ **Résolu (implémentation lot 1) : nom normalisé identique sur la même commune, ou coordonnées à moins de 300 m l'une de l'autre.** Valeur pragmatique, ajustable.
3. Faut-il une fonction d'export de la base de recensement à usage interne, distincte des exports institutionnels interdits.
4. Nombre maximal de lignes par import.

---

*Document 9 bis. Lot 2 sur 3. Lot suivant : `M6_MATURITE` et `M7_EVENEMENTIEL`, puis `M3_ACTIVITE`, `M5_CONFORMITE` et `M8_RETOMBEES`.*
