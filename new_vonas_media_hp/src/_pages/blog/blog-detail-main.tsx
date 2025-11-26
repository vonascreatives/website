"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Wrapper from "@/layouts/wrapper";
import HeaderOne from "@/layouts/headers/header-one";
import FooterOne from "@/layouts/footers/footer-one";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import { PortableText } from '@portabletext/react';

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt: string;
  category?: string;
  categories?: string[];
  tags?: string[];
  heroImage?: string;
  heroImageAlt?: string;
  author?: {
    name: string;
    slug?: string;
    photo?: string;
    photoAlt?: string;
    role?: string;
    bio?: any;
  };
  body?: any[];
  readTime?: number;
}

interface BlogDetailMainProps {
  post: BlogPost;
}

// Custom components for PortableText
const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?.url) return null;
      return (
        <div className="tp-blog-detail-image my-4">
          <Image
            src={value.asset.url}
            alt={value.alt || 'Blog image'}
            width={800}
            height={450}
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          />
          {value.caption && (
            <p className="text-center text-muted mt-2" style={{ fontSize: '14px' }}>
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    h1: ({ children }: any) => <h1 className="tp-blog-detail-title mb-20">{children}</h1>,
    h2: ({ children }: any) => <h2 className="tp-blog-detail-subtitle mb-15">{children}</h2>,
    h3: ({ children }: any) => <h3 className="tp-blog-detail-h3 mb-15">{children}</h3>,
    h4: ({ children }: any) => <h4 className="tp-blog-detail-h4 mb-10">{children}</h4>,
    normal: ({ children }: any) => <p className="tp-blog-detail-text mb-20">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="tp-blog-detail-quote my-30" style={{
        borderLeft: '4px solid #333',
        paddingLeft: '20px',
        fontStyle: 'italic',
        margin: '30px 0'
      }}>
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a href={value.href} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>
        {children}
      </a>
    ),
    strong: ({ children }: any) => <strong>{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="tp-blog-detail-list mb-20">{children}</ul>,
    number: ({ children }: any) => <ol className="tp-blog-detail-list mb-20">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
    number: ({ children }: any) => <li>{children}</li>,
  },
};

const BlogDetailMain = ({ post }: BlogDetailMainProps) => {
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

      <Breadcrumb title="Blog" subtitle={post.title} />

      {/* Blog Detail Area */}
      <div className="tp-blog-details-area pt-120 pb-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-10 col-lg-10">
              {/* Hero Image */}
              {post.heroImage && (
                <div className="tp-blog-details-thumb mb-40">
                  <Image
                    src={post.heroImage}
                    alt={post.heroImageAlt || post.title}
                    width={1200}
                    height={600}
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                    priority
                  />
                </div>
              )}

              {/* Post Meta */}
              <div className="tp-blog-details-meta mb-30">
                <div className="d-flex align-items-center flex-wrap gap-3">
                  {post.category && (
                    <span className="tp-blog-meta-tag" style={{
                      backgroundColor: '#f5f5f5',
                      padding: '5px 15px',
                      borderRadius: '20px',
                      fontSize: '14px'
                    }}>
                      {post.category}
                    </span>
                  )}
                  <span className="tp-blog-meta-date" style={{ color: '#777' }}>
                    {formatDate(post.publishedAt)}
                  </span>
                  {post.readTime && (
                    <span className="tp-blog-meta-read" style={{ color: '#777' }}>
                      {Math.ceil(post.readTime)} min read
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <h1 className="tp-blog-details-title mb-30" style={{ fontSize: '36px', lineHeight: '1.3' }}>
                {post.title}
              </h1>

              {/* Author Info */}
              {post.author && (
                <div className="tp-blog-details-author mb-40 d-flex align-items-center">
                  {post.author.photo && (
                    <div className="tp-blog-author-thumb mr-15">
                      <Image
                        src={post.author.photo}
                        alt={post.author.name}
                        width={50}
                        height={50}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div className="tp-blog-author-info">
                    <h5 className="tp-blog-author-name mb-0" style={{ fontSize: '16px' }}>
                      {post.author.name}
                    </h5>
                    {post.author.role && (
                      <span className="tp-blog-author-role" style={{ fontSize: '14px', color: '#777' }}>
                        {post.author.role}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="tp-blog-details-content">
                {post.body ? (
                  <PortableText value={post.body} components={portableTextComponents} />
                ) : post.excerpt ? (
                  <p>{post.excerpt}</p>
                ) : (
                  <p>No content available.</p>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="tp-blog-details-tags mt-40 pt-30" style={{ borderTop: '1px solid #eee' }}>
                  <h5 className="mb-15">Tags:</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="tp-blog-tag"
                        style={{
                          backgroundColor: '#f5f5f5',
                          padding: '5px 12px',
                          borderRadius: '4px',
                          fontSize: '13px'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to Blog */}
              <div className="tp-blog-details-nav mt-50">
                <Link href="/blog" className="tp-btn-back" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#333',
                  textDecoration: 'none'
                }}>
                  <i className="fa-regular fa-arrow-left"></i>
                  Back to Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* footer area start */}
      <FooterOne />
      {/* footer area end */}
    </Wrapper>
  );
};

export default BlogDetailMain;
