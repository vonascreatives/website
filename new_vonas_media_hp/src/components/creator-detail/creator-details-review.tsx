import React from "react";

interface CreatorDetailsReviewProps {
  creator: any;
}

export default function CreatorDetailsReview({ creator }: CreatorDetailsReviewProps) {
  // Sample reviews - in a real app this would come from CMS
  const reviews = [
    {
      name: "Sarah Johnson",
      company: "FitLife Brands",
      rating: 5,
      date: "2 weeks ago",
      review: "Absolutely fantastic to work with! The content was delivered on time and exceeded our expectations. Great engagement rates and very professional throughout the process."
    },
    {
      name: "Michael Chen", 
      company: "TechStart Inc",
      rating: 5,
      date: "1 month ago",
      review: "Outstanding creator with authentic content. Our brand awareness increased significantly after the campaign. Highly recommend for any tech-related collaborations."
    },
    {
      name: "Emma Rodriguez",
      company: "Style Co.",
      rating: 4,
      date: "2 months ago", 
      review: "Great experience overall. Professional communication and high-quality content. The only minor issue was a small delay, but the final results were worth it."
    },
    {
      name: "David Park",
      company: "Healthy Living",
      rating: 5,
      date: "3 months ago",
      review: "Perfect collaboration! The content perfectly matched our brand voice and generated excellent engagement. Will definitely work together again."
    },
    {
      name: "Lisa Thompson",
      company: "Beauty Essentials", 
      rating: 5,
      date: "4 months ago",
      review: "Amazing work! Very creative and professional. The content performed better than expected and drove significant traffic to our website."
    }
  ];

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="tp-product-details-review-wrapper">
      <div className="row">
        <div className="col-lg-6">
          {/* Review Summary */}
          <div className="tp-product-details-review-summery">
            <h4 className="tp-product-details-review-summery-title">Customer Reviews</h4>
            <div className="tp-product-details-review-summery-top d-flex align-items-center">
              <div className="tp-product-details-review-summery-rating d-flex align-items-center">
                <span>{averageRating.toFixed(1)}</span>
                <div className="tp-product-details-review-summery-rating-star">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>
                      <i className={`fa-solid fa-star ${star <= averageRating ? 'text-warning' : 'text-muted'}`}></i>
                    </span>
                  ))}
                </div>
              </div>
              <div className="tp-product-details-review-summery-info">
                <span>Based on {reviews.length} reviews</span>
              </div>
            </div>
            
            {/* Rating Breakdown */}
            <div className="tp-product-details-review-rating-list">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter(review => review.rating === rating).length;
                const percentage = (count / reviews.length) * 100;
                
                return (
                  <div key={rating} className="tp-product-details-review-rating-item d-flex align-items-center">
                    <span>{rating} Star</span>
                    <div className="tp-product-details-review-rating-bar">
                      <span style={{ width: `${percentage}%` }}></span>
                    </div>
                    <span>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="col-lg-6">
          {/* Review Form */}
          <div className="tp-product-details-review-form">
            <h4 className="tp-product-details-review-form-title">Leave a Review</h4>
            <form>
              <div className="tp-product-details-review-form-rating mb-20">
                <label>Your Rating *</label>
                <div className="tp-product-details-review-form-rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>
                      <i className="fa-light fa-star"></i>
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="tp-product-details-review-form-input mb-20">
                    <input type="text" placeholder="Your Name *" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="tp-product-details-review-form-input mb-20">
                    <input type="email" placeholder="Your Email *" />
                  </div>
                </div>
              </div>
              
              <div className="tp-product-details-review-form-input mb-20">
                <textarea placeholder="Write your review here..." rows={6}></textarea>
              </div>
              
              <div className="tp-product-details-review-form-btn">
                <button type="submit" className="tp-btn-cart">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Individual Reviews */}
      <div className="tp-product-details-review-list mt-50">
        <h4 className="tp-product-details-review-list-title">All Reviews</h4>
        
        {reviews.map((review, i) => (
          <div key={i} className="tp-product-details-review-item">
            <div className="tp-product-details-review-avatar">
              <div className="tp-product-details-review-avatar-thumb" style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '600',
                color: '#333'
              }}>
                {review.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <div className="tp-product-details-review-content">
              <div className="tp-product-details-review-meta d-flex align-items-center justify-content-between">
                <div className="tp-product-details-review-author">
                  <h5>{review.name}</h5>
                  <span>{review.company} • {review.date}</span>
                </div>
                <div className="tp-product-details-review-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>
                      <i className={`fa-solid fa-star ${star <= review.rating ? 'text-warning' : 'text-muted'}`}></i>
                    </span>
                  ))}
                </div>
              </div>
              <div className="tp-product-details-review-text">
                <p>{review.review}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}