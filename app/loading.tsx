export default function Loading() {
  return (
    <div className="container-px section-y">
      <div className="h-8 w-48 animate-pulse rounded-md bg-black/10 dark:bg-white/10" />
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-64 animate-pulse rounded-md bg-black/10 dark:bg-white/10" />
        ))}
      </div>
    </div>
  );
}
