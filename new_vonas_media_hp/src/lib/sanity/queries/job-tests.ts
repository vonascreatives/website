import { groq } from "next-sanity";

// Query to get all job tests
export const jobTestsQuery = groq`
  *[_type == "jobTests" && isActive == true] | order(order asc, _createdAt desc) {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    content,
    contactPerson {
      name,
      email,
      phone
    },
    supportedDocuments[]->{
      _id,
      title,
      slug
    },
    relatedFAQs[]->{
      _id,
      question,
      slug
    },
    order,
    isActive
  }
`;

// Query to get a single job test by slug
export const jobTestBySlugQuery = groq`
  *[_type == "jobTests" && slug.current == $slug && isActive == true][0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    content,
    contactPerson {
      name,
      email,
      phone
    },
    supportedDocuments[]->{
      _id,
      title,
      slug
    },
    relatedFAQs[]->{
      _id,
      question,
      slug
    },
    order,
    isActive
  }
`;

// Query to get job test slugs for static generation
export const jobTestSlugsQuery = groq`
  *[_type == "jobTests" && isActive == true && defined(slug.current)] {
    "slug": slug.current
  }
`;
