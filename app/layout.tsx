import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

/*
 * Document 8, section 9 : polices auto-hebergees, jamais appelees depuis un
 * service tiers a l'affichage. next/font telecharge les fichiers au build et
 * les sert depuis notre propre domaine.
 *
 * Montserrat porte les titres et les valeurs d'indicateur. Inter remplace Arial
 * sur le texte courant et les donnees : chiffres tabulaires natifs et lisibilite
 * en projection a trois metres, ce qu'Arial ne fournit pas. Document 8,
 * section 3, revise le 2026-09-08.
 */
const montserrat = Montserrat({
  variable: "--font-titre",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-texte",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Observatoire National de l'Hospitalité Guinéenne",
  description: "Une infrastructure SIMANDOU SEJOUR",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      /* L'attribut data-rail est pose par le script ci-dessous avant hydratation :
         l'ecart avec le rendu serveur est voulu, pas un defaut a signaler. */
      suppressHydrationWarning
      className={`${montserrat.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/*
         * Pose l'etat replie du rail avant la premiere peinture. Sans ce script,
         * le rail se retracte sous les yeux a chaque rechargement, puisque le
         * rendu serveur ne connait pas le stockage du navigateur.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(localStorage.getItem("observatoire.navigation.repliee")==="1"){document.documentElement.dataset.rail="replie"}}catch(e){}',
          }}
        />
        {children}
      </body>
    </html>
  );
}
