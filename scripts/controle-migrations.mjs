/*
 * Document 17, partie A.3. Controle automatique.
 *
 * Compare les objets presents en base aux objets que les migrations creent,
 * et signale tout ecart dans les deux sens.
 *
 * Motif : deux objets, mv_evenementiel_national et acces_evenementiel_national,
 * ont vecu en base sans exister dans aucun fichier de migration. Un tel ecart
 * est silencieux : tout fonctionne, et le deploiement sur base neuve echoue.
 * Le croisement fait a la main lors de la revue du 18 septembre 2026 devient
 * ici automatique.
 *
 * Execution : node scripts/controle-migrations.mjs
 * Depuis la racine du depot, avec .env.local renseigne.
 * Sortie non nulle des qu'un ecart est trouve, pour servir de garde-fou
 * avant livraison (document 12, verification I10).
 *
 * Sous Git Bash, lancer avec un chemin relatif : un chemin absolu de la forme
 * /c/... est lu par Node comme C:\c\...
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const DOSSIER_MIGRATIONS = join("supabase", "migrations");
const SCHEMA = "observatoire";

/* ------------------------------------------------------------------ */
/* Lecture de .env.local, sans dependance supplementaire.              */
/* ------------------------------------------------------------------ */

function lireEnv() {
  let brut;
  try {
    brut = readFileSync(".env.local", "utf8");
  } catch {
    throw new Error(
      "Fichier .env.local introuvable. Lancer le script depuis la racine du depot.",
    );
  }
  const env = {};
  for (const ligne of brut.split(/\r?\n/)) {
    const m = ligne.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

/* ------------------------------------------------------------------ */
/* Etat projete par les migrations.                                    */
/*                                                                     */
/* Les fichiers sont joues dans l'ordre de leur nom, comme le fait le  */
/* deploiement. Une creation ajoute, une suppression retire : c'est ce */
/* qui permet de suivre les vues detruites puis recreees, nombreuses   */
/* dans ce depot.                                                      */
/* ------------------------------------------------------------------ */

// Retire les commentaires pour qu'une instruction commentee ne compte pas.
function sansCommentaires(sql) {
  return sql.replace(/\/\*[\s\S]*?\*\//g, "").replace(/--[^\n]*/g, "");
}

const S = SCHEMA;
const REGLES = [
  // [categorie, action, expression, indice du groupe portant le nom]
  ["table", "creer", new RegExp(`create\\s+table\\s+(?:if\\s+not\\s+exists\\s+)?${S}\\.(\\w+)`, "gi"), 1],
  ["table", "retirer", new RegExp(`drop\\s+table\\s+(?:if\\s+exists\\s+)?${S}\\.(\\w+)`, "gi"), 1],

  ["vue_materialisee", "creer", new RegExp(`create\\s+materialized\\s+view\\s+(?:if\\s+not\\s+exists\\s+)?${S}\\.(\\w+)`, "gi"), 1],
  ["vue_materialisee", "retirer", new RegExp(`drop\\s+materialized\\s+view\\s+(?:if\\s+exists\\s+)?${S}\\.(\\w+)`, "gi"), 1],

  // La negation evite que "create materialized view" soit compte deux fois.
  ["vue", "creer", new RegExp(`create\\s+(?:or\\s+replace\\s+)?view\\s+(?:if\\s+not\\s+exists\\s+)?${S}\\.(\\w+)`, "gi"), 1],
  ["vue", "retirer", new RegExp(`drop\\s+view\\s+(?:if\\s+exists\\s+)?${S}\\.(\\w+)`, "gi"), 1],

  ["fonction", "creer", new RegExp(`create\\s+(?:or\\s+replace\\s+)?function\\s+${S}\\.(\\w+)`, "gi"), 1],
  ["fonction", "retirer", new RegExp(`drop\\s+function\\s+(?:if\\s+exists\\s+)?${S}\\.(\\w+)`, "gi"), 1],

  ["index", "creer", new RegExp(`create\\s+(?:unique\\s+)?index\\s+(?:if\\s+not\\s+exists\\s+)?(\\w+)\\s+on\\s+${S}\\.`, "gi"), 1],
  ["index", "retirer", new RegExp(`drop\\s+index\\s+(?:if\\s+exists\\s+)?(?:${S}\\.)?(\\w+)`, "gi"), 1],
];

// Les politiques portent deux noms : celui de la table et le leur.
const POLITIQUE_CREER = new RegExp(
  `create\\s+policy\\s+"([^"]+)"\\s+on\\s+${S}\\.(\\w+)`, "gi");
const POLITIQUE_RETIRER = new RegExp(
  `drop\\s+policy\\s+(?:if\\s+exists\\s+)?"([^"]+)"\\s+on\\s+${S}\\.(\\w+)`, "gi");

function etatProjete() {
  const fichiers = readdirSync(DOSSIER_MIGRATIONS)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (fichiers.length === 0) {
    throw new Error(`Aucune migration lue dans ${DOSSIER_MIGRATIONS}.`);
  }

  const etat = new Map(); // categorie -> Set d'identifiants
  const ajouter = (cat, id) => {
    if (!etat.has(cat)) etat.set(cat, new Set());
    etat.get(cat).add(id);
  };
  const retirer = (cat, id) => etat.get(cat)?.delete(id);

  for (const fichier of fichiers) {
    const sql = sansCommentaires(
      readFileSync(join(DOSSIER_MIGRATIONS, fichier), "utf8"),
    );

    // Une vue materialisee ne doit pas etre comptee aussi comme vue simple.
    // La substitution garde la longueur du texte sans importance : seules les
    // positions relatives comptent, et elles sont conservees par fichier.
    const sqlVuesSimples = sql.replace(/materialized\s+view/gi, "MATVIEW____");

    // Les instructions sont collectees avec leur position, puis appliquees
    // dans l'ordre du fichier. Sans cela, un fichier qui supprime une vue
    // puis la recree la laisserait absente, parce que la suppression serait
    // appliquee apres la creation.
    const instructions = [];

    for (const [categorie, action, expression, groupe] of REGLES) {
      const source = categorie === "vue" ? sqlVuesSimples : sql;
      expression.lastIndex = 0;
      let m;
      while ((m = expression.exec(source)) !== null) {
        instructions.push({ position: m.index, categorie, action, id: m[groupe] });
      }
    }

    for (const [expression, action] of [
      [POLITIQUE_CREER, "creer"],
      [POLITIQUE_RETIRER, "retirer"],
    ]) {
      expression.lastIndex = 0;
      let m;
      while ((m = expression.exec(sql)) !== null) {
        instructions.push({
          position: m.index,
          categorie: "politique",
          action,
          id: `${m[2]} : ${m[1]}`,
        });
      }
    }

    instructions.sort((a, b) => a.position - b.position);
    for (const { categorie, action, id } of instructions) {
      if (action === "creer") ajouter(categorie, id);
      else retirer(categorie, id);
    }
  }

  return { etat, nbFichiers: fichiers.length };
}

/* ------------------------------------------------------------------ */
/* Etat reel, lu en base.                                              */
/* ------------------------------------------------------------------ */

async function etatReel(env) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const cle = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !cle) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY absent de .env.local.",
    );
  }

  const client = createClient(url, cle, {
    db: { schema: SCHEMA },
    auth: { persistSession: false },
  });

  const { data, error } = await client.rpc("inventaire_objets");
  if (error) {
    throw new Error(
      `Lecture de l'inventaire impossible : ${error.message}. ` +
        "La fonction observatoire.inventaire_objets() est-elle appliquee ?",
    );
  }

  const etat = new Map();
  for (const ligne of data) {
    if (!etat.has(ligne.categorie)) etat.set(ligne.categorie, new Set());
    etat.get(ligne.categorie).add(ligne.identifiant);
  }
  return etat;
}

