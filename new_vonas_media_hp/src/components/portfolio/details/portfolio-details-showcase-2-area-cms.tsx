import React from 'react';
import Image from 'next/image';
import { Leaf, UpArrow } from '@/components/svg';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/lib/sanity';

// Types
interface SectionType {
  sectionTitle: string;
  subtitle?: string;
  content?: any[];
}

interface CaseStudyProps {
  caseStudy: {
    title: string;
    subtitle?: string;
    heroImageUrl: string;
    heroImageAlt?: string;
    websiteUrl?: string;
    summary?: string;
    client?: string;
    services?: string;
    industry?: string;
    date?: string;
    sections?: SectionType[];
    galleryImages?: {
      url: string;
      alt?: string;
      caption?: string;
    }[];
    fullWidthImageUrl?: string;
    fullWidthImageAlt?: string;
    gridImageLeftUrl?: string;
    gridImageLeftAlt?: string;
    gridImageRightUrl?: string;
    gridImageRightAlt?: string;
  };
}

// PortableText components configuration
const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="case-study-image">
          <img 
            src={urlFor(value)?.width(800).url() || ''} 
            alt={value.alt || ''} 
            style={{ height: 'auto', width: '100%' }}
          />
          {value.caption && <p className="image-caption">{value.caption}</p>}
        </div>
      );
    },
  },
  marks: {
    link: ({children, value}: any) => {
      const rel = value.href.startsWith('/') ? undefined : 'noreferrer noopener';
      return (
        <a href={value.href} rel={rel} target={rel ? '_blank' : undefined}>
          {children}
        </a>
      );
    },
  },
};

