export interface JobPost {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: {
    current: string;
  };
  team?: string;
  location?: string;
  jobType?: string;
  compensation?: string;
  description?: any[]; // richBody content from Sanity
  requirements?: string[];
  applyUrl?: string;
  publishedAt?: string;
  active: boolean; // matches Sanity schema
  seo?: any;
}