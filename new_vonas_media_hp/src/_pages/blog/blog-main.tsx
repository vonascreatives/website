"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Wrapper from "@/layouts/wrapper";
import HeaderOne from "@/layouts/headers/header-one";
import FooterOne from "@/layouts/footers/footer-one";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt: string;
  category?: string;
  categories?: string[];
  heroImage?: string;
  heroImageAlt?: string;
  author?: {
    name: string;
    slug?: string;
    photo?: string;
    role?: string;
  };
  readTime?: number;
}

interface BlogMainProps {
  posts?: BlogPost[];
}

const BlogMain = ({ posts = [] }: BlogMainProps) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const postsPerPage = 9;

  // Pagination
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Wrapper>
      {/* header area start */}
      <HeaderOne />
      {/* header area end */}

      <Breadcrumb title="Blog" subtitle="Latest News & Insights" />

      {/* Blog Area */}
      <div className="tp-blog-area pt-120 pb-120">
        <div className="container">
          <div className="row">
            {posts.length === 0 ? (
              <div className="col-12 text-center py-5">
                <h4>No blog posts found</h4>
                <p>Check back soon for new content!</p>
              </div>
            ) : (
              currentPosts.map((post) => (
                <div key={post._id} className="col-xl-4 col-lg-6 col-md-6 mb-30">
                  <div className="tp-blog-item">
                    <div className="tp-blog-thumb fix">
                      <Link href={`/news/${post.slug?.current || ''}`}>
                        {post.heroImage ? (
                          <Image
                            src={post.heroImage}
                            alt={post.heroImageAlt || post.title}
                            width={400}
                            height={260}
                            style={{ 
                              width: '100%', 
                              height: '260px', 
                              objectFit: 'cover' 
                            }}
                          />
                        ) : (
                          <div 
                            style={{ 
                              width: '100%', 
                              height: '260px', 
                              backgroundColor: '#f5f5f5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <span style={{ color: '#999' }}>No Image</span>
                          </div>
                        )}
                      </Link>
                    </div>
                    <div className="tp-blog-content">
                      <div className="tp-blog-meta mb-10">
                        <span className="tp-blog-meta-tag">
                          {post.category || post.categories?.[0] || 'News'}
                        </span>
                        <span className="tp-blog-meta-date">
                          {formatDate(post.publishedAt)}
                        </span>
                      </div>
                      <h4 className="tp-blog-title">
                        <Link href={`/news/${post.slug?.current || ''}`}>
                          {post.title}
                        </Link>
                      </h4>
                      {post.excerpt && (
                        <p className="tp-blog-desc">
                          {post.excerpt.length > 120 
                            ? `${post.excerpt.substring(0, 120)}...` 
                            : post.excerpt
                          }
                        </p>
                      )}
                      <div className="tp-blog-author-info d-flex align-items-center">
                        {post.author?.photo && (
                          <div className="tp-blog-author-thumb mr-10">
                            <Image
                              src={post.author.photo}
                              alt={post.author.name}
                              width={40}
                              height={40}
                              style={{ borderRadius: '50%', objectFit: 'cover' }}
                            />
                          </div>
                        )}
                        <div className="tp-blog-author-content">
                          <span className="tp-blog-author-name">
                            {post.author?.name || 'Vonas Media'}
                          </span>
                          {post.readTime && (
                            <span className="tp-blog-read-time">
                              {Math.ceil(post.readTime)} min read
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Pagination */}
            {posts.length > postsPerPage && (
              <div className="col-12">
                <div className="basic-pagination mt-40 text-center">
                  <nav>
                    <ul className="pagination list-wrap" role="navigation" aria-label="Pagination">
                      {/* Previous Button */}
                      <li className={`previous ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                          type="button"
                          disabled={currentPage === 1}
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          aria-label="Previous page"
                          style={{ background: 'none', border: 'none', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                        >
                          <i className="fa-regular fa-arrow-left icon"></i>
                        </button>
                      </li>

                      {/* Page Numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <li key={page} className={currentPage === page ? 'current' : ''}>
                          <button
                            type="button"
                            onClick={() => handlePageChange(page)}
                            aria-label={`Go to page ${page}`}
                            aria-current={currentPage === page ? 'page' : undefined}
                            style={{ 
                              cursor: 'pointer',
                              background: 'none',
                              border: 'none',
                              padding: '8px 12px',
                              color: 'inherit'
                            }}
                          >
                            {page}
                          </button>
                        </li>
                      ))}

                      {/* Next Button */}
                      <li className={`next ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                          type="button"
                          disabled={currentPage === totalPages}
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          aria-label="Next page"
                          style={{ background: 'none', border: 'none', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                        >
                          <i className="fa-regular fa-arrow-right icon"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* footer area start */}
      <FooterOne />
      {/* footer area end */}
    </Wrapper>
  );
};

export default BlogMain;
