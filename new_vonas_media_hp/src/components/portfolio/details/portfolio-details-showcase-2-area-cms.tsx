import React from 'react';
import Image from 'next/image';
import { Leaf, UpArrow } from '@/components/svg';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/lib/sanity';

// Types
interface SectionType {
  sectionTitle: string;
  goal?: string;
  caseDetails?: any[];
}

interface UseCaseProps {
  useCase: {
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

export default function PortfolioDetailsShowcaseTwoAreaCms({ useCase }: UseCaseProps) {
  
  return (
    <>
    {/* portfolio hero */}
    <div className="showcase-details-2-area showcase-details-2-bg p-relative" style={{backgroundImage: `url(${useCase.heroImageUrl})`}}>
          {useCase.websiteUrl && (
            <div className="showcase-details-2-link">
              <a className="project-details-custom-link" href={useCase.websiteUrl} target="_blank" rel="noopener noreferrer">
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
                        <h5 className="showcase-details-2-title mb-20 tp-char-animation">{useCase.title}</h5>
                        {useCase.subtitle && (
                          <span className="showcase-details-2-subtitle tp_title_anim">{useCase.subtitle}</span>
                        )}
                      </div>
                  </div>
                  <div className="col-xxl-7 col-xl-10">
                      <div className="showcase-details-2-content tp_title_anim">
                        <p>{useCase.summary}</p>
                      </div>
                      <div className="showcase-details-2-info-wrap d-flex align-items-center justify-content-between">
                        {useCase.client && (
                          <div className="showcase-details-2-info tp_fade_bottom">
                              <span>CLIENT</span>
                              <h5>{useCase.client}</h5>
                          </div>
                        )}
                        {useCase.services && (
                          <div className="showcase-details-2-info tp_fade_bottom">
                              <span>Services</span>
                              <h5>{useCase.services}</h5>
                          </div>
                        )}
                        {useCase.industry && (
                          <div className="showcase-details-2-info tp_fade_bottom">
                              <span>INDUSTRIES</span>
                              <h5>{useCase.industry}</h5>
                          </div>
                        )}
                        {useCase.date && (
                          <div className="showcase-details-2-info tp_fade_bottom">
                              <span>Date</span>
                              <h5>{new Date(useCase.date).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}</h5>
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
      {useCase.sections && useCase.sections.length > 0 && (
        <div className="showcase-details-2-area pt-120 pb-120">
          <div className="container">
            {useCase.sections[0].sectionTitle && (
              <div className="row">
                <div className="col-xl-8">
                  <div className="showcase-details-2-section-box">
                    <h4 className="showcase-details-2-section-title tp-char-animation">{useCase.sections[0].sectionTitle}</h4>
                  </div>
                </div>
              </div>
            )}
            <div className="row">
              <div className="col-xl-3">
                <div className="showcase-details-2-section-left">
                  <span className="ab-inner-subtitle mb-25">
                    <Leaf/>
                    {useCase.sections[0].goal || "Overview"}
                  </span>
                </div>
              </div>
              <div className="col-xl-9">
                <div className="showcase-details-2-section-right tp_title_anim">
                  {useCase.sections[0].caseDetails && (
                    <PortableText 
                      value={useCase.sections[0].caseDetails}
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
      {useCase.galleryImages && useCase.galleryImages.length > 0 && (() => {
        const galleryImages = useCase.galleryImages;
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
      {useCase.sections && useCase.sections.length > 1 && (
        <div className="showcase-details-2-area pt-120 pb-120">
          <div className="container">
            {useCase.sections[1].sectionTitle && (
              <div className="row">
                <div className="col-xl-8">
                  <div className="showcase-details-2-section-box">
                    <h4 className="showcase-details-2-section-title tp-char-animation">{useCase.sections[1].sectionTitle}</h4>
                  </div>
                </div>
              </div>
            )}
            <div className="row">
              <div className="col-xl-3">
                <div className="showcase-details-2-section-left">
                  <span className="ab-inner-subtitle mb-25">
                    <Leaf/>
                    {useCase.sections[1].goal || "Overview"}
                  </span>
                </div>
              </div>
              <div className="col-xl-9">
                <div className="showcase-details-2-section-right tp_title_anim">
                  {useCase.sections[1].caseDetails && (
                    <PortableText 
                      value={useCase.sections[1].caseDetails}
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
      {useCase.fullWidthImageUrl && (
        <div className="showcase-details-2-fullwidth-img">
          <img 
            data-speed=".8" 
            src={useCase.fullWidthImageUrl} 
            alt={useCase.fullWidthImageAlt || "Project showcase"} 
            style={{height:'auto', width:'100%'}}
          />
        </div>
      )}
      {/* full width image */}

      {/* content section 2 */}
      {useCase.sections && useCase.sections.length > 2 && (
        <div className="showcase-details-2-area pt-120 pb-120">
          <div className="container">
            {useCase.sections[2].sectionTitle && (
              <div className="row">
                <div className="col-xl-8">
                  <div className="showcase-details-2-section-box">
                    <h4 className="showcase-details-2-section-title tp-char-animation">{useCase.sections[2].sectionTitle}</h4>
                  </div>
                </div>
              </div>
            )}
            <div className="row">
              <div className="col-xl-3">
                <div className="showcase-details-2-section-left">
                  <span className="ab-inner-subtitle mb-25">
                    <Leaf/>
                    {useCase.sections[2].goal || "Overview"}
                  </span>
                </div>
              </div>
              <div className="col-xl-9">
                <div className="showcase-details-2-section-right tp_title_anim">
                  {useCase.sections[2].caseDetails && (
                    <PortableText 
                      value={useCase.sections[2].caseDetails}
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
      {(useCase.gridImageLeftUrl || useCase.gridImageRightUrl) && (
        <div className="showcase-details-2-grid-area pb-90">
          <div className="container">
            <div className="row">
              {useCase.gridImageLeftUrl && (
                <div className="col-xl-6 col-lg-6">
                  <div className="showcase-details-2-grid-img mb-30">
                    <img 
                      className="img-left" 
                      src={useCase.gridImageLeftUrl} 
                      alt={useCase.gridImageLeftAlt || "Left grid image"} 
                      style={{height:'auto', width:'100%'}}
                    />
                  </div>
                </div>
              )}
              {useCase.gridImageRightUrl && (
                <div className="col-xl-6 col-lg-6">
                  <div className="showcase-details-2-grid-img mb-30">
                    <img 
                      className="img-right" 
                      src={useCase.gridImageRightUrl} 
                      alt={useCase.gridImageRightAlt || "Right grid image"} 
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
      {useCase.sections && useCase.sections.length > 3 && (
        <div className="showcase-details-2-area pb-120">
          <div className="container">
            <div className="row">
              <div className="col-xl-3">
                <div className="showcase-details-2-section-left">
                  <span className="ab-inner-subtitle mb-25">
                    <Leaf/>
                    {useCase.sections[3].goal || "Overview"}
                  </span>
                </div>
              </div>
              <div className="col-xl-9">
                <div className="showcase-details-2-section-right tp_title_anim">
                  {useCase.sections[3].caseDetails && (
                    <PortableText 
                      value={useCase.sections[3].caseDetails}
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
