import Image from "next/image";
import Link from "next/link";
import { makeGqlClient } from "@/lib/graphql";
import BouncyClick from "@/components/ui/bouncy-click";
import { LiveFilters } from "@/components/live/LiveFilters";
import { Card, CardContent } from "@/components/ui/card";

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
          <Card>
            <CardContent className="text-sm text-muted-foreground">
              No live streams right now.
            </CardContent>
          </Card>
        ) : (
          data.liveStreams.map((s) => (
            <BouncyClick key={s.uuid}>
              <Link href={`/live/${s.uuid}`} className="block">
                <Card className="hover:bg-accent/30 transition-colors">
                  <CardContent className="pt-4">
                    <div className="flex gap-4">
                      <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-md border bg-muted">
                        {s.thumbnailUrl ? (
                          <Image
                            src={s.thumbnailUrl}
                            alt={`${s.title} thumbnail`}
                            fill
                            sizes="112px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-base font-semibold">
                          {s.title}
                        </div>
                        <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {s.description}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </BouncyClick>
          ))
        )}
      </div>
    </div>
  );
}
