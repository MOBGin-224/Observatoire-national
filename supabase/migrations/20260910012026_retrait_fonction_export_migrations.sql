-- L'historique est desormais dans le depot, sous supabase/migrations.
-- La fonction d'export n'a plus d'objet : une fonction capable de restituer
-- le schema complet de la base n'a aucune raison de rester en place.
drop function if exists observatoire.exporter_migrations();
