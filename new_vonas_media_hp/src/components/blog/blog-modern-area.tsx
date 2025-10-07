import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getNewsData, getSanityImageUrl } from "@/lib/sanity";
import usePagination from "@/hooks/use-pagination";
import Pagination from "../ui/pagination";
import BlogItem from "./blog-item/blog-item";

import { SanityBlogPost, TransformedBlogPost } from "@/types/sanity";

export default function BlogModern() {
  const [blogPosts, setBlogPosts] = useState<SanityBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const data = await getNewsData();
        setBlogPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Always call hooks at the top level
  const first_blog = blogPosts[0];
  const other_blogs = blogPosts.slice(1);
  const { currentItems, handlePageClick, pageCount } = usePagination<SanityBlogPost>(other_blogs, 6);

  if (isLoading) {
    return (
      <div className="tp-blog-standard-area pt-170">
        <div className="container container-1500">
          <div className="row">
            <div className="col-xl-12">
              <div className="text-center">
                <p>Loading blog posts...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="tp-blog-standard-area pt-170">
        <div className="container container-1500">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-blog-standard-thumb-box p-relative">
                {first_blog?.heroImage && (
                  <Image 
                    data-speed=".8" 
                    src={getSanityImageUrl(first_blog.heroImage)} 
                    alt={first_blog.title}
                    width={800}
                    height={600}
                  />
                )}
                <div className="tp-blog-standard-title-box d-none d-sm-block">
                  <h4 className="tp-blog-standard-title tp-char-animation">
                    {first_blog?.title}
                  </h4>
                </div>
                <div className="tp-blog-standard-meta d-none d-sm-block">
                  <span>
                    {first_blog?.publishedAt && new Date(first_blog.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="blog-details-realated-area pt-120 pb-70">
        <div className="container">
          <div className="row">
            {currentItems.map((item) => {
              // Transform Sanity blog post to match BlogItem expected format
              const transformedItem = {
                id: item._id,
                title: item.title,
                img: item.heroImage ? getSanityImageUrl(item.heroImage) : '/assets/img/blog/blog-placeholder.jpg',
                date: new Date(item.publishedAt).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }).replace(/\//g, '.'),
                category: item.category || item.categories?.[0]?.title || 'News',
                author: item.author?.name || 'Vonas Media',
                excerpt: item.excerpt || '',
                slug: item.slug?.current
              };
              
              return (
                <div key={item._id} className="col-xl-4 col-lg-6 col-md-6 mb-50">
                  <BlogItem item={transformedItem} />
                </div>
              );
            })}

            <div className="col-12">
              <div className="basic-pagination mt-40 d-flex align-items-center justify-content-center">
                <nav>
                  <Pagination
                    handlePageClick={handlePageClick}
                    pageCount={pageCount}
                  />
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
