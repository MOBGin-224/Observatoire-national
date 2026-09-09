# Document 7. Règles de confidentialité et de gouvernance

**Projet :** Observatoire National de l'Hospitalité Guinéenne
**Maître d'ouvrage :** SIMANDOU SEJOUR
**Version :** 1.0
**Statut :** Prescriptif et contractuel. Prime sur toute autre spécification en cas de contradiction.
**Prérequis :** documents 1, 2, 3, 4 et 6.

> **Double usage.** Ce document encadre le développement et constitue l'annexe technique de toute convention avec une institution. Il est rédigé pour être remis en l'état.
>
> **Règle de préséance.** Si une exigence fonctionnelle contredit une règle de ce document, c'est la règle de ce document qui s'applique. Aucune fonctionnalité ne justifie une exception. En cas de doute, ne pas afficher.

---

## 1. Les trois interdictions structurelles

Elles ne se garantissent pas par une consigne mais par l'architecture. Un développeur qui ne les connaît pas ne doit pas pouvoir les enfreindre.

### 1.1 Aucune donnée financière de Simandou Séjour

Ni commission, ni taux de commission, ni marge, ni revenu net, ni chiffre d'affaires de l'entreprise, ni moyen de paiement, ni statut de paiement.

**Garantie technique :** le modèle de données ne prévoit aucun champ pour les accueillir. Le flux d'alimentation applique une liste blanche de champs.

**Pourquoi :** exposer ces données à une agence publique ouvre une discussion sur le modèle économique de l'entreprise que rien n'oblige à avoir, et que l'entreprise ne maîtriserait pas.

### 1.2 Aucune donnée nominative par établissement

Aucun taux d'occupation, aucun prix pratiqué, aucun revenu, aucun volume de réservation rattachable à un établissement identifiable.

**Garantie technique :** les comptes institutionnels n'accèdent qu'aux vues matérialisées d'agrégats. Les tables de faits leur sont fermées au niveau de la base.

**Pourquoi :** c'est le risque létal. Un hôtelier qui apprend que ses chiffres sont consultables par une administration quitte la plateforme le jour même, et prévient ses confrères. La confiance des établissements est l'actif dont dépend tout le reste.

### 1.3 Aucune donnée personnelle de voyageur

Ni identité, ni coordonnées, ni historique individuel, ni moyen de paiement.

**Garantie technique :** aucun champ correspondant n'existe dans le modèle. Le pays est la seule information géographique publiée sur un utilisateur.

---

## 2. Champs interdits d'entrée dans la couche analytique

Liste fermée. Aucun de ces éléments ne doit exister dans une table, transiter par un flux d'alimentation ou apparaître dans un champ de commentaire.

| Catégorie | Éléments |
|---|---|
| Financier entreprise | commission, taux de commission, marge, revenu net, moyen de paiement, statut de paiement, frais de service |
| Personnel voyageur | nom, prénom, téléphone, adresse électronique, adresse postale, pièce d'identité, historique individuel |
| Réseau | adresse IP brute, identifiant d'appareil persistant |
| Appréciation | note interne, commentaire d'évaluation, jugement sur un partenaire |
| Litige | réclamation, contentieux, incident commercial |

### Règle de la liste blanche

Le flux d'alimentation depuis la plateforme déclare **ce qui entre**, jamais ce qui est exclu.

Une liste d'exclusions signifie qu'un champ ajouté un jour en production remontera automatiquement dans l'Observatoire. C'est ainsi que se produisent les fuites que personne n'avait voulues.

### Champ `notes`

Le champ `notes` de la fiche établissement porte des précisions factuelles de collecte, jamais un jugement. Il n'est jamais publié, sous aucun profil.

---

## 3. Règles de masquage

### 3.1 Règle M0, volumes bruts

Un volume brut est **toujours affiché**, quel que soit son effectif, y compris à zéro.

Zéro établissement recensé à Karala est une information. Dix-neuf recherches sur Boké en sept jours est une information. Un petit chiffre vrai vaut mieux qu'un grand chiffre approximatif.

Concernés : nombre d'établissements, capacité, recherches, réservations, nuitées, unités demandées.

### 3.2 Règle M1, confidentialité des établissements

Un agrégat de performance hôtelière n'est affiché que si les deux conditions suivantes sont réunies :

- l'échantillon comporte au moins **3 établissements** ;
- aucun établissement ne représente plus de **la moitié** des unités de l'échantillon.

Sinon, afficher exactement :

> Non publié : effectif insuffisant pour préserver la confidentialité des établissements.

Concernés : taux d'occupation, ADR, RevPAR, ALOS, lead time, taux d'annulation, taux de non-présentation, dépense d'hébergement.

**Pourquoi la seconde condition.** Trois établissements dont un pèse 80 % des unités ne protègent personne : le poids lourd est déductible.

**Le libellé compte.** Il ne dit pas que la donnée manque. Il dit qu'une règle déontologique s'applique. C'est un signal de professionnalisme, pas un aveu de faiblesse.

### 3.3 Règle M2, ratios sur très faible effectif

