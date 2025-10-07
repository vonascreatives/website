import { client } from "../sanity-client";
import {
  jobPostsQuery,
  jobPostBySlugQuery,
  jobPostsPaginatedQuery,
  jobPostSlugsQuery,
} from "./queries/job-posts";
import { JobPost } from "@/lib/sanity-queries";

// Get all job posts
export async function getJobPosts(): Promise<JobPost[]> {
  try {
    const jobPosts = await client.fetch(jobPostsQuery);
    return jobPosts || [];
  } catch (error) {
    console.error("Error fetching job posts:", error);
    return [];
  }
}

// Get job post by slug
export async function getJobPostBySlug(slug: string): Promise<JobPost | null> {
  try {
    const jobPost = await client.fetch(jobPostBySlugQuery, { slug });
    return jobPost || null;
  } catch (error) {
    console.error(`Error fetching job post with slug ${slug}:`, error);
    return null;
  }
}

// Get job posts with pagination
export async function getJobPostsPaginated(
  page: number = 1,
  limit: number = 10
): Promise<{ posts: JobPost[]; total: number; hasMore: boolean }> {
  try {
    const start = (page - 1) * limit;
    const end = start + limit;
    
    const result = await client.fetch(jobPostsPaginatedQuery, { start, end });
    
    return {
      posts: result.posts || [],
      total: result.total || 0,
      hasMore: result.posts?.length === limit,
    };
  } catch (error) {
    console.error("Error fetching paginated job posts:", error);
    return {
      posts: [],
      total: 0,
      hasMore: false,
    };
  }
}

// Get job post slugs for static generation
export async function getJobPostSlugs(): Promise<string[]> {
  try {
    const slugs = await client.fetch(jobPostSlugsQuery);
    return slugs?.map((item: { slug: string }) => item.slug) || [];
  } catch (error) {
    console.error("Error fetching job post slugs:", error);
    return [];
  }
}