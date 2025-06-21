"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import Link from "next/link";

export default function ArticleModal({ article }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button 
        variant="default" 
        onClick={() => setOpen(true)}
      >
        Read Article
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {article.news_title}
            </DialogTitle>
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                {article.category}
              </span>
              <span>
                Published: {new Date(article.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {article.news_content ? (
              <div className="prose dark:prose-invert max-w-none">
                {article.news_content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                No content available for this article.
              </p>
            )}
            
            <div className="mt-6 pt-4 border-t border-border">
              <Button asChild variant="outline" className="w-full">
                <Link 
                  href={article.source_link} 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Original Source
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}