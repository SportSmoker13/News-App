"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ClientCalendar from "@/components/ui/ClientCalendar";
import { format } from "date-fns";
import { updateArticle, deleteArticle } from "@/lib/actions/article";
import { toast } from "sonner";
import ArticleForm from "./ArticleForm";

export default function EditArticleForm({ article }) {
  const router = useRouter();
  const [date, setDate] = useState(new Date(article.date));
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      news_title: article.news_title,
      category: article.category,
      source_link: article.source_link,
      news_content: article.news_content || "",
    }
  });

  const onSubmit = async (data) => {
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

  return (
    <div className="space-y-6">
      <ArticleForm
        initialValues={article}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Update Article"
        showCancel={true}
        onCancel={() => router.push("/admin/articles")}
        onDelete={handleDelete}
        deleteLabel="Delete Article"
      />
    </div>
  );
} 