import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

type Scope = "all" | "rider" | "driver";

// 👇 note the Promise type
export default async function RidesPage({
  searchParams,
}: {
  searchParams: Promise<{ scope?: Scope, page: string }> ;
}) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string | undefined;
  // 👇 unwrap the promise
  const sp = await searchParams;
  const scope = (sp?.scope ?? "all") as Scope;
  const pageSize = 5;
  const page = Number(sp?.page) || 1;
  const skip = (page - 1) * pageSize;
  const where =
    scope === "rider" && userId ? { riderId: userId } :
    scope === "driver" && userId ? { driverId: userId } :
    {};

  const totalCount = await db.ride.count({ where });

  const totalPages = Math.ceil(totalCount / pageSize);


  const rides = await db.ride.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { rider: true, driver: true },
    take:5,
    skip: skip,
  });


  const Tab = ({ href, label, active }: { href: string; label: string; active: boolean; page: number }) => (
    <a
      href={href}
      className={`px-3 py-2 rounded-md border ${
        active ? "border-[--color-brand] text-[--color-brand]" :
                 "border-[--color-border] text-[--color-muted]"
      }`}
    >
      {label}
    </a>
  );

  return (
    <main className="min-h-screen bg-[--color-bg] text-[--color-text]">
      <section className="container py-9">
        <div className="flex items-center justify-between mb-7">
          <h1 className="text-2xl font-bold">Rides</h1>
          <a href="/rides/new" className="btn-primary">New Ride</a>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Tab href="/rides?scope=all" label="All" active={scope === "all"} />
          <Tab href="/rides?scope=rider" label="My rides (rider)" active={scope === "rider"} />
          <Tab href="/rides?scope=driver" label="My rides (driver)" active={scope === "driver"} />
        </div>

        <div className="grid gap-4">
          {rides.map((r) => (
            <article key={r.id} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{r.origin} → {r.destination}</div>
                  <div className="text-[--color-muted] text-sm">
                    Rider: {r.rider?.name ?? "(deleted)"} • Driver: {r.driver?.name ?? "(deleted)"}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-semibold">${(r.priceCents / 100).toFixed(2)}</div>
                  <form action={async () => { "use server"; const { deleteRide } = await import("./actions"); await deleteRide(r.id); }}>
                    <button type="submit" className="border-2 rounded px-3 py-1 cursor-pointer">Delete</button>
                  </form>
                </div>
              </div>
            </article>
          ))}
          {rides.length === 0 && <p className="text-[--color-muted]">No rides found for this filter.</p>}
        </div>
           <div className="flex gap-2 mt-6">
            {page > 1 && <a href={`/rides?scope=${scope}&page=${page - 1}`}>Previous</a>}
            {page < totalPages && <a href={`/rides?scope=${scope}&page=${page + 1}`}>Next</a>}
          </div>
      </section>
    </main>
  );
}
