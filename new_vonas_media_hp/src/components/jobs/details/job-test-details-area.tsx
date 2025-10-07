"use client";
import React from "react";
import { JobTest } from "@/lib/sanity-queries";
import { PortableText } from "@portabletext/react";
import JobRelatedContent from "./job-related-content";

interface JobTestDetailsAreaProps {
  jobTest: JobTest;
}

// Mock related content data - in a real app, this would come from Sanity
const mockRelatedContent = [
  {
    _id: "faq-1",
    title: "How do I prepare for technical assessments?",
    slug: { current: "technical-assessment-preparation" },
    excerpt: "Learn the best practices for preparing for technical interviews and coding challenges.",
    category: "Interview Prep",
    type: "faq" as const
  },
  {
    _id: "kb-1",
    title: "Understanding Our Hiring Process",
    slug: { current: "hiring-process-guide" },
    excerpt: "A comprehensive guide to our multi-stage hiring process and what to expect at each step.",
    category: "Getting Started",
    type: "knowledge" as const
  },
  {
    _id: "faq-2",
    title: "What should I include in my portfolio?",
    slug: { current: "portfolio-requirements" },
    excerpt: "Guidelines for creating an impressive portfolio that showcases your skills effectively.",
    category: "Application Tips",
    type: "faq" as const
  }
];

const JobTestDetailsArea: React.FC<JobTestDetailsAreaProps> = ({ jobTest }) => {
  return (
    <section className="blog-details-area pt-120 pb-80">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="blog-details-wrapper">
              <article className="blog-details-content">
                <div className="blog-details-content-wrapper">
                  <div className="blog-details-meta">
                    <span className="meta-date">
                      Order: {jobTest.order}
                    </span>
                    {jobTest.contactPerson && (
                      <span className="meta-author">
                        Contact: {jobTest.contactPerson.name}
                      </span>
                    )}
                  </div>

                  <h1 className="blog-details-title">{jobTest.title}</h1>

                  {/* Job Test Content */}
                  <div className="blog-details-content-inner">
                    {jobTest.content && (
                      <div className="job-test-content">
                        <PortableText value={jobTest.content} />
                      </div>
                    )}
                  </div>

                  {/* Supported Documents */}
                  {jobTest.supportedDocuments && jobTest.supportedDocuments.length > 0 && (
                    <div className="supported-documents mt-40">
                      <h3>Supported Documents</h3>
                      <div className="documents-list">
                        <PortableText value={jobTest.supportedDocuments} />
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  {jobTest.contactPerson && (
                    <div className="contact-info mt-40">
                      <h3>Contact Information</h3>
                      <div className="contact-details">
                        <p><strong>Name:</strong> {jobTest.contactPerson.name}</p>
                        {jobTest.contactPerson.email && (
                          <p><strong>Email:</strong> 
                            <a href={`mailto:${jobTest.contactPerson.email}`}>
                              {jobTest.contactPerson.email}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="blog-sidebar">
              <div className="sidebar-widget">
                <h4 className="sidebar-widget-title">Test Information</h4>
                <div className="sidebar-widget-content">
                  <ul className="test-info-list">
                    <li>
                      <span className="info-label">Order:</span>
                      <span className="info-value">{jobTest.order}</span>
                    </li>
                    <li>
                      <span className="info-label">Status:</span>
                      <span className="info-value">
                        {jobTest.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </li>
                    {jobTest.contactPerson && (
                      <li>
                        <span className="info-label">Contact Person:</span>
                        <span className="info-value">{jobTest.contactPerson.name}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Related FAQs */}
              {jobTest.relatedFAQs && jobTest.relatedFAQs.length > 0 && (
                <div className="sidebar-widget">
                  <h4 className="sidebar-widget-title">Related FAQs</h4>
                  <div className="sidebar-widget-content">
                    <div className="related-faqs">
                      <PortableText value={jobTest.relatedFAQs} />
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Card */}
              {jobTest.contactPerson && (
                <div className="sidebar-widget">
                  <h4 className="sidebar-widget-title">Get in Touch</h4>
                  <div className="sidebar-widget-content">
                    <div className="contact-card">
                      {jobTest.contactPerson.image && (
                        <div className="contact-avatar">
                          <img 
                            src={jobTest.contactPerson.image} 
                            alt={jobTest.contactPerson.name}
                            className="avatar-img"
                          />
                        </div>
                      )}
                      <div className="contact-info">
                        <h5>{jobTest.contactPerson.name}</h5>
                        {jobTest.contactPerson.email && (
                          <a 
                            href={`mailto:${jobTest.contactPerson.email}`}
                            className="contact-email"
                          >
                            {jobTest.contactPerson.email}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Content Section */}
      <JobRelatedContent 
        relatedItems={mockRelatedContent}
        title="Helpful Resources"
      />
    </section>
  );
};

export default JobTestDetailsArea;