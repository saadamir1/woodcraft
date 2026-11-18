export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-5" aria-busy="true">
      <div className="skeleton h-10 w-36" />
      <div className="skeleton h-12 w-full max-w-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton aspect-[4/5] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
