import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getNewsData, getSanityImageUrl } from "@/lib/sanity";
import usePagination from "@/hooks/use-pagination";
import Pagination from "../ui/pagination";
import { SanityBlogPost, TransformedBlogPost } from "@/types/sanity";

export default function BlogListArea() {
  const [blogPosts, setBlogPosts] = useState<TransformedBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const posts = await getNewsData();
        setBlogPosts(posts || []);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogPosts();
  }, []);

  const { currentItems, handlePageClick, pageCount } = usePagination(blogPosts, 4);

  if (loading) {
    return (
      <div className="tp-blog-list-area mb-30">
        <div className="container container-1480">
          <div className="tp-blog-list-wrap">
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="tp-blog-list-area mb-30">
      <div className="container container-1480">
        <div className="tp-blog-list-wrap">
          {currentItems.map((item) => {
            const formattedDate = new Date(item.publishedAt).toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }).toUpperCase().replace(',', '.');
            
            return (
              <div key={item.id} className="tp-blog-list-item">
                <div className="row">
                  <div className="col-xl-2 col-lg-2 tp-flex-end">
                    <div className="tp-blog-list-meta">
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                  <div className="col-xl-5 col-lg-5 col-md-7">
                    <div className="tp-blog-list-content-wrap">
                      <div className="tp-blog-list-thumb anim-zoomin-wrap">
                        <Link href={`/news/${item.slug}`}>
                          <Image
                            className="anim-zoomin"
                            src={item.heroImage || '/assets/img/placeholder.jpg'}
                            alt={item.title}
                            width={500}
                            height={300}
                            style={{height: "auto"}}
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-5 col-lg-5 col-md-5">
                    <div className="tp-blog-list-content tp-flex-column">
                      <div className="tp-blog-list-title-wrap">
                        <h4 className="tp-blog-list-title-sm">
                          <Link href={`/news/${item.slug}`}>{item.title}</Link>
                        </h4>
                        {item.excerpt && (
                          <p className="tp-blog-list-excerpt mt-2">
                            {item.excerpt.length > 120 ? `${item.excerpt.substring(0, 120)}...` : item.excerpt}
                          </p>
                        )}
                      </div>
                      <div className="tp-blog-list-link-wrap">
                        <Link className="tp-blog-list-link" href={`/news/${item.slug}`}>
                          Read More
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="col-12">
            <div className="basic-pagination mt-80 d-flex align-items-center justify-content-center">
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
  );
}
