# Document 13. Décisions arbitrées

**Projet :** Observatoire National de l'Hospitalité Guinéenne
**Maître d'ouvrage :** SIMANDOU SEJOUR
**Version :** 1.0
**Statut :** Prescriptif. Clôt les points ouverts des documents 3, 5, 6, 9 bis et 11.

> **Objet.** Ce document tranche les décisions restées ouvertes dans les documents précédents. Chaque point énonce la décision, sa justification, et ce qu'il faut implémenter.
>
> **Préséance.** Ce document complète les documents 1 à 12 et leurs lots. Il ne les contredit pas. En cas de contradiction apparente, le document 7 prime, comme toujours.
>
> **Ce qui reste ouvert** est listé en section 12. Rien de ce qui y figure n'empêche de développer : les comportements de repli sont déjà spécifiés dans les documents concernés.

---

## 1. Logo des institutions

**Décision : téléversement de fichier, pas saisie d'adresse.**

| Élément | Valeur |
|---|---|
| Stockage | Supabase Storage, compartiment privé |
| Accès | Adresses signées, jamais d'accès public direct |
| Formats acceptés | PNG, SVG |
| Taille maximale | 2 Mo |
| Champ `institution.logo_url` | Contient le chemin interne du fichier, jamais une adresse externe |

**Pourquoi pas une adresse externe.** Une institution ne fournira pas une adresse stable de son logo. Et un logo appelé depuis un serveur tiers finira par disparaître ou changer, y compris sur un export PDF déjà remis à un ministère. Un document officiel dont le logo se transforme six mois après sa remise est un incident évitable.

**Pourquoi un compartiment privé.** Un logo institutionnel accessible publiquement sur l'infrastructure de Simandou Séjour permettrait de deviner la liste des partenaires de l'entreprise. Ce n'est pas une information à exposer.

**À implémenter dans `M11_ADMIN`, section Institutions :** téléversement avec prévisualisation, remplacement, suppression. La suppression du logo ne supprime pas l'institution.

---

## 2. Expiration de session

**Décision : deux durées distinctes selon le profil, et un plafond absolu commun.**

| Paramètre | Profils institutionnels | Profil `ADMIN` |
|---|---|---|
| Inactivité avant déconnexion | 45 minutes | 20 minutes |
| Durée maximale d'une session | 5 heures | 5 heures |

**Pourquoi 45 minutes côté institutions.** L'outil est consulté en réunion et projeté en salle. Une déconnexion survenant pendant une discussion de vingt minutes obligerait à se reconnecter devant l'assistance, second facteur compris. C'est une mauvaise scène. Quarante-cinq minutes couvrent une séquence de travail sans laisser une session ouverte toute une journée.

**Pourquoi 20 minutes côté administration.** C'est le seul profil qui accède aux données brutes, aux comptes et aux référentiels. Le poste d'un administrateur laissé sans surveillance est un risque d'une autre nature que celui d'un compte de consultation.

**Pourquoi un plafond absolu de 5 heures.** L'inactivité seule ne suffit pas : une page qui s'actualise ou un onglet resté ouvert peut maintenir une session indéfiniment. Le plafond garantit qu'une session ouverte le matin ne survit pas à la journée, quelle que soit l'activité. Passé cinq heures, reconnexion complète avec second facteur.

**À implémenter :** les deux compteurs fonctionnent en parallèle. Le premier des deux qui expire ferme la session. À la reconnexion, l'utilisateur revient sur l'écran et le périmètre qu'il consultait.

---

## 3. Notification d'approche d'expiration de compte

**Décision : oui, à deux échéances.**

| Échéance | Destinataires |
|---|---|
| 30 jours avant expiration | Titulaire du compte et administration interne |
| 7 jours avant expiration | Titulaire du compte et administration interne |

**Pourquoi.** Un accès qui meurt en silence pendant une réunion ministérielle est une mauvaise scène, et elle est imputée à l'outil, pas à la convention. La notification évite l'incident.

Elle a aussi une utilité qui dépasse la technique : l'approche d'une expiration est un motif légitime de reprendre contact avec une institution. C'est un point d'appui pour la reconduction de la convention.

**À implémenter :** tâche planifiée quotidienne. Courriel au titulaire, entrée dans un tableau de suivi de `M11_ADMIN`. La notification ne prolonge rien automatiquement : seule l'administration peut prolonger une date d'expiration.

---

## 4. Plafond d'import

**Décision : 2 500 lignes par fichier.**

**Pourquoi ce n'est pas une limite technique.** Le système traiterait sans peine des volumes bien supérieurs. La limite est une limite de **lisibilité du rapport de contrôle**.

Le document 9 bis impose une prévisualisation avant validation, avec le motif de chaque ligne en erreur. Sur un fichier de dix mille lignes, ce rapport devient inexploitable : personne ne le lit, l'opérateur valide en aveugle, et des erreurs entrent en base sans être vues. Le contrôle deviendrait une formalité.

**Pourquoi 2 500 convient.** Un lot de recensement réel comptera quelques centaines de lignes, produit par une équipe sur une semaine de collecte. La limite ne sera jamais atteinte en usage normal. Elle protège contre l'import massif non relu.

