// components/dashboard/SearchBar.jsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, X } from "lucide-react";

export default function SearchBar({ initialQuery = "" }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(initialQuery);
  
    // Handle initial hydration
    useEffect(() => {
      if (initialQuery) {
        setSearchQuery(initialQuery);
      }
    }, [initialQuery]);
  
    const handleSearch = (e) => {
      e.preventDefault();
      const params = new URLSearchParams(searchParams.toString());
      
      if (searchQuery) {
        params.set("q", searchQuery);
        params.delete("page"); // Reset to first page when searching
      } else {
        params.delete("q");
      }
      
      router.push(`/dashboard?${params.toString()}`);
    };
  
    const clearSearch = () => {
      setSearchQuery("");
      const params = new URLSearchParams(searchParams.toString());
      params.delete("q");
      params.delete("page");
      router.push(`/dashboard?${params.toString()}`);
    };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-2xl mx-auto">
      <div className="relative grow">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <SearchIcon className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles by title or content..."
          className="pl-10 pr-10 py-6 text-base"
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 h-full px-3 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="flex justify-center gap-2">
        <Button
          type="submit"
          variant="default"
          className="px-6 py-2 h-full"
        >
          Search
        </Button>
        {searchQuery && (
          <Button
            type="button"
            variant="outline"
            onClick={clearSearch}
            className="px-6 py-2  h-full"
          >
            Clear Search
          </Button>
        )}
      </div>
    </form>
  );
}