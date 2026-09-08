# Document 10. Charte des libellés bilingue

**Projet :** Observatoire National de l'Hospitalité Guinéenne
**Maître d'ouvrage :** SIMANDOU SEJOUR
**Version :** 1.0
**Statut :** Prescriptif. Source unique de tous les textes de l'interface.
**Prérequis :** documents 2, 4, 6, 7, 8 et 9.

> **Règle absolue.** Aucune chaîne de caractères n'est écrite en dur dans un composant. Toute chaîne affichée provient d'une clé de ce document ou de la table `enumeration`.
>
> **Pourquoi.** Un développeur qui ne trouve pas un libellé l'invente. Un intitulé approximatif dans un outil destiné à une agence d'État coûte plus cher qu'une fonctionnalité manquante.

---

## 1. Principes

### 1.1 Convention de nommage des clés

Notation par points, en minuscules, sans accent, sans espace.

```
domaine.sous_domaine.element
```

Domaines : `nav`, `module`, `ctrl`, `kpi`, `state`, `export`, `auth`, `admin`, `legal`, `unit`.

Exemples : `nav.deconnexion`, `module.m1.titre`, `state.vide.defaut`, `kpi.off_taux_couverture.libelle`.

### 1.2 Deux sources de textes

| Source | Contenu | Où |
|---|---|---|
| Fichiers de traduction | Interface, états, messages, titres | `fr.json` et `en.json` |
| Table `enumeration` | Valeurs des listes fermées | Colonnes `libelle_fr` et `libelle_en` |

Un libellé d'énumération n'est jamais dupliqué dans un fichier de traduction. Il vient de la base.

### 1.3 Allongement

Prévoir 30 % d'allongement en anglais sur les étiquettes courtes. Aucune largeur fixe sur un conteneur d'étiquette.

### 1.4 Terminologie non traduite

Les termes normalisés du secteur hôtelier restent identiques dans les deux langues :

`ADR`, `RevPAR`, `ALOS`, `GNF`.

Leur développé est en revanche traduit. En français : « Prix moyen journalier ». En anglais : « Average Daily Rate ».

### 1.5 Ton

Institutionnel, sobre, factuel. Aucune familiarité, aucun point d'exclamation, aucune formule commerciale, aucun emoji.

Les messages d'état vide expliquent une situation, ils ne s'excusent pas.

---

## 2. Formats

| Élément | Français | Anglais |
|---|---|---|
| Date courte | 07/09/2026 | 09/07/2026 |
| Date longue | 7 septembre 2026 | September 7, 2026 |
| Date et heure | 07/09/2026 à 14:32 | 09/07/2026 at 2:32 PM |
| Séparateur de milliers | Espace insécable : 3 180 | Virgule : 3,180 |
| Séparateur décimal | Virgule : 6,7 % | Point : 6.7% |
| Pourcentage | 6,7 % avec espace insécable | 6.7% sans espace |
| Devise | 450 000 GNF | GNF 450,000 |
| Plage de dates | du 1er au 15 novembre 2026 | November 1 to 15, 2026 |
| Durée | 3,2 nuits | 3.2 nights |
| Délai | 21 jours | 21 days |

Fuseau d'affichage : Africa/Conakry, dans les deux langues.

---

## 3. Chrome et navigation

| Clé | Français | Anglais |
|---|---|---|
| `app.titre` | Observatoire National de l'Hospitalité Guinéenne | National Observatory of Guinean Hospitality |
| `app.titre_court` | Observatoire | Observatory |
| `app.attribution` | Une infrastructure Simandou Séjour | A Simandou Séjour infrastructure |
| `nav.modules` | Modules | Modules |
| `nav.compte` | Mon compte | My account |
| `nav.langue` | Langue | Language |
| `nav.deconnexion` | Se déconnecter | Sign out |
| `nav.aide` | Aide | Help |
| `nav.methodologie` | Méthodologie | Methodology |

### Bandeau de périmètre

