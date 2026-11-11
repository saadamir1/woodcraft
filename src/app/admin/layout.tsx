import { auth } from "@/lib/auth";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <div className="min-h-[70vh] bg-cream-2/40">
      {session?.user ? <AdminNav role={session.user.role} /> : null}
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </div>
  );
}
