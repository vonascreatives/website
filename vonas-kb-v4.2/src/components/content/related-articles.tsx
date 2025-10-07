import type { KnowledgeBaseItem } from '@/data/knowledge-base-data';

interface RelatedArticlesProps {
  articles: KnowledgeBaseItem[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;


  return (
    <div className="mb-8">
      <h3 className="text-base font-medium text-gray-900 mb-4" data-testid="related-articles-title">
        Related Articles
      </h3>
      <div className="space-y-3">
        {articles.map((article) => (
          <div 
            key={article.id}
            className="border border-gray-200 rounded p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            data-testid={`card-related-article-${article.id}`}
          >
            <h4 className="font-medium text-gray-900 mb-2" data-testid={`title-related-article-${article.id}`}>
              {article.title}
            </h4>
            <p className="text-gray-600 text-sm mb-3" data-testid={`description-related-article-${article.id}`}>
              {article.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded" data-testid={`badge-related-article-type-${article.id}`}>
                {article.type}
              </span>
              <span className="text-xs text-gray-500" data-testid={`read-time-related-article-${article.id}`}>
                {article.readTime}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
