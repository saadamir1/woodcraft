export default function RootLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-6" aria-busy="true">
      <div className="skeleton h-10 w-48" />
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="skeleton h-8 w-40" />
          <div className="skeleton h-14 w-full max-w-md" />
          <div className="skeleton h-20 w-full max-w-sm" />
          <div className="skeleton h-12 w-40" />
        </div>
        <div className="skeleton aspect-[5/4] w-full rounded-[1.5rem]" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton aspect-[4/5] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
