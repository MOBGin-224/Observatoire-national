# Document 1. Note de cadrage produit

**Projet :** Observatoire National de l'Hospitalité Guinéenne
**Maître d'ouvrage :** SIMANDOU SEJOUR
**Version :** 1.1
**Statut :** Document fondateur. À lire avant toute session de développement.

---

## 1. Qui est Simandou Séjour

SIMANDOU SEJOUR est une entreprise guinéenne de droit privé, immatriculée au RCCM sous le numéro GN.TCC.2025.A.18026, établie à la Blue-zone de Dixinn, Conakry, République de Guinée.

Elle opère **simandousejour.com**, plateforme numérique de réservation d'hébergement en Guinée. La plateforme est en production, elle fonctionne, elle reçoit du trafic et traite des réservations réelles. Elle est développée en Next.js. Elle propose la recherche d'établissements, la réservation en ligne avec paiement d'un acompte ou paiement intégral, un espace voyageur, et un espace partenaire permettant aux hôteliers de gérer leurs tarifs, leurs disponibilités et leurs réservations.

L'entreprise a été distinguée par le Grand Prix FONIJ 2025 et figure au Top 50 FODIP du Sommet Économique et Financier de Guinée 2026.

---

## 2. Ce que l'entreprise cherche à faire

La Guinée dispose d'une offre d'hébergement réelle et d'une demande réelle, mais elles ne se rencontrent presque jamais par un canal traçable. Les réservations se font par bouche-à-oreille, par WhatsApp, par appel direct ou par intermédiaire informel. Il en résulte trois choses. Le voyageur n'a aucune garantie. L'hôtelier n'a aucune visibilité au-delà de son cercle. Et l'État ne dispose d'aucune donnée sur son propre secteur touristique.

Simandou Séjour ne se positionne pas comme une agence de voyage ni comme un simple site de réservation. Elle se construit comme **l'infrastructure numérique de l'hospitalité guinéenne** : la couche technique qui rend l'offre nationale visible, réservable, mesurable et fiable.

La vision est **panafricaine**. Le modèle est conçu pour être répliqué dans d'autres marchés africains où la même situation prévaut : une offre d'hébergement abondante mais invisible, une demande qui existe mais qui se perd dans l'informel, et des institutions dépourvues d'instruments de mesure. La Guinée est le marché de démonstration, pas la limite de l'ambition. Une infrastructure de données conçue pour un pays où l'offre est peu numérisée est directement transposable à la plupart des marchés du continent.

---

## 3. Ce que nous construisons ici

Ce projet n'est pas la plateforme de réservation. **La plateforme existe déjà, elle est en production, et elle n'est pas à développer.**

Nous construisons un produit distinct et autonome : l'**Observatoire National de l'Hospitalité Guinéenne**, une infrastructure Simandou Séjour.

C'est une application web en accès réservé, destinée aux institutions publiques et aux partenaires techniques et financiers du secteur du tourisme. Elle restitue, sous forme de tableaux de bord, une lecture chiffrée du secteur de l'hébergement en Guinée : ce qui existe, ce qui est demandé, et l'écart entre les deux.

Elle est développée à partir de zéro, comme une application indépendante, avec son propre socle de données et sa propre authentification.

### Trajectoire d'intégration

L'Observatoire est conçu dès maintenant pour être raccordé, à terme, à l'infrastructure de simandousejour.com. La plateforme alimentera alors l'Observatoire en continu : offre commercialisée, demande exprimée par les recherches des visiteurs, activité de réservation. Cette connexion interviendra dans une phase ultérieure et **ne fait pas partie du périmètre de développement actuel**.

Deux conséquences sur la conception, à respecter dès la première ligne de code :

- La couche de données de l'Observatoire doit être alimentable par une source externe, au moyen d'un flux d'alimentation clairement isolé du reste de l'application.
- Le modèle de données doit être conçu comme la cible de ce flux, avec des identifiants stables et des structures capables d'accueillir la donnée de production sans être remaniées.

En attendant ce raccordement, l'Observatoire fonctionne de manière autonome, sur les données qui lui sont propres, notamment le recensement des établissements et la demande institutionnelle déclarée.

---

## 4. Pourquoi cet outil existe

Les institutions guinéennes chargées de la promotion touristique et de la tutelle du secteur ne disposent d'aucune donnée d'hébergement en continu. Elles produisent de l'attractivité sans pouvoir mesurer ce qu'elle génère. Elles démarchent des investisseurs sans pouvoir documenter la demande. Elles doivent classer des établissements sans en posséder l'inventaire. Elles organisent des sommets sans savoir si le pays peut héberger les délégations.

Simandou Séjour produit cette donnée par son activité même. L'Observatoire est l'instrument qui la restitue, sous une forme utilisable par une institution, **sans jamais céder la donnée elle-même**.

Pour l'entreprise, l'Observatoire remplit trois fonctions :

- Il installe Simandou Séjour comme source de référence du secteur.
- Il crée une relation institutionnelle durable et non dépendante d'un contrat commercial.
- Il ouvre une seconde ligne de produit, réplicable dans chaque pays où l'entreprise s'implantera.

---

## 5. Les trois questions auxquelles l'outil répond

Toute fonctionnalité de l'Observatoire doit servir l'une de ces trois questions. Une fonctionnalité qui n'en sert aucune n'entre pas dans le périmètre.

