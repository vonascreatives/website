import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJobPostBySlug } from "@/lib/sanity-queries";
import { getJobPostSlugs } from "@/lib/sanity/job-posts";
import { getOperationsManager } from "@/lib/sanity";
import JobPostDetailsMain from "@/_pages/jobs/job-post-details";
import { generateMetadata as generateSEOMetadata, generateArticleSchema, StructuredData, SEO_DEFAULTS } from "@/utils/seo";

export async function generateStaticParams() {
  const slugs = await getJobPostSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// Enable ISR (Incremental Static Regeneration) with 10-second revalidation
export const revalidate = 10;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const jobPost = await getJobPostBySlug(slug);

  if (!jobPost) {
    return generateSEOMetadata({
      title: "Job Post Not Found - Vonas Media",
      description: "The job post you're looking for could not be found.",
      url: `${SEO_DEFAULTS.siteUrl}/jobs/${slug}`,
    });
  }

  const description = Array.isArray(jobPost.description)
    ? 'Join our team at Vonas Media. Apply now for this exciting opportunity.'
    : jobPost.description || `Join our team as ${jobPost.title} at Vonas Media. Apply now for this exciting opportunity.`;

  return generateSEOMetadata({
    title: `${jobPost.title} - Vonas Media Careers`,
    description,
    url: `${SEO_DEFAULTS.siteUrl}/jobs/${slug}`,
    type: 'article',
    keywords: [jobPost.title, 'vonas media jobs', jobPost.team || '', jobPost.location || '', 'career opportunities'].filter(Boolean),
  });
}

export default async function JobPostDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const jobPost = await getJobPostBySlug(slug);

  if (!jobPost) {
    notFound();
  }

  // Fetch Operations Manager for author section
  const operationsManager = await getOperationsManager();

  const articleSchema = generateArticleSchema({
    title: jobPost.title,
    description: Array.isArray(jobPost.description) ? jobPost.title : (jobPost.description || jobPost.title),
    author: 'Vonas Media HR Team',
    publishedAt: jobPost.publishedAt,
    updatedAt: jobPost.publishedAt,
    url: `${SEO_DEFAULTS.siteUrl}/jobs/${slug}`,
  });

  return (
    <>
      <StructuredData data={articleSchema} />
      <JobPostDetailsMain jobPost={jobPost} operationsManager={operationsManager} />
    </>
  );
}