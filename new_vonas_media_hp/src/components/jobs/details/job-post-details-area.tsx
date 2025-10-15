import React from "react";
import { QuoteThree, Share, Tag } from "@/components/svg";
import BlogDetailsAuthor from "@/components/blog/details/blog-details-author";
import BlogDetailsNavigation from "@/components/blog/details/blog-details-navigation";

export default function JobPostDetailsArea() {
  return (
    <section className="postbox__area tp-blog-sidebar-sticky-area pt-120 pb-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="postbox__wrapper">
              <div className="row justify-content-center">
                <div className="col-xl-8">
                  <div className="blog-details-top-text tp_fade_bottom">
                    <p>
                      Join our dynamic team at Vonas Media and be part of creating
                      innovative digital experiences. We&apos;re looking for passionate
                      individuals who share our vision for excellence and creativity
                      in the digital space.{" "}
                    </p>
                  </div>
                  <div className="blog-details-left-content tp_fade_bottom">
                    <h4 className="blog-details-left-title">
                      What is this role about?
                    </h4>
                    <p className="mb-20">
                      <span>This position</span> offers an exciting opportunity to
                      work with cutting-edge technologies and collaborate with
                      talented professionals. You&apos;ll be contributing to projects
                      that make a real impact in the digital media landscape.
                    </p>
                    <p>
                      We believe in fostering growth, creativity, and innovation
                      while maintaining a healthy work-life balance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="row justify-content-center">
                <div className="col-xl-8">
                  <div className="blog-details-left-content tp_fade_bottom">
                    <h4 className="blog-details-left-title">
                      Responsibilities & Growth
                    </h4>
                    <p>
                      You&apos;ll be working on exciting projects that challenge your
                      skills and help you grow professionally. Our collaborative
                      environment encourages innovation and creative problem-solving.
                      We provide mentorship, learning opportunities, and the tools
                      you need to succeed in your career journey with us.
                    </p>
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
              </div>

              <div className="row justify-content-center">
                <div className="col-xl-8">
                  <div className="blog-details-left-content tp_fade_bottom">
                    <h4 className="blog-details-left-title">
                      What is Lorem Ipsum?
                    </h4>
                    <p>
                      <span>Lorem Ipsum</span> is simply dummy text of the printing
                      and typesetting industry. Lorem Ipsum has been the industry
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a type
                      specimen book.
                    </p>
                    <p>
                      It has survived not only five centuries, but also the leap
                      into electronic typesetting, remaining essentially unchanged
                    </p>
                  </div>
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
                  <BlogDetailsAuthor />
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