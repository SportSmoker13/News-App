// app/admin/articles/create/page.jsx
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { createArticle } from "@/lib/actions/article";
import ArticleForm from "@/components/admin/ArticleForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CreateArticlePage() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitResult(null);
    
    try {
      // Format date to ISO string without time
      const formattedDate = new Date(date);
      formattedDate.setUTCHours(0, 0, 0, 0);
      
      const result = await createArticle({
        ...data,
        date: formattedDate.toISOString(),
      });
      
      if (result.success) {
        setSubmitResult({ type: "success", message: result.message });
        reset();
        setTimeout(() => router.push("/admin/articles"), 1500);
      } else {
        setSubmitResult({ type: "error", message: result.message });
      }
    } catch (error) {
      setSubmitResult({ type: "error", message: "An unexpected error occurred" });
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => router.back()}
            className="rounded-full bg-white border-gray-200 hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Create New Article</h1>
            <p className="text-gray-600 mt-1">Add a new medical news article to the platform</p>
          </div>
        </div>
      </div>
      
      <Card className="rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <CardHeader className="flex flex-center bg-gradient-to-r from-slate-50 to-slate-100 border-b border-gray-200 py-5">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="bg-[#0d2b69] w-1.5 h-6 rounded-full"></span>
            Article Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {submitResult && (
            <div className={`mb-6 p-4 rounded-lg flex items-center ${
              submitResult.type === "success" 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              <div className={`w-3 h-3 rounded-full mr-3 ${
                submitResult.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}></div>
              <p className="font-medium">{submitResult.message}</p>
            </div>
          )}
          <ArticleForm
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Create Article"
            showCancel={true}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </div>
  );
}