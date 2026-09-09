/*
 * Primitives geometriques partagees par les visualisations SVG.
 * Aucune dependance externe (document 8, section 9 : aucune dependance lourde,
 * une bibliotheque de graphiques defaillante produit un ecran blanc en reunion).
 */

/** Rampe sequentielle bleue du document 8, du plus fonce au plus clair. */
export const RAMPE_SEQUENTIELLE = [
  "var(--seq-6)",
  "var(--seq-5)",
  "var(--seq-4)",
  "var(--seq-3)",
  "var(--seq-2)",
  "var(--seq-1)",
] as const;

/**
 * Couleur du palier `index` sur une serie de `total` valeurs.
 * Au dela de six categories la rampe boucle sur son palier le plus clair :
 * le document 8 plafonne de toute facon les repartitions a douze categories,
 * et une repartition ordonnee se lit du plus fonce au plus clair.
 */
export function couleurSequentielle(index: number, total: number): string {
  if (total <= 1) return RAMPE_SEQUENTIELLE[0];
  const palier = Math.round((index / (total - 1)) * (RAMPE_SEQUENTIELLE.length - 1));
  return RAMPE_SEQUENTIELLE[Math.min(palier, RAMPE_SEQUENTIELLE.length - 1)];
}

function pointSurCercle(cx: number, cy: number, rayon: number, angleDegres: number) {
  const radians = ((angleDegres - 90) * Math.PI) / 180;
  return [cx + rayon * Math.cos(radians), cy + rayon * Math.sin(radians)] as const;
}

/**
 * Trace d'un secteur d'anneau entre deux angles, en degres, zero en haut.
 * Un secteur qui ferait le tour complet est coupe en deux moities : un arc SVG
 * de 360 degres se replie sur lui-meme et ne dessine rien.
 */
export function secteurAnneau(
  cx: number,
  cy: number,
  rayonExterieur: number,
  rayonInterieur: number,
  angleDebut: number,
  angleFin: number
): string {
  const amplitude = angleFin - angleDebut;
  if (amplitude >= 359.99) {
    const moitie = angleDebut + 180;
    return `${secteurAnneau(cx, cy, rayonExterieur, rayonInterieur, angleDebut, moitie)} ${secteurAnneau(cx, cy, rayonExterieur, rayonInterieur, moitie, angleDebut + 359.98)}`;
  }
  const grandArc = amplitude > 180 ? 1 : 0;
  const [x1, y1] = pointSurCercle(cx, cy, rayonExterieur, angleDebut);
  const [x2, y2] = pointSurCercle(cx, cy, rayonExterieur, angleFin);
  const [x3, y3] = pointSurCercle(cx, cy, rayonInterieur, angleFin);
  const [x4, y4] = pointSurCercle(cx, cy, rayonInterieur, angleDebut);

  return [
    `M ${x1.toFixed(2)} ${y1.toFixed(2)}`,
    `A ${rayonExterieur} ${rayonExterieur} 0 ${grandArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
    `L ${x3.toFixed(2)} ${y3.toFixed(2)}`,
    `A ${rayonInterieur} ${rayonInterieur} 0 ${grandArc} 0 ${x4.toFixed(2)} ${y4.toFixed(2)}`,
    "Z",
  ].join(" ");
}

export type Part = { code: string; libelle: string; valeur: number };

/** Repartit les parts en secteurs angulaires, du plus gros au plus petit. */
export function decouperEnSecteurs(parts: Part[], jeuAngulaire = 1.5) {
  const total = parts.reduce((somme, p) => somme + p.valeur, 0);
  if (total <= 0) return [];

  const triees = [...parts].sort((a, b) => b.valeur - a.valeur);
  let curseur = 0;

  return triees.map((part, index) => {
    const amplitude = (part.valeur / total) * 360;
    const jeu = triees.length > 1 ? jeuAngulaire : 0;
    const secteur = {
      ...part,
      part: (part.valeur / total) * 100,
      angleDebut: curseur + jeu / 2,
      angleFin: curseur + amplitude - jeu / 2,
      couleur: couleurSequentielle(index, triees.length),
    };
    curseur += amplitude;
    return secteur;
  });
}

/*
 * Paliers d'une echelle de densite en cinq classes (document 8, section 2.5).
 * Les seuils sont pris sur les quantiles des valeurs non nulles : une echelle a
 * intervalles egaux sur des donnees tres dispersees ecrase tout dans la premiere
 * classe et ne montre plus rien.
 */
export function paliersDensite(valeurs: number[]): number[] {
  const nonNulles = valeurs.filter((v) => v > 0).sort((a, b) => a - b);
  if (nonNulles.length === 0) return [];

  const quantile = (q: number) => {
    const position = q * (nonNulles.length - 1);
    const bas = Math.floor(position);
    const haut = Math.ceil(position);
    return nonNulles[bas] + (nonNulles[haut] - nonNulles[bas]) * (position - bas);
  };

  return [quantile(0.2), quantile(0.4), quantile(0.6), quantile(0.8)];
}

/**
 * Classe d'une valeur sur l'echelle de densite, de 0 (plus clair) a 4 (plus fonce).
 * Une valeur nulle n'a pas de classe : un territoire sans donnee est hachure,
 * jamais colore en clair (document 8, section 2.5).
 */
export function classeDensite(valeur: number, seuils: number[]): number | null {
  if (valeur <= 0) return null;
  if (seuils.length === 0) return 4;
  let classe = 0;
  for (const seuil of seuils) {
    if (valeur > seuil) classe += 1;
  }
  return Math.min(classe, 4);
}

/** Cinq aplats de l'echelle de densite, du plus clair au plus fonce. */
export const ECHELLE_DENSITE = [
  "var(--seq-1)",
  "var(--seq-2)",
  "var(--seq-3)",
  "var(--seq-5)",
  "var(--seq-6)",
] as const;

/** Le texte passe en blanc sur les deux paliers les plus fonces. */
export function texteSurDensite(classe: number | null): string {
  return classe !== null && classe >= 3 ? "var(--color-on-primary)" : "var(--color-text)";
}

export const TRAME_SANS_DONNEE =
  "repeating-linear-gradient(45deg, var(--hachure-trait) 0 1px, transparent 1px 7px)";
