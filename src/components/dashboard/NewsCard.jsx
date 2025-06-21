// components/dashboard/NewsCard.jsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ArticleModal from "./ArticleModal";

export default function NewsCard({ article }) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
      <h3 className="text-lg font-semibold mb-2">{article.news_title}</h3>
      <div className="flex justify-between text-sm text-muted-foreground mb-4">
        <span>{article.category}</span>
        <span>{new Date(article.date).toLocaleDateString()}</span>
      </div>
      
      <div className="flex gap-2">
        <ArticleModal article={article} />
        <Button variant="outline" asChild>
          <Link href={article.source_link} target="_blank">
            Source
          </Link>
        </Button>
      </div>
    </div>
  );
}