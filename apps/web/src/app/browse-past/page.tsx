import Link from "next/link";
import { makeGqlClient } from "@/lib/graphql";
import BouncyClick from "@/components/ui/bouncy-click";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type Stream = {
  uuid: string;
  title: string;
  description: string;
  status: "live" | "processing" | "past";
  thumbnailUrl?: string | null;
};

export default async function BrowsePastPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const resolved = searchParams ? await searchParams : undefined;
  const q = resolved?.q ?? "";
  const client = makeGqlClient();
  const data = await client.request<{ pastStreams: Stream[] }>(
    `
      query PastStreams($q: String) {
        pastStreams(search: $q) {
          uuid
          title
          description
          status
          thumbnailUrl
        }
      }
    `,
    { q }
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold">Past Streams</div>
          <div className="text-sm text-zinc-500">Replays (MVP listing).</div>
        </div>
        <form action="/browse-past" className="flex items-center gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search title/description"
            className="w-64 rounded-md border px-3 py-2 text-sm"
          />
          <BouncyClick>
            <Button variant="outline">
              <Search className="size-4 mr-2" />
              Search
            </Button>
          </BouncyClick>
        </form>
      </div>

      <div className="grid gap-3">
        {data.pastStreams.length === 0 ? (
          <div className="rounded-lg border bg-zinc-900 p-4 text-sm text-zinc-500">
            No past streams yet.
          </div>
        ) : (
          data.pastStreams.map((s) => (
            <Link
              key={s.uuid}
              href={`/stream/${s.uuid}`}
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
          ))
        )}
      </div>
    </div>
  );
}
