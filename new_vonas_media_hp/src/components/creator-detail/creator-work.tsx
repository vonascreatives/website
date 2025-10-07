import React from "react";
import Image from "next/image";

interface CreatorWorkProps {
  creator: any;
}

export default function CreatorWork({ creator }: CreatorWorkProps) {
  // Mock portfolio items - in real implementation, this would come from Sanity
  const portfolioItems = [
    {
      id: 1,
      title: "Brand Campaign Video",
      type: "Video Content",
      description: "Engaging product showcase with authentic storytelling approach",
      image: "/assets/img/shop/details/portfolio-1.jpg",
      metrics: {
        views: "2.5M",
        engagement: "8.2%",
        reach: "1.8M"
      }
    },
    {
      id: 2,
      title: "Social Media Series",
      type: "Photo Series",
      description: "Multi-post campaign featuring lifestyle integration",
      image: "/assets/img/shop/details/portfolio-2.jpg",
      metrics: {
        views: "1.2M",
        engagement: "12.5%",
        reach: "950K"
      }
    },
    {
      id: 3,
      title: "Product Unboxing",
      type: "Short Form Video",
      description: "Authentic product review with detailed breakdown",
      image: "/assets/img/shop/details/portfolio-3.jpg",
      metrics: {
        views: "850K",
        engagement: "15.3%",
        reach: "720K"
      }
    }
  ];

  return (
    <div className="tp-shop-details-description-wrapper">
      <div className="tp-shop-details-description-content">
        <h3 className="tp-shop-details-description-title">Selected Work Portfolio</h3>
        
        <div className="tp-shop-details-description-text mb-40">
          <p>Explore {creator.name}&apos;s most successful campaigns and creative projects. Each piece demonstrates their unique style and proven ability to drive engagement and deliver results for brand partners.</p>
        </div>

        <div className="row">
          {portfolioItems.map((item) => (
            <div key={item.id} className="col-lg-4 col-md-6 mb-40">
              <div className="tp-portfolio-item">
                <div className="tp-portfolio-thumb p-relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={350}
                    height={197}
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                    onError={(e) => {
                      // Fallback to placeholder if image doesn't exist
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/350x197/f0f0f0/666?text=${encodeURIComponent(item.type)}`;
                    }}
                  />
                  <div className="tp-portfolio-overlay">
                    <div className="tp-portfolio-overlay-content">
                      <span className="tp-portfolio-type">{item.type}</span>
                    </div>
                  </div>
                </div>
                
                <div className="tp-portfolio-content mt-20">
                  <h4 className="tp-portfolio-title">{item.title}</h4>
                  <p className="tp-portfolio-description">{item.description}</p>
                  
                  <div className="tp-portfolio-metrics mt-15">
                    <div className="row">
                      <div className="col-4">
                        <div className="tp-portfolio-metric">
                          <span className="tp-portfolio-metric-label">Views</span>
                          <span className="tp-portfolio-metric-value">{item.metrics.views}</span>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="tp-portfolio-metric">
                          <span className="tp-portfolio-metric-label">Engagement</span>
                          <span className="tp-portfolio-metric-value">{item.metrics.engagement}</span>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="tp-portfolio-metric">
                          <span className="tp-portfolio-metric-label">Reach</span>
                          <span className="tp-portfolio-metric-value">{item.metrics.reach}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="tp-shop-details-description-note mt-40 p-4" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
          <h5>Why Choose {creator.name}?</h5>
          <ul className="mt-20">
            <li>✓ Consistent high-quality content creation</li>
            <li>✓ Strong audience engagement and authentic brand integration</li>
            <li>✓ Professional approach to campaign execution</li>
            <li>✓ Proven track record of delivering measurable results</li>
            <li>✓ Flexible content formats to match your brand needs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