| Clé | Français | Anglais |
|---|---|---|
| `perimetre.titre` | Périmètre observé | Observed scope |
| `perimetre.etablissements` | {n} établissements recensés | {n} establishments surveyed |
| `perimetre.partenaires` | dont {n} partenaires | including {n} partners |
| `perimetre.couverture` | soit {p} de la capacité identifiée | representing {p} of identified capacity |
| `perimetre.date` | Données au {date} | Data as of {date} |
| `perimetre.avertissement` | Les indicateurs de conjoncture portent sur le périmètre observé et ne constituent pas une statistique nationale exhaustive. | Market indicators cover the observed scope only and do not constitute exhaustive national statistics. |

---

## 4. Modules

| Clé | Français | Anglais |
|---|---|---|
| `module.m1.titre` | Offre nationale d'hébergement | National accommodation supply |
| `module.m1.court` | Offre | Supply |
| `module.m2.titre` | Demande exprimée | Expressed demand |
| `module.m2.court` | Demande | Demand |
| `module.m3.titre` | Activité observée | Observed activity |
| `module.m3.court` | Activité | Activity |
| `module.m4.titre` | Tension et déficit d'offre | Pressure and supply gap |
| `module.m4.court` | Tension | Pressure |
| `module.m5.titre` | Conformité et classification | Compliance and classification |
| `module.m5.court` | Conformité | Compliance |
| `module.m6.titre` | Maturité numérique du secteur | Sector digital maturity |
| `module.m6.court` | Maturité numérique | Digital maturity |
| `module.m7.titre` | Événementiel et pics de demande | Events and demand peaks |
| `module.m7.court` | Événementiel | Events |
| `module.m8.titre` | Retombées économiques estimées | Estimated economic impact |
| `module.m8.court` | Retombées estimées | Estimated impact |
| `module.m9.titre` | Synthèse institutionnelle | Institutional summary |
| `module.m9.court` | Synthèse | Summary |
| `module.m10.titre` | Méthodologie | Methodology |
| `module.m11.titre` | Administration | Administration |

---

## 5. Barre de contrôle et filtres

| Clé | Français | Anglais |
|---|---|---|
| `ctrl.niveau` | Niveau géographique | Geographic level |
| `ctrl.periode` | Période | Period |
| `ctrl.periode.7j` | 7 derniers jours | Last 7 days |
| `ctrl.periode.30j` | 30 derniers jours | Last 30 days |
| `ctrl.periode.90j` | 90 derniers jours | Last 90 days |
| `ctrl.periode.12m` | 12 derniers mois | Last 12 months |
| `ctrl.periode.perso` | Période personnalisée | Custom period |
| `ctrl.filtres` | Filtres | Filters |
| `ctrl.filtre.typologie` | Typologie | Type |
| `ctrl.filtre.gamme` | Gamme tarifaire | Price range |
| `ctrl.filtre.statut_relation` | Statut | Status |
| `ctrl.filtre.motif` | Motif de séjour | Purpose of stay |
| `ctrl.filtre.canal` | Canal | Channel |
| `ctrl.filtre.nature_echec` | Nature de l'échec | Type of failure |
| `ctrl.filtre.tous` | Tous | All |
| `ctrl.filtre.toutes` | Toutes | All |
| `ctrl.reinitialiser` | Réinitialiser | Reset |
| `ctrl.exporter` | Exporter | Export |
| `ctrl.retour_national` | Retour au national | Back to national |

### Niveaux géographiques

| Clé | Français | Anglais |
|---|---|---|
| `geo.national` | National | National |
| `geo.region` | Région | Region |
| `geo.prefecture` | Préfecture | Prefecture |
| `geo.commune` | Commune | Commune |

**Cas de Conakry.** Conakry n'a pas de niveau préfectoral. Le fil d'Ariane passe directement de la région aux communes.

| Clé | Français | Anglais |
|---|---|---|
| `geo.conakry_note` | Conakry est une zone spéciale : ses communes se rattachent directement à la région. | Conakry is a special zone: its communes report directly to the region. |

---

## 6. Statuts de donnée et fiabilité

Ces libellés viennent de la table `enumeration`. Ils sont reproduits ici pour référence et pour l'alimentation initiale de la base.

### Statut de donnée

| Code | Français | Anglais |
|---|---|---|
| `RECENSE` | Recensé | Surveyed |
| `OBSERVE` | Observé | Observed |
| `EXPRIME` | Exprimé | Expressed |
| `DECLARE` | Déclaré | Declared |
| `ESTIME` | Estimé | Estimated |

