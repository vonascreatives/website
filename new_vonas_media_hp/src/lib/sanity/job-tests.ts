import { client } from "../sanity-client";
import {
  jobTestsQuery,
  jobTestBySlugQuery,
  jobTestSlugsQuery,
} from "./queries/job-tests";
import { JobTest } from "@/types/job-test";

// Get all job tests
export async function getJobTests(): Promise<JobTest[]> {
  try {
    const jobTests = await client.fetch(jobTestsQuery);
    return jobTests || [];
  } catch (error) {
    console.error("Error fetching job tests:", error);
    return [];
  }
}

// Get job test by slug
export async function getJobTestBySlug(slug: string): Promise<JobTest | null> {
  try {
    const jobTest = await client.fetch(jobTestBySlugQuery, { slug });
    return jobTest || null;
  } catch (error) {
    console.error(`Error fetching job test with slug ${slug}:`, error);
    return null;
  }
}

// Get job test slugs for static generation
export async function getJobTestSlugs(): Promise<string[]> {
  try {
    const slugs = await client.fetch(jobTestSlugsQuery);
    return slugs?.map((item: { slug: string }) => item.slug) || [];
  } catch (error) {
    console.error("Error fetching job test slugs:", error);
    return [];
  }
}