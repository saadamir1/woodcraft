import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

export default async function ContactPage() {
  const s = await getSettings();
  return (
    <div className="page-shell mx-auto max-w-lg px-4 py-12">
      <h1 className="font-display text-4xl text-walnut">Contact</h1>
      <p className="mt-3 text-muted text-sm leading-relaxed">
        Fastest reply is WhatsApp. Ask about sizes, gifts, city delivery, or JazzCash
        payment.
      </p>
      <a
        href={waLink(s.whatsappNumber, "Hi WoodCraft, ")}
        className="btn btn-sage mt-6 inline-flex"
        target="_blank"
        rel="noreferrer"
      >
        <WhatsAppIcon className="size-5" />
        Message on WhatsApp
      </a>
      <div className="card p-5 mt-6 text-sm space-y-3">
        <p>
          <strong className="text-walnut">WhatsApp</strong>
          <br />
          0327 5695299
        </p>
        <p>
          <strong className="text-walnut">JazzCash / Easypaisa</strong>
          <br />
          Same number: 0327 5695299
        </p>
        <p>
          <strong className="text-walnut">Hours</strong>
          <br />
          Mon–Sat, 11am–8pm PKT
        </p>
      </div>
    </div>
  );
}