En dessous de **10 observations**, un ratio s'affiche en effectifs et non en pourcentage.

« 2 sur 3 », jamais « 66,7 % ».

### 3.4 Ce que le masquage ne fait jamais

- Il ne remplace pas une valeur masquée par zéro.
- Il ne masque jamais un volume brut.
- Il ne s'applique jamais pour dissimuler un résultat défavorable à Simandou Séjour. Un taux de couverture de 6,7 % s'affiche.

---

## 4. Niveaux de fiabilité

Chaque bloc d'indicateurs porte un niveau visible.

| Niveau | Lecture |
|---|---|
| `CONSOLIDE` | Effectif suffisant, valeur stable |
| `INDICATIF` | Effectif faible, tendance à interpréter avec prudence |
| `SIGNAL` | Effectif très faible, valeur d'alerte et non de mesure |

Un outil qui qualifie lui-même la robustesse de ses chiffres inspire plus confiance qu'un outil qui affiche tout au même niveau.

Les seuils sont définis indicateur par indicateur dans le document 4.

---

## 5. Statut de donnée et périmètre

### 5.1 Statut de donnée

Toute valeur affichée porte son origine : `RECENSE`, `OBSERVE`, `EXPRIME`, `DECLARE` ou `ESTIME`.

**Un même graphique ne mélange jamais deux statuts de donnée.**

### 5.2 Bandeau de périmètre

Présent en haut de chaque écran, **non masquable**, repris sur tous les exports.

Contenu : nombre d'établissements recensés, nombre de partenaires, part de la capacité couverte, date d'observation.

Ce bandeau renforce la position de Simandou Séjour au lieu de l'affaiblir. Il distingue immédiatement l'Observatoire des acteurs qui promettent des chiffres nationaux qu'ils n'ont pas.

### 5.3 Valeurs estimées

Toute valeur en statut `ESTIME` affiche, à côté du chiffre :

- le coefficient ou la méthode appliquée ;
- la source de ce coefficient ;
- le mot « estimation » dans le titre du bloc.

Un chiffre d'estimation repris dans un communiqué officiel puis contesté publiquement ferait plus de dégâts que l'absence du module.

---

## 6. Consentement des établissements

| Valeur | Conséquence |
|---|---|
| `OUI` | L'établissement peut être nommé dans une restitution nominative |
| `NON` | L'établissement compte dans les agrégats, n'est jamais nommé |
| `NON_DEMANDE` | Traité comme `NON` jusqu'à obtention |

**Règle de sécurité :** en l'absence de valeur explicite, le comportement par défaut est le plus restrictif.

Un établissement en `REFUS` de relation compte dans l'inventaire mais n'apparaît sous aucune forme identifiable.

---

## 7. Exports

### 7.1 Formats

PDF et image uniquement.

**Interdits, quel que soit le profil :** CSV, tableur, JSON, XML, API ouverte, accès direct à la base, connexion à un outil de visualisation tiers.

### 7.2 Contenu obligatoire

Tout export porte :

- filigrane au nom du compte émetteur ;
- horodatage de génération ;
- référence unique, imprimée en pied de page ;
- bandeau de périmètre ;
- mention d'attribution et logo de l'institution ;
- version des indicateurs utilisée.

### 7.3 Traçabilité

Chaque export crée une ligne dans la table `export` avec l'empreinte du contenu.

Deux usages : savoir d'où vient un document qui circule, et régénérer l'état exact de la donnée si un chiffre est contesté plus tard.

### 7.4 Réponse à la demande d'export brut

Cette demande viendra, avec insistance. Formulation à tenir :

> Les restitutions sont conçues pour être directement intégrables dans vos documents. L'accès à la donnée structurée fera l'objet d'une convention spécifique précisant les usages autorisés.

Vous ne refusez pas, vous conditionnez.

---

## 8. Propriété intellectuelle

### 8.1 Ce qui appartient à SIMANDOU SEJOUR

Le code source, le socle de données, le référentiel des établissements, les traitements, les indicateurs, la méthodologie et la marque demeurent la propriété exclusive de SIMANDOU SEJOUR.

### 8.2 Ce dont dispose l'institution

Un droit d'accès et d'usage des restitutions, à des fins institutionnelles non commerciales, **sans droit de cession, de revente ou de communication à des tiers** hors mention de la source.

### 8.3 Attribution

La mention « Observatoire National de l'Hospitalité Guinéenne, une infrastructure Simandou Séjour » est présente à l'écran et sur tout export.

**Elle n'est pas paramétrable.** Le logo de l'institution apparaît en co-branding et est, lui, paramétrable par compte.

### 8.4 Citation

Toute reprise d'un chiffre dans un document officiel mentionne la source et la date d'observation.

---

## 9. Hébergement et contrôle

| Élément | Règle |
|---|---|
| Hébergement | Infrastructure de SIMANDOU SEJOUR exclusivement |
| Adresse | Sous-domaine de simandousejour.com |
| Installation chez le partenaire | Aucune, en aucun cas |
| Instance dédiée livrée | Aucune, en aucun cas |
| Code source | Jamais transmis |
| Sauvegarde de la base | Jamais transmise |