export default function PortfolioDetailsShowcaseTwoAreaCms({ caseStudy }: CaseStudyProps) {
  
  return (
    <>
    {/* portfolio hero */}
    <div className="showcase-details-2-area showcase-details-2-bg p-relative" style={{backgroundImage: `url(${caseStudy.heroImageUrl})`}}>
          {caseStudy.websiteUrl && (
            <div className="showcase-details-2-link">
              <a className="project-details-custom-link" href={caseStudy.websiteUrl} target="_blank" rel="noopener noreferrer">
                  Visit Website
                  <span>
                    <UpArrow/>
                  </span>
              </a>
            </div>
          )}
          <div className="showcase-details-2-wrapper" data-lag="0.2" data-stagger="0.08">
            <div className="container container-1550">
                <div className="row">
                  <div className="col-xl-8">
                      <div className="showcase-details-2-title-box">
                        <h5 className="showcase-details-2-title mb-20 tp-char-animation">{caseStudy.title}</h5>
                        {caseStudy.subtitle && (
                          <span className="showcase-details-2-subtitle tp_title_anim">{caseStudy.subtitle}</span>
                        )}
                      </div>
                  </div>
                  <div className="col-xxl-7 col-xl-10">
                      <div className="showcase-details-2-content tp_title_anim">
                        <p>{caseStudy.summary}</p>
                      </div>
                      <div className="showcase-details-2-info-wrap d-flex align-items-center justify-content-between">
                        {caseStudy.client && (
                          <div className="showcase-details-2-info tp_fade_bottom">
                              <span>CLIENT</span>
                              <h5>{caseStudy.client}</h5>
                          </div>
                        )}
                        {caseStudy.services && (
                          <div className="showcase-details-2-info tp_fade_bottom">
                              <span>Services</span>
                              <h5>{caseStudy.services}</h5>
                          </div>
                        )}
                        {caseStudy.industry && (
                          <div className="showcase-details-2-info tp_fade_bottom">
                              <span>INDUSTRIES</span>
                              <h5>{caseStudy.industry}</h5>
                          </div>
                        )}
                        {caseStudy.date && (
                          <div className="showcase-details-2-info tp_fade_bottom">
                              <span>Date</span>
                              <h5>{new Date(caseStudy.date).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}</h5>
                          </div>
                        )}
                      </div>
                  </div>
                </div>
            </div>
          </div>
      </div>
      {/* portfolio hero */}

      {/* content section 1 */}
      {caseStudy.sections && caseStudy.sections.length > 0 && (
        <div className="showcase-details-2-area pt-120 pb-120">
          <div className="container">
            {caseStudy.sections[0].sectionTitle && (
              <div className="row">
                <div className="col-xl-8">
                  <div className="showcase-details-2-section-box">
                    <h4 className="showcase-details-2-section-title tp-char-animation">{caseStudy.sections[0].sectionTitle}</h4>
                  </div>
                </div>
              </div>
            )}
            <div className="row">
              <div className="col-xl-3">
                <div className="showcase-details-2-section-left">
                  <span className="ab-inner-subtitle mb-25">
                    <Leaf/>
                    {caseStudy.sections[0].subtitle || "Overview"}
                  </span>
                </div>
              </div>
              <div className="col-xl-9">
                <div className="showcase-details-2-section-right tp_title_anim">
                  {caseStudy.sections[0].content && (
                    <PortableText 
                      value={caseStudy.sections[0].content}
                      components={portableTextComponents}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* content section 1 */}

      {/* moving image gallery */}
      {caseStudy.galleryImages && caseStudy.galleryImages.length > 0 && (() => {
        const galleryImages = caseStudy.galleryImages;
        const halfLength = Math.ceil(galleryImages.length / 2);
        
        return (
          <div className="showcase-details-2-slider-area pb-120">
            <div className="moving-gallery">
              <div className="showcase-details-2-slider-wrap wrapper-gallery slider-wrap-top d-flex align-items-end mb-20">
                {galleryImages.slice(0, halfLength).map((img, i) => (
                  <div key={i} className="showcase-details-2-slider-item">
                    <img 
                      src={img.url} 
                      alt={img.alt || `Gallery image ${i+1}`}
                      style={{height:"auto", width:"100%"}}
                    />
                  </div>
                ))}
              </div>
            </div>

            {galleryImages.length > halfLength && (
              <div className="moving-gallery">
                <div className="showcase-details-2-slider-wrap wrapper-gallery slider-wrap-bottom d-flex align-items-start">
                  {galleryImages.slice(halfLength).map((img, i) => (
                    <div key={i} className="showcase-details-2-slider-item">
                      <img 
                        src={img.url} 
                        alt={img.alt || `Gallery image ${halfLength + i + 1}`}
                        style={{height:"auto", width:"100%"}}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}
      {/* moving image gallery */}

      {/* content section 2 */}
      {caseStudy.sections && caseStudy.sections.length > 1 && (
        <div className="showcase-details-2-area pt-120 pb-120">
          <div className="container">
            {caseStudy.sections[1].sectionTitle && (
              <div className="row">
                <div className="col-xl-8">
                  <div className="showcase-details-2-section-box">
                    <h4 className="showcase-details-2-section-title tp-char-animation">{caseStudy.sections[1].sectionTitle}</h4>
                  </div>
                </div>
              </div>
            )}
            <div className="row">
              <div className="col-xl-3">
                <div className="showcase-details-2-section-left">
                  <span className="ab-inner-subtitle mb-25">
                    <Leaf/>
                    {caseStudy.sections[1].subtitle || "Overview"}
                  </span>
                </div>
              </div>
              <div className="col-xl-9">
                <div className="showcase-details-2-section-right tp_title_anim">
                  {caseStudy.sections[1].content && (
                    <PortableText 
                      value={caseStudy.sections[1].content}
                      components={portableTextComponents}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* content section 2 */}

      {/* full width image */}
      {caseStudy.fullWidthImageUrl && (
        <div className="showcase-details-2-fullwidth-img">
          <img 
            data-speed=".8" 
            src={caseStudy.fullWidthImageUrl} 
            alt={caseStudy.fullWidthImageAlt || "Project showcase"} 
            style={{height:'auto', width:'100%'}}
          />
        </div>
      )}
      {/* full width image */}

      {/* content section 2 */}
      {caseStudy.sections && caseStudy.sections.length > 2 && (
        <div className="showcase-details-2-area pt-120 pb-120">
          <div className="container">
            {caseStudy.sections[2].sectionTitle && (
              <div className="row">
                <div className="col-xl-8">
                  <div className="showcase-details-2-section-box">
                    <h4 className="showcase-details-2-section-title tp-char-animation">{caseStudy.sections[2].sectionTitle}</h4>
                  </div>
                </div>
              </div>
            )}
            <div className="row">
              <div className="col-xl-3">
                <div className="showcase-details-2-section-left">
                  <span className="ab-inner-subtitle mb-25">
                    <Leaf/>
                    {caseStudy.sections[2].subtitle || "Overview"}
                  </span>
                </div>
              </div>
              <div className="col-xl-9">
                <div className="showcase-details-2-section-right tp_title_anim">
                  {caseStudy.sections[2].content && (
                    <PortableText 
                      value={caseStudy.sections[2].content}
                      components={portableTextComponents}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* content section 2 */}

      {/* grid images */}
      {(caseStudy.gridImageLeftUrl || caseStudy.gridImageRightUrl) && (
        <div className="showcase-details-2-grid-area pb-90">
          <div className="container">
            <div className="row">
              {caseStudy.gridImageLeftUrl && (
                <div className="col-xl-6 col-lg-6">
                  <div className="showcase-details-2-grid-img mb-30">
                    <img 
                      className="img-left" 
                      src={caseStudy.gridImageLeftUrl} 
                      alt={caseStudy.gridImageLeftAlt || "Left grid image"} 
                      style={{height:'auto', width:'100%'}}
                    />
                  </div>
                </div>
              )}
              {caseStudy.gridImageRightUrl && (
                <div className="col-xl-6 col-lg-6">
                  <div className="showcase-details-2-grid-img mb-30">
                    <img 
                      className="img-right" 
                      src={caseStudy.gridImageRightUrl} 
                      alt={caseStudy.gridImageRightAlt || "Right grid image"} 
                      style={{height:'auto', width:'100%'}}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* grid images */}

      {/* content section 3 */}
      {caseStudy.sections && caseStudy.sections.length > 3 && (
        <div className="showcase-details-2-area pb-120">
          <div className="container">
            <div className="row">
              <div className="col-xl-3">
                <div className="showcase-details-2-section-left">
                  <span className="ab-inner-subtitle mb-25">
                    <Leaf/>
                    {caseStudy.sections[3].subtitle || "Overview"}
                  </span>
                </div>
              </div>
              <div className="col-xl-9">
                <div className="showcase-details-2-section-right tp_title_anim">
                  {caseStudy.sections[3].content && (
                    <PortableText 
                      value={caseStudy.sections[3].content}
                      components={portableTextComponents}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* content section 3 */}
    </>
  )
}