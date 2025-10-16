'use client';

import React from 'react';
import Link from 'next/link';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Simple markdown parser for basic formatting
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentCodeBlock = '';
    let inCodeBlock = false;
    let codeLanguage = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          elements.push(
            <pre key={i} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 p-6 rounded-xl overflow-x-auto shadow-sm my-6">
              <code className={`language-${codeLanguage} text-sm font-mono leading-relaxed`}>
                {currentCodeBlock.trim()}
              </code>
            </pre>
          );
          currentCodeBlock = '';
          inCodeBlock = false;
          codeLanguage = '';
        } else {
          // Start code block
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
        }
        continue;
      }
      
      if (inCodeBlock) {
        currentCodeBlock += line + '\n';
        continue;
      }
      
      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={i} className="text-4xl font-bold text-gray-900 dark:text-white mb-6 mt-12 leading-tight">
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-3xl font-semibold text-gray-900 dark:text-white mb-5 mt-10 leading-tight">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 mt-8 leading-tight">
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={i} className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6 leading-tight">
            {line.slice(5)}
          </h4>
        );
      }
      // Lists
      else if (line.match(/^\d+\. /)) {
        const listItems = [line];
        let j = i + 1;
        while (j < lines.length && lines[j].match(/^\d+\. /)) {
          listItems.push(lines[j]);
          j++;
        }
        elements.push(
          <ol key={i} className="list-decimal list-outside space-y-3 mb-6 text-gray-700 dark:text-gray-300 ml-6">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {parseInlineMarkdown(item.replace(/^\d+\. /, ''))}
              </li>
            ))}
          </ol>
        );
        i = j - 1;
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        const listItems = [line];
        let j = i + 1;
        while (j < lines.length && (lines[j].startsWith('- ') || lines[j].startsWith('* '))) {
          listItems.push(lines[j]);
          j++;
        }
        elements.push(
          <ul key={i} className="list-disc list-outside space-y-3 mb-6 text-gray-700 dark:text-gray-300 ml-6">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {parseInlineMarkdown(item.replace(/^[\-\*] /, ''))}
              </li>
            ))}
          </ul>
        );
        i = j - 1;
      }
      // Empty lines
      else if (line.trim() === '') {
        // Skip empty lines
        continue;
      }
      // Regular paragraphs
      else {
        elements.push(
          <p key={i} className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-base">
            {parseInlineMarkdown(line)}
          </p>
        );
      }
    }
    
    return elements;
  };
  
  // Parse inline markdown (bold, italic, code, links)
  const parseInlineMarkdown = (text: string): React.ReactNode => {
    const parts = [];
    let currentText = text;
    let key = 0;
    
    // Process inline code first
    const codeRegex = /`([^`]+)`/g;
    const codeParts = currentText.split(codeRegex);
    
    for (let i = 0; i < codeParts.length; i++) {
      if (i % 2 === 1) {
        // This is code
        parts.push(
          <code key={key++} className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-sm font-mono text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
            {codeParts[i]}
          </code>
        );
      } else {
        // Process other inline formatting
        let part = codeParts[i];
        
        // Bold
        part = part.replace(/\*\*([^*]+)\*\*/g, (match, p1) => {
          return `<strong>${p1}</strong>`;
        });
        
        // Italic
        part = part.replace(/\*([^*]+)\*/g, (match, p1) => {
          return `<em>${p1}</em>`;
        });
        
        // Links
        part = part.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
          return `<a href="${url}">${text}</a>`;
        });
        
        // Convert HTML-like strings back to JSX
        if (part.includes('<')) {
          const htmlParts = part.split(/(<[^>]+>[^<]*<\/[^>]+>|<[^>]+\/>)/);
          for (let j = 0; j < htmlParts.length; j++) {
            const htmlPart = htmlParts[j];
            if (htmlPart.startsWith('<strong>')) {
              const content = htmlPart.replace(/<\/?strong>/g, '');
              parts.push(
                <strong key={key++} className="font-semibold text-gray-900 dark:text-white">
                  {content}
                </strong>
              );
            } else if (htmlPart.startsWith('<em>')) {
              const content = htmlPart.replace(/<\/?em>/g, '');
              parts.push(
                <em key={key++} className="italic text-gray-800 dark:text-gray-200">
                  {content}
                </em>
              );
            } else if (htmlPart.startsWith('<a ')) {
              const hrefMatch = htmlPart.match(/href="([^"]+)"/);
              const textMatch = htmlPart.match(/>([^<]+)</);
              if (hrefMatch && textMatch) {
                const href = hrefMatch[1];
                const linkText = textMatch[1];
                if (href.startsWith('/')) {
                  parts.push(
                    <Link key={key++} href={href} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-blue-400 underline-offset-2 hover:decoration-2 transition-all duration-200">
                      {linkText}
                    </Link>
                  );
                } else {
                  parts.push(
                    <a key={key++} href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-blue-400 underline-offset-2 hover:decoration-2 transition-all duration-200">
                      {linkText}
                    </a>
                  );
                }
              }
            } else if (htmlPart.trim()) {
              parts.push(htmlPart);
            }
          }
        } else if (part.trim()) {
          parts.push(part);
        }
      }
    }
    
    return parts.length === 1 ? parts[0] : parts;
  };
  
  return (
    <div className="prose prose-lg max-w-none">
      {parseMarkdown(content)}
    </div>
  );
}
