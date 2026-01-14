import Link from "next/link";
import { makeGqlClient } from "@/lib/graphql";
import BouncyClick from "@/components/ui/bouncy-click";
import { LiveFilters } from "@/components/live/LiveFilters";

type Stream = {
  uuid: string;
  title: string;
  description: string;
  status: "live" | "processing" | "past";
  thumbnailUrl?: string | null;
};

export default async function BrowseLivePage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; sort?: "viewers" | "recent" }>;
}) {
  const resolved = searchParams ? await searchParams : undefined;
  const q = resolved?.q ?? "";
  const sort = resolved?.sort === "recent" ? "recent" : "viewers";
  const client = makeGqlClient();
  const data = await client.request<{ liveStreams: Stream[] }>(
    `
      query LiveStreams($q: String, $sort: String) { 
        liveStreams(sort: $sort, search: $q) {
          uuid
          title
          description
          status
          thumbnailUrl
        }
      }
    `,
    { q, sort }
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8" id="page">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold">Live Now</div>
          <div className="text-sm text-zinc-500">
            Sorted by {sort === "recent" ? "most recent" : "viewer count"}.
          </div>
        </div>
        <LiveFilters initialSort={sort} initialQuery={q} />
      </div>

      <div className="grid gap-3">
        {data.liveStreams.length === 0 ? (
          <div className="rounded-lg border bg-zinc-900 p-4 text-sm text-zinc-500">
            No live streams right now.
          </div>
        ) : (
          data.liveStreams.map((s) => (
            <BouncyClick key={s.uuid}>
              <Link
                href={`/live/${s.uuid}`}
                className="flex gap-4 rounded-lg border bg-zinc-900 p-4 hover:bg-zinc-800 transition-all duration-200"
              >
                <div className="h-16 w-28 shrink-0 overflow-hidden rounded-md border bg-zinc-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {s.thumbnailUrl ? (
                    <img
                      src={s.thumbnailUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold">
                    {s.title}
                  </div>
                  <div className="mt-1 line-clamp-2 text-sm text-zinc-500">
                    {s.description}
                  </div>
                </div>
              </Link>
            </BouncyClick>
          ))
        )}
      </div>
    </div>
  );
}
