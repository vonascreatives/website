import { Metadata } from "next";
import BlogDetailsMain from "@/pages/blog/blog-details";
import { getNewsArticleBySlug, getNewsData } from "@/lib/sanity";
import { generateMetadata as generateSEOMetadata, generateArticleSchema, StructuredData, SEO_DEFAULTS } from "@/utils/seo";

export async function generateMetadata({params}:{params:{slug:string}}): Promise<Metadata> {
  const article = await getNewsArticleBySlug(params.slug);
  
  if (article && article._id !== 'fallback-article') {
    return generateSEOMetadata({
      title: `${article.title} - Vonas Media`,
      description: article.excerpt || `Read the latest news from Vonas Media: ${article.title}`,
      keywords: article.tags || ['vonas media news', 'content creation', 'digital marketing'],
      url: `${SEO_DEFAULTS.siteUrl}/news/${params.slug}`,
      type: 'article',
      image: article.heroImage,
      author: article.author?.name || 'Vonas Media',
      publishedTime: article.publishedAt,
    });
  }
  
  return generateSEOMetadata({
    title: "News Article - Vonas Media",
    description: "Stay updated with the latest news and insights from Vonas Media.",
    url: `${SEO_DEFAULTS.siteUrl}/news/${params.slug}`,
    type: 'article',
  });
}

export default async function NewsDetailsPage({params}:{params:{slug:string}}) {
  // Try to get the specific article first
  let article = await getNewsArticleBySlug(params.slug);
  
  // If not found by slug, try finding in the general news data
  if (!article || article._id === 'fallback-article') {
    const articles = await getNewsData();
    article = articles.find((a: any) => a.slug?.current === params.slug) || articles[0];
  }
  
  if (!article) {
    return (
      <div className="text-center pt-100">
        <h2>Article not found</h2>
        <p>The article &quot;{params.slug}&quot; could not be found.</p>
      </div>
    );
  }
  
  const articleSchema = generateArticleSchema({
    title: article.title,
    description: article.excerpt || article.title,
    author: article.author?.name || 'Vonas Media',
    publishedAt: article.publishedAt || article._createdAt,
    updatedAt: article._updatedAt,
    image: article.heroImage,
    url: `${SEO_DEFAULTS.siteUrl}/news/${params.slug}`,
  });
  
  return (
    <>
      <StructuredData data={articleSchema} />
      <BlogDetailsMain blog={article} />
    </>
  );
}
