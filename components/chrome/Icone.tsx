/*
 * Jeu d'icônes de la navigation repliée.
 *
 * Le document 8, point 12.1, bannit l'icône de toute l'interface. La règle est
 * maintenue partout, à une exception près introduite le 8 septembre 2026 : le
 * rail replié, où le libellé n'a plus la place de s'écrire. L'icône n'y est pas
 * décorative, elle est le seul porteur d'information restant. Elle est toujours
 * doublée d'un `title` et d'un `aria-label` reprenant le libellé exact, et elle
 * disparaît dès que le rail est déplié.
 *
 * Tracé maison, aucune bibliothèque : une dépendance d'icônes défaillante
 * produirait une colonne de carrés vides le jour de la démonstration
 * (document 8, section 9).
 *
 * Grille commune : 20 × 20, trait de 1,5, jamais d'aplat. Le trait unique tient
 * la lisibilité à 20 px et reste net en projection.
 */
export type NomIcone =
  | "synthese"
  | "offre"
  | "demande"
  | "activite"
  | "tension"
  | "conformite"
  | "maturite"
  | "evenementiel"
  | "retombees"
  | "methodologie"
  | "administration"
  | "deconnexion"
  | "replier"
  | "deplier";

const TRACES: Record<NomIcone, React.ReactNode> = {
  /* Quatre panneaux : la vue d'ensemble. */
  synthese: (
    <>
      <rect x="2.75" y="2.75" width="6" height="6" rx="1" />
      <rect x="11.25" y="2.75" width="6" height="6" rx="1" />
      <rect x="2.75" y="11.25" width="6" height="6" rx="1" />
      <rect x="11.25" y="11.25" width="6" height="6" rx="1" />
    </>
  ),
  /* Un bâtiment d'hébergement : façade, fenêtres, porte. */
  offre: (
    <>
      <path d="M3.25 17.25V5.25l6.75-2.5 6.75 2.5v12" />
      <path d="M2 17.25h16" />
      <path d="M8.25 17.25v-3.5h3.5v3.5" />
      <path d="M7 8h1.5M11.5 8H13M7 11h1.5M11.5 11H13" />
    </>
  ),
  /* Une loupe : la demande est ce que les visiteurs cherchent. */
  demande: (
    <>
      <circle cx="8.75" cy="8.75" r="5" />
      <path d="M12.5 12.5l4.25 4.25" />
    </>
  ),
  /* Une courbe : l'activité est un flux dans le temps. */
  activite: (
    <>
      <path d="M2.75 16.5V3.5" />
      <path d="M2.75 16.5h14.5" />
      <path d="M5.5 13l3.25-3.75L11.5 11.5 16 6" />
    </>
  ),
  /* Un cadran et son aiguille : la tension est une pression mesurée. */
  tension: (
    <>
      <path d="M3 14.5a7 7 0 0 1 14 0" />
      <path d="M10 14.5L13.25 9" />
      <path d="M3 14.5h2M15 14.5h2" />
    </>
  ),
  /* Un écu et sa validation : la conformité administrative. */
  conformite: (
    <>
      <path d="M10 2.75l5.75 2.25v5.25c0 3.5-2.4 6.2-5.75 7.25-3.35-1.05-5.75-3.75-5.75-7.25V5z" />
      <path d="M7.5 9.75l1.9 1.9 3.35-3.4" />
    </>
  ),
  /* Un écran : la maturité mesurée est numérique. */
  maturite: (
    <>
      <rect x="2.75" y="3.75" width="14.5" height="9.5" rx="1.25" />
      <path d="M7.25 17h5.5M10 13.25V17" />
      <path d="M6 10.25V8M9 10.25V6.5M12 10.25v-3" />
    </>
  ),
  /* Un calendrier : l'événementiel se lit en dates. */
  evenementiel: (
    <>
      <rect x="2.75" y="4.5" width="14.5" height="12.75" rx="1.25" />
      <path d="M2.75 8.25h14.5" />
      <path d="M6.5 2.75v3.5M13.5 2.75v3.5" />
      <path d="M6.5 11.75h2M11.5 11.75h2M6.5 14.5h2M11.5 14.5h2" />
    </>
  ),
  /* Un billet : les retombées sont une estimation de dépense. */
  retombees: (
    <>
      <rect x="2.25" y="5" width="15.5" height="10" rx="1.25" />
      <circle cx="10" cy="10" r="2.5" />
      <path d="M5.25 10h.5M14.25 10h.5" />
    </>
  ),
  /* Un ouvrage ouvert : la méthodologie est un document de référence. */
  methodologie: (
    <>
      <path d="M10 5.5v11" />
      <path d="M10 5.5C8.75 4.35 7.1 3.75 5 3.75H2.75v10.75H5c2.1 0 3.75.6 5 1.75" />
      <path d="M10 5.5c1.25-1.15 2.9-1.75 5-1.75h2.25v10.75H15c-2.1 0-3.75.6-5 1.75" />
    </>
  ),
  /* Des réglages : l'administration paramètre l'outil. */
  administration: (
    <>
      <path d="M2.75 6h5M11.25 6h6" />
      <path d="M2.75 14h6M12.25 14h5" />
      <circle cx="9.5" cy="6" r="1.75" />
      <circle cx="10.5" cy="14" r="1.75" />
    </>
  ),
  /* Une sortie : quitter la session. */
  deconnexion: (
    <>
      <path d="M8 3.25H4.75c-.83 0-1.5.67-1.5 1.5v10.5c0 .83.67 1.5 1.5 1.5H8" />
      <path d="M12.75 13.25L16.75 10l-4-3.25" />
      <path d="M16.75 10H7.5" />
    </>
  ),
  replier: <path d="M12.5 4.75L7.25 10l5.25 5.25" />,
  deplier: <path d="M7.5 4.75L12.75 10 7.5 15.25" />,
};

export function Icone({
  nom,
  taille = 20,
  className,
}: {
  nom: NomIcone;
  taille?: number;
  className?: string;
}) {
  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ flexShrink: 0 }}
    >
      {TRACES[nom]}
    </svg>
  );
}