### Niveau de fiabilité

| Code | Français | Anglais |
|---|---|---|
| `CONSOLIDE` | Consolidé | Consolidated |
| `INDICATIF` | Indicatif | Indicative |
| `SIGNAL` | Signal | Signal |

### Infobulles explicatives

| Clé | Français | Anglais |
|---|---|---|
| `fiab.consolide.aide` | Effectif suffisant, valeur stable. | Sufficient sample size, stable value. |
| `fiab.indicatif.aide` | Effectif faible, tendance à interpréter avec prudence. | Small sample size, interpret the trend with caution. |
| `fiab.signal.aide` | Effectif très faible, valeur d'alerte et non de mesure. | Very small sample size, an alert rather than a measurement. |

---

## 7. Énumérations métier

Valeurs à charger dans la table `enumeration`.

### Typologie

| Code | Français | Anglais |
|---|---|---|
| `HOTEL` | Hôtel | Hotel |
| `RESIDENCE` | Résidence meublée | Serviced apartment |
| `AUBERGE` | Auberge | Guesthouse |
| `MAISON_HOTES` | Maison d'hôtes | Bed and breakfast |
| `LODGE` | Lodge | Lodge |
| `RECEPTIF` | Réceptif événementiel | Event venue with accommodation |

### Gamme tarifaire

| Code | Français | Anglais |
|---|---|---|
| `G1` | Économique | Budget |
| `G2` | Intermédiaire | Midscale |
| `G3` | Supérieur | Upscale |
| `G4` | Haut de gamme | Luxury |

### Statut de relation

| Code | Français | Anglais |
|---|---|---|
| `RECENSE` | Recensé | Surveyed |
| `PARTENAIRE_ACTIF` | Partenaire actif | Active partner |
| `PARTENAIRE_INACTIF` | Partenaire inactif | Inactive partner |
| `REFUS` | Refus | Declined |
| `DOUBLON` | Doublon | Duplicate |

### Statut de résultat de recherche

| Code | Français | Anglais |
|---|---|---|
| `RESULTATS_DISPONIBLES` | Résultats disponibles | Results available |
| `OFFRE_INDISPONIBLE` | Offre existante indisponible | Existing supply unavailable |
| `NON_RESERVABLE` | Offre recensée non réservable | Surveyed supply not bookable |
| `AUCUNE_OFFRE` | Aucune offre référencée | No supply on record |
| `HORS_PERIMETRE` | Hors périmètre | Out of scope |

### Libellés de lecture des états d'échec

Utilisés dans le module `M4_TENSION`, où le sens prime sur le code.

| Clé | Français | Anglais |
|---|---|---|
| `echec.aucune_offre.lecture` | Il manque des établissements | Establishments are missing |
| `echec.non_reservable.lecture` | Il manque de la numérisation | Digital presence is missing |
| `echec.offre_indisponible.lecture` | Il manque de la capacité | Capacity is missing |
| `echec.hors_perimetre.lecture` | Localité hors référentiel | Locality not in the reference list |

### Motif de séjour

| Code | Français | Anglais |
|---|---|---|
| `AFFAIRES` | Affaires | Business |
| `LOISIRS` | Loisirs | Leisure |
| `FAMILIAL` | Familial | Family |
| `EVENEMENTIEL` | Événementiel | Event |
| `MISSION` | Mission | Official mission |
| `NON_DECLARE` | Non déclaré | Not stated |

### Type d'appareil et canal

| Code | Français | Anglais |
|---|---|---|
| `DESKTOP` | Ordinateur | Desktop |
| `TABLETTE` | Tablette | Tablet |
| `MOBILE` | Téléphone | Mobile |
| `WEB` | Web | Web |
| `WHATSAPP` | WhatsApp | WhatsApp |
| `AUTRE` | Autre | Other |

### Équipements

