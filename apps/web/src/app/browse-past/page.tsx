import Image from "next/image";
import Link from "next/link";
import { makeGqlClient } from "@/lib/graphql";
import BouncyClick from "@/components/ui/bouncy-click";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
          <Input
            name="q"
            defaultValue={q}
            placeholder="Search title/description"
            className="w-64"
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
          <Card>
            <CardContent className="text-sm text-muted-foreground">
              No past streams yet.
            </CardContent>
          </Card>
        ) : (
          data.pastStreams.map((s) => (
            <BouncyClick key={s.uuid}>
              <Link href={`/stream/${s.uuid}`} className="block">
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
