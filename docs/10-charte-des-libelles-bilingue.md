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
| `app.editeur` | Simandou Séjour | Simandou Séjour |
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
| `module.m1.territoires` | Lecture territoriale | Territorial reading |
| `module.m1.qualite_inventaire` | Qualité de l'inventaire | Inventory quality |
| `module.m1.repartition_typologie` | Répartition par typologie | Breakdown by type |
| `module.m1.repartition_gamme` | Répartition par gamme | Breakdown by price range |
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
| `module.m9.en_construction` | Module en construction. | Module under construction. |
| `module.m10.titre` | Méthodologie | Methodology |
| `module.m11.titre` | Administration | Administration |
| `module.m7.decomposition_partenaires` | Partenaires disponibles : disponibilité réelle connue | Available partners: actual availability known |
| `module.m7.decomposition_recenses` | Recensés non réservables : capacité théorique, disponibilité inconnue | Recorded non-bookable: theoretical capacity, availability unknown |

> Trois clés ajoutées le 2026-09-08 : `module.m9.en_construction` (écran d'atterrissage provisoire) et les deux libellés de la zone de décomposition de la capacité de `M7_EVENEMENTIEL` (document 9 quater, partie J.8/J.10), qui étaient codés en dur sans être documentés ici.
>
> Quatre clés supplémentaires ajoutées le 2026-09-08, lors de la refonte visuelle « Rapport d'État » : `module.m1.territoires`, `module.m1.qualite_inventaire` (titres de zone Z4/Z5, document 9 partie B), `module.m1.repartition_typologie` et `module.m1.repartition_gamme` (titres de la zone Z3), également codés en dur jusqu'ici.

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

> Sept clés ajoutées le 2026-09-08 pour la construction des modules `M3_ACTIVITE`, `M5_CONFORMITE`, `M6_MATURITE`, `M7_EVENEMENTIEL` et `M8_RETOMBEES` : `reservations`, `ecart_terrain`, `evaluation`, `evenement`, `salles`, `demande_institutionnelle`, `estimation_retombees`. Libellés repris mot pour mot des fiches fonctionnelles correspondantes (document 9 ter, parties I et J ; document 9 quater, parties K, L et M).

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
| `state.vide.reservations` | Aucune réservation sur la période. | No reservation for this period. |
| `state.vide.ecart_terrain` | Aucun écart constaté sur ce territoire. | No discrepancy found in this territory. |
| `state.vide.evaluation` | Aucun établissement à évaluer. | No establishment to assess. |
| `state.vide.evenement` | Aucun événement enregistré. Sélectionnez des dates libres. | No event recorded. Select free dates. |
| `state.vide.salles` | Aucune salle de réunion recensée sur ce territoire. | No meeting room surveyed in this territory. |
| `state.vide.demande_institutionnelle` | Aucune demande institutionnelle sur cette fenêtre. | No institutional request for this window. |
| `state.vide.estimation_retombees` | Estimation non produite en l'absence de dépense observée. | Estimate not produced in the absence of observed spend. |

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
| `auth.sous_titre` | Accès réservé aux institutions. | Reserved for institutions. |
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
| `auth.mfa.titre_inscription` | Sécuriser votre compte | Secure your account |
| `auth.mfa.instruction_inscription` | Second facteur obligatoire. Scannez ce code avec une application d'authentification, puis saisissez le code affiché. | Second factor required. Scan this code with an authenticator app, then enter the code shown. |
| `auth.mfa.cle_secrete` | Vous ne pouvez pas scanner ce code ? Saisissez cette clé manuellement dans votre application : | Can't scan this code? Enter this key manually in your app: |
| `auth.mfa.titre_verification` | Vérification en deux étapes | Two-step verification |
| `auth.mfa.instruction_verification` | Saisissez le code affiché dans votre application d'authentification. | Enter the code shown in your authenticator app. |
| `auth.mfa.valider` | Vérifier | Verify |
| `auth.erreur.code_invalide` | Code incorrect. Réessayez. | Incorrect code. Try again. |

> Sept clés ajoutées le 2026-09-08 pour l'inscription et la vérification du second facteur d'authentification (document 7, section 10 : "Second facteur obligatoire pour tous les comptes"), jusque là non implémenté. Modalité retenue : TOTP via une application d'authentification, en utilisant le support natif de Supabase Auth MFA. Ces écrans restent une étape du flux de l'écran de connexion unique (document 9, A.0), pas une nouvelle surface applicative.

---

## 12 bis. Administration (`M11_ADMIN`)

Libellés du back-office de saisie, produits avec la fiche fonctionnelle du document 9bis, partie H. Couvre le lot 1 : institutions et comptes, import du recensement. Les sections suivantes de M11 (fiche établissement, retours terrain, demande institutionnelle, calendrier, accessibilité, référentiels, journal/exports) complèteront cette liste à leur tour.

| Clé | Français | Anglais |
|---|---|---|
| `admin.carte_institutions.titre` | Institutions et comptes | Institutions and accounts |
| `admin.carte_institutions.description` | Créer une institution, inviter des comptes, gérer les accès. | Create an institution, invite accounts, manage access. |
| `admin.carte_import.titre` | Import du recensement | Survey import |
| `admin.carte_import.description` | Déposer un fichier de recensement, contrôler puis valider les lignes. | Upload a survey file, review then validate rows. |

### Institutions

| Clé | Français | Anglais |
|---|---|---|
| `admin.institutions.titre` | Institutions | Institutions |
| `admin.institutions.nouvelle` | Nouvelle institution | New institution |
| `admin.institutions.denomination` | Dénomination | Name |
| `admin.institutions.type` | Type | Type |
| `admin.institutions.convention_reference` | Référence de convention | Agreement reference |
| `admin.institutions.convention_debut` | Début de convention | Agreement start |
| `admin.institutions.convention_fin` | Fin de convention | Agreement end |
| `admin.institutions.creer` | Créer l'institution | Create institution |
| `admin.institutions.creation_reussie` | Institution créée. | Institution created. |
| `admin.institutions.vide` | Aucune institution enregistrée. | No institution recorded. |

### Comptes

| Clé | Français | Anglais |
|---|---|---|
| `admin.comptes.titre` | Comptes | Accounts |
| `admin.comptes.nouveau` | Inviter un compte | Invite an account |
| `admin.comptes.nom` | Nom | Last name |
| `admin.comptes.prenom` | Prénom | First name |
| `admin.comptes.fonction` | Fonction | Role |
| `admin.comptes.email` | Adresse professionnelle | Work email address |
| `admin.comptes.profil` | Profil | Profile |
| `admin.comptes.perimetre` | Périmètre territorial | Territorial scope |
| `admin.comptes.granularite` | Granularité maximale | Maximum granularity |
| `admin.comptes.langue` | Langue | Language |
| `admin.comptes.expiration` | Date d'expiration | Expiration date |
| `admin.comptes.modules` | Modules accessibles | Accessible modules |
| `admin.comptes.inviter` | Envoyer l'invitation | Send invitation |
| `admin.comptes.invitation_envoyee` | Invitation envoyée. | Invitation sent. |
| `admin.comptes.statut.actif` | Actif | Active |
| `admin.comptes.statut.suspendu` | Suspendu | Suspended |
| `admin.comptes.statut.expire` | Expiré | Expired |
| `admin.comptes.action.suspendre` | Suspendre | Suspend |
| `admin.comptes.action.reactiver` | Réactiver | Reactivate |
| `admin.comptes.action.prolonger` | Prolonger l'expiration | Extend expiration |
| `admin.comptes.action.renvoyer_invitation` | Renvoyer l'invitation | Resend invitation |
| `admin.comptes.confirmation.suspendre` | Suspendre ce compte ? L'accès cesse immédiatement. | Suspend this account? Access ends immediately. |
| `admin.comptes.confirmation.reactiver` | Réactiver ce compte ? | Reactivate this account? |
| `admin.comptes.vide` | Aucun compte pour cette institution. | No account for this institution. |
| `admin.erreur.nom_generique` | Un compte doit être nominatif : indiquez le nom et le prénom du titulaire. | An account must be personal: enter the holder's first and last name. |
| `admin.erreur.expiration_obligatoire` | La date d'expiration est obligatoire. | Expiration date is required. |
| `admin.erreur.module_non_autorise` | Ce module n'est pas autorisé pour le profil sélectionné. | This module is not authorised for the selected profile. |
| `admin.erreur.email_deja_utilise` | Cette adresse est déjà associée à un compte. | This address is already associated with an account. |

### Import du recensement

**Décision (point ouvert 9bis résolu) :** format accepté = CSV, délimiteur point-virgule. **Décision (point ouvert 9bis résolu) :** doublon potentiel = nom normalisé identique sur la même commune, ou coordonnées à moins de 300 m l'une de l'autre.

| Clé | Français | Anglais |
|---|---|---|
| `admin.import.titre` | Import du recensement | Survey import |
| `admin.import.deposer` | Déposer un fichier CSV | Upload a CSV file |
| `admin.import.format` | Fichier CSV, délimiteur point-virgule. | CSV file, semicolon delimiter. |
| `admin.import.previsualiser` | Prévisualiser | Preview |
| `admin.import.valider` | Valider l'import | Validate import |
| `admin.import.rapport.titre` | Rapport de contrôle | Control report |
| `admin.import.rapport.lignes_valides` | {n} lignes valides | {n} valid rows |
| `admin.import.rapport.lignes_erreur` | {n} lignes en erreur | {n} rows with errors |
| `admin.import.rapport.ligne` | Ligne {n} | Row {n} |
| `admin.import.rapport.motif` | Motif | Reason |
| `admin.import.historique.titre` | Imports précédents | Previous imports |
| `admin.import.historique.vide` | Aucun import réalisé. | No import performed yet. |
| `admin.import.historique.fichier` | Fichier | File |
| `admin.import.historique.date` | Date | Date |
| `admin.import.historique.lignes` | Lignes | Rows |
| `admin.import.erreur.champ_obligatoire_absent` | Champ obligatoire absent : {champ} | Required field missing: {champ} |
| `admin.import.erreur.valeur_enumeration_invalide` | Valeur non reconnue pour {champ} : {valeur} | Unrecognised value for {champ}: {valeur} |
| `admin.import.erreur.territoire_non_resolu` | Territoire non reconnu : {valeur} | Territory not recognised: {valeur} |
| `admin.import.erreur.coordonnees_hors_bornes` | Coordonnées hors des limites de la Guinée | Coordinates outside Guinea's boundaries |
| `admin.import.erreur.doublon_potentiel` | Doublon potentiel avec un établissement déjà recensé | Potential duplicate of an already surveyed establishment |

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
2. Libellés du module `M11_ADMIN`, à produire avec sa fiche fonctionnelle. **Résolu pour le lot 1** (institutions et comptes, import du recensement) : voir §12 bis. Les sept autres sections du module restent à documenter à leur tour.
3. Textes d'aide contextuelle par indicateur, dérivés des définitions du document 4.
4. Formulation du courriel d'invitation à un compte institutionnel.

---

## 16. Libellés ajoutés par la refonte visuelle du 8 septembre 2026

Ces clés accompagnent la direction « Rapport d'État » du document 8, révision du 8 septembre 2026, appliquée d'abord à l'écran `M1_OFFRE`.

### 16.1 Bandeau de périmètre, présentation en couples étiquette/valeur

Le bandeau passe de quatre phrases à quatre couples étiquette/valeur, seule forme lisible en projection à trois mètres. Les clés en phrase (`perimetre.etablissements`, `perimetre.partenaires`, `perimetre.couverture`, `perimetre.date`) restent en catalogue : elles servent l'export et les textes courants.

| Clé | Français | Anglais |
|---|---|---|
| `perimetre.label.etablissements` | Établissements recensés | Establishments recorded |
| `perimetre.label.partenaires` | dont partenaires | of which partners |
| `perimetre.label.couverture` | Capacité couverte | Capacity covered |
| `perimetre.label.observation` | Données au | Data as of |

### 16.2 Barre de contrôle

| Clé | Français | Anglais |
|---|---|---|
| `controle.niveau` | Niveau territorial | Territorial level |
| `controle.national` | National | National |
| `controle.export` | Exporter | Export |

### 16.3 Écran `M1_OFFRE`

| Clé | Français | Anglais |
|---|---|---|
| `module.m1.code` | M1 · Offre | M1 · Supply |
| `module.m1.question` | Quelle est l'offre d'hébergement existant en Guinée, de quelle nature, de quelle capacité, et quelle part en est réellement réservable en ligne ? | What accommodation supply exists in Guinea, of what kind, of what capacity, and what share of it is genuinely bookable online? |
| `module.m1.volumes` | Volumes recensés | Recorded volumes |
| `module.m1.ratios` | Ratios d'inventaire | Inventory ratios |
| `module.m1.structure` | Structure de l'offre | Structure of supply |
| `module.m1.territoires_repartition` | Répartition territoriale | Territorial distribution |
| `module.m1.territoires_repartition_aide` | Densité d'établissements recensés, une tuile par région. | Density of recorded establishments, one tile per region. |
| `module.m1.tableau_territorial` | Détail par territoire | Breakdown by territory |
| `module.m1.tableau_territorial_aide` | Toutes les régions du référentiel, y compris celles sans établissement recensé. | Every region in the reference list, including those with no recorded establishment. |
| `module.m1.repartition_typologie_aide` | Nature des établissements recensés. | Type of the recorded establishments. |
| `module.m1.repartition_gamme_aide` | Positionnement tarifaire déclaré, de l'économique au haut de gamme. | Declared price positioning, from budget to upscale. |
| `module.m1.legende_etablissements` | Établissements | Establishments |
| `module.m1.unites` | {n} unités | {n} units |
| `module.m1.part_du_parc` | {p} du parc recensé | {p} of the recorded stock |
| `module.m1.part_du_parc_effectifs` | {n} sur {d} établissements recensés | {n} of {d} recorded establishments |
| `module.m1.qualite_inventaire_aide` | Ce que l'Observatoire sait de l'offre, et ce qu'il ne sait pas encore. | What the Observatory knows about supply, and what it does not know yet. |
| `module.m1.sur_cent` | sur 100 | out of 100 |
| `module.m1.ecart_admin_aide` | Établissements portés par une liste administrative et non retrouvés lors du recensement de terrain, ou l'inverse. | Establishments listed by an administrative register and not found during field recording, or the reverse. |

### 16.4 Représentation territoriale

Employés par la grille de tuiles qui remplace la carte de densité tant qu'aucun contour du découpage refondu le 20 août 2026 n'est disponible (document 8, section 5.7).

| Clé | Français | Anglais |
|---|---|---|
| `carte.aucune_donnee` | Aucune donnée | No data |
| `carte.legende_densite` | Densité | Density |
| `carte.legende_bornes` | de {min} à {max} établissements | from {min} to {max} establishments |
| `carte.legende_sans_echelle` | Échelle non établie, aucun établissement recensé | Scale not established, no establishment recorded |
| `carte.legende_hachure` | Sans donnée ({n}) | No data ({n}) |
| `carte.sans_contour` | Les contours du découpage administratif refondu le 20 août 2026 ne sont disponibles dans aucun fichier réutilisable. Les territoires sont ici représentés par une grille, sans géométrie. | Boundaries for the administrative division redrawn on 20 August 2026 are not available in any reusable file. Territories are shown here as a grid, without geometry. |

### 16.5 En-têtes de tableau territorial

| Clé | Français | Anglais |
|---|---|---|
| `tableau.territoire` | Territoire | Territory |
| `tableau.etablissements` | Établ. | Estab. |
| `tableau.capacite` | Capacité | Capacity |
| `tableau.partenaires` | Partenaires | Partners |
| `tableau.couverture` | Couverture | Coverage |
| `tableau.numerisation` | Numérisation | Digitisation |
| `tableau.reservabilite` | Réservabilité | Bookability |
| `tableau.verification` | Vérification | Verification |
| `tableau.total` | Total | Total |

### 16.6 États et export

| Clé | Français | Anglais |
|---|---|---|
| `state.vide.repartition` | Aucun établissement à répartir. | No establishment to break down. |
| `impression.emis_par` | Émis par | Issued by |
| `impression.reference` | Référence d'export | Export reference |

`impression.reference` est en catalogue mais pas encore affichée : la référence unique d'export doit être enregistrée pour être opposable, donc produite côté serveur et non tirée au rendu.

---



---

## 17. Libellés des écrans `M2_DEMANDE` et `M3_ACTIVITE`, 9 septembre 2026

Ajoutés avec la refonte de ces deux écrans et l'ouverture des zones Z2 et Z4 du module `M2` et de la zone Z2 du module `M3`, par les vues `mv_demande_region`, `mv_demande_saisonnalite` et `mv_activite_evolution`.

### 17.1 `M2_DEMANDE`

| Clé | Français | Anglais |
|---|---|---|
| `module.m2.code` | M2 · Demande | M2 · Demand |
| `module.m2.question` | Qui cherche à venir en Guinée, depuis quel pays, vers quelle destination, à quelles dates, pour quelle durée et avec quel budget. | Who is looking to come to Guinea, from which country, to which destination, on what dates, for how long and on what budget. |
| `module.m2.intention` | Intention de séjour | Intent to travel |
| `module.m2.saisonnalite` | Saisonnalité | Seasonality |
| `module.m2.saisonnalite_titre` | Saisonnalité de l'intention | Seasonality of intent |
| `module.m2.saisonnalite_aide` | Recherches par mois d'arrivée souhaitée, et non par mois de recherche. | Searches by intended month of arrival, not by month of search. |
| `module.m2.geographie` | Où, et depuis où | Where to, and where from |
| `module.m2.destinations` | Destinations recherchées | Destinations searched |
| `module.m2.destinations_aide` | Construite sur la destination saisie, jamais sur l'origine de la connexion. | Built on the destination entered, never on the origin of the connection. |
| `module.m2.origine` | Origine des connexions | Origin of connections |
| `module.m2.origine_aide` | Dix premiers pays. Aucune granularité inférieure au pays n'est publiée. | Top ten countries. No granularity below country level is published. |
| `module.m2.contexte` | Contexte d'usage | Usage context |
| `module.m2.appareil` | Répartition par appareil | Breakdown by device |
| `module.m2.appareil_aide` | Type d'appareil utilisé pour la recherche. | Type of device used for the search. |
| `module.m2.canal` | Répartition par canal | Breakdown by channel |
| `module.m2.canal_aide` | Canal d'entrée de la recherche, dans l'ordre du référentiel. | Entry channel of the search, in reference-list order. |
| `module.m2.hors_referentiel` | Signal | Signal |
| `module.m2.hors_referentiel_titre` | Destinations hors référentiel | Destinations outside the reference list |
| `module.m2.hors_referentiel_aide` | Localités recherchées qui ne correspondent à aucun territoire du référentiel. Chaque rectangle est proportionnel au nombre de recherches. | Localities searched that match no territory in the reference list. Each rectangle is proportional to the number of searches. |
| `module.m2.legende_recherches` | Recherches | Searches |
| `module.m2.sessions` | {n} sessions | {n} sessions |
| `module.m2.sparkline_volume` | Tendance sur douze mois | Twelve-month trend |
| `module.m2.part_filtre_budget` | {p} des recherches ont utilisé le filtre budget | {p} of searches used the budget filter |

Le libellé `module.m2.origine` reprend au caractère près l'intitulé imposé par le document 9, C.7 : « Origine des connexions », jamais « Origine des voyageurs ».

### 17.2 `M3_ACTIVITE`

| Clé | Français | Anglais |
|---|---|---|
| `module.m3.code` | M3 · Activité | M3 · Activity |
| `module.m3.question` | Que se passe-t-il réellement sur le périmètre commercialisé : combien de réservations, quel taux d'occupation, à quel prix moyen. | What actually happens across the commercialised scope: how many bookings, what occupancy rate, at what average price. |
| `module.m3.avertissement_perimetre` | Ce module porte sur le seul périmètre partenaire, soit {n} établissements. Il ne décrit pas le secteur, il décrit ce qui est commercialisé sur la plateforme. | This module covers the partner scope only, that is {n} establishments. It does not describe the sector, it describes what is sold on the platform. |
| `module.m3.volumes` | Volumes observés | Observed volumes |
| `module.m3.performance` | Performance hôtelière | Hotel performance |
| `module.m3.evolution` | Évolution dans le temps | Change over time |
| `module.m3.evolution_occupation` | Taux d'occupation contractualisé | Occupancy on contracted capacity |
| `module.m3.evolution_adr` | ADR, franc guinéen | ADR, Guinean franc |
| `module.m3.evolution_revpar` | RevPAR, franc guinéen | RevPAR, Guinean franc |
| `module.m3.reservations_par_mois` | Réservations par mois d'arrivée | Bookings by month of arrival |
| `module.m3.reservations_par_mois_aide` | Réservations non annulées, réparties sur le mois d'arrivée et non de réservation. | Non-cancelled bookings, allocated to the month of arrival rather than of booking. |
| `module.m3.sparkline_reservations` | Réservations mois par mois | Bookings month by month |
| `module.m3.sparkline_nuitees` | Nuitées mois par mois | Room nights month by month |
| `module.m3.conversion` | Conversion | Conversion |
| `module.m3.conversion_titre` | De la recherche à la réservation | From search to booking |
| `module.m3.conversion_aide` | Les deux taux sont posés sur la même règle, jamais séparément. | Both rates are placed on the same scale, never separately. |
| `module.m3.conversion_lecture` | Un taux de conversion lu seul se comprend comme une contre-performance commerciale. Lu à côté du taux de couverture, il se comprend comme une conséquence mécanique de la part du parc réellement réservable en ligne. | A conversion rate read on its own reads as commercial underperformance. Read next to the platform coverage rate, it reads as a mechanical consequence of the share of stock that is genuinely bookable online. |
| `module.m3.libelle_conversion` | Taux de conversion | Conversion rate |
| `module.m3.libelle_couverture` | Taux de couverture plateforme | Platform coverage rate |

`module.m3.conversion_lecture` reprend la mise en garde du document 9 quater, K.7. Elle est affichée sous le graphique, pas dans une infobulle : c'est la phrase qui empêche le chiffre d'être mal cité.

### 17.3 États et légende

| Clé | Français | Anglais |
|---|---|---|
| `state.vide.evolution` | Pas encore assez de réservations pour tracer une évolution. | Not enough bookings yet to plot a trend. |
| `state.vide.inventaire` | Inventaire quotidien non alimenté : ce taux n'est pas calculable. | Daily inventory not supplied: this rate cannot be computed. |
| `state.vide.conversion` | Moins de 100 recherches sur la période. | Fewer than 100 searches over the period. |
| `carte.legende_bornes_generique` | de {min} à {max} | from {min} to {max} |

### 17.4 Noms de pays

Les noms de pays ne sont pas au catalogue. Les codes `ISO 3166-1 alpha-2` sont des codes normalisés internationaux, pas une énumération du document 2 : ils passent par les données de localisation d'`Intl`, comme les nombres et les dates, plutôt que par la recopie de deux cents libellés. Le code brut reste le repli si la locale ne connaît pas le pays.

---

*Document 10 sur 12. Document précédent : spécifications fonctionnelles par module. Document suivant : architecture technique et conventions de code.*