Le contrôle est une propriété d'architecture, pas une clause contractuelle. Une clause se négocie et se contourne. Une architecture où la donnée ne quitte jamais l'infrastructure de l'entreprise ne se négocie pas.

---

## 10. Sécurité technique

- Chiffrement en transit et au repos.
- Row Level Security activée sur toutes les tables, sans exception.
- Trois rôles de base : `role_institutionnel` en lecture sur les vues seules, `role_admin`, `role_ingestion` en écriture sans droit de lecture.
- Second facteur obligatoire pour tous les comptes.
- Séparation stricte des environnements de production et de développement.
- **Aucune donnée de production dans un environnement de développement.**
- Sauvegarde automatisée, restauration testée.
- Revue des habilitations à chaque comité de suivi.

---

## 11. Protection des données à caractère personnel

- L'adresse réseau brute n'est jamais conservée au delà de la dérivation du pays.
- La position navigateur, quand elle est accordée, est stockée mais **jamais publiée** à un niveau inférieur au pays.
- La cartographie institutionnelle repose sur la **destination recherchée**, jamais sur l'origine de la connexion. La destination est saisie par l'utilisateur, elle est donc fiable ; la géolocalisation par adresse réseau ne l'est qu'au niveau du pays.
- Une mention d'information figure sur la plateforme concernant la mesure d'audience et la géolocalisation.
- La conformité au cadre guinéen de protection des données à caractère personnel est à faire vérifier avant l'ouverture du premier accès institutionnel.

**Point de vigilance opérationnel.** Le trafic mobile guinéen transite par un nombre restreint de passerelles concentrées à Conakry. Publier une carte d'origine des utilisateurs fondée sur l'adresse réseau produirait une image où tout le pays semble se connecter depuis Kaloum. Un technicien la contesterait et l'outil entier perdrait sa crédibilité.

---

## 12. Gouvernance de la relation

### 12.1 Comité de suivi

Périodicité trimestrielle. Composition paritaire. Compte rendu écrit obligatoire.

Ordre du jour permanent : évolution du périmètre observé, usage constaté de l'outil, revue des habilitations, points ouverts.

### 12.2 Point focal

Un point focal nommé de chaque côté, avec fonction et coordonnées.

Une convention sans point focal nommé est une convention morte.

### 12.3 Durée et révision

Durée alignée sur la convention. Clause de revue à mi-parcours.

### 12.4 Réversibilité

À la fin de la convention :

- les comptes sont désactivés ;
- les exports déjà produits restent utilisables par l'institution, avec mention de la source ;
- **aucune donnée n'est transférée.**

Cette clause doit être écrite. Laissée à l'imagination d'un juriste public, elle sera plus contraignante.

### 12.5 Communication

Aucune annonce publique unilatérale. Toute communication mentionnant l'Observatoire est concertée.

---

## 13. Ce que l'Observatoire ne produira jamais

Liste fermée. Ces exclusions doivent survivre au départ de leurs auteurs.

**Une note ou un score de qualité des établissements.** Classer est un pouvoir régalien. Un score maison mettrait Simandou Séjour en conflit simultané avec ses clients et avec l'État.

**Un classement nominatif d'établissements, quel qu'en soit le critère.**

**Une désignation d'établissements comme informels.** L'indicateur existe sous le libellé « établissements dont l'enregistrement n'est pas documenté ». Les partenaires hôteliers doivent pouvoir lire l'Observatoire sans s'y sentir accusés.

**Une comparaison de parts de marché entre plateformes.**

**Une donnée d'emploi collectée directement auprès des établissements.**

**Un accès nominatif à un établissement pour un profil institutionnel, même sur demande écrite d'une autorité.** Une telle demande relève d'une procédure juridique, pas d'un paramétrage.

---

## 14. Conduite à tenir en cas de doute

Trois règles pour un agent de développement confronté à une situation non prévue.

**En cas de doute sur l'affichage d'une donnée, ne pas l'afficher.** Une donnée manquante se corrige. Une donnée exposée ne se retire pas.

**En cas de doute sur un champ à intégrer au flux d'alimentation, ne pas l'intégrer.** La liste blanche s'étend par décision explicite, jamais par défaut.

**En cas de contradiction entre une demande fonctionnelle et une règle de ce document, appliquer la règle et signaler la contradiction.**

---

## 15. Points ouverts

1. Durée de conservation des enregistrements de recherche.
2. Durée de conservation du journal d'accès.
3. Vérification de conformité au cadre guinéen de protection des données.
4. ~~Modalité de second facteur retenue.~~ **Résolu le 2026-09-08 :** TOTP (application d'authentification), implémenté via le support natif de Supabase Auth MFA. Enrôlement obligatoire au premier accès, vérification à chaque connexion, appliqué au niveau du routage (session refusée si le niveau d'authentification `aal2` n'est pas atteint).
5. Formulation définitive des clauses de propriété intellectuelle et de réversibilité, à faire relire par un juriste.

---

*Document 7 sur 12. Document précédent : matrice profils, modules et permissions. Document suivant : système de design et charte visuelle.*
