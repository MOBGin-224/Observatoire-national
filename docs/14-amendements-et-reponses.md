# Document 14. Amendements et réponses

**Projet :** Observatoire National de l'Hospitalité Guinéenne
**Maître d'ouvrage :** SIMANDOU SEJOUR
**Version :** 1.0
**Statut :** Prescriptif. Amende le document 7. Clôt les points soulevés lors de la revue du document 13.

> **Objet.** Ce document répond aux trois points soulevés lors de la revue du document 13, corrige une contradiction interne, et tranche les besoins d'infrastructure qui en découlent.
>
> **Il contient un amendement au document 7.** Une fois appliqué, la contradiction disparaît.

---

## 1. Point de méthode : la source de vérité

**Le dépôt est la source de vérité, pas les fichiers produits en dehors.**

Une régression a été introduite dans `CLAUDE.md` : la version régénérée provenait d'une copie antérieure aux amendements du document 8 sur l'anneau et la jauge radiale. La détection était correcte, le refus d'installer aussi.

**Règle applicable désormais.**

Les documents du dépôt évoluent au fil du développement. Toute modification apportée en dehors du dépôt risque d'écraser un amendement déjà validé.

Deux modes de travail acceptés, dans cet ordre de préférence :

1. **Amendement textuel appliqué dans le dépôt.** Le texte de la modification est fourni, l'application dans le fichier se fait dans le dépôt. C'est le mode retenu par défaut.
2. **Régénération complète d'un document.** Uniquement si la version en vigueur a été transmise au préalable.

**Un fichier régénéré sans que sa version en vigueur ait été fournie ne doit pas être installé.** Le comportement adopté lors de cette revue est le bon et doit être reproduit.

---

## 2. `CLAUDE.md` : installation avec corrections

**Décision : installer la version fournie, avec les deux corrections identifiées.**

### 2.1 Correction 1, régression sur les graphiques

Rétablir la formulation en vigueur, qui autorise l'anneau sous conditions :

| À supprimer | À rétablir |
|---|---|
| Camembert, anneau, double axe, 3D | Camembert, double axe, 3D |
| | Anneau sans total central ni légende chiffrée, voir document 8 section 6 |

L'anneau et la jauge radiale sont autorisés sous conditions depuis l'amendement du document 8. Le composant existe et sert dans des écrans validés.

### 2.2 Correction 2, état du projet

La ligne « État actuel : rien n'est développé. Ni base, ni écran, ni code. » est périmée.

**À remplacer par une formulation reflétant l'état réel**, et à tenir à jour à chaque étape majeure. Une session future qui lirait l'ancienne ligne repartirait de zéro sur un projet déjà avancé.

**Règle permanente :** la section d'état de `CLAUDE.md` est mise à jour à chaque livraison de module. Elle indique ce qui existe en base, quels écrans sont construits, et ce qui reste.

### 2.3 Ce qui n'appelle pas de correction

L'ajout du document 13 au tableau des documents est conservé.

L'absence du bloc de configuration en fin de fichier est sans conséquence, il se régénère automatiquement.

---

## 3. Amendement au document 7, section 7.1

**Contradiction constatée.** Le document 7 interdit l'export CSV « quel que soit le profil ». Le document 13 section 7 autorise un export interne pour `ADMIN`. Le document 13 pose lui-même que le document 7 prime.

**L'analyse était juste : c'est le document 13 qui est mal écrit, pas la décision qui est mauvaise.** Une exception se pose dans le texte de la règle, jamais à côté.

### Texte de remplacement de la section 7.1 du document 7

