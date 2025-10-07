import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getNewsData, getNewsArticleBySlug } from "@/lib/sanity";
import BlogDetailsMain from "@/pages/blog/blog-details";
import { generateMetadata as generateSEOMetadata, SEO_DEFAULTS } from "@/utils/seo";

export async function generateMetadata({params}:{params:{id:string}}): Promise<Metadata> {
  // Try to find article by numeric ID in fallback data or redirect to slug-based URL
  const articles = await getNewsData();
  const article = articles.find((a: any, index: number) => index.toString() === params.id || a._id === params.id);
  
  if (article && article.slug?.current) {
    return generateSEOMetadata({
      title: `${article.title} - Vonas Media`,
      description: article.excerpt || `Read the latest news from Vonas Media: ${article.title}`,
      url: `${SEO_DEFAULTS.siteUrl}/news/${article.slug.current}`,
      type: 'article',
      image: article.heroImage,
      author: article.author?.name || 'Vonas Media',
      publishedTime: article.publishedAt,
    });
  }
  
  return generateSEOMetadata({
    title: "Blog Article - Vonas Media",
    description: "Stay updated with the latest news and insights from Vonas Media.",
    url: `${SEO_DEFAULTS.siteUrl}/blog-details/${params.id}`,
    type: 'article',
  });
}

export default async function BlogDetailsPage({params}:{params:{id:string}}) {
  // Try to find article by numeric ID and redirect to proper slug-based URL
  const articles = await getNewsData();
  const article = articles.find((a: any, index: number) => index.toString() === params.id || a._id === params.id);
  
  if (article && article.slug?.current) {
    // Redirect to the proper slug-based URL
    redirect(`/news/${article.slug.current}`);
  }
  
  // If no article found, show not found message
  return (
    <div className="text-center pt-100">
      <h2>Article not found</h2>
      <p>The article with ID &quot;{params.id}&quot; could not be found.</p>
      <p>Please check our <a href="/blog-list">latest articles</a> instead.</p>
    </div>
  );
}
