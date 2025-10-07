'use client';

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import BlogSidebar from "../blog-sidebar";
import { QuoteThree, Share, Tag } from "@/components/svg";
import BlogDetailsAuthor from "./blog-details-author";
import BlogDetailsNavigation from "./blog-details-navigation";
import BlogDetailsComments from "./blog-details-comments";
import BlogReplyForm from "@/components/form/blog-reply-form";
import details_thumb_1 from "@/assets/img/inner-blog/blog-details/blog-details-2.jpg";
import details_thumb_2 from "@/assets/img/inner-blog/blog-details/blog-details-3.jpg";
import details_thumb_3 from "@/assets/img/inner-blog/blog-details/blog-details-4.jpg";
import { getNewsData } from "@/lib/sanity";
import { PortableText } from '@portabletext/react';
import { useErrorHandling } from '@/hooks/use-error-handling';
import { useGlobalError } from '@/contexts/error-context';
import { LoadingSpinner, ErrorState, AsyncDataWrapper } from '@/components/ui/loading-states';
import { withErrorBoundary } from '@/components/error/error-boundary';

interface BlogDetailsAreaProps {
  blog: any;
}

// Error boundary for PortableText rendering
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="blog-details-left-content">
          <h4 className="blog-details-left-title">Content Loading Error</h4>
          <p>There was an issue rendering the article content. Please try refreshing the page.</p>
          <details style={{ background: '#f5f5f5', padding: '10px', marginTop: '10px' }}>
            <summary>Technical Details</summary>
            <pre>{this.state.error?.message}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function BlogDetailsArea({ blog }: BlogDetailsAreaProps) {
  const isFromCMS = blog && blog._id && !blog.id;
  const excerpt = isFromCMS ? blog.excerpt : "The metaverse can be viewed as an evolution of today\'s internet, which in turn evolved from passive media that we simply consumed. In the age of radio and television, the consumer\'s only job was to listen and decide if they wanted to buy.";
  const bodyContent = isFromCMS ? blog.body : null;
  const categories = isFromCMS ? (blog.categories || []) : ['Creative', 'Photography', 'Lifestyle'];
  const tags = isFromCMS ? (blog.tags || []) : ['Creative', 'Photography', 'Lifestyle'];
  const heroImage = isFromCMS ? blog.heroImage : null;
  const heroImageAlt = isFromCMS ? blog.heroImageAlt : null;
  
  const [recentPosts, setRecentPosts] = React.useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { safeAsync } = useErrorHandling();
  
  // Safely use useGlobalError - it might not be available during static generation
  let addError: ((error: Error) => void) | null = null;
  try {
    const errorContext = useGlobalError();
    addError = errorContext.addError;
  } catch (error) {
    // Context not available during static generation - use console.error as fallback
    addError = (error: Error) => console.error('Blog details error:', error);
  }
  
  React.useEffect(() => {
    const fetchRecentPosts = async () => {
      if (!isFromCMS) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      const result = await safeAsync(
        async () => {
          const data = await getNewsData();
          // Get other articles for recent posts, excluding current one
          return data.filter((post: any) => post._id !== blog._id);
        },
        {
          context: 'Fetching recent blog posts',
          onError: (error) => {
            console.error('Failed to fetch recent posts:', error);
          }
        }
      );
      
      if (result) {
        setRecentPosts(result);
      }
      
      setIsLoading(false);
    };

    fetchRecentPosts();
  }, [blog._id, isFromCMS, safeAsync, addError]);
  
  // Portable Text components for rich text rendering
  const portableTextComponents = {
    types: {
      image: ({ value }: any) => {
        if (!value?.asset?.url) return null;
        return (
          <div className="blog-details-thumb mb-30">
            <Image
              src={value.asset.url}
              alt={value.alt || 'Blog image'}
              width={800}
              height={400}
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            />
          </div>
        );
      },
    },
    block: {
      normal: ({ children }: any) => {
        if (!children || children.length === 0) return null;
        return <p className="mb-20">{children}</p>;
      },
      h1: ({ children }: any) => {
        if (!children || children.length === 0) return null;
        return <h1 className="blog-details-left-title mb-20">{children}</h1>;
      },
      h2: ({ children }: any) => {
        if (!children || children.length === 0) return null;
        return <h2 className="blog-details-left-title mb-20">{children}</h2>;
      },
      h3: ({ children }: any) => {
        if (!children || children.length === 0) return null;
        return <h3 className="blog-details-left-title mb-20">{children}</h3>;
      },
      h4: ({ children }: any) => {
        if (!children || children.length === 0) return null;
        return <h4 className="blog-details-left-title mb-20">{children}</h4>;
      },
      blockquote: ({ children }: any) => {
        if (!children || children.length === 0) return null;
        return (
          <div className="blog-details-blockquote mb-30">
            <blockquote>
              <span className="quote-icon">
                <QuoteThree />
              </span>
              <p>{children}</p>
            </blockquote>
          </div>
        );
      },
    },
    marks: {
      strong: ({ children }: any) => <strong>{children}</strong>,
      em: ({ children }: any) => <em>{children}</em>,
      link: ({ children, value }: any) => {
        if (!value?.href) return <span>{children}</span>;
        return (
          <a href={value.href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        );
      },
    },
  };
  return (
    <section className="postbox__area tp-blog-sidebar-sticky-area pt-120 pb-120">
      <div className="container">
        <div className="row">
          <div className="col-xxl-8 col-xl-8 col-lg-8">
            <div className="postbox__wrapper">
              {/* Hero Image */}
              {heroImage && (
                <div className="blog-details-hero-image mb-40">
                  <Image
                    src={heroImage}
                    alt={heroImageAlt || blog.title || 'Blog post image'}
                    width={800}
                    height={400}
                    style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                    priority
                  />
                </div>
              )}
              
              {excerpt && (
                <div className="blog-details-top-text">
                  <p>{excerpt}</p>
                </div>
              )}
              
              {isFromCMS && bodyContent && Array.isArray(bodyContent) ? (
                <div className="blog-details-left-content">
                  {bodyContent.map((block: any, index: number) => {
                    if (block._type === 'block') {
                      const text = block.children?.map((child: any) => child.text || '').join(' ') || '';
                      if (!text.trim()) return null;
                      
                      switch (block.style) {
                        case 'h1':
                          return <h1 key={block._key || index} className="blog-details-left-title mb-20">{text}</h1>;
                        case 'h2':
                          return <h2 key={block._key || index} className="blog-details-left-title mb-20">{text}</h2>;
                        case 'h3':
                          return <h3 key={block._key || index} className="blog-details-left-title mb-20">{text}</h3>;
                        case 'h4':
                          return <h4 key={block._key || index} className="blog-details-left-title mb-20">{text}</h4>;
                        case 'blockquote':
                          return (
                            <div key={block._key || index} className="blog-details-blockquote mb-30">
                              <blockquote>
                                <span className="quote-icon">
                                  <QuoteThree />
                                </span>
                                <p>{text}</p>
                              </blockquote>
                            </div>
                          );
                        default:
                          return <p key={block._key || index} className="mb-20">{text}</p>;
                      }
                    }
                    return null;
                  })}
                </div>
              ) : isFromCMS && bodyContent ? (
                <div className="blog-details-left-content">
                  <p>Content is available but in an unexpected format. Please check the CMS content structure.</p>
                  <pre style={{ background: '#f5f5f5', padding: '10px', fontSize: '12px' }}>
                    {JSON.stringify(bodyContent, null, 2)}
                  </pre>
                </div>
              ) : (
                // Fallback template content when no CMS data
                <>
                  <div className="blog-details-left-content">
                    <h4 className="blog-details-left-title">
                      Breaking Digital Barriers
                    </h4>
                    <p className="mb-20">
                      <span>Vonas Media</span> specializes in creating meaningful
                      digital content that sparks conversations and breaks through
                      social barriers. We believe content should be informative,
                      entertaining, and engaging for millennials and Gen X.
                    </p>
                    <p>
                      Through innovative formats and authentic storytelling, we
                      create platforms for important social dialogues and cultural
                      expression that resonate with modern audiences.
                    </p>
                  </div>
                  <div className="blog-details-thumb-box">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="blog-details-thumb">
                          <Image
                            className="w-100 mb-20"
                            src={details_thumb_1}
                            alt="details-thumb"
                            style={{ height: "auto" }}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="blog-details-thumb">
                          <Image
                            className="w-100 mb-20"
                            src={details_thumb_2}
                            alt="details-thumb"
                            style={{ height: "auto" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="blog-details-left-content">
                    <h4 className="blog-details-left-title">
                      Content & Cultural Impact
                    </h4>
                    <p>
                      Our content series like &quot;At the Backdoor&quot; tackle controversial
                      and taboo topics that need discussion in Filipino society.
                      Meanwhile, &quot;Skyline Music&quot; showcases extraordinary artists
                      in intimate one-take sessions set against urban skylines.
                      &quot;Tatak&quot; celebrates the rich heritage of Filipino craftsmanship
                      and cultural traditions in the modern world.
                    </p>
                  </div>
                  <div className="blog-details-blockquote">
                    <blockquote>
                      <span className="quote-icon">
                        <QuoteThree />
                      </span>
                      <p>Social media should inform, entertain, and create meaningful connections.</p>
                      <span className="blockquote-info">Vonas Media Vision</span>
                    </blockquote>
                  </div>
                  <div className="blog-details-left-content">
                    <p>
                      With any accomplished project, great time management is an
                      essential component. We business owners hire product
                      designers, they expect them to not only perform well, but also
                      on time. At Vonas Media, we provide you with an experienced
                      team, led by an expert PM who knows how to prioritise
                      your platform and product.
                    </p>
                  </div>
                  <div className="blog-details-thumb-box">
                    <div className="row">
                      <div className="col-xl-12">
                        <div className="blog-details-thumb">
                          <Image
                            src={details_thumb_3}
                            alt="details-thumb"
                            style={{ height: "auto" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="blog-details-left-content">
                    <h4 className="blog-details-left-title">
                      Empowering Digital Stories
                    </h4>
                    <p>
                      <span>Digital storytelling</span> in the Philippines requires
                      understanding both traditional culture and modern social media
                      landscapes. We create content that bridges generations and
                      speaks to contemporary issues facing Filipino society.
                    </p>
                    <p>
                      From discussing masculinity norms to celebrating LGBTQ+
                      courage, our platform amplifies voices that need to be
                      heard in today&apos;s digital conversation.
                    </p>
                  </div>
                </>
              )}
              <div className="blog-details-share-wrap mb-40">
                <div className="row">
                  <div className="col-xl-8 col-lg-8">
                    <div className="blog-details-tag">
                      <span>
                        <Tag />
                      </span>
                      {(tags.length > 0 ? tags : categories).map((tag: string, index: number) => (
                        <a key={index} href={`/news?tag=${encodeURIComponent(tag)}`}>
                          {tag}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-4">
                    <div className="blog-details-share text-start text-md-end">
                      <span>
                        <Share />
                      </span>
                      <a href="#">Share Post</a>
                    </div>
                  </div>
                </div>
              </div>
              {/* blog details author */}
              <BlogDetailsAuthor author={isFromCMS ? blog.author : null} />
              {/* blog details author */}

              {/* blog details navigation */}
              <BlogDetailsNavigation currentArticleId={blog?._id || blog?.id || ''} />
              {/* blog details navigation */}

              <div className="postbox__comment mb-100">
                <h3 className="postbox__comment-title">3 Comments</h3>
                {/* blog details comments */}
                <BlogDetailsComments />
                {/* blog details comments */}
              </div>

              <div className="tp-postbox-details-form">
                <h3 className="tp-postbox-details-form-title">Leave a Reply</h3>
                <p>
                  Your email address will not be published. Required fields are
                  marked *
                </p>

                {/* blog reply form */}
                <BlogReplyForm />
                {/* blog reply form */}
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-xl-4 col-lg-4">
            <AsyncDataWrapper
               loading={isLoading}
               error={null}
               data={recentPosts}
               loadingComponent={<LoadingSpinner />}
               errorComponent={<ErrorState message="Failed to load sidebar content" />}
             >
              <BlogSidebar 
                recentPosts={recentPosts} 
                categories={isFromCMS ? categories : []} 
              />
            </AsyncDataWrapper>
          </div>
        </div>
      </div>
    </section>
  );
}
