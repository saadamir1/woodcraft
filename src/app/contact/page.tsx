import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/utils";

export default async function ContactPage() {
  const s = await getSettings();
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="font-display text-4xl text-walnut">Contact</h1>
      <p className="mt-3 text-muted text-sm">
        Fastest reply is WhatsApp. We help with orders, sizes, and care tips.
      </p>
      <a
        href={waLink(s.whatsappNumber, "Hi WoodCraft — ")}
        className="btn btn-sage mt-6 inline-flex"
        target="_blank"
        rel="noreferrer"
      >
        Message on WhatsApp
      </a>
      <div className="card p-4 mt-6 text-sm space-y-2">
        <p>
          <strong>Email:</strong> hello@woodcraft.pk
        </p>
        <p>
          <strong>Hours:</strong> Mon–Sat, 11am–8pm PKT
        </p>
      </div>
    </div>
  );
}
