import React from "react";
import { Metadata } from "next";
import JobPostsMainNew from "../../_pages/jobs/job-posts-new";
import { generateMetadata as generateSEOMetadata, SEO_DEFAULTS } from "@/utils/seo";
import { getJobPosts } from "@/lib/sanity-queries";

export const metadata: Metadata = generateSEOMetadata({
  title: "Job Opportunities - Vonas Media",
  description: "Explore exciting career opportunities at Vonas Media. Join our team and help shape the future of content creation and digital marketing.",
  keywords: ['vonas media jobs', 'content creation careers', 'digital marketing jobs', 'remote work opportunities', 'creative careers'],
  url: `${SEO_DEFAULTS.siteUrl}/jobs`,
  type: 'website',
});

const JobsPage = async () => {
  // Fetch job posts from Sanity CMS
  const jobPosts = await getJobPosts();
  
  return (
    <JobPostsMainNew initialJobs={jobPosts} />
  );
};

export default JobsPage;
