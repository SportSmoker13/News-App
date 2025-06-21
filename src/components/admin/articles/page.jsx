// app/admin/articles/page.jsx
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import ArticlesTable from "@/components/admin/ArticlesTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function AdminArticlesPage({ searchParams }) {
  const session = await getServerSession();
  
  // Redirect if not admin or client
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "CLIENT")) {
    redirect("/dashboard");
  }

  // Pagination
  const page = parseInt(searchParams?.page) || 1;
  const pageSize = 10;
  const skip = (page - 1) * pageSize;
  
  // Search and filter
  const searchQuery = searchParams?.q || "";
  const category = searchParams?.category || "";
  
  // Fetch articles
  const whereClause = {
    AND: [
      searchQuery ? {
        OR: [
          { news_title: { contains: searchQuery, mode: "insensitive" } },
          { news_content: { contains: searchQuery, mode: "insensitive" } }
        ]
      } : {},
      category ? { category } : {}
    ]
  };

  const [articles, totalArticles] = await Promise.all([
    prisma.article.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
      skip,
      take: pageSize,
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    }),
    prisma.article.count({ where: whereClause })
  ]);

  const totalPages = Math.ceil(totalArticles / pageSize);
  const categories = await prisma.article.findMany({
    select: { category: true },
    distinct: ["category"]
  });

  // Helper function to create query string
  const createQueryString = (params) => {
    const newParams = new URLSearchParams();
    
    if (params.q && params.q.trim() !== "") newParams.set("q", params.q);
    if (params.category && params.category.trim() !== "") newParams.set("category", params.category);
    if (params.page && params.page > 1) newParams.set("page", params.page.toString());
    
    return newParams.toString();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Manage Articles</h1>
          <p className="text-gray-600">
            View, edit, and manage all articles on the platform
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/articles/create">
            Create New Article
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </Label>
              <Input
                id="search"
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Search articles..."
                className="w-full"
                form="filter-form"
              />
            </div>
            
            <div>
              <Label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </Label>
              <select
                id="category"
                name="category"
                defaultValue={category}
                className="w-full px-3 py-2 border rounded-md cursor-pointer"
                form="filter-form"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.category} value={cat.category}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <form id="filter-form" className="w-full">
                <Button type="submit" className="w-full">
                  Apply Filters
                </Button>
              </form>
            </div>
          </div>
        </div>

        <ArticlesTable articles={articles} />
        
        <div className="p-4 border-t flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {articles.length} of {totalArticles} articles
          </p>
          
          <div className="flex space-x-2">
            <Button
              asChild
              variant="outline"
              disabled={page <= 1}
            >
              <Link 
                href={`/admin/articles?${createQueryString({ 
                  q: searchQuery, 
                  category, 
                  page: page - 1 
                })}`}
              >
                Previous
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              disabled={page >= totalPages}
            >
              <Link 
                href={`/admin/articles?${createQueryString({ 
                  q: searchQuery, 
                  category, 
                  page: page + 1 
                })}`}
              >
                Next
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}