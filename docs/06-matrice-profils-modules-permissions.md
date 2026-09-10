# Document 6. Matrice profils, modules et permissions

**Projet :** Observatoire National de l'Hospitalité Guinéenne
**Maître d'ouvrage :** SIMANDOU SEJOUR
**Version :** 1.0
**Statut :** Prescriptif. Définit qui voit quoi. Bloquant pour l'authentification et pour tout écran.
**Prérequis :** documents 1, 2 et 3.

> **Double usage.** Ce document est à la fois une spécification technique et l'annexe de gouvernance remise à chaque institution partenaire. Il est donc rédigé pour être publiable en l'état. La transparence sur qui voit quoi est ce qui désamorce, entre deux institutions, tout soupçon de traitement préférentiel.

---

## 1. Principes

### 1.1 Trois dimensions, pas une

Un accès n'est pas défini par un rôle unique. Il est le croisement de trois attributs indépendants.

| Dimension | Ce qu'elle contrôle | Champ porteur |
|---|---|---|
| **Profil** | Quels modules sont visibles | `compte_institutionnel.profil` |
| **Périmètre** | Quelles lignes de données sont visibles | `compte_institutionnel.code_territoire_perimetre` |
| **Granularité** | Jusqu'à quel niveau de finesse | `compte_institutionnel.granularite_max` |

Séparer ces trois dimensions dès la conception est ce qui permet, plus tard, d'ouvrir un accès à un gouvernorat ou à une collectivité sans refondre le contrôle d'accès.

### 1.2 Le contrôle d'accès vit dans la base, pas dans l'application

Row Level Security activée sur toutes les tables, sans exception.

Un oubli dans un écran ne doit jamais pouvoir exposer une donnée. La base refuse la ligne. L'application n'est pas responsable de la confidentialité, elle en est seulement l'affichage.

### 1.3 Les comptes institutionnels ne voient jamais les tables de faits

Un compte institutionnel accède exclusivement aux vues matérialisées d'agrégats.

Les tables suivantes ne sont lisibles par aucun rôle institutionnel, quel que soit le profil :

`etablissement`, `etablissement_equipement`, `etablissement_historique`, `retour_terrain`, `recherche`, `resultat_recherche`, `consultation_etablissement`, `reservation`, `inventaire_quotidien`, `conformite_etablissement`, `demande_institutionnelle`, `journal_acces`, `export`, `compte_institutionnel`, `institution`.

### 1.4 Compte nominatif obligatoire

Un compte est rattaché à une personne physique, avec nom, prénom, fonction et adresse professionnelle.

Aucun compte générique, aucun compte au nom d'une direction, aucun compte partagé.

Inscription libre désactivée. Création par invitation uniquement.

### 1.5 Tout compte expire

`date_expiration` est un champ obligatoire, aligné sur la durée de la convention. À échéance, le statut bascule automatiquement en `EXPIRE` et l'accès cesse.

La suspension d'un compte est un acte technique unilatéral, immédiat, sans préavis technique.

### 1.6 Aucune institution n'est écrite dans le code

Nom, logo, périmètre, durée de convention sont des données de configuration en base. Le même code doit servir n'importe quelle institution sans modification.

---

## 2. Les cinq profils institutionnels

| Code | Libellé | Mandat couvert |
|---|---|---|
| `ATTRACTIVITE` | Attractivité et promotion | Promotion de la destination, rayonnement, événements |
| `INVESTISSEMENT` | Investissement | Attraction d'investisseurs, développement du secteur privé |
| `TUTELLE` | Tutelle sectorielle | Réglementation, classification, suivi du secteur |
| `BAILLEUR` | Bailleur et partenaire technique | Financement et appui aux programmes |
| `EVENEMENTIEL` | Organisateur d'événement | Sommets, forums, conférences |

Plus un profil interne, non institutionnel :

| Code | Libellé |
|---|---|
| `ADMIN` | Administration Simandou Séjour |

---

## 3. Matrice profils et modules

| Module | `ATTRACTIVITE` | `INVESTISSEMENT` | `TUTELLE` | `BAILLEUR` | `EVENEMENTIEL` | `ADMIN` |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| `M1_OFFRE` Offre nationale | oui | oui | oui | oui | oui | oui |
| `M2_DEMANDE` Demande exprimée | oui | oui | oui | oui | non | oui |
| `M3_ACTIVITE` Activité observée | oui | non | oui | non | non | oui |
| `M4_TENSION` Tension et déficit | oui | oui | oui | oui | oui | oui |
| `M5_CONFORMITE` Conformité | non | non | oui | non | non | oui |
| `M6_MATURITE` Maturité numérique | oui | oui | oui | oui | non | oui |
| `M7_EVENEMENTIEL` Événementiel | oui | non | non | non | oui | oui |
| `M8_RETOMBEES` Retombées estimées | oui | oui | oui | oui | non | oui |
| `M9_SYNTHESE` Synthèse | oui | oui | oui | oui | oui | oui |
| `M10_METHODO` Méthodologie | oui | oui | oui | oui | oui | oui |
| `M11_ADMIN` Administration | non | non | non | non | non | oui |

