"use client";
import React from "react";
import Link from "next/link";

interface RelatedItem {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  category?: string;
  type: 'faq' | 'knowledge';
}

interface JobRelatedContentProps {
  relatedItems?: RelatedItem[];
  title?: string;
}

const JobRelatedContent: React.FC<JobRelatedContentProps> = ({ 
  relatedItems = [], 
  title = "Related Resources" 
}) => {
  if (!relatedItems || relatedItems.length === 0) {
    return null;
  }

  return (
    <div className="job-related-content-area grey-bg-2 pt-90 pb-40">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8">
            <div className="job-related-title-box text-center mb-50">
              <h3 className="job-related-title">{title}</h3>
            </div>
          </div>
        </div>
        <div className="row">
          {relatedItems.map((item) => {
            const href = item.type === 'faq' 
              ? `/faq#${item.slug.current}` 
              : `/knowledge/${item.slug.current}`;
            
            return (
              <div key={item._id} className="col-xl-4 col-lg-6 col-md-6 mb-50">
                <div className="job-related-item">
                  <div className="job-related-content">
                    <div className="job-related-meta">
                      <span className={`job-related-type ${item.type}`}>
                        {item.type === 'faq' ? 'FAQ' : 'Knowledge Base'}
                      </span>
                      {item.category && (
                        <span className="job-related-category">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <h4 className="job-related-item-title">
                      <Link href={href}>
                        {item.title}
                      </Link>
                    </h4>
                    {item.excerpt && (
                      <p className="job-related-excerpt">
                        {item.excerpt.length > 120 
                          ? `${item.excerpt.substring(0, 120)}...` 
                          : item.excerpt
                        }
                      </p>
                    )}
                    <div className="job-related-link">
                      <Link href={href} className="job-related-read-more">
                        {item.type === 'faq' ? 'View FAQ' : 'Read More'}
                        <i className="fas fa-arrow-right ml-5"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JobRelatedContent;
