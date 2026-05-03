export default function DashboardLoading() {
  return (
    <div className="space-y-6" aria-live="polite" aria-busy="true">
      <div className="bg-lightsecondary rounded-lg px-6 py-5">
        <div className="bg-muted h-6 w-56 animate-pulse rounded" />
        <div className="bg-muted mt-3 h-4 w-full max-w-xl animate-pulse rounded" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="border-border bg-card rounded-lg border p-5"
          >
            <div className="bg-muted h-4 w-24 animate-pulse rounded" />
            <div className="bg-muted mt-4 h-8 w-16 animate-pulse rounded" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="border-border bg-card rounded-lg border p-5"
          >
            <div className="bg-muted h-5 w-40 animate-pulse rounded" />
            <div className="mt-5 space-y-3">
              <div className="bg-muted h-4 animate-pulse rounded" />
              <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
              <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