| Code | Français | Anglais |
|---|---|---|
| `RESTAURATION` | Restauration sur place | On-site dining |
| `SALLE_REUNION` | Salle de réunion | Meeting room |
| `GROUPE_ELECTROGENE` | Groupe électrogène | Backup generator |
| `WIFI` | Connexion internet | Internet access |
| `CLIMATISATION` | Climatisation | Air conditioning |
| `EAU_CHAUDE` | Eau chaude | Hot water |
| `PARKING` | Parking | Parking |
| `PISCINE` | Piscine | Swimming pool |
| `NAVETTE_AEROPORT` | Navette aéroport | Airport shuttle |
| `BLANCHISSERIE` | Blanchisserie | Laundry service |
| `SECURITE_24H` | Sécurité permanente | 24-hour security |
| `ACCES_PMR` | Accès aux personnes à mobilité réduite | Wheelchair access |
| `PAIEMENT_CARTE` | Paiement par carte | Card payment |
| `PAIEMENT_MOBILE_MONEY` | Paiement mobile money | Mobile money payment |

### Accessibilité

| Code | Français | Anglais |
|---|---|---|
| `BITUMEE_BONNE` | Route bitumée en bon état | Paved road, good condition |
| `BITUMEE_DEGRADEE` | Route bitumée dégradée | Paved road, poor condition |
| `PISTE_AMENAGEE` | Piste aménagée | Improved track |
| `PISTE_SOMMAIRE` | Piste sommaire | Unimproved track |
| `TOUTE_ANNEE` | Praticable toute l'année | Passable year-round |
| `DIFFICILE_PLUIES` | Difficile en saison des pluies | Difficult in rainy season |
| `IMPRATICABLE_PLUIES` | Impraticable en saison des pluies | Impassable in rainy season |
| `INCONNU` | Non renseigné | Not recorded |

### Demande institutionnelle

| Code | Français | Anglais |
|---|---|---|
| `SOMMET` | Sommet ou forum | Summit or forum |
| `CONFERENCE` | Conférence ou séminaire | Conference or seminar |
| `MISSION` | Mission officielle | Official mission |
| `DELEGATION` | Délégation ou visite d'État | Delegation or state visit |
| `FORMATION` | Formation ou atelier | Training or workshop |
| `COMPETITION` | Compétition | Competition |
| `ANNONCEE` | Annoncée | Announced |
| `CONFIRMEE` | Confirmée | Confirmed |
| `SATISFAITE` | Satisfaite | Fulfilled |
| `PARTIELLEMENT_SATISFAITE` | Partiellement satisfaite | Partially fulfilled |
| `NON_SATISFAITE` | Non satisfaite | Not fulfilled |
| `ANNULEE` | Annulée | Cancelled |

---

## 8. Libellés d'indicateurs

Clé de forme `kpi.<code>.libelle` et `kpi.<code>.aide`.

### Offre

| Code | Français | Anglais |
|---|---|---|
| `OFF_ETAB_RECENSES` | Établissements recensés | Establishments surveyed |
| `OFF_CAPACITE_RECENSEE` | Capacité recensée | Surveyed capacity |
| `OFF_ETAB_PARTENAIRES` | Établissements partenaires | Partner establishments |
| `OFF_TAUX_COUVERTURE` | Taux de couverture plateforme | Platform coverage rate |
| `OFF_TAUX_NUMERISATION` | Taux de numérisation de l'offre | Supply digitalisation rate |
| `OFF_TAUX_RESERVABILITE` | Taux de réservabilité en ligne | Online bookability rate |
| `OFF_COMPLETUDE_FICHE` | Complétude documentaire | Record completeness |
| `OFF_TAUX_VERIFICATION` | Taux de fiches vérifiées | Verified records rate |
| `OFF_ECART_LISTE_ADMIN` | Écart entre liste administrative et terrain | Gap between official list and field |

### Maturité numérique

| Code | Français | Anglais |
|---|---|---|
| `MAT_INDICE` | Indice de maturité numérique | Digital maturity index |
| `MAT_TAUX_PAIEMENT_NUMERIQUE` | Taux d'acceptation du paiement numérique | Digital payment acceptance rate |

### Demande exprimée

| Code | Français | Anglais |
|---|---|---|
| `DEM_VOLUME_RECHERCHES` | Volume de recherches | Search volume |
| `DEM_DESTINATIONS_TOP` | Destinations les plus recherchées | Most searched destinations |
| `DEM_ORIGINE_PAYS` | Origine des connexions par pays | Connection origin by country |
| `DEM_BOOKING_WINDOW` | Délai de projection médian | Median booking window |
| `DEM_DUREE_SEJOUR_RECHERCHEE` | Durée de séjour recherchée médiane | Median searched length of stay |
| `DEM_BUDGET_RECHERCHE` | Budget recherché médian | Median searched budget |
| `DEM_SAISONNALITE` | Saisonnalité de l'intention | Seasonality of intent |
| `DEM_DESTINATIONS_NON_RECONNUES` | Destinations hors référentiel | Destinations outside the reference list |

