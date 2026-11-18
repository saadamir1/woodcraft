export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8" aria-busy="true">
      <div className="skeleton h-4 w-64 mb-6" />
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="skeleton aspect-[4/5] rounded-[1.5rem]" />
        <div className="space-y-4">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-12 w-3/4" />
          <div className="skeleton h-8 w-40" />
          <div className="skeleton h-24 w-full" />
          <div className="skeleton h-12 w-full" />
        </div>
      </div>
    </div>
  );
}