/* ------------------------------------------------------------------ */
/* Comparaison et rapport.                                             */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  ["table", "Tables"],
  ["vue", "Vues"],
  ["vue_materialisee", "Vues materialisees"],
  ["fonction", "Fonctions"],
  ["politique", "Politiques de securite"],
  ["index", "Index"],
];

function difference(a, b) {
  return [...(a ?? [])].filter((x) => !(b ?? new Set()).has(x)).sort();
}

async function main() {
  const { etat: projete, nbFichiers } = etatProjete();

  // --migrations-seules : lit les fichiers et s'arrete la, sans contacter la
  // base. Sert a verifier la lecture elle-meme, et a travailler hors ligne.
  if (process.argv.includes("--migrations-seules")) {
    console.log(`Lecture seule des migrations, ${nbFichiers} fichiers.\n`);
    for (const [cle, titre] of CATEGORIES) {
      const noms = [...(projete.get(cle) ?? new Set())].sort();
      console.log(`  ${titre} : ${noms.length}`);
      for (const nom of noms) console.log(`    ${nom}`);
    }
    process.exit(0);
  }

  const env = lireEnv();
  const reel = await etatReel(env);

  console.log(`Controle des migrations, ${nbFichiers} fichiers lus.\n`);

  let ecarts = 0;

  for (const [cle, titre] of CATEGORIES) {
    const enBaseSeulement = difference(reel.get(cle), projete.get(cle));
    const enMigrationSeulement = difference(projete.get(cle), reel.get(cle));

    const nbReel = (reel.get(cle) ?? new Set()).size;
    const nbProjete = (projete.get(cle) ?? new Set()).size;

    if (enBaseSeulement.length === 0 && enMigrationSeulement.length === 0) {
      console.log(`  ${titre} : ${nbReel} objets, aucun ecart.`);
      continue;
    }

    ecarts += enBaseSeulement.length + enMigrationSeulement.length;
    console.log(`  ${titre} : ${nbReel} en base, ${nbProjete} attendus.`);

    for (const nom of enBaseSeulement) {
      console.log(`    PRESENT EN BASE, ABSENT DES MIGRATIONS : ${nom}`);
    }
    for (const nom of enMigrationSeulement) {
      console.log(`    CREE PAR UNE MIGRATION, ABSENT DE LA BASE : ${nom}`);
    }
  }

  console.log("");
  if (ecarts === 0) {
    console.log("Aucun ecart. La base et les migrations coincident.");
    process.exit(0);
  }
  console.log(
    `${ecarts} ecart(s). Un objet present en base mais absent des migrations ` +
      "disparaitra au premier deploiement propre ; un objet cree par une " +
      "migration mais absent de la base signale une migration jamais appliquee.",
  );
  process.exit(1);
}

main().catch((e) => {
  console.error(`Echec du controle : ${e.message}`);
  process.exit(2);
});
