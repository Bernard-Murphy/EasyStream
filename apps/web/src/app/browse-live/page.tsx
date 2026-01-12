import Link from 'next/link';
import { makeGqlClient } from '@/lib/graphql';

type Stream = {
  uuid: string;
  title: string;
  description: string;
  status: 'live' | 'processing' | 'past';
  thumbnailUrl?: string | null;
};

export default async function BrowseLivePage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const q = searchParams?.q ?? '';
  const client = makeGqlClient();
  const data = await client.request<{ liveStreams: Stream[] }>(
    `
      query LiveStreams($q: String) {
        liveStreams(sort: "viewers", search: $q) {
          uuid
          title
          description
          status
          thumbnailUrl
        }
      }
    `,
    { q },
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold">Live Now</div>
          <div className="text-sm text-slate-600">
            Sorted by viewer count (MVP uses active positions).
          </div>
        </div>
        <form action="/browse-live" className="flex items-center gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search title/description"
            className="w-64 rounded-md border px-3 py-2 text-sm"
          />
          <button className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50">
            Search
          </button>
        </form>
      </div>

      <div className="grid gap-3">
        {data.liveStreams.length === 0 ? (
          <div className="rounded-lg border bg-white p-4 text-sm text-slate-600">
            No live streams right now.
          </div>
        ) : (
          data.liveStreams.map((s) => (
            <Link
              key={s.uuid}
              href={`/live/${s.uuid}`}
              className="flex gap-4 rounded-lg border bg-white p-4 hover:bg-slate-50"
            >
              <div className="h-16 w-28 shrink-0 overflow-hidden rounded-md border bg-slate-100">
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
                <div className="truncate text-base font-semibold">{s.title}</div>
                <div className="mt-1 line-clamp-2 text-sm text-slate-600">
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