### Tension

| Code | Français | Anglais |
|---|---|---|
| `TEN_TAUX_INFRUCTUEUX` | Taux de recherche infructueuse | Unsuccessful search rate |
| `TEN_REPARTITION_ECHEC` | Nature des recherches infructueuses | Nature of unsuccessful searches |
| `TEN_INDICE_TENSION` | Indice de tension | Pressure index |
| `TEN_CAPACITE_MANQUANTE` | Capacité manquante estimée | Estimated missing capacity |
| `TEN_CLASSEMENT_DEFICIT` | Territoires en déficit d'offre | Territories with a supply gap |
| `TEN_FENETRES_SATURATION` | Fenêtres de saturation | Saturation windows |

### Demande institutionnelle

| Code | Français | Anglais |
|---|---|---|
| `INS_VOLUME_DEMANDE` | Unités demandées | Units requested |
| `INS_TAUX_COUVERTURE` | Taux de couverture des besoins institutionnels | Institutional needs coverage rate |
| `INS_DEFICIT` | Déficit institutionnel | Institutional shortfall |

### Activité observée

| Code | Français | Anglais |
|---|---|---|
| `ACT_RESERVATIONS` | Réservations confirmées | Confirmed bookings |
| `ACT_NUITEES` | Nuitées générées | Room nights generated |
| `ACT_TAUX_OCCUPATION` | Taux d'occupation | Occupancy rate |
| `ACT_TAUX_OCCUPATION_CONTRACTUALISE` | Taux d'occupation sur capacité contractualisée | Occupancy on contracted capacity |
| `ACT_ADR` | Prix moyen journalier (ADR) | Average Daily Rate (ADR) |
| `ACT_REVPAR` | Revenu par unité disponible (RevPAR) | Revenue per Available Unit (RevPAR) |
| `ACT_ALOS` | Durée moyenne de séjour (ALOS) | Average Length of Stay (ALOS) |
| `ACT_LEAD_TIME` | Délai de réservation réalisé | Actual booking lead time |
| `ACT_TAUX_ANNULATION` | Taux d'annulation | Cancellation rate |
| `ACT_TAUX_NON_PRESENTATION` | Taux de non-présentation | No-show rate |
| `ACT_TAUX_CONVERSION` | Taux de conversion | Conversion rate |

### Conformité

| Code | Français | Anglais |
|---|---|---|
| `CONF_TAUX_ENREGISTREMENT` | Taux d'enregistrement administratif | Administrative registration rate |
| `CONF_TAUX_CLASSIFICATION` | Taux de classification | Classification rate |
| `CONF_ECART_ENREGISTREMENT` | Établissements dont l'enregistrement n'est pas documenté | Establishments with undocumented registration |

### Événementiel et retombées

| Code | Français | Anglais |
|---|---|---|
| `EVE_CAPACITE_MOBILISABLE` | Capacité mobilisable | Mobilisable capacity |
| `EVE_CAPACITE_SALLES` | Capacité de salles de réunion | Meeting room capacity |
| `EVE_TAUX_TENSION_EVENEMENT` | Tension sur la fenêtre événementielle | Pressure over the event window |
| `RET_DEPENSE_HEBERGEMENT` | Dépense d'hébergement observée | Observed accommodation spending |
| `RET_DEPENSE_TOTALE_ESTIMEE` | Dépense touristique totale estimée | Estimated total tourism spending |

### Contexte

| Code | Français | Anglais |
|---|---|---|
| `CTX_RECENSEMENT_PROGRESSION` | Progression du recensement | Survey progress |
| `CTX_FRAICHEUR_DONNEE` | Dernière mise à jour | Last updated |

---

## 9. Unités

