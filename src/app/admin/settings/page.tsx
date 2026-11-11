import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const rows = await prisma.setting.findMany();
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="font-display text-3xl text-walnut">Settings</h1>
      <SettingsForm initial={map} />
    </div>
  );
}
