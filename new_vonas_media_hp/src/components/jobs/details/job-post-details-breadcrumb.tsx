import React from "react";
import Image from "next/image";
import { JobPost } from "@/lib/sanity-queries";

interface JobPostDetailsBreadcrumbProps {
  jobPost: JobPost;
}

export default function JobPostDetailsBreadcrumb({ jobPost }: JobPostDetailsBreadcrumbProps) {
  const publishedAt = new Date(jobPost.publishedAt).toLocaleDateString('en-US', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });

  return (
    <div className="blog-details-area">
      <div className="blog-details-bg blog-details-bg-height blog-details-overlay p-relative d-flex align-items-end pt-170 pb-170">
        {/* Featured Image */}
        <div className="blog-details-hero-image" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <Image 
            src="/assets/img/home-01/hero/hero-1-2.jpg"
            alt={jobPost.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div className="blog-details-overlay-shape" style={{ zIndex: 2 }}>
          <Image src="/assets/img/home-04/brand/overly.png" alt="overlay" width={100} height={100} />
        </div>
        <div className="container" style={{ zIndex: 3, position: 'relative' }}>
          <div className="row">
            <div className="col-xl-11">
              <div className="blog-details-content z-index-5">
                <span className="blog-details-meta">
                  {jobPost.team || 'Career'} <i>. {publishedAt}</i>
                </span>
                <h4 className="blog-details-title tp-char-animation">
                  {jobPost.title}
                </h4>
                <div className="job-meta-info mt-3">
                  {jobPost.location && (
                    <span className="badge bg-primary me-2">
                      📍 {jobPost.location}
                    </span>
                  )}
                  {jobPost.jobType && (
                    <span className="badge bg-secondary me-2">
                      💼 {jobPost.jobType}
                    </span>
                  )}
                  {jobPost.compensation && (
                    <span className="badge bg-success">
                      💰 {jobPost.compensation}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}