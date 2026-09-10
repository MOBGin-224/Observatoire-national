# Migrations de base de données

Historique complet du schéma `observatoire`, exporté depuis le projet Supabase `Observatoire` le 10 septembre 2026.

## Pourquoi ce dossier existe

Jusqu'à cette date, les migrations ne vivaient que dans le projet Supabase. Le dépôt ne suffisait donc pas à reconstruire l'application sur une base neuve : le code y était, le schéma qu'il interroge n'y était pas.

Un dépôt qui ne peut pas reconstruire son propre socle n'est pas une sauvegarde.

## Convention

Un fichier par migration, nommé `<version>_<nom>.sql`, la version étant l'horodatage `AAAAMMJJhhmmss` de son application. **L'ordre alphabétique des fichiers est l'ordre d'application.** Une migration déjà appliquée ne se modifie jamais : on en ajoute une nouvelle.

## Appliquer sur une base neuve

Avec la CLI Supabase, depuis la racine du dépôt :

```
npx supabase login
npx supabase link --project-ref <référence du projet>
npx supabase db push
```

`db push` applique les migrations manquantes, dans l'ordre, en s'appuyant sur la table `supabase_migrations.schema_migrations` de la base cible.

## Ce que ces fichiers ne contiennent pas

**Aucune donnée.** Ni le référentiel territorial, ni les énumérations chargées par les migrations de départ ne suffisent à faire tourner l'application avec du contenu réel : le recensement, les comptes et les institutions sont des données d'exploitation, pas du schéma.

**Aucun secret.** Ni clé d'API, ni mot de passe, ni jeton. Ils vivent dans les variables d'environnement, voir `.env.example`.

Le jeu de test synthétique est à part, dans `/scripts`. Il est explicitement identifié comme tel et ne doit jamais être chargé en production.

## Tenir ce dossier à jour

Toute migration appliquée au projet Supabase doit être reportée ici dans la foulée. Une migration appliquée en base et absente du dépôt reproduit exactement le problème que ce dossier corrige.
