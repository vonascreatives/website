import type { KnowledgeBaseItem } from '@/data/knowledge-base-data';

interface ContentHeaderProps {
  item: KnowledgeBaseItem;
}

export function ContentHeader({ item }: ContentHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2" data-testid="content-title">
            {item.title}
          </h1>
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded" data-testid="content-type-badge">
            {item.type}
          </span>
        </div>
        <div className="text-sm text-gray-500" data-testid="content-last-updated">
          Last updated {item.lastUpdated}
        </div>
      </div>
      {item.description && (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4" data-testid="content-description">
          <p className="text-gray-700 leading-relaxed text-sm">{item.description}</p>
        </div>
      )}
    </header>
  );
}
