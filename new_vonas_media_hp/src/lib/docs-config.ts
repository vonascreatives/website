// Static documentation configuration

export interface DocsPage {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content: string;
  section: string;
  order: number;
}

export interface DocsSection {
  id: string;
  title: string;
  slug: string;
  description?: string;
  order: number;
  pages: DocsPage[];
}

export interface NavigationItem {
  title: string;
  href: string;
  items?: NavigationItem[];
  icon?: string;
  noLink?: boolean;
}

// Static documentation pages
export const docsPages: DocsPage[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    slug: 'getting-started',
    description: 'Learn the basics and get up and running quickly.',
    section: 'basics',
    order: 1,
    content: `
# Getting Started

Welcome to our documentation! This guide will help you get started quickly.

## Quick Start

1. **Installation**: Follow the installation steps
2. **Configuration**: Set up your environment
3. **First Steps**: Create your first project

## Installation

To get started, you'll need to install the necessary dependencies:

\`\`\`bash
npm install
\`\`\`

## Configuration

Create a configuration file in your project root:

\`\`\`json
{
  "name": "my-project",
  "version": "1.0.0"
}
\`\`\`

## Next Steps

Once you've completed the installation, check out our [API Reference](/docs/api-reference) to learn more about available features.
    `
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    slug: 'api-reference',
    description: 'Complete API documentation and examples.',
    section: 'reference',
    order: 1,
    content: `
# API Reference

Complete reference for all available APIs and methods.

## Core Methods

### \`initialize()\`

Initializes the application with default settings.

**Parameters:**
- \`config\` (object): Configuration options

**Returns:**
- \`Promise<void>\`

**Example:**
\`\`\`javascript
await initialize({
  apiKey: 'your-api-key',
  environment: 'production'
});
\`\`\`

### \`getData()\`

Retrieves data from the API.

**Parameters:**
- \`endpoint\` (string): API endpoint
- \`options\` (object): Request options

**Returns:**
- \`Promise<any>\`

**Example:**
\`\`\`javascript
const data = await getData('/users', {
  limit: 10,
  offset: 0
});
\`\`\`
    `
  },
  {
    id: 'best-practices',
    title: 'Best Practices',
    slug: 'best-practices',
    description: 'Recommended patterns and conventions.',
    section: 'guides',
    order: 1,
    content: `
# Best Practices

Follow these recommended patterns for optimal results.

## Code Organization

### File Structure

Organize your files in a logical structure:

\`\`\`
src/
├── components/
├── pages/
├── utils/
└── styles/
\`\`\`

### Naming Conventions

- Use **PascalCase** for component names
- Use **camelCase** for function names
- Use **kebab-case** for file names

## Performance

### Optimization Tips

1. **Lazy Loading**: Load components only when needed
2. **Memoization**: Cache expensive calculations
3. **Bundle Splitting**: Split code into smaller chunks

### Example

\`\`\`javascript
const LazyComponent = lazy(() => import('./Component'));

const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
\`\`\`
    `
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    slug: 'troubleshooting',
    description: 'Common issues and solutions.',
    section: 'guides',
    order: 2,
    content: `
# Troubleshooting

Common issues and their solutions.

## Installation Issues

### Problem: Package not found

**Solution:**
Make sure you have the latest version of npm:

\`\`\`bash
npm install -g npm@latest
\`\`\`

### Problem: Permission denied

**Solution:**
Use sudo (macOS/Linux) or run as administrator (Windows):

\`\`\`bash
sudo npm install
\`\`\`

## Runtime Issues

### Problem: Module not found

**Solution:**
1. Check your import paths
2. Verify the module is installed
3. Clear node_modules and reinstall

\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

## Getting Help

If you're still having issues:

1. Check our [FAQ](/docs/faq)
2. Search existing issues on GitHub
3. Create a new issue with detailed information
    `
  }
];

// Group pages into sections
export const docsSections: DocsSection[] = [
  {
    id: 'basics',
    title: 'Getting Started',
    slug: 'basics',
    description: 'Essential information to get you started',
    order: 1,
    pages: docsPages.filter(page => page.section === 'basics')
  },
  {
    id: 'reference',
    title: 'API Reference',
    slug: 'reference',
    description: 'Complete API documentation',
    order: 2,
    pages: docsPages.filter(page => page.section === 'reference')
  },
  {
    id: 'guides',
    title: 'Guides',
    slug: 'guides',
    description: 'In-depth guides and best practices',
    order: 3,
    pages: docsPages.filter(page => page.section === 'guides')
  }
];

// Navigation structure
export const docsNavigation: NavigationItem[] = docsSections.map(section => ({
  title: section.title,
  href: `/docs/${section.pages[0]?.slug || section.slug}`,
  items: section.pages.map(page => ({
    title: page.title,
    href: `/docs/${page.slug}`
  }))
}));

// Helper functions
export function getPageBySlug(slug: string): DocsPage | null {
  return docsPages.find(page => page.slug === slug) || null;
}

export function getAllPages(): DocsPage[] {
  return docsPages;
}

export function getPreviousNext(currentSlug: string): { prev: { title: string; href: string } | null; next: { title: string; href: string } | null } {
  const currentIndex = docsPages.findIndex(page => page.slug === currentSlug);
  
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }
  
  const prev = currentIndex > 0 ? {
    title: docsPages[currentIndex - 1].title,
    href: `/docs/${docsPages[currentIndex - 1].slug}`
  } : null;
  
  const next = currentIndex < docsPages.length - 1 ? {
    title: docsPages[currentIndex + 1].title,
    href: `/docs/${docsPages[currentIndex + 1].slug}`
  } : null;
  
  return { prev, next };
}

export function getNavigation(): NavigationItem[] {
  return docsNavigation;
}