| Clé | Français | Anglais |
|---|---|---|
| `unit.etablissement` | établissement | establishment |
| `unit.etablissements` | établissements | establishments |
| `unit.unite` | unité | unit |
| `unit.unites` | unités | units |
| `unit.nuit` | nuit | night |
| `unit.nuits` | nuits | nights |
| `unit.nuitee` | nuitée | room night |
| `unit.nuitees` | nuitées | room nights |
| `unit.jour` | jour | day |
| `unit.jours` | jours | days |
| `unit.recherche` | recherche | search |
| `unit.recherches` | recherches | searches |
| `unit.place` | place | seat |
| `unit.places` | places | seats |
| `unit.km` | km | km |
| `unit.gnf` | GNF | GNF |

---

## 10. Les cinq états

### État 1, chargement

| Clé | Français | Anglais |
|---|---|---|
| `state.chargement` | Chargement des données | Loading data |

### État 3, données vides

| Clé | Français | Anglais |
|---|---|---|
| `state.vide.defaut` | Aucune donnée sur ce périmètre. | No data for this scope. |
| `state.vide.etablissements` | Aucun établissement recensé sur ce territoire. | No establishment surveyed in this territory. |
| `state.vide.recherches` | Aucune recherche enregistrée sur la période. | No searches recorded for this period. |
| `state.vide.mediane` | Pas encore assez de recherches pour calculer une médiane. | Not enough searches yet to compute a median. |
| `state.vide.budget` | Aucune recherche avec filtre budget sur la période. | No searches with a budget filter for this period. |
| `state.vide.saisonnalite` | L'historique est encore trop court pour dégager une saisonnalité. | The history is still too short to identify seasonality. |
| `state.vide.echecs` | Aucune recherche infructueuse sur la période. | No unsuccessful searches for this period. |
| `state.vide.deficit` | Aucun territoire en déficit sur la période. | No territory with a supply gap for this period. |
| `state.vide.saturation` | Aucune fenêtre de saturation détectée. | No saturation window detected. |
| `state.vide.hors_referentiel` | Aucune destination hors référentiel sur la période. | No destination outside the reference list for this period. |
| `state.vide.subdivision` | Ce territoire n'a pas de subdivision référencée. | This territory has no recorded subdivision. |
| `state.vide.carte` | Aucune donnée cartographique sur ce périmètre. | No map data for this scope. |
| `state.vide.conformite` | Aucune donnée de conformité transmise à ce jour. | No compliance data provided to date. |

### État 4, données masquées

Libellé invariable, jamais reformulé.

| Clé | Français | Anglais |
|---|---|---|
| `state.masque` | Non publié : effectif insuffisant pour préserver la confidentialité des établissements. | Not published: sample size too small to protect establishment confidentiality. |
| `state.masque.court` | Non publié | Not published |
| `state.masque.aide` | Un agrégat de performance n'est publié que si l'échantillon comporte au moins trois établissements et qu'aucun n'y est prépondérant. | A performance aggregate is published only if the sample includes at least three establishments and none is predominant. |

### Cas particuliers

| Clé | Français | Anglais |
|---|---|---|
| `state.tension_indefinie` | Capacité réservable nulle sur ce territoire. | No bookable capacity in this territory. |
| `state.estimation_non_produite` | Moins de 10 recherches en échec, estimation non produite. | Fewer than 10 failed searches, estimate not produced. |
| `state.masque_budget` | Non publié : moins de 10 recherches avec filtre budget sur la période. | Not published: fewer than 10 searches with a budget filter for this period. |
| `state.non_renseigne` | Non renseigné | Not recorded |

### État 5, erreur

| Clé | Français | Anglais |
|---|---|---|
| `state.erreur.titre` | Les données n'ont pas pu être chargées. | Data could not be loaded. |
| `state.erreur.action` | Réessayer | Try again |
| `state.erreur.persistante` | Si le problème persiste, contactez votre administrateur. | If the problem persists, contact your administrator. |

---

## 11. Exports

