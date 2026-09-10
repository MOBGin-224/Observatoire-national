-- Cette fonction ne sert que de déclencheur, jamais un appel RPC direct.
revoke execute on function observatoire.tf_etablissement_historique() from public, anon, authenticated;
;
