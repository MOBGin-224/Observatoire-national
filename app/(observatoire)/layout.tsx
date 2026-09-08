import { redirect } from "next/navigation";
import { EnTete } from "@/components/chrome/EnTete";
import { BandeauPerimetre } from "@/components/chrome/BandeauPerimetre";
import { NavigationLaterale } from "@/components/chrome/NavigationLaterale";
import { chargerMonCompte, chargerMesModules } from "@/lib/queries/compte";
import { chargerPerimetre } from "@/lib/queries/perimetre";

/*
 * Chrome commun a tous les ecrans du tableau de bord (document 9, A.1) :
 * en-tete, bandeau de perimetre non masquable, navigation laterale permanente.
 */
export default async function LayoutObservatoire({ children }: { children: React.ReactNode }) {
  const compte = await chargerMonCompte();

  if (!compte) {
    redirect("/");
  }

  const [modulesActifs, perimetre] = await Promise.all([chargerMesModules(), chargerPerimetre()]);

  return (
    <div className="flex flex-1 flex-col">
      <EnTete compte={compte} />
      <BandeauPerimetre perimetre={perimetre} />
      <div className="flex flex-1">
        <NavigationLaterale modulesActifs={modulesActifs} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
