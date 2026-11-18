import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="page-shell mx-auto max-w-3xl px-4 py-12">
      <p className="text-sage-deep text-sm font-semibold uppercase tracking-wide">
        Gobox · Amir Rashid
      </p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl text-walnut">Our story</h1>
      <div className="mt-6 space-y-4 text-muted leading-relaxed">
        <p>
          WoodCraft is the wooden-goods shop from Gobox. We bring warm, useful pieces into
          Pakistani homes: boards you chop on every day, spice boxes that look good on the
          counter, and toys that feel honest in a child&apos;s hands.
        </p>
        <p>
          We keep the catalog small on purpose. Fewer products, better finish, clearer
          photos, and checkout that matches how people actually buy here: COD, JazzCash,
          Easypaisa, and a quick WhatsApp confirmation.
        </p>
        <p>
          Questions? Message us on 0327 5695299. We are a small team, not a call centre.
        </p>
      </div>

      <div className="mt-10 grid sm:grid-cols-3 gap-3">
        {[
          { t: "Careful finish", d: "Edges and grain checked before packing." },
          { t: "Nationwide COD", d: "Confirm on WhatsApp, pay on delivery." },
          { t: "Gift ready", d: "Kitchen sets packed for birthdays and Eid." },
        ].map((x) => (
          <div key={x.t} className="card p-4">
            <h2 className="font-semibold text-walnut text-sm">{x.t}</h2>
            <p className="mt-1 text-xs text-muted">{x.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/shop" className="btn btn-primary">
          Shop collection
        </Link>
        <Link href="/contact" className="btn btn-secondary">
          Contact
        </Link>
      </div>
    </div>
  );
}