| Clé | Français | Anglais |
|---|---|---|
| `export.titre` | Exporter | Export |
| `export.pdf` | Document PDF | PDF document |
| `export.image` | Image | Image |
| `export.generation` | Génération du document | Generating document |
| `export.reference` | Référence : {ref} | Reference: {ref} |
| `export.genere_par` | Document généré par {nom}, {institution} | Document generated by {nom}, {institution} |
| `export.genere_le` | Généré le {date} | Generated on {date} |
| `export.source` | Source : Observatoire National de l'Hospitalité Guinéenne, une infrastructure Simandou Séjour | Source: National Observatory of Guinean Hospitality, a Simandou Séjour infrastructure |
| `export.version_indicateurs` | Version des indicateurs : {version} | Indicator version: {version} |
| `export.usage` | Usage institutionnel. Reproduction autorisée avec mention de la source. | Institutional use. Reproduction permitted with source attribution. |

---

## 12. Authentification et compte

| Clé | Français | Anglais |
|---|---|---|
| `auth.titre` | Observatoire National de l'Hospitalité Guinéenne | National Observatory of Guinean Hospitality |
| `auth.accroche` | Mesurer l'offre. Comprendre la demande. Éclairer la décision. | Measure supply. Understand demand. Inform decisions. |
| `auth.sous_titre` | Accès réservé aux institutions partenaires. | Reserved for partner institutions. |
| `auth.email` | Adresse professionnelle | Work email address |
| `auth.mot_de_passe` | Mot de passe | Password |
| `auth.connexion` | Se connecter | Sign in |
| `auth.code_verification` | Code de vérification | Verification code |
| `auth.mot_de_passe_oublie` | Mot de passe oublié | Forgot password |
| `auth.pas_de_compte` | L'accès à l'Observatoire se fait sur invitation. Rapprochez-vous de votre point focal. | Access to the Observatory is by invitation. Please contact your focal point. |
| `auth.erreur.identifiants` | Identifiants incorrects. | Incorrect credentials. |
| `auth.erreur.suspendu` | Votre accès est suspendu. Contactez votre administrateur. | Your access is suspended. Contact your administrator. |
| `auth.erreur.expire` | Votre accès a expiré. | Your access has expired. |
| `compte.profil` | Profil | Profile |
| `compte.institution` | Institution | Institution |
| `compte.expiration` | Accès valable jusqu'au {date} | Access valid until {date} |

---

## 13. Vocabulaire imposé

Formulations obligatoires. Toute autre formulation est une erreur, y compris si elle est plus courte ou plus naturelle.

| Ne jamais écrire | Écrire | Raison |
|---|---|---|
| Origine des voyageurs | Origine des connexions | La géolocalisation réseau ne dit pas d'où vient le voyageur |
| Traveller origin | Connection origin | Idem |
| Établissements informels | Établissements dont l'enregistrement n'est pas documenté | Les partenaires hôteliers lisent l'Observatoire |
| Informal establishments | Establishments with undocumented registration | Idem |
| Note, score de qualité, classement | Aucun équivalent. Ces notions n'existent pas dans l'outil | Classer est un pouvoir régalien |
| Délai moyen, durée moyenne | Délai médian, durée médiane | Le document 4 prescrit la médiane |
| Données indisponibles, erreur | Non publié : effectif insuffisant... | Un masquage n'est pas une panne |
| Notre plateforme, nous | Simandou Séjour, l'Observatoire | Registre institutionnel |
| Chiffre d'affaires | Dépense d'hébergement observée | L'outil ne mesure pas un revenu d'entreprise |
| Clients | Établissements, partenaires | Registre institutionnel |
| Taux de remplissage | Taux d'occupation | Terminologie normalisée du secteur |

---

## 14. Vocabulaire interdit

Aucune de ces notions n'apparaît dans l'interface, sous aucune forme, dans aucune langue.

- Commission, marge, revenu net, chiffre d'affaires de Simandou Séjour
- Nom d'un établissement dans un agrégat
- Nom, prénom ou coordonnées d'un voyageur
- Note, score ou classement d'établissement
- Toute mention nominative d'une institution écrite en dur

---

## 15. Points ouverts

1. Traduction anglaise à faire relire par une personne connaissant la terminologie hôtelière.
2. Libellés du module `M11_ADMIN`, à produire avec sa fiche fonctionnelle.
3. Textes d'aide contextuelle par indicateur, dérivés des définitions du document 4.
4. Formulation du courriel d'invitation à un compte institutionnel.

---

*Document 10 sur 12. Document précédent : spécifications fonctionnelles par module. Document suivant : architecture technique et conventions de code.*
