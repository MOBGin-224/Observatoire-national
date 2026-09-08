"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { t } from "@/lib/i18n";

export function BoutonDeconnexion() {
  const router = useRouter();

  async function seDeconnecter() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={seDeconnecter}
      className="underline"
      style={{ color: "var(--color-text-secondary)" }}
    >
      {t("nav.deconnexion")}
    </button>
  );
}
