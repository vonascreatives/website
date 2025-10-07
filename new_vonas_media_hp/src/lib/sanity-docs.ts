import { sanityClient, fetchSanityData } from './sanity';

// Types matching our Sanity schemas
export interface DocsSection {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  parent?: DocsSection;
  order: number;
  isCollapsible: boolean;
  icon?: string;
  isPublished: boolean;
}

export interface DocsPage {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  section: DocsSection;
  order: number;
  body: any[];
  tableOfContents: boolean;
  breadcrumbs: boolean;
  lastUpdated: string;
  author?: {
    name: string;
    image?: {
      asset: {
        url: string;
      };
      alt?: string;
    };
  };
  tags?: string[];
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface NavigationItem {
  title: string;
  href: string;
  noLink?: boolean;
  items?: NavigationItem[];
  order: number;
  icon?: string;
}

// GROQ queries
const DOCS_SECTIONS_QUERY = `
  *[_type == "docsSection" && isPublished == true] | order(order asc) {
    _id,
    title,
    slug,
    description,
    parent->{
      _id,
      title,
      slug
    },
    order,
    isCollapsible,
    icon,
    isPublished
  }
`;

const DOCS_PAGES_QUERY = `
  *[_type == "docsPage" && isPublished == true] | order(section->order asc, order asc) {
    _id,
    title,
    slug,
    description,
    section->{
      _id,
      title,
      slug,
      order
    },
    order,
    tableOfContents,
    breadcrumbs,
    lastUpdated,
    author->{
      name,
      image {
        asset->{
          url
        },
        alt
      }
    },
    tags,
    isPublished
  }
`;

const DOCS_PAGE_BY_SLUG_QUERY = `
  *[_type == "docsPage" && slug.current == $slug && isPublished == true][0] {
    _id,
    title,
    slug,
    description,
    section->{
      _id,
      title,
      slug,
      order
    },
    order,
    body,
    tableOfContents,
    breadcrumbs,
    lastUpdated,
    author->{
      name,
      image {
        asset->{
          url
        },
        alt
      }
    },
    tags,
    isPublished,
    seoTitle,
    seoDescription
  }
`;

const DOCS_NAVIGATION_QUERY = `
  {
    "sections": *[_type == "docsSection" && isPublished == true && !defined(parent)] | order(order asc) {
      _id,
      title,
      slug,
      description,
      order,
      isCollapsible,
      icon,
      "pages": *[_type == "docsPage" && references(^._id) && isPublished == true] | order(order asc) {
        _id,
        title,
        slug,
        description,
        order
      },
      "subsections": *[_type == "docsSection" && references(^._id) && isPublished == true] | order(order asc) {
        _id,
        title,
        slug,
        description,
        order,
        isCollapsible,
        icon,
        "pages": *[_type == "docsPage" && references(^._id) && isPublished == true] | order(order asc) {
          _id,
          title,
          slug,
          description,
          order
        }
      }
    }
  }
`;

// Fetch functions
export async function getDocsSections(): Promise<DocsSection[]> {
  if (!sanityClient) return [];
  return await sanityClient.fetch(DOCS_SECTIONS_QUERY);
}

export async function getDocsPages(): Promise<DocsPage[]> {
  if (!sanityClient) return [];
  return await sanityClient.fetch(DOCS_PAGES_QUERY);
}

export async function getDocsPageBySlug(slug: string): Promise<DocsPage | null> {
  if (!sanityClient) return null;
  return await sanityClient.fetch(DOCS_PAGE_BY_SLUG_QUERY, { slug });
}

export async function getDocsNavigation(): Promise<NavigationItem[]> {
  if (!sanityClient) return [];
  const data = await sanityClient.fetch(DOCS_NAVIGATION_QUERY);
  return buildNavigationTree(data.sections);
}

// Helper function to build navigation tree
function buildNavigationTree(sections: any[]): NavigationItem[] {
  return sections.map(section => {
    const navigationItem: NavigationItem = {
      title: section.title,
      href: section.pages.length > 0 ? `/docs/${section.pages[0].slug.current}` : '#',
      noLink: section.pages.length === 0,
      order: section.order,
      icon: section.icon,
      items: []
    };

    // Add pages to this section
    if (section.pages && section.pages.length > 0) {
      navigationItem.items = section.pages.map((page: any) => ({
        title: page.title,
        href: `/docs/${page.slug.current}`,
        order: page.order
      }));
    }

    // Add subsections
    if (section.subsections && section.subsections.length > 0) {
      const subsectionItems = section.subsections.map((subsection: any) => ({
        title: subsection.title,
        href: subsection.pages.length > 0 ? `/docs/${subsection.pages[0].slug.current}` : '#',
        noLink: subsection.pages.length === 0,
        order: subsection.order,
        icon: subsection.icon,
        items: subsection.pages.map((page: any) => ({
          title: page.title,
          href: `/docs/${page.slug.current}`,
          order: page.order
        }))
      }));
      
      navigationItem.items = [...(navigationItem.items || []), ...subsectionItems];
    }

    // Sort items by order
    if (navigationItem.items) {
      navigationItem.items.sort((a, b) => a.order - b.order);
    }

    return navigationItem;
  });
}

// Get previous and next pages for navigation
export async function getPreviousNext(currentSlug: string): Promise<{
  prev: { title: string; href: string } | null;
  next: { title: string; href: string } | null;
}> {
  const pages = await getDocsPages();
  const currentIndex = pages.findIndex(page => page.slug.current === currentSlug);
  
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  const prev = currentIndex > 0 ? {
    title: pages[currentIndex - 1].title,
    href: `/docs/${pages[currentIndex - 1].slug.current}`
  } : null;

  const next = currentIndex < pages.length - 1 ? {
    title: pages[currentIndex + 1].title,
    href: `/docs/${pages[currentIndex + 1].slug.current}`
  } : null;

  return { prev, next };
}

// Generate table of contents from page body
export function generateTableOfContents(body: any[]): Array<{
  href: string;
  level: number;
  text: string;
}> {
  if (!body || !Array.isArray(body)) return [];

  const toc: Array<{ href: string; level: number; text: string }> = [];

  body.forEach((block, index) => {
    if (block._type === 'block' && ['h1', 'h2', 'h3', 'h4'].includes(block.style)) {
      const text = block.children?.map((child: any) => child.text).join('') || '';
      if (text.trim()) {
        const level = parseInt(block.style.replace('h', ''));
        const href = `#${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
        toc.push({ href, level, text });
      }
    }
  });

  return toc;
}

// Search function for documentation
export async function searchDocs(query: string): Promise<DocsPage[]> {
  const searchQuery = `
    *[_type == "docsPage" && isPublished == true && (
      title match $query + "*" ||
      description match $query + "*" ||
      pt::text(body) match $query + "*"
    )] | order(_score desc) [0...10] {
      _id,
      title,
      slug,
      description,
      section->{
        title,
        slug
      },
      _score
    }
  `;
  
  return await fetchSanityData(searchQuery, { query }, []);
}