// app/dashboard/page.jsx
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import SearchBar from "@/components/dashboard/SearchBar";
import CategoryTabs from "@/components/dashboard/CategoryTabs";
import NewsCard from "@/components/dashboard/NewsCard";
import Pagination from "@/components/dashboard/Pagination";
import { getAllArticles, getCachedArticleCount } from "@/lib/actions/article";
import { FileText, Folder, Calendar, FilePlus, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function Dashboard({ searchParams }) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  // Get current page from query parameters
  const page = typeof searchParams?.page === 'string' 
    ? parseInt(searchParams.page, 10) 
    : 1;
  
  // Get search query safely
  const searchQuery = searchParams?.q || "";
  const categoryFilter = searchParams?.category || "";
  
  // Fetch all articles
  const [allArticles, totalArticles] = await Promise.all([
    getAllArticles(),
    getCachedArticleCount(),
  ]);

  // Filter articles based on search query and category
  const filteredArticles = allArticles.filter(article => {
    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const titleMatch = article.news_title.toLowerCase().includes(searchLower);
      const contentMatch = article.news_content && article.news_content.toLowerCase().includes(searchLower);
      if (!titleMatch && !contentMatch) return false;
    }
    
    // Filter by category
    if (categoryFilter && article.category !== categoryFilter) {
      return false;
    }
    
    return true;
  });

  // Paginate filtered results
  const ITEMS_PER_PAGE = 9;
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const articles = filteredArticles.slice(startIndex, endIndex);
  
  // Calculate total pages based on filtered results
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  
  // Extract unique categories
  const categories = [...new Set(allArticles.map(a => a.category))];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="mb-10 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-muted p-3 rounded-full border border-border">
            <Stethoscope className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Medical News Digest</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
          Latest research updates and industry insights in pharmaceutical sciences
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-10 max-w-2xl mx-auto">
        <SearchBar initialQuery={searchQuery} />
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-muted p-3 rounded-lg mr-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-muted-foreground text-sm font-medium">Total Articles</h3>
              <p className="text-2xl font-bold text-foreground">{totalArticles}</p>
              {searchQuery || categoryFilter ? (
                <p className="text-xs text-muted-foreground mt-1">
                  Showing {filteredArticles.length} filtered
                </p>
              ) : null}
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-muted p-3 rounded-lg mr-4">
              <Folder className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-muted-foreground text-sm font-medium">Categories</h3>
              <p className="text-2xl font-bold text-foreground">{categories.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-muted p-3 rounded-lg mr-4">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-muted-foreground text-sm font-medium">Latest Update</h3>
              <p className="text-2xl font-bold text-foreground">
                {articles.length > 0 
                  ? new Date(articles[0].date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    }) 
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-10">
        <CategoryTabs categories={categories} />
      </div>

      {/* News Articles Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Latest Articles</h2>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
        </div>

        {articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
            
            {/* Pagination */}
            <div className="mt-12">
              <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
              />
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-muted/50 rounded-2xl border-2 border-dashed border-border">
            <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">No articles found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {searchQuery || categoryFilter
                ? `We couldn't find any articles${searchQuery ? ` matching "${searchQuery}"` : ""}${categoryFilter ? ` in category "${categoryFilter}"` : ""}`
                : "Check back soon for new updates in your feed."}
            </p>
          </div>
        )}
      </div>

      {/* Featured Resources Banner */}
<div className="relative overflow-hidden rounded-2xl mb-12">
  <div className="absolute inset-0 bg-gradient-to-r from-primary to-muted z-0"></div>
  
  {/* Medical pattern overlay */}
  <div className="absolute inset-0 z-0 opacity-10">
    <div className="pattern-dots pattern-border pattern-opacity-100 pattern-size-4 w-full h-full"></div>
  </div>
  
  <div className="relative z-10 p-8 text-primary-foreground">
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Icon section with animation */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="bg-accent/20 p-6 rounded-full">
              <div className="bg-gradient-to-br from-accent to-accent/80 p-4 rounded-full shadow-lg">
                <FilePlus className="h-12 w-12 text-accent-foreground" />
              </div>
            </div>
            <div className="absolute -top-2 -right-2">
              <div className="bg-destructive rounded-full p-2 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="flex-grow">
          <div className="mb-2">
            <Badge className="bg-accent/20 text-accent-foreground border border-accent/30 py-1 px-3 text-xs font-medium">
              Newsletter
            </Badge>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold mb-3 max-w-lg">
            Stay Updated with <span className="text-accent-foreground">Medical Insights</span>
          </h3>
          
          <p className="mb-6 text-primary-foreground/80 max-w-xl">
            Get weekly curated research summaries and industry updates delivered to your inbox
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
            <div className="flex-grow relative">
              <input 
                type="email" 
                placeholder="Your professional email" 
                className="w-full px-4 py-3 pl-12 rounded-lg text-foreground bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground absolute left-4 top-1/2 transform -translate-y-1/2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            
            <button className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-accent-foreground font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
              Subscribe
            </button>
          </div>
          
          <p className="mt-3 text-xs text-primary-foreground/60 max-w-lg">
            By subscribing, you agree to our <a href="#" className="text-accent-foreground hover:underline">Privacy Policy</a>. 
            Unsubscribe anytime with one click.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
    </div>
  );
}