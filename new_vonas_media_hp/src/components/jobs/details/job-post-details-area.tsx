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
                  </div>
                </div>
              )}

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
                  {/* blog details author */}
                  <BlogDetailsAuthor operationsManager={operationsManager} />
                  {/* blog details author */}

                  {/* blog details navigation */}
                  <BlogDetailsNavigation currentArticleId="job-post" />
                  {/* blog details navigation */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