> ### 7.1 Formats
>
> PDF et image uniquement.
>
> **Interdits pour tout compte institutionnel, quel que soit son profil :** CSV, tableur, JSON, XML, API ouverte, accès direct à la base, connexion à un outil de visualisation tiers.
>
> **Exception unique, profil `ADMIN`.** Un export CSV du référentiel des établissements et des retours terrain est autorisé au seul profil `ADMIN`, à des fins internes de contrôle qualité et de sauvegarde de travail.
>
> Cette exception ne remet pas en cause le principe : la donnée n'est jamais cédée à un tiers. Elle reconnaît que SIMANDOU SEJOUR exporte des données qu'elle a elle-même collectées, pour son propre usage.
>
> **Trois garde-fous, cumulatifs :**
>
> 1. L'export est fermé au niveau de la base, et non seulement masqué dans la navigation. Un compte institutionnel ne doit pas pouvoir l'atteindre en saisissant l'adresse.
> 2. Chaque export écrit une ligne au journal d'accès, avec son périmètre.
> 3. **L'export ne contient aucune donnée de recherche, de réservation ni d'inventaire quotidien.** Il porte sur l'inventaire de l'offre, jamais sur les données d'usage.

### Portée de l'amendement

| Élément | Traitement |
|---|---|
| Document 7, section 7.1 | Remplacé par le texte ci-dessus |
| Document 13, section 7 | Inchangé, devient cohérent |
| Document 12, critère M21 | Reformulé, voir 3.1 |

### 3.1 Reformulation du critère de recette M21

Le critère M21 du document 12 dit actuellement :

> Aucun export de données structurées n'est proposé, sous aucun profil.

**Nouvelle formulation :**

> M21. Aucun export de données structurées n'est proposé à un compte institutionnel, quel que soit son profil. L'export CSV interne est accessible au seul profil `ADMIN`, fermé au niveau de la base, tracé au journal, et ne contient aucune donnée de recherche, de réservation ni d'inventaire.

### 3.2 Le troisième garde-fou est le plus important

Il ne figurait pas au document 13 et il change le périmètre de la fonctionnalité.

L'export interne porte sur `etablissement`, `etablissement_equipement` et `retour_terrain`. Il ne porte pas sur `recherche`, `resultat_recherche`, `reservation` ni `inventaire_quotidien`.

**Raison.** L'inventaire de l'offre est une donnée que SIMANDOU SEJOUR a collectée elle-même sur le terrain. Les données d'usage et de transaction relèvent d'un autre régime : elles concernent des voyageurs et des établissements partenaires qui n'ont consenti à aucune extraction. Les sortir du système, même en interne, créerait un fichier dont la circulation ne serait plus contrôlée.

---

## 4. Compartiment de stockage : autorisé

**Feu vert pour la création d'un compartiment Supabase Storage.**

| Paramètre | Valeur |
|---|---|
| Visibilité | Privé |
| Accès | Adresses signées uniquement |
| Contenu autorisé | Logos d'institutions exclusivement |
| Formats | PNG, SVG |
| Taille maximale | 2 Mo |

**Rien d'autre n'y transite.** Pas de document, pas d'export généré, pas de fichier d'import, pas de pièce jointe. Un compartiment de stockage qui accueille progressivement des contenus non prévus devient un angle mort de sécurité.

Si un besoin de stockage apparaît pour un autre usage, il fait l'objet d'un compartiment distinct et d'une décision écrite.

---

## 5. Besoins d'infrastructure : recommandations retenues

Les quatre recommandations formulées lors de la revue sont retenues telles quelles.

### 5.1 Planificateur de tâches

**Vercel Cron, avec route protégée par secret.**

Retenu parce qu'il n'ajoute aucune brique à l'infrastructure. Le document 11 impose l'absence de dépendances externes lourdes.

Tâches à planifier :

| Tâche | Fréquence | Source |
|---|---|---|
| Notification d'approche d'expiration | Quotidienne | Doc 13, section 3 |
| Purge des enregistrements de recherche | Mensuelle | Doc 13, section 8 |
| Purge du journal d'accès | Mensuelle | Doc 13, section 8 |
| Rafraîchissement des vues matérialisées | Selon doc 3, section 12 | Doc 3 |

Les routes de tâches planifiées ne sont accessibles qu'avec le secret. Elles ne sont jamais atteignables depuis une session utilisateur.

### 5.2 Envoi de courriel

**Le SMTP déjà configuré dans Supabase pour les invitations.**

Retenu pour la même raison : pas de prestataire supplémentaire, pas de secret de plus à gérer, pas de dépendance additionnelle.

