-- CreateIndex
CREATE INDEX "Article_news_title_idx" ON "Article"("news_title");

-- CreateIndex
CREATE INDEX "Article_category_idx" ON "Article"("category");

-- CreateIndex
CREATE INDEX "Article_date_idx" ON "Article"("date");
