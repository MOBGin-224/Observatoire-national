import { redirect } from "next/navigation";
import { EnTete } from "@/components/chrome/EnTete";
import { BandeauPerimetre } from "@/components/chrome/BandeauPerimetre";
import { NavigationLaterale } from "@/components/chrome/NavigationLaterale";
import { PiedImpression } from "@/components/chrome/PiedImpression";
import { chargerMonCompte, chargerMesModules } from "@/lib/queries/compte";
import { chargerPerimetre } from "@/lib/queries/perimetre";

/*
 * Chrome commun a tous les ecrans du tableau de bord (document 9, A.1) :
 * en-tete, navigation laterale permanente, bandeau de perimetre non masquable.
 *
 * Le bandeau de perimetre est place dans la colonne de contenu, sous la barre
 * d'en-tete et a droite de la navigation : il decrit le perimetre des donnees
 * affichees, pas l'outil. Il reste collant au defilement de cette colonne.
 */
export default async function LayoutObservatoire({ children }: { children: React.ReactNode }) {
  const compte = await chargerMonCompte();

  if (!compte) {
    redirect("/");
  }

  const [modulesActifs, perimetre] = await Promise.all([chargerMesModules(), chargerPerimetre()]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <EnTete compte={compte} />
      <div className="flex min-h-0 flex-1">
        <NavigationLaterale modulesActifs={modulesActifs} />
        <div className="flex min-w-0 flex-1 flex-col">
          <BandeauPerimetre perimetre={perimetre} />
          <main className="min-w-0 flex-1">{children}</main>
          <PiedImpression
            emetteur={`${compte.prenom} ${compte.nom}`}
            date={new Date().toISOString()}
          />
        </div>
      </div>
    </div>
  );
}