### Justification des exclusions

Ces choix seront discutés par les institutions. Ils doivent être défendables.

**`INVESTISSEMENT` sans `M3_ACTIVITE`.** La performance commerciale d'un périmètre partenaire ne relève pas d'un mandat d'attraction d'investissements. Ce profil a besoin de la demande et du déficit, pas du taux d'occupation.

**`BAILLEUR` sans `M3_ACTIVITE`.** Même logique. Un bailleur évalue un secteur, pas la performance d'un opérateur privé.

**`EVENEMENTIEL` sans `M2_DEMANDE` ni `M6_MATURITE`.** Ce profil est le plus restreint et souvent le plus temporaire. Il voit ce qui concerne sa fenêtre : l'offre disponible et la tension sur ses dates.

**`M5_CONFORMITE` réservé à `TUTELLE`.** L'enregistrement et la classification relèvent du pouvoir régalien. Aucun autre profil n'a de motif légitime d'y accéder.

### Chaque institution dispose d'au moins un module propre

| Profil | Module distinctif |
|---|---|
| `ATTRACTIVITE` | `M7_EVENEMENTIEL` |
| `INVESTISSEMENT` | `M4_TENSION` au niveau communal |
| `TUTELLE` | `M5_CONFORMITE` |
| `BAILLEUR` | `M10_METHODO` en accès étendu |
| `EVENEMENTIEL` | `M7_EVENEMENTIEL` |

Ce point n'est pas cosmétique. Il évite qu'une institution se perçoive comme moins bien servie qu'une autre.

---

## 4. Granularité géographique

**Tous les profils institutionnels disposent des quatre niveaux : national, régional, préfectoral, communal.**

C'est ce qui rend la matrice publiable. Aucune institution ne peut soupçonner qu'une autre voit plus finement qu'elle.

| Niveau | Code | Disponible pour |
|---|---|---|
| National | `NATIONAL` | Tous |
| Régional | `REGION` | Tous |
| Préfectoral | `PREFECTURE` | Tous |
| Communal | `COMMUNE` | Tous |

Le champ `granularite_max` existe malgré tout dans le modèle et vaut `COMMUNE` pour tous les comptes au lancement. Il permettra de restreindre un accès futur sans modification de code.

---

## 5. Périmètre territorial

`code_territoire_perimetre` est nul par défaut, ce qui vaut périmètre national.

Renseigné, il restreint l'accès au territoire indiqué et à toute sa descendance hiérarchique. Un compte dont le périmètre vaut `08` voit la région Nzérékoré, ses préfectures et ses communes, et rien d'autre.

Au lancement, tous les comptes institutionnels sont en périmètre national. Le champ existe pour un usage futur : gouvernorat, collectivité territoriale, programme de bailleur ciblé sur une zone.

---

## 6. Activation par module

La table `compte_module` porte un drapeau d'activation par couple compte et module.

**Règle de résolution :** un module est visible si et seulement si le profil l'autorise dans la matrice de la section 3 **et** que `compte_module.actif` est vrai.

Au lancement, tous les modules autorisés par le profil sont actifs. Le mécanisme existe pour trois usages à venir :

- Ouvrir progressivement un module en cours de fiabilisation.
- Suspendre un module sans suspendre un compte.
- Différencier ce qui relève du socle et ce qui relève d'un accès étendu.

Implémenter ce mécanisme dès maintenant coûte quelques heures. L'ajouter après coup coûte une refonte du contrôle d'accès.

---

## 7. Ce que tous les profils voient toujours

Éléments non masquables, non désactivables, présents sur tous les écrans de tous les profils.

**Bandeau de périmètre.** Présent sur tous les écrans, en deux variantes selon le profil.

| Élément | Variante institutionnelle | Variante interne `ADMIN` |
|---|---|---|
| Établissements recensés | Oui | Oui |
| Dont réservables en ligne | Oui | Non |
| Territoires couverts | Oui | Non |
| Dont partenaires | Non | Oui |
| Capacité couverte | Non | Oui |
| Fiches vérifiées | Non | Oui |
| Date et heure d'observation | Oui | Oui |
| Mention de non-exhaustivité | Oui | Oui |

Les trois derniers éléments du tableau sont communs et ne peuvent être retirés d'aucune variante.

