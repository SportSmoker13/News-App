// components/admin/ArticlesTable.jsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { deleteArticle } from "@/lib/actions/article";
import { toast } from "sonner";
import { useState } from "react";
import { Edit, Trash2, Eye, CalendarDays, Folder, User, FileText } from "lucide-react";

export default function ArticlesTable({ articles = [] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) return;
    
    setDeletingId(id);
    
    try {
      const result = await deleteArticle(id);
      if (result.success) {
        toast.success("Article deleted successfully", {
          description: "The article has been permanently removed",
          position: "top-center"
        });
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete article", {
          position: "top-center"
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred", {
        description: "Please try again later",
        position: "top-center"
      });
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (articles.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto max-w-md">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No articles found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or create a new article
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="pl-6 py-4 font-medium text-foreground">Article</TableHead>
            <TableHead className="py-4">
              <div className="flex items-center gap-1 text-foreground">
                <Folder className="w-4 h-4" />
                Category
              </div>
            </TableHead>
            <TableHead className="py-4">
              <div className="flex items-center gap-1 text-foreground">
                <CalendarDays className="w-4 h-4" />
                Date
              </div>
            </TableHead>
            <TableHead className="py-4">
              <div className="flex items-center gap-1 text-foreground">
                <User className="w-4 h-4" />
                Author
              </div>
            </TableHead>
            <TableHead className="py-4 text-foreground">Status</TableHead>
            <TableHead className="pr-6 py-4 text-right text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id} className="border-t border-border hover:bg-muted/50 transition-colors">
              <TableCell className="pl-6 py-4">
                <Link 
                  href={`/admin/articles/edit/${article.id}`}
                  className="font-medium text-foreground hover:text-muted-foreground transition-colors flex items-start gap-2"
                >
                  <FileText className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                  <span className="line-clamp-2">{article.news_title}</span>
                </Link>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                  <a 
                    href={article.source_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground hover:underline truncate max-w-[200px]"
                  >
                    {article.source_link}
                  </a>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <Badge variant="secondary" className="bg-muted text-muted-foreground border border-border">
                  {article.category}
                </Badge>
              </TableCell>
              <TableCell className="py-4 text-muted-foreground">
                {format(new Date(article.date), "MMM dd, yyyy")}
              </TableCell>
              <TableCell className="py-4 text-muted-foreground">
                {article.author?.name || article.author?.email || "Unknown"}
              </TableCell>
              <TableCell className="py-4">
                <Badge variant="success" className="bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                  Published
                </Badge>
              </TableCell>
              <TableCell className="pr-6 py-4">
                <div className="flex justify-end gap-1.5">
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="border-border hover:bg-muted text-muted-foreground"
                  >
                    <Link href={`/admin/articles/edit/${article.id}`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(article.id)}
                    disabled={deletingId === article.id}
                    className="hover:bg-destructive/90"
                  >
                    {deletingId === article.id ? (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}