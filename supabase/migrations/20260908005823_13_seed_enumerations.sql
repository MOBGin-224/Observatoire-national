-- Migration 13 : chargement des valeurs d'enumeration
-- Document 2, sections 3 a 19. Valeurs recopiees telles quelles, aucune inventee.
-- libelle_en laisse a NULL : la charte des libelles bilingue (document 10) n'a pas ete lue.
-- Non charges ici, volontairement (points ouverts du document 2, section 20) :
--   - referentiel territorial (regions/prefectures/communes) : source officielle MATD pas encore integree
--   - bornes GNF des gammes tarifaires (gamme_tarifaire_borne)

insert into observatoire.enumeration (domaine, code, libelle_fr, ordre) values
-- NIVEAU_TERRITOIRE
('NIVEAU_TERRITOIRE','REGION','Région',10),
('NIVEAU_TERRITOIRE','PREFECTURE','Préfecture',20),
('NIVEAU_TERRITOIRE','COMMUNE','Commune',30),
-- TYPOLOGIE
('TYPOLOGIE','HOTEL','Hôtel',10),
('TYPOLOGIE','RESIDENCE','Résidence meublée',20),
('TYPOLOGIE','AUBERGE','Auberge',30),
('TYPOLOGIE','MAISON_HOTES','Maison d''hôtes',40),
('TYPOLOGIE','LODGE','Lodge',50),
('TYPOLOGIE','RECEPTIF','Réceptif événementiel',60),
-- GAMME
('GAMME','G1','Économique',10),
('GAMME','G2','Intermédiaire',20),
('GAMME','G3','Supérieur',30),
('GAMME','G4','Haut de gamme',40),
-- STATUT_RELATION
('STATUT_RELATION','RECENSE','Recensé',10),
('STATUT_RELATION','PARTENAIRE_ACTIF','Partenaire actif',20),
('STATUT_RELATION','PARTENAIRE_INACTIF','Partenaire inactif',30),
('STATUT_RELATION','REFUS','Refus',40),
('STATUT_RELATION','DOUBLON','Doublon',50),
-- STATUT_RESULTAT
('STATUT_RESULTAT','RESULTATS_DISPONIBLES','Résultats disponibles',10),
('STATUT_RESULTAT','OFFRE_INDISPONIBLE','Offre existante indisponible',20),
('STATUT_RESULTAT','NON_RESERVABLE','Offre recensée non réservable',30),
('STATUT_RESULTAT','AUCUNE_OFFRE','Aucune offre référencée',40),
('STATUT_RESULTAT','HORS_PERIMETRE','Hors périmètre',50),
-- STATUT_DONNEE
('STATUT_DONNEE','RECENSE','Recensé',10),
('STATUT_DONNEE','OBSERVE','Observé',20),
('STATUT_DONNEE','EXPRIME','Exprimé',30),
('STATUT_DONNEE','DECLARE','Déclaré',40),
('STATUT_DONNEE','ESTIME','Estimé',50),
-- FIABILITE
('FIABILITE','CONSOLIDE','Consolidé',10),
('FIABILITE','INDICATIF','Indicatif',20),
('FIABILITE','SIGNAL','Signal',30),
-- SOURCE_RECENSEMENT
('SOURCE_RECENSEMENT','ADMINISTRATION','Liste administrative',10),
('SOURCE_RECENSEMENT','SOURCE_OUVERTE','Source ouverte',20),
('SOURCE_RECENSEMENT','TELEPHONE','Qualification téléphonique',30),
('SOURCE_RECENSEMENT','TERRAIN','Vérification terrain',40),
('SOURCE_RECENSEMENT','DECLARATIF','Déclaration de l''établissement',50),
-- STATUT_VERIFICATION
('STATUT_VERIFICATION','NON_VERIFIE','Non vérifié',10),
('STATUT_VERIFICATION','VERIFIE_TEL','Vérifié par téléphone',20),
('STATUT_VERIFICATION','VERIFIE_TERRAIN','Vérifié sur site',30),
-- STATUT_TERRAIN
('STATUT_TERRAIN','FERME_DEFINITIF','Fermé définitivement',10),
('STATUT_TERRAIN','FERME_TEMPORAIRE','Fermé temporairement',20),
('STATUT_TERRAIN','INEXISTANT','Établissement inexistant',30),
('STATUT_TERRAIN','NUMERO_INVALIDE','Numéro invalide',40),
('STATUT_TERRAIN','INJOIGNABLE','Injoignable après relances',50),
('STATUT_TERRAIN','ADRESSE_INTROUVABLE','Adresse introuvable',60),
('STATUT_TERRAIN','REFUS_MOTIVE','Refus motivé',70),
('STATUT_TERRAIN','DOUBLON_DETECTE','Doublon détecté',80),
('STATUT_TERRAIN','RECLASSEMENT','Typologie erronée',90),
-- EQUIPEMENT
('EQUIPEMENT','RESTAURATION','Restauration sur place',10),
('EQUIPEMENT','SALLE_REUNION','Salle de réunion ou de conférence',20),
('EQUIPEMENT','GROUPE_ELECTROGENE','Groupe électrogène',30),
('EQUIPEMENT','WIFI','Connexion internet',40),
('EQUIPEMENT','CLIMATISATION','Climatisation',50),
('EQUIPEMENT','EAU_CHAUDE','Eau chaude',60),
('EQUIPEMENT','PARKING','Parking',70),
('EQUIPEMENT','PISCINE','Piscine',80),
('EQUIPEMENT','NAVETTE_AEROPORT','Navette aéroport',90),
('EQUIPEMENT','BLANCHISSERIE','Blanchisserie',100),
('EQUIPEMENT','SECURITE_24H','Sécurité permanente',110),
('EQUIPEMENT','ACCES_PMR','Accès aux personnes à mobilité réduite',120),
('EQUIPEMENT','PAIEMENT_CARTE','Paiement par carte',130),
('EQUIPEMENT','PAIEMENT_MOBILE_MONEY','Paiement mobile money',140),
-- TYPE_DEMANDE_INST
('TYPE_DEMANDE_INST','SOMMET','Sommet ou forum',10),
('TYPE_DEMANDE_INST','CONFERENCE','Conférence ou séminaire',20),
('TYPE_DEMANDE_INST','MISSION','Mission officielle',30),
('TYPE_DEMANDE_INST','DELEGATION','Délégation ou visite d''État',40),
('TYPE_DEMANDE_INST','FORMATION','Formation ou atelier',50),
('TYPE_DEMANDE_INST','COMPETITION','Compétition sportive ou culturelle',60),
('TYPE_DEMANDE_INST','AUTRE','Autre besoin institutionnel',70),
-- STATUT_DEMANDE_INST
('STATUT_DEMANDE_INST','ANNONCEE','Annoncée',10),
('STATUT_DEMANDE_INST','CONFIRMEE','Confirmée',20),
('STATUT_DEMANDE_INST','SATISFAITE','Satisfaite',30),
('STATUT_DEMANDE_INST','PARTIELLEMENT_SATISFAITE','Partiellement satisfaite',40),
('STATUT_DEMANDE_INST','NON_SATISFAITE','Non satisfaite',50),
('STATUT_DEMANDE_INST','ANNULEE','Annulée',60),
-- TYPE_EVENEMENT
('TYPE_EVENEMENT','SOMMET','Sommet ou forum',10),
('TYPE_EVENEMENT','CONFERENCE','Conférence ou salon',20),
('TYPE_EVENEMENT','FOIRE','Foire ou salon commercial',30),
('TYPE_EVENEMENT','COMPETITION','Compétition sportive ou culturelle',40),
('TYPE_EVENEMENT','FETE_RELIGIEUSE','Fête religieuse',50),
('TYPE_EVENEMENT','JOUR_FERIE','Jour férié',60),
('TYPE_EVENEMENT','VACANCES_SCOLAIRES','Vacances scolaires',70),
('TYPE_EVENEMENT','SAISON','Saison sèche ou saison des pluies',80),
('TYPE_EVENEMENT','MISSION_OFFICIELLE','Mission ou visite officielle',90),
('TYPE_EVENEMENT','AUTRE','Autre',100),
-- PORTEE_EVENEMENT
('PORTEE_EVENEMENT','LOCALE','Locale',10),
('PORTEE_EVENEMENT','NATIONALE','Nationale',20),
('PORTEE_EVENEMENT','INTERNATIONALE','Internationale',30),
-- RECURRENCE
('RECURRENCE','PONCTUEL','Ponctuel',10),
('RECURRENCE','ANNUEL','Annuel',20),
-- ETAT_ROUTE
('ETAT_ROUTE','BITUMEE_BONNE','Route bitumée en bon état',10),
('ETAT_ROUTE','BITUMEE_DEGRADEE','Route bitumée dégradée',20),
('ETAT_ROUTE','PISTE_AMENAGEE','Piste aménagée',30),
('ETAT_ROUTE','PISTE_SOMMAIRE','Piste sommaire',40),
('ETAT_ROUTE','INCONNU','Non renseigné',50),
-- PRATICABILITE
('PRATICABILITE','TOUTE_ANNEE','Praticable toute l''année',10),
('PRATICABILITE','DIFFICILE_PLUIES','Difficile en saison des pluies',20),
('PRATICABILITE','IMPRATICABLE_PLUIES','Impraticable en saison des pluies',30),
('PRATICABILITE','INCONNU','Non renseigné',40),
-- INFRA_TRANSPORT
('INFRA_TRANSPORT','AEROPORT_INTERNATIONAL','Aéroport international',10),
('INFRA_TRANSPORT','AERODROME','Aérodrome',20),
('INFRA_TRANSPORT','PORT','Port maritime ou fluvial',30),
('INFRA_TRANSPORT','GARE_ROUTIERE','Gare routière',40),
('INFRA_TRANSPORT','VOIE_FERREE','Desserte ferroviaire',50),
('INFRA_TRANSPORT','AUCUNE','Aucune infrastructure notable',60),
-- PROFIL
('PROFIL','ATTRACTIVITE','Attractivité et promotion',10),
('PROFIL','INVESTISSEMENT','Investissement',20),
('PROFIL','TUTELLE','Tutelle sectorielle',30),
('PROFIL','BAILLEUR','Bailleur et partenaire technique',40),
('PROFIL','EVENEMENTIEL','Organisateur d''événement',50),
('PROFIL','ADMIN','Administration Simandou Séjour',60),
-- NIVEAU_GEO
('NIVEAU_GEO','NATIONAL','National',10),
('NIVEAU_GEO','REGION','Régional',20),
('NIVEAU_GEO','PREFECTURE','Préfectoral',30),
('NIVEAU_GEO','COMMUNE','Communal',40),
-- MODULE
('MODULE','M1_OFFRE','Offre nationale d''hébergement',10),
('MODULE','M2_DEMANDE','Demande exprimée',20),
('MODULE','M3_ACTIVITE','Activité observée',30),
('MODULE','M4_TENSION','Tension et déficit d''offre',40),
('MODULE','M5_CONFORMITE','Conformité et classification',50),
('MODULE','M6_MATURITE','Maturité numérique du secteur',60),
('MODULE','M7_EVENEMENTIEL','Événementiel et pics de demande',70),
('MODULE','M8_RETOMBEES','Retombées économiques estimées',80),
('MODULE','M9_SYNTHESE','Synthèse institutionnelle',90),
('MODULE','M10_METHODO','Méthodologie',100),
('MODULE','M11_ADMIN','Administration',110),
-- CANAL
('CANAL','WEB','Web',10),
('CANAL','WHATSAPP','WhatsApp',20),
('CANAL','AUTRE','Autre',30),
-- APPAREIL
('APPAREIL','DESKTOP','Ordinateur',10),
('APPAREIL','TABLETTE','Tablette',20),
('APPAREIL','MOBILE','Mobile',30),
-- MOTIF_SEJOUR
('MOTIF_SEJOUR','AFFAIRES','Affaires',10),
('MOTIF_SEJOUR','LOISIRS','Loisirs',20),
('MOTIF_SEJOUR','FAMILIAL','Familial',30),
('MOTIF_SEJOUR','EVENEMENTIEL','Événementiel',40),
('MOTIF_SEJOUR','MISSION','Mission',50),
('MOTIF_SEJOUR','NON_DECLARE','Non déclaré',60),
-- LANGUE
('LANGUE','FR','Français',10),
('LANGUE','EN','Anglais',20),
-- CONSENTEMENT
('CONSENTEMENT','OUI','Oui',10),
('CONSENTEMENT','NON','Non',20),
('CONSENTEMENT','NON_DEMANDE','Non demandé',30);
;
