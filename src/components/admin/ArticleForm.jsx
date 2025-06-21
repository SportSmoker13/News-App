// components/admin/ArticleForm.jsx
"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { format } from "date-fns";
import ClientCalendar from "@/components/ui/ClientCalendar";
import { 
  ClipboardList, 
  Link, 
  Calendar, 
  Type,
  Loader2
} from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function ArticleForm({
  initialValues = {},
  onSubmit,
  isSubmitting = false,
  submitLabel = "Submit",
  showCancel = false,
  onCancel,
  onDelete,
  deleteLabel = "Delete",
}) {
  const [date, setDate] = useState(initialValues.date ? new Date(initialValues.date) : new Date());
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      news_title: initialValues.news_title || "",
      category: initialValues.category || "",
      source_link: initialValues.source_link || "",
      news_content: initialValues.news_content || "",
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit({ ...data, date });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <Label 
            htmlFor="news_title" 
            className="flex items-center gap-1 mb-2 text-gray-700 font-medium"
          >
            <Type className="h-4 w-4 text-[#0d2b69]" />
            Title *
          </Label>
          <Input
            id="news_title"
            placeholder="Enter article title"
            className={`pl-10 py-5 ${errors.news_title ? "border-red-300 focus:ring-red-200" : "focus:ring-[#0d2b69]/20"}`}
            {...register("news_title", { required: "Title is required" })}
          />
          {errors.news_title && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <span className="mr-1">•</span> {errors.news_title.message}
            </p>
          )}
        </div>
        
        <div className="relative">
          <Label 
            htmlFor="category" 
            className="flex items-center gap-1 mb-2 text-gray-700 font-medium"
          >
            <ClipboardList className="h-4 w-4 text-[#0d2b69]" />
            Category *
          </Label>
          <Input
            id="category"
            placeholder="e.g., Cardiology, Neurology"
            className={`pl-10 py-5 ${errors.category ? "border-red-300 focus:ring-red-200" : "focus:ring-[#0d2b69]/20"}`}
            {...register("category", { required: "Category is required" })}
          />
          {errors.category && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <span className="mr-1">•</span> {errors.category.message}
            </p>
          )}
        </div>
        
        
      </div>

      <div className="flex gap-8">

      <div className="relative">
          <Label className="flex items-center gap-1 mb-2 text-gray-700 font-medium">
            <Calendar className="h-4 text-[#0d2b69]" />
            Publication Date *
          </Label>
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <ClientCalendar date={date} onDateChange={setDate} />
            <p className="mt-4 text-sm text-gray-600 font-medium bg-gray-50 py-2 px-3 rounded-lg">
              Selected: {format(date, "MMMM d, yyyy")}
            </p>
          </div>
        </div>

        <div className="flex flex-col relative grow h-auto">
        <Label 
          htmlFor="news_content" 
          className="block mb-2 text-gray-700 font-medium"
        >
          Content
        </Label>
        <Textarea
          id="news_content"
          placeholder="Enter article content (supports Markdown formatting)"
          className="grow min-h-[200px] focus:ring-2 focus:ring-[#0d2b69]/20 w-full"
          {...register("news_content")}
        />
        <p className="mt-2 text-sm text-gray-500">
          Optional. You can use Markdown for formatting.
        </p>
      </div>

      </div>
      <div className="relative">
          <Label 
            htmlFor="source_link" 
            className="flex items-center gap-1 mb-2 text-gray-700 font-medium"
          >
            <Link className="h-4 w-4 text-[#0d2b69]" />
            Source Link *
          </Label>
          <Input
            id="source_link"
            type="url"
            placeholder="https://example.com"
            className={`pl-10 py-5 ${errors.source_link ? "border-red-300 focus:ring-red-200" : "focus:ring-[#0d2b69]/20"}`}
            {...register("source_link", {
              required: "Source link is required",
              pattern: {
                value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                message: "Invalid URL format",
              },
            })}
          />
          <p className="mt-2 text-sm text-gray-500">
            Must be a valid URL starting with http:// or https://
          </p>
          {errors.source_link && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <span className="mr-1">•</span> {errors.source_link.message}
            </p>
          )}
        </div>
      
      
      
      <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
        {showCancel && (
          <Button
            variant="outline"
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
        )}
        {onDelete && (
          <Button
            variant="destructive"
            type="button"
            onClick={onDelete}
            disabled={isSubmitting}
            className="px-6 py-3"
          >
            {deleteLabel}
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-[#0d2b69] hover:bg-[#0a1f4f] transition-all shadow-md hover:shadow-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}