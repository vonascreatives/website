import React from "react";
import { QuoteThree, Share, Tag } from "@/components/svg";
import BlogDetailsAuthor from "@/components/blog/details/blog-details-author";
import BlogDetailsNavigation from "@/components/blog/details/blog-details-navigation";
import { JobPost } from "@/lib/sanity-queries";
import { PortableText } from "@portabletext/react";

interface JobPostDetailsAreaProps {
  operationsManager?: any;
  jobPost?: JobPost;
}

export default function JobPostDetailsArea({ operationsManager, jobPost }: JobPostDetailsAreaProps) {
  return (
    <section className="postbox__area tp-blog-sidebar-sticky-area pt-120 pb-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="postbox__wrapper">
              {/* Description Section */}
              {jobPost?.description && Array.isArray(jobPost.description) && (
                <div className="row justify-content-center">
                  <div className="col-xl-8">
                    <div className="blog-details-left-content tp_fade_bottom">
                      <h4 className="blog-details-left-title">
                        Description
                      </h4>
                      <div className="job-description-content">
                        <PortableText value={jobPost.description} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Requirements Section */}
              {jobPost?.requirements && Array.isArray(jobPost.requirements) && jobPost.requirements.length > 0 && (
                <div className="row justify-content-center">
                  <div className="col-xl-8">
                    <div className="blog-details-left-content tp_fade_bottom">
                      <h4 className="blog-details-left-title">
                        Requirements
                      </h4>
                      <div className="job-requirements-content">
                        <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                          {jobPost.requirements.map((requirement, index) => (
                            <li key={index} className="mb-10">{requirement}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Apply Now Button */}
                    {jobPost?.applyUrl && (
                      <div className="blog-details-left-content tp_fade_bottom mt-40">
                        <a
                          href={jobPost.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tp-btn-border"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '15px 30px',
                            fontSize: '16px',
                            fontWeight: '500'
                          }}
                        >
                          <span className="tp-btn-border-wrap">
                            <span className="text-1">Apply Now</span>
                            <span className="text-2">Apply Now</span>
                          </span>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.16675 10H15.8334M15.8334 10L10.0001 4.16669M15.8334 10L10.0001 15.8334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="blog-details-blockquote tp_fade_bottom">
                    <blockquote>
                      <span className="quote-icon">
                        <QuoteThree />
                      </span>
                      <p>Don&apos;t watch the clock; do what it does. keep going.</p>
                      <span className="blockquote-info">Sam Levenson</span>
                    </blockquote>
                  </div>
                  <div className="blog-details-left-content tp_fade_bottom">
                    <p>
                      At Vonas Media, we believe that great work comes from great
                      people. We&apos;re committed to creating an inclusive environment
                      where everyone can thrive. Join us in building the future of
                      digital media and make your mark in an industry that&apos;s
                      constantly evolving.
                    </p>
                  </div>


                </div>
              )}


              {/* 
              <div className="row justify-content-center">
                <div className="col-xl-8">

                  <div className="blog-details-share-wrap mb-40">
                    <div className="row">
                      <div className="col-xl-8">
                        <div className="blog-details-tag">
                          <span>
                            <Tag />
                          </span>
                          <a href="#">Creative</a>
                          <a href="#">Photography</a>
                          <a href="#">Lifestyle</a>
                        </div>
                      </div>
                      <div className="col-xl-4">
                        <div className="blog-details-share text-md-end text-start">
                          <span>
                            <Share />
                          </span>
                          <a href="#">Share Post</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <BlogDetailsAuthor operationsManager={operationsManager} />

                  <BlogDetailsNavigation currentArticleId="job-post" />
                </div>
              </div> */}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
