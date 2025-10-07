import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle } from 'lucide-react';
import { ContentHeader } from './content-header';
import { StepCounter } from './step-counter';
import { RelatedArticles } from './related-articles';
import { WorkflowSteps } from './workflow-steps';
import { PortableText } from '@portabletext/react';
import type { KnowledgeBaseItem } from '@/data/knowledge-base-data';

interface MainContentProps {
  item: KnowledgeBaseItem | null;
  relatedArticles: KnowledgeBaseItem[];
}

export function MainContent({ item, relatedArticles }: MainContentProps) {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  if (!item) {
    return (
      <main className="flex-1 max-w-none">
        <div className="max-w-4xl mx-auto p-8">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-foreground mb-4">Welcome to ProductionDocs</h1>
            <p className="text-lg text-muted-foreground">
              Select an item from the sidebar to view its content.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  };

  const isWorkflow = item.type === 'Workflow';
  const portableTextComponents = {
    block: {
      h2: ({children}: any) => <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">{children}</h2>,
      h3: ({children}: any) => <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">{children}</h3>,
      h4: ({children}: any) => <h4 className="text-base font-medium text-gray-900 mt-4 mb-2">{children}</h4>,
      normal: ({children}: any) => <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>,
    },
    list: {
      bullet: ({children}: any) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">{children}</ul>,
      number: ({children}: any) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">{children}</ol>,
    },
    listItem: {
      bullet: ({children}: any) => <li className="text-gray-700">{children}</li>,
      number: ({children}: any) => <li className="text-gray-700">{children}</li>,
    },
    marks: {
      strong: ({children}: any) => <strong className="font-semibold">{children}</strong>,
      em: ({children}: any) => <em className="italic">{children}</em>,
      code: ({children}: any) => <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
    },
  } as const

  return (
    <main className="flex-1 max-w-none">
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        <ContentHeader item={item} />

        {/* Description is already rendered in ContentHeader */}

        {/* Steps (structured field) */}
        {Array.isArray((item as any).steps) && (item as any).steps.length > 0 && (
          <div className="mb-8">
            <h3 className="text-base font-medium text-gray-900 mb-3">Steps</h3>
            <div className="space-y-3">
              {(item as any).steps.map((s: any, idx: number) => (
                <div key={s._key || idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="text-gray-800">
                    <div className="font-medium">{s.title}</div>
                    {s.content && <div className="text-gray-600 text-sm mt-0.5">{s.content}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video/embed block after steps if provided */}
        {(item as any).videoUrl && (
          <div className="mb-8">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={(item as any).videoUrl}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                frameBorder={0}
              />
            </div>
          </div>
        )}

        {/* Embedded HTML (if provided) */}
        {!(item as any).videoUrl && (item as any).embedCode && (
          <div className="mb-8" dangerouslySetInnerHTML={{ __html: (item as any).embedCode }} />
        )}

        {/* Main Article Content */}
        <article className="prose max-w-none mb-12">
          <h2 className="text-xl font-medium text-gray-900 mb-6">{item.title}</h2>

          {/* Main Portable Text content */}
          {item.hasContent && item.body && (
            <div className="mb-8">
              <div className="prose prose-gray max-w-none">
                <PortableText value={item.body as any} components={portableTextComponents as any} />
              </div>
            </div>
          )}

          {/* Checklist (if provided) */}
          {(item as any).checklist && Array.isArray((item as any).checklist) && (
            <div className="mb-8">
              <h3 className="text-base font-medium text-gray-900 mb-3">Checklist</h3>
              <ul className="space-y-2">
                {(item as any).checklist.map((c: any, idx: number) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="text-green-500 h-5 w-5" />
                    <span className="text-gray-700">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Attachments */}
          {Array.isArray((item as any).attachments) && (item as any).attachments.length > 0 && (
            <div className="mb-8">
              <h3 className="text-base font-medium text-gray-900 mb-3">Attachments</h3>
              <ul className="space-y-2">
                {(item as any).attachments.map((a: any) => (
                  <li key={a._key} className="text-sm">
                    {a.asset?.url ? (
                      <a href={a.asset.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                        {a.title || 'Attachment'}
                      </a>
                    ) : (
                      <span className="text-gray-700">{a.title || 'Attachment'}</span>
                    )}
                    {a.description && <div className="text-gray-500">{a.description}</div>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>

        {/* Tags and Footer */}
        <footer className="border-t border-gray-200 pt-8">
          {/* Tags Section */}
          <div className="mb-8">
            <h3 className="text-base font-medium text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => toggleTag(tag)}
                  data-testid={`tag-${tag}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* FAQ only when present (not hardcoded) */}
          {!!(item as any).faqs?.length && (
            <div className="mb-8">
              <h3 className="text-base font-medium text-gray-900 mb-4">Frequently Asked Questions</h3>
              <Accordion type="single" collapsible className="space-y-2">
                {(item as any).faqs.map((q: any, idx: number) => (
                  <AccordionItem key={idx} value={`q-${idx}`} className="border border-gray-200 rounded">
                    <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 text-left">
                      <span className="font-medium text-gray-900 text-sm">{q?.question || q?.title || 'Question'}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-3 text-gray-600 text-sm">{q?.answer || ''}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          <RelatedArticles articles={relatedArticles} />
        </footer>
      </div>
    </main>
  );
}
