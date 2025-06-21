// app/admin/articles/edit/[id]/page.jsx
import { redirect } from "next/navigation";
import { getArticle } from "@/lib/actions/article";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditArticleForm from "@/components/admin/EditArticleForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditArticlePage({ params }) {
  const searchParams = await params;
  // Fetch article data on the server
  const article = await getArticle(searchParams.id);
  
  if (!article) {
    redirect("/admin/articles");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            asChild
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white border-gray-200 hover:bg-gray-50"
          >
            <Link href="/admin/articles">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Edit Article</h1>
            <p className="text-gray-600 mt-1">Update the details of this medical news article</p>
          </div>
        </div>
      </div>
      
      <Card className="rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <CardHeader className="flex flex-cente bg-gradient-to-r from-slate-50 to-slate-100 border-b border-gray-200 py-5">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="bg-[#0d2b69] w-1.5 h-6 rounded-full"></span>
            Article Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <EditArticleForm article={article} />
        </CardContent>
      </Card>
    </div>
  );
}