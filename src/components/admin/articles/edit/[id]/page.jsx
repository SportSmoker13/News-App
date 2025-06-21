// app/admin/articles/edit/[id]/page.jsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ClientCalendar from "@/components/ui/ClientCalendar";
import { format } from "date-fns";
import { updateArticle, deleteArticle } from "@/lib/actions/article";
import { toast } from "sonner";
import ArticleForm from "@/components/admin/ArticleForm";

export default function EditArticlePage({ params }) {
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${params.id}`);
        if (!response.ok) throw new Error("Article not found");
        
        const data = await response.json();
        setArticle(data);
        reset(data);
        setDate(new Date(data.date));
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch article:", error);
        toast.error("Failed to load article");
        router.push("/admin/articles");
      }
    };
    
    fetchArticle();
  }, [params.id, reset, router]);

  const handleUpdate = async (data) => {
    setIsSubmitting(true);
    try {
      const formattedDate = new Date(date);
      formattedDate.setUTCHours(0, 0, 0, 0);
      const result = await updateArticle(article.id, {
        ...data,
        date: formattedDate.toISOString(),
      });
      if (result.success) {
        toast.success("Article updated successfully");
        router.push("/admin/articles");
      } else {
        toast.error(result.message || "Failed to update article");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article? This cannot be undone.")) return;
    setIsSubmitting(true);
    try {
      const result = await deleteArticle(article.id);
      if (result.success) {
        toast.success("Article deleted successfully");
        router.push("/admin/articles");
      } else {
        toast.error(result.message || "Failed to delete article");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Delete error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!article) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Article</h1>
          <p className="text-gray-600">Update the details of this medical news article</p>
        </div>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isSubmitting}
        >
          Delete Article
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ArticleForm
            initialValues={article}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            submitLabel="Update Article"
            showCancel={true}
            onCancel={() => router.push("/admin/articles")}
          />
        </CardContent>
      </Card>
    </div>
  );
}