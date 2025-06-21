// components/dashboard/CategoryTabs.jsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CategoryTabs({ categories = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current category from URL
  const currentCategory = searchParams.get("category") || "all";
  
  // Get search query
  const searchQuery = searchParams.get("q") || "";

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams(searchParams);
    
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    
    // Reset to first page when changing categories
    params.delete("page");
    
    router.push(`/dashboard?${params.toString()}`);
  };

  // Add "All" category option
  const allCategories = ["all", ...categories];

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex space-x-2 min-w-max">
        {allCategories.map((category) => (
          <Button
            key={category}
            variant="outline"
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
              currentCategory === category
                ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
            onClick={() => handleCategoryChange(category)}
          >
            {category === "all" ? "All Categories" : category}
          </Button>
        ))}
      </div>
      
      {/* Selected category indicator */}
      {currentCategory !== "all" && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing articles in: <span className="font-semibold text-foreground">{currentCategory}</span>
          </p>
          <Button
            variant="link"
            size="sm"
            className="text-primary hover:text-primary/80"
            onClick={() => handleCategoryChange("all")}
          >
            Clear filter
          </Button>
        </div>
      )}
      
      {/* Search indicator */}
      {searchQuery && (
        <p className="mt-2 text-sm text-muted-foreground">
          Search results for: <span className="font-semibold text-foreground">"{searchQuery}"</span>
        </p>
      )}
    </div>
  );
}