Courriels concernés : invitation à un compte, réinitialisation de mot de passe, notification d'approche d'expiration à 30 et 7 jours.

### 5.3 Fichier de configuration

**Un fichier unique, reprenant les douze paramètres du document 13 section 13.**

Aucun de ces paramètres n'est écrit en dur dans un composant ni dans une requête.

| Paramètre | Valeur |
|---|---|
| Inactivité, profils institutionnels | 45 minutes |
| Inactivité, profil `ADMIN` | 20 minutes |
| Durée maximale de session | 5 heures |
| Notification d'expiration | 30 jours et 7 jours |
| Plafond d'import | 2 500 lignes |
| Taille maximale de logo | 2 Mo |
| Formats de logo | PNG, SVG |
| Conservation des recherches | 24 mois |
| Conservation du journal d'accès | 36 mois |
| Détection de doublon, distance | 300 mètres |
| Détection de doublon, nom | Identique sur la même commune |
| Format d'import | CSV, séparateur point-virgule |

### 5.4 Expiration de session à deux durées

**Confirmation : cela relève de l'intergiciel, pas des réglages Supabase.**

Les réglages de session Supabase sont globaux au projet. Deux durées distinctes selon le profil supposent deux compteurs gérés dans l'intergiciel, en parallèle du plafond absolu.

**Ce n'est pas un réglage, c'est du développement.** Le point est acté et ne doit pas être sous-estimé dans l'estimation de charge.

Rappel du comportement attendu : le premier des deux compteurs qui expire ferme la session. À la reconnexion, l'utilisateur revient sur l'écran et le périmètre qu'il consultait.

---

## 6. Zone 5 du module Tension

**Confirmation : elle se construit.**

Le document 13 section 11.4 le pose déjà. Les trois colonnes d'accessibilité affichent « non renseigné » tant que `territoire_accessibilite` est vide, et le document 9 partie D critère 3 en fait un critère de recette.

**L'obstacle restant est l'agrégat de tension par territoire**, qui suppose une vue en base. C'est un travail technique identifié, pas une décision en attente.

---

## 7. Consultation de la documentation technique

**Point retenu et confirmé comme règle permanente.**

Les guides fournis avec le cadre applicatif sont consultés avant d'écrire du code, plutôt que d'écrire de mémoire. Cela vaut en particulier pour le téléversement de fichier, les routes planifiées et l'intergiciel.

Cette règle est ajoutée aux consignes de session du document 11, section 14.

---

## 8. Ce qui reste ouvert

Une seule décision touche le cœur du produit.

| Sujet | Effet |
|---|---|
| **Bornes de gamme tarifaire en GNF** | **Bloque le démarrage du recensement.** N'empêche pas de construire l'administration ni les écrans |
| Confirmation MATD du découpage | Bloque la mise en production, pas le développement |
| Communes hors Conakry | Aucun, s'ajoutent au fil du recensement |
| Contours géographiques | Aucun, repli sur centroïdes déjà spécifié |
| Données d'accessibilité | Aucun, mention « non renseigné » déjà spécifiée |
| Coefficient de retombées | Bloque l'activation de `M8` uniquement |
| Vérification juridique des durées de conservation | Aucun, durées provisoires appliquées |

---

## 9. Récapitulatif des actions

| Action | Où |
|---|---|
| Installer `CLAUDE.md` avec les deux corrections de la section 2 | Racine du dépôt |
| Remplacer la section 7.1 du document 7 par le texte de la section 3 | `/docs/07-...` |
| Reformuler le critère M21 du document 12 | `/docs/12-...` |
| Créer le compartiment de stockage privé | Supabase |
| Créer le fichier de configuration unique | `/lib` |
| Mettre en place les tâches planifiées | Vercel Cron |
| Implémenter les deux compteurs de session | Intergiciel |

Une fois ces actions faites, plus aucune contradiction ne subsiste entre les documents, et le développement de l'administration peut se poursuivre sans point d'arrêt.

---

*Document 14. Amende le document 7 section 7.1 et le document 12 critère M21. Complète les documents 11 et 13.*
