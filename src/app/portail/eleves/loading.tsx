import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";

export default function Loading() {
  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7 h-8 w-40 animate-pulse rounded-lg bg-neutral-200" />
          <div className="rounded-2xl border border-neutral-200 bg-white">
            <div className="border-b border-neutral-100 p-5">
              <div className="h-9 w-64 animate-pulse rounded-xl bg-neutral-100" />
            </div>
            <div className="divide-y divide-neutral-100">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="h-9 w-9 animate-pulse rounded-xl bg-neutral-200" />
                  <div className="h-4 flex-1 animate-pulse rounded bg-neutral-100" />
                  <div className="h-4 w-20 animate-pulse rounded bg-neutral-100" />
                  <div className="h-4 w-16 animate-pulse rounded bg-neutral-100" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
