"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export default function Pagination({ currentPage, totalPages, searchQuery = "" }) {
  const searchParams = useSearchParams();
  
  // Create query string for pagination links
  const createQueryString = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return params.toString();
  };

  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  return (
    <div className="flex justify-center gap-2 mt-8">
      {prevPage > 0 && (
        <Button asChild variant="outline">
          <Link href={`/dashboard?${createQueryString(prevPage)}`}>
            Previous
          </Link>
        </Button>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <Button 
          key={page}
          asChild
          variant={page === currentPage ? "default" : "outline"}
        >
          <Link href={`/dashboard?${createQueryString(page)}`}>
            {page}
          </Link>
        </Button>
      ))}

      {nextPage <= totalPages && (
        <Button asChild variant="outline">
          <Link href={`/dashboard?${createQueryString(nextPage)}`}>
            Next
          </Link>
        </Button>
      )}
    </div>
  );
}