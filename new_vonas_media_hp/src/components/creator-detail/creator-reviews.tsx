"use client";
import React from "react";

interface CreatorReviewsProps {
  creator: any;
}

export default function CreatorReviews({ creator }: CreatorReviewsProps) {
  // Mock reviews data - in real implementation, this would come from Sanity via the creatorReview schema
  const reviews = [
    {
      id: 1,
      clientName: "Sarah Johnson",
      brand: "TechStart Co.",
      rating: 5,
      date: "2024-01-15",
      title: "Exceptional collaboration and results",
      content: "Working with this creator was an absolute pleasure. The content quality exceeded our expectations and the engagement rates were phenomenal. Highly professional and delivered exactly what was promised.",
      projectType: "Product Launch Campaign",
      verified: true
    },
    {
      id: 2,
      clientName: "Mike Chen",
      brand: "FitLife Nutrition",
      rating: 5,
      date: "2024-01-02",
      title: "Outstanding creativity and professionalism",
      content: "The creative approach was fresh and perfectly aligned with our brand values. The campaign generated significant ROI and helped us reach a new audience segment we'd been trying to connect with.",
      projectType: "Brand Awareness Campaign",
      verified: true
    },
    {
      id: 3,
      clientName: "Emma Davis",
      brand: "Style & Co",
      rating: 4,
      date: "2023-12-20",
      title: "Great content, excellent communication",
      content: "Professional, timely, and produced beautiful content that resonated with our target audience. Communication throughout the project was excellent and revisions were handled promptly.",
      projectType: "Seasonal Collection Showcase",
      verified: true
    }
  ];

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`tp-rating-star ${index < rating ? 'filled' : ''}`}>
        ⭐
      </span>
    ));
  };

  return (
    <div className="tp-shop-details-description-wrapper">
      <div className="tp-shop-details-description-content">
        <div className="tp-shop-details-review-overview mb-40">
          <h3 className="tp-shop-details-description-title">Client Reviews & Testimonials</h3>
          
          <div className="tp-review-summary d-flex align-items-center mb-30">
            <div className="tp-review-rating-avg me-4">
              <span className="tp-review-rating-number">{averageRating.toFixed(1)}</span>
              <div className="tp-review-stars">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="tp-review-count">{reviews.length} Reviews</p>
            </div>
            
            <div className="tp-review-highlights">
              <div className="tp-review-highlight">
                <span className="tp-review-highlight-label">Professional</span>
                <div className="tp-review-highlight-bar">
                  <div className="tp-review-highlight-fill" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div className="tp-review-highlight">
                <span className="tp-review-highlight-label">Quality</span>
                <div className="tp-review-highlight-bar">
                  <div className="tp-review-highlight-fill" style={{ width: '98%' }}></div>
                </div>
              </div>
              <div className="tp-review-highlight">
                <span className="tp-review-highlight-label">Communication</span>
                <div className="tp-review-highlight-bar">
                  <div className="tp-review-highlight-fill" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tp-shop-details-review-list">
          {reviews.map((review) => (
            <div key={review.id} className="tp-shop-details-review-item border-bottom pb-30 mb-30">
              <div className="tp-review-header d-flex justify-content-between align-items-start mb-20">
                <div className="tp-review-author">
                  <div className="tp-review-author-info">
                    <h5 className="tp-review-author-name">
                      {review.clientName}
                      {review.verified && <span className="tp-review-verified ms-2">✓</span>}
                    </h5>
                    <span className="tp-review-author-brand">{review.brand}</span>
                    <span className="tp-review-project-type">{review.projectType}</span>
                  </div>
                </div>
                
                <div className="tp-review-meta text-end">
                  <div className="tp-review-rating mb-1">
                    {renderStars(review.rating)}
                  </div>
                  <span className="tp-review-date">{new Date(review.date).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="tp-review-content">
                <h6 className="tp-review-title mb-15">{review.title}</h6>
                <p className="tp-review-text">{review.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="tp-shop-details-review-cta mt-40 p-4" style={{ background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
          <h5 className="mb-20">Ready to Work Together?</h5>
          <p className="mb-20">Join the growing list of satisfied clients who have achieved exceptional results with {creator.name}.</p>
          <div className="tp-review-cta-stats d-flex justify-content-center gap-4 mb-20">
            <div className="tp-review-stat">
              <strong>100%</strong>
              <span>Client Satisfaction</span>
            </div>
            <div className="tp-review-stat">
              <strong>50+</strong>
              <span>Successful Campaigns</span>
            </div>
            <div className="tp-review-stat">
              <strong>15M+</strong>
              <span>Total Reach</span>
            </div>
          </div>
          <p className="text-muted">All reviews are from verified brand collaborations and campaigns.</p>
        </div>
      </div>
    </div>
  );
}
