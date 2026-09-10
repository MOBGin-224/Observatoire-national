-- rls_auto_enable() est une fonction de declencheur d'evenement : elle est
-- lancee par le moteur lors d'un CREATE TABLE, jamais appelee par un client.
-- Le droit EXECUTE ouvert a public, anon et authenticated l'exposait sur
-- /rest/v1/rpc/ sans aucun usage legitime. Le declencheur continue de
-- fonctionner : il s'execute sous l'identite de son proprietaire et ne
-- verifie pas ce droit.
revoke execute on function public.rls_auto_enable() from public;
revoke execute on function public.rls_auto_enable() from anon;
revoke execute on function public.rls_auto_enable() from authenticated;
revoke execute on function public.rls_auto_enable() from service_role;;