**La variante remise aux institutions ne comporte aucune donnée du portefeuille commercial de Simandou Séjour.** Le nombre de partenaires et la part de capacité couverte décrivent l'entreprise, pas le secteur ; ils relèvent du pilotage interne. La numérisation du parc est mesurée à la place par le nombre d'établissements réservables en ligne, toutes plateformes confondues.

**Statut de donnée** sur chaque indicateur : recensé, observé, exprimé, déclaré ou estimé.

**Niveau de fiabilité** sur chaque bloc : consolidé, indicatif ou signal.

**Fraîcheur de la donnée**, par bloc.

**Mention d'attribution :** « Observatoire National de l'Hospitalité Guinéenne, une infrastructure Simandou Séjour ».

**Accès au module Méthodologie** depuis chaque indicateur.

---

## 8. Exports

### 8.1 Formats autorisés

PDF et image uniquement.

**Aucun export de données structurées.** Pas de CSV, pas de tableur, pas de JSON, pas d'API ouverte, quel que soit le profil.

### 8.2 Contenu obligatoire de tout export

- Filigrane au nom du compte émetteur
- Horodatage de génération
- Référence unique d'export, imprimée en pied de page
- Bandeau de périmètre
- Mention d'attribution et logo de l'institution
- Version des indicateurs utilisée

### 8.3 Traçabilité

Chaque export crée une ligne dans la table `export`, avec l'empreinte du contenu. Si un document circule, la référence dit d'où il vient. Si un chiffre est contesté six mois plus tard, l'empreinte et la version permettent de régénérer l'état exact de la donnée.

### 8.4 Réponse à la demande d'export brut

Cette demande sera formulée, avec insistance. Réponse à tenir :

> Les restitutions sont conçues pour être directement intégrables dans vos documents. L'accès à la donnée structurée fera l'objet d'une convention spécifique précisant les usages autorisés.

Vous ne refusez pas. Vous conditionnez.

---

## 9. Cycle de vie d'un compte

| Étape | Action | Acteur |
|---|---|---|
| Création | Invitation nominative envoyée à une adresse professionnelle | `ADMIN` |
| Activation | Définition du mot de passe et du second facteur | Titulaire |
| Usage | Consultation, exports, tracés au journal | Titulaire |
| Suspension | Bascule en `SUSPENDU`, effet immédiat | `ADMIN` |
| Expiration | Bascule automatique en `EXPIRE` à la date prévue | Système |
| Fin de convention | Désactivation de tous les comptes de l'institution | `ADMIN` |

### Réversibilité en fin de convention

Les comptes sont désactivés. Les exports déjà produits restent utilisables par l'institution, avec mention de la source. **Aucune donnée n'est transférée.**

Cette clause doit figurer dans la convention. Écrite par vous, elle est claire. Laissée à l'imagination d'un juriste public, elle sera plus contraignante.

---

## 10. Authentification

- Supabase Auth, comptes nominatifs.
- **Inscription libre désactivée.** Création exclusivement par invitation.
- Second facteur obligatoire pour tous les profils.
- Aucune connexion par fournisseur tiers.
- Session expirant après inactivité prolongée.
- Réinitialisation de mot de passe par l'adresse professionnelle enregistrée uniquement.

---

## 11. Rôles de base de données

| Rôle | Portée | Usage |
|---|---|---|
| `role_institutionnel` | Lecture sur les vues matérialisées uniquement | Tous les comptes institutionnels |
| `role_admin` | Lecture et écriture sur l'ensemble du schéma applicatif | Administration interne |
| `role_ingestion` | Écriture sur les tables de faits, aucune lecture des vues | Flux d'alimentation depuis la plateforme |

`role_ingestion` n'a aucun droit de lecture. Un flux d'alimentation écrit, il ne consulte pas.

---

## 12. Journalisation des accès

Toute consultation est tracée : compte, horodatage, module, filtres appliqués, action, adresse de connexion.

Trois usages :

- **Sécurité.** Détecter un usage anormal.
- **Gouvernance.** Prouver, si nécessaire, qui a consulté quoi.
- **Renseignement produit.** Savoir ce qui intéresse réellement chaque institution oriente les développements suivants mieux qu'une réunion.

Le journal est accessible au seul profil `ADMIN`.

---

## 13. Points ouverts

1. Durée d'inactivité avant expiration de session.
2. Durée de conservation du journal d'accès.
3. Modalité de second facteur retenue : application d'authentification ou courriel.
4. Faut il notifier une institution lorsqu'un de ses comptes approche de sa date d'expiration.

---

*Document 6 sur 12. Document précédent : plan de captation des données. Document suivant : règles de confidentialité et de gouvernance.*
