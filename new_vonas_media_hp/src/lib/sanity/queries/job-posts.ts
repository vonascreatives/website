import { groq } from "next-sanity";

// Query to get all job posts
export const jobPostsQuery = groq`
  *[_type == "jobBoard" && active == true] | order(publishedAt desc, _createdAt desc) {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    team,
    location,
    jobType,
    compensation,
    description,
    requirements,
    applyUrl,
    publishedAt,
    active,
    seo
  }
`;

// Query to get a single job post by slug
export const jobPostBySlugQuery = groq`
  *[_type == "jobBoard" && slug.current == $slug && active == true][0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    team,
    location,
    jobType,
    compensation,
    description,
    requirements,
    applyUrl,
    publishedAt,
    active,
    seo
  }
`;

// Query for paginated job posts
export const jobPostsPaginatedQuery = groq`
  {
    "posts": *[_type == "jobBoard" && active == true] | order(publishedAt desc, _createdAt desc) [$start...$end] {
      _id,
      _createdAt,
      _updatedAt,
      title,
      slug,
      team,
      location,
      jobType,
      compensation,
      description,
      requirements,
      applyUrl,
      publishedAt,
      active,
      seo
    },
    "total": count(*[_type == "jobBoard" && active == true])
  }
`;

// Query to get all job post slugs for static generation
export const jobPostSlugsQuery = groq`
  *[_type == "jobBoard" && active == true && defined(slug.current)] {
    "slug": slug.current
  }
`;