**À implémenter :** contrôle avant traitement, message explicite invitant à scinder le fichier. Le message indique le nombre de lignes détectées.

---

## 5. Second facteur et perte d'appareil

**Décision : aucun code de récupération auto-généré.**

**Procédure retenue.** Le titulaire signale la perte. L'administration interne vérifie son identité auprès du **point focal de son institution**, jamais auprès du titulaire lui-même. Elle réinitialise ensuite le second facteur. Le titulaire le reconfigure à sa prochaine connexion.

**Pourquoi refuser les codes de récupération.** Un code imprimé qui traîne dans un bureau ministériel, ou conservé dans un fichier partagé, constitue un risque supérieur au dérangement qu'il évite. Il contourne précisément la protection qu'il est censé sauvegarder.

**Pourquoi passer par le point focal.** Une demande de réinitialisation est le vecteur d'attaque le plus simple contre un accès protégé par second facteur. La vérification auprès d'un tiers connu de l'institution rend l'usurpation nettement plus difficile.

**À implémenter dans `M11_ADMIN` :** action de réinitialisation du second facteur, avec confirmation explicite, motif obligatoire, et écriture au journal d'accès. La réinitialisation ne modifie ni le profil, ni le périmètre, ni la date d'expiration du compte.

---

## 6. Consentement à la publication

**Décision : valeur par défaut `NON_DEMANDE`. Aucune question posée pendant la qualification téléphonique.**

**Pourquoi c'est cohérent avec le reste de la documentation.** Le consentement n'est nécessaire que pour publier un établissement **nommément**. Or l'Observatoire ne nomme jamais un établissement, sous aucun profil, dans aucun module, y compris dans une infobulle. C'est une interdiction structurelle du document 7.

Le champ ne conditionne donc aucune restitution existante. Il est conservé pour un usage futur qui n'est pas au programme.

**Pourquoi cela compte plus qu'il n'y paraît.** Poser une question de consentement pendant l'appel de qualification allongerait chaque appel, introduirait une notion juridique dans une conversation de trois minutes, et augmenterait le taux de refus. Le recensement est le poste le plus long du projet et le plus déterminant pour la crédibilité de l'outil. Rien ne doit le ralentir sans nécessité.

**À implémenter :** valeur par défaut à la création d'une fiche, modifiable dans `M11_ADMIN` si le besoin apparaît un jour. Aucun champ de consentement dans le formulaire de qualification.

**Règle inchangée :** un établissement en `NON_DEMANDE` ou `NON` compte dans tous les agrégats. Il n'est simplement jamais nommé, ce qui est de toute façon la règle générale.

---

## 7. Export interne du recensement

**Décision : autorisé, profil `ADMIN` exclusivement.**

| Élément | Valeur |
|---|---|
| Formats | CSV |
| Profil autorisé | `ADMIN` uniquement |
| Traçabilité | Écriture au journal d'accès, avec périmètre exporté |
| Contenu | Fiches établissement et retours terrain |

**Pourquoi cela ne contredit pas l'interdiction d'export du document 7.** Cette interdiction vise les **comptes institutionnels externes**. Elle protège la donnée contre une cession à un tiers. Un export interne à SIMANDOU SEJOUR, par un opérateur de l'entreprise, sur des données que l'entreprise a elle-même collectées, ne relève pas de cette logique.

**Pourquoi c'est nécessaire.** C'est votre sauvegarde de travail et votre outil de contrôle qualité. Vérifier la cohérence de quatre cents fiches se fait dans un tableur, pas écran par écran.

**À implémenter :** l'export interne est fermé au niveau de la base, pas seulement masqué dans la navigation. Un compte institutionnel ne doit pas pouvoir l'atteindre en saisissant l'adresse.

---

## 8. Conservation des données

**Décision provisoire, à réviser après vérification juridique.**

| Donnée | Durée | Traitement à échéance |
|---|---|---|
| Enregistrements de recherche | 24 mois | Purge automatique |
| Journal d'accès | 36 mois | Purge automatique |
| Registre des exports | Illimité | Conservé |
| Fiches établissement | Illimité | Conservé |

**Pourquoi 24 mois pour les recherches.** Cela préserve deux cycles saisonniers complets, ce qui est le minimum pour établir une saisonnalité défendable. En dessous, `DEM_SAISONNALITE` perd son sens.

**Pourquoi 36 mois pour le journal.** Il doit couvrir la durée d'une convention et sa reconduction, afin de pouvoir répondre à une question de gouvernance sur l'usage passé de l'outil.

**Pourquoi le registre des exports est conservé sans limite.** C'est ce qui permet, des années plus tard, d'identifier l'origine d'un document en circulation et de régénérer l'état exact de la donnée à sa date d'émission. Le registre ne contient aucune donnée personnelle : compte émetteur, horodatage, périmètre, empreinte.

**Pourquoi ces durées sont provisoires.** Elles se rallongent bien plus facilement qu'elles ne se raccourcissent. Une donnée purgée ne revient pas. Elles restent à confirmer au regard du cadre guinéen de protection des données à caractère personnel.

