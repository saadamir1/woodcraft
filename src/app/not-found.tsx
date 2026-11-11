import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="font-display text-5xl text-walnut">404</h1>
      <p className="mt-3 text-muted">That page wandered off into the woodwork.</p>
      <Link href="/shop" className="btn btn-primary mt-6 inline-flex">
        Back to shop
      </Link>
    </div>
  );
}
