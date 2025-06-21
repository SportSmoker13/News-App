// src/app/admin/articles/page.jsx
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import ArticlesTable from "@/components/admin/ArticlesTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/db";
import { PlusCircle, FileUp, Search, Filter } from "lucide-react";

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
  
  // Get unique categories
  const categories = await prisma.article.groupBy({
    by: ['category'],
    _count: {
      category: true,
    },
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Articles</h1>
          <p className="text-muted-foreground mt-1">
            View, edit, and manage all articles on the platform
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/articles/import" className="flex items-center gap-2">
              <FileUp className="w-4 h-4" />
              Import Articles
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/articles/create" className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Create New Article
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border">
          <form id="filter-form" className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-1">
                <Search className="w-4 h-4" />
                Search Articles
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="Search by title or content..."
                  className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-1">
                <Filter className="w-4 h-4" />
                Category
              </label>
              <div className="relative">
                <select
                  name="category"
                  defaultValue={category}
                  className="w-full pl-3 pr-10 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring appearance-none cursor-pointer bg-background text-foreground"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.category} value={cat.category}>
                      {cat.category} ({cat._count.category})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex items-end">
              <Button 
                type="submit" 
                className="w-full h-[42px]"
              >
                Apply Filters
              </Button>
            </div>
          </form>
        </div>

        <ArticlesTable articles={articles} />
        
        <div className="p-5 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{(page-1)*pageSize + 1}-{Math.min(page*pageSize, totalArticles)}</span> of <span className="font-medium text-foreground">{totalArticles}</span> articles
          </p>
          
          <div className="flex space-x-2">
            <Button
              asChild
              variant="outline"
              disabled={page <= 1}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Link 
                href={`/admin/articles?${createQueryString({ 
                  q: searchQuery, 
                  category, 
                  page: page - 1 
                })}`}
                className="flex items-center gap-1"
              >
                Previous
              </Link>
            </Button>
            
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Page <span className="font-medium text-foreground">{page}</span> of <span className="font-medium text-foreground">{totalPages}</span>
            </div>
            
            <Button
              asChild
              variant="outline"
              disabled={page >= totalPages}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Link 
                href={`/admin/articles?${createQueryString({ 
                  q: searchQuery, 
                  category, 
                  page: page + 1 
                })}`}
                className="flex items-center gap-1"
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