**À implémenter :** tâche planifiée mensuelle. La purge est irréversible et tracée.

---

## 9. Calendrier de la section Événementiel

**Décision : tracé à la main, aucune bibliothèque supplémentaire.**

**Pourquoi.** Une grille annuelle de douze mois avec des bandes de dates ne justifie pas une dépendance externe. Le document 11 impose déjà l'absence de dépendances lourdes et l'auto-hébergement des ressources.

Une bibliothèque de calendrier apporterait des fonctions dont l'Observatoire n'a aucun usage : édition d'événement, glisser-déposer, vues jour et semaine, récurrences complexes, fuseaux multiples. Elle imposerait aussi son propre style, en contradiction avec le document 8.

**À implémenter :** grille de douze colonnes, une ligne par territoire ou par type d'événement, bandes horizontales pour les plages de dates, jetons de design du document 8, infobulle au survol.

---

## 10. Génération des exports PDF

**Décision : rendu côté serveur, en vectoriel.**

**Exigences, à respecter quel que soit l'outil retenu :**

- Les graphiques déjà produits en SVG sont intégrés tels quels, sans rastérisation.
- Contrôle total du filigrane, de la référence unique d'export et du bandeau de périmètre.
- Format A4 paysage.
- Navigation et contrôles retirés.
- Polices auto-hébergées, incluses dans le document.
- Pas de dépendance à un service tiers de génération.

**Le choix de l'outil est laissé à l'appréciation technique**, en fonction des contraintes d'exécution de la plateforme d'hébergement. Seules les exigences ci-dessus sont prescriptives.

**Pourquoi le vectoriel.** Un export destiné à être projeté ou imprimé en réunion institutionnelle ne doit pas se pixelliser. C'est un critère de crédibilité, pas de confort.

---

## 11. Points signalés comme bloquants qui ne le sont pas

Quatre éléments ont été identifiés comme manquants. Ils ne bloquent pas le développement, et les documents prévoient déjà le comportement à adopter.

### 11.1 Les communes rurales hors Conakry

Environ 300 communes manquantes.

**Non bloquant.** Le recensement commence par Conakry, dont les 13 communes sont complètes, puis par les chefs-lieux de préfecture, déjà chargés. Cela couvre plusieurs mois de collecte.

Les communes s'ajoutent au fil de la progression territoriale du recensement, pas avant. Une commune non référencée fait basculer une recherche en `HORS_PERIMETRE`, ce qui est un signal utile documenté au document 2, pas une erreur.

### 11.2 La confirmation officielle du MATD

**Non bloquant pour le développement.** Bloquant pour la mise en production et pour toute présentation à une institution.

Les listes des sections 2.2, 2.3 et 2.4.1 du document 2 sont cohérentes et vérifiées arithmétiquement : 44 préfectures, 13 communes de Conakry. Toute divergence constatée sur la carte officielle se corrigera dans la seule table `territoire`, sans toucher au code.

### 11.3 Les contours géographiques

**Non bloquant, et explicitement prévu.**

Le document 3 impose que l'application fonctionne sans aucun contour, en se rabattant sur les centroïdes. Le document 12, critère S49, en fait un critère de recette bloquant.

L'absence de contours n'est pas un manque à combler avant de développer : c'est l'état attendu au lancement, et le comportement de repli doit être construit et testé.

### 11.4 L'accessibilité des territoires

**Non bloquant.**

Il s'agit de 44 lignes, une par préfecture. Un tableur approximatif contenant la distance routière depuis Conakry et le temps de trajet suffit pour démarrer, et se corrige ensuite.

En attendant, la zone 5 du module `M4_TENSION` affiche « non renseigné » sur ses trois colonnes d'accessibilité. Le document 9, partie D, critère 3, le prévoit explicitement. **Le module se construit malgré tout.**

---

## 12. Ce qui reste ouvert

| Sujet | Effet | Où |
|---|---|---|
| Bornes de gamme tarifaire en GNF | **Bloque le recensement**, pas le développement | Doc 2, section 20 |
| Confirmation MATD du découpage | Bloque la mise en production | Doc 2, section 20 |
| Communes hors Conakry | Aucun, s'ajoutent au fil du recensement | Doc 2, section 20 |
| Contours géographiques | Aucun, repli spécifié | Doc 3, point 3 |
| Données d'accessibilité | Aucun, repli spécifié | Doc 3 point 4, doc 5 point 4 |
| Correspondance Grand Conakry | Aucun tant qu'aucune liste antérieure n'est importée | Doc 2, section 20 |
| Coefficient de retombées | Bloque l'activation de `M8` uniquement | Doc 4, point 3 |
| Vérification juridique des durées de conservation | Aucun, durées provisoires appliquées | Section 8 |

**Une seule décision bloque réellement le cœur du produit : les bornes de gamme tarifaire.** Elles conditionnent le recensement, qui conditionne l'Observatoire.

---

## 13. Récapitulatif des paramètres

Valeurs à porter en configuration, jamais en dur dans un composant.

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

---

*Document 13. Complète les documents 1 à 12 et les lots 9 bis, 9 ter et 9 quater.*
