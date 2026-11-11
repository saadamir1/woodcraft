export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-4xl text-walnut">Privacy</h1>
      <div className="mt-6 space-y-3 text-muted text-sm leading-relaxed">
        <p>We collect name, phone, address, and order details to fulfill purchases and improve ads.</p>
        <p>We use Meta Pixel / Conversions API when configured, plus our own store analytics.</p>
        <p>We do not sell your personal data. Contact us to request deletion of unused records.</p>
      </div>
    </div>
  );
}
