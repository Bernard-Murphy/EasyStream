"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import BouncyClick from "@/components/ui/bouncy-click";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

type LiveFiltersProps = {
  initialSort: "viewers" | "recent";
  initialQuery: string;
};

export function LiveFilters({ initialSort, initialQuery }: LiveFiltersProps) {
  const router = useRouter();
  const [sort, setSort] = useState(initialSort);
  const [search, setSearch] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("q", search.trim());
    if (sort) params.set("sort", sort);
    startTransition(() => {
      router.push(`/browse-live?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="min-w-[150px]">
        <Select
          value={sort}
          onValueChange={(value) =>
            setSort(value as LiveFiltersProps["initialSort"])
          }
        >
          <SelectTrigger aria-label="Sort streams">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="viewers">Most viewers</SelectItem>
            <SelectItem value="recent">Most recent</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        name="q"
        placeholder="Search title/description"
        className="w-64"
      />
      <BouncyClick>
        <Button type="submit" variant="outline" disabled={isPending}>
          <Search className="size-4 mr-2" />
          Search
        </Button>
      </BouncyClick>
    </form>
  );
}