**1. Quelle est l'offre d'hébergement en Guinée.**
Combien d'établissements, où, de quelle nature, de quelle capacité, avec quels équipements, à quel niveau de prix, et quelle part de cette offre est réellement réservable en ligne.

**2. Quelle est la demande d'hébergement.**
Deux sources distinctes. La **demande exprimée** par les visiteurs de la plateforme : qui cherche à venir, depuis quel pays, vers quelle destination, à quelles dates, pour quelle durée, avec quel budget. Et la **demande déclarée** par les institutions : besoins d'hébergement annoncés pour un sommet, une mission ou une délégation, qui ne transitent jamais par une plateforme et resteraient invisibles autrement.

**3. Où se situe l'écart entre les deux.**
Dans quelles localités une demande s'exprime sans offre disponible, sans offre réservable, ou sans aucune offre connue. Et dans quelles conditions d'accessibilité, car un déficit dans une zone desservie toute l'année et un déficit dans une zone impraticable six mois par an n'appellent pas la même réponse.

---

## 6. Les utilisateurs

Cinq profils institutionnels, tous en accès nominatif :

| Profil | Nature |
|---|---|
| Attractivité et promotion | Promotion de la destination, rayonnement, événements |
| Investissement | Attraction d'investisseurs, développement du secteur privé |
| Tutelle sectorielle | Réglementation, classification, suivi du secteur |
| Bailleur et partenaire technique | Financement et appui aux programmes du secteur |
| Organisateur d'événement | Sommets, forums, conférences nécessitant de l'hébergement |

Tous disposent des mêmes niveaux de finesse géographique : **national, régional, préfectoral, communal**. Ils diffèrent par les modules auxquels ils accèdent.

---

## 7. Ce que l'Observatoire n'est pas

Section à relire avant toute décision de conception.

- **Ce n'est pas la plateforme de réservation.** Aucune fonction de recherche, de réservation ou de paiement. La plateforme existe et n'est pas concernée par ce projet.
- **Ce n'est pas un outil de pilotage commercial de Simandou Séjour.** Aucune commission, aucune marge, aucun revenu de l'entreprise n'y apparaît.
- **Ce n'est pas un outil de gestion de réservation de groupe.** Les besoins institutionnels y sont enregistrés comme donnée de demande, jamais traités comme des dossiers à réserver ou à commercialiser.
- **Ce n'est pas une base de données livrable.** L'outil sert des restitutions, il ne cède jamais la donnée.
- **Ce n'est pas un outil grand public.** Accès réservé, comptes nominatifs.
- **Ce n'est pas un site web.** L'application ne comporte aucune partie publique : ni page d'accueil, ni page de présentation, ni section « à propos », ni page de contact, ni pied de page institutionnel, ni contenu marketing, ni tunnel d'inscription. Elle se compose d'un écran de connexion et d'un tableau de bord, rien d'autre. La racine du domaine affiche l'écran de connexion ; toute adresse consultée sans session valide y redirige.
- **Ce n'est pas une application mobile.** Web uniquement, desktop et tablette.
- **Ce n'est pas un produit propre à une institution.** Aucun nom, logo ou périmètre d'institution ne doit être écrit dans le code. Ce sont des données de configuration.
- **Ce n'est pas un outil de notation des établissements.** L'Observatoire ne produit aucun classement, aucune note et aucun score de qualité. Classer relève de l'autorité publique.

---

## 8. Principes non négociables

**Trois interdictions structurelles.**
L'Observatoire n'expose jamais de donnée financière de Simandou Séjour, jamais de donnée nominative par établissement, jamais de donnée personnelle de voyageur. Ces interdictions se garantissent par l'architecture, pas par une consigne.

**La donnée est servie, jamais cédée.**
Exports en PDF et image uniquement, filigranés et horodatés. Aucun export de données structurées, aucune API ouverte.

**Toute donnée affichée porte son statut et son périmètre.**
L'outil distingue en permanence ce qui est recensé, observé, exprimé, déclaré ou estimé, et affiche le périmètre sur lequel chaque chiffre est calculé.

**Un petit chiffre vrai vaut mieux qu'un grand chiffre approximatif.**
Les volumes bruts sont toujours affichés, quel que soit leur effectif. Aucune donnée n'est jamais inventée, simulée, arrondie pour l'apparence, ni générée à titre d'illustration, y compris pendant le développement.

**Les ratios de performance obéissent à un seuil de confidentialité.**
Un agrégat de performance hôtelière n'est publié que si l'échantillon comporte au moins trois établissements et qu'aucun n'y est prépondérant. Sinon la valeur est masquée, avec une mention explicite.

**L'état dégradé est l'état normal.**
Au lancement, la majorité des cellules seront vides ou masquées. Ces états se conçoivent et se soignent au même titre que les états nominaux.

**Attribution permanente.**
La mention « une infrastructure Simandou Séjour » est présente à l'écran et sur tout export, non paramétrable.

---

## 9. État du projet

Rien n'est développé. Aucune base, aucun écran, aucun code.

Le recensement des établissements est en cours de lancement en parallèle. Au démarrage, la base contiendra un nombre restreint d'établissements et l'historique de demande sera nul. L'outil doit donc être **fonctionnel, lisible et honnête avec très peu de données**, et monter en charge ensuite.

---

*Document 1 sur 12. Documents suivants : taxonomies et référentiels, modèle de données, dictionnaire des indicateurs, plan de captation des données.*
