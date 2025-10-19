import React from "react";
import Image from "next/image";
import { Search } from "../svg";
import faq_banner from '@/assets/img/inner-faq/faq/banner-faq.jpg';
import shape from '@/assets/img/home-02/service/sv-shape-1.png';
import FaqItem from "./faq-item";

// type 
type IFaq = {
  id?: number;
  question: string;
  answer: string;
  order: number;
  category?: string;
  isActive: boolean;
}

// faq data
export const faq_data: IFaq[] = [
  {
    id: 1,
    question: "Do you only work with exclusive creators?",
    answer:
      "No. We work with both in-house creators and non-exclusive collaborators. All get access to the same strategy, editorial edge, and production craft from our team.",
    order: 1,
    category: 'general',
    isActive: true,
  },
  {
    id: 2,
    question: "Can brands build a channel with you?",
    answer:
      "Yes. We design, launch, and scale channels that brands fully own. We treat every channel like a startup with identity, audience, format, and growth strategy.",
    order: 2,
    category: 'brands',
    isActive: true,
  },
  {
    id: 3,
    question: "What types of content do you focus on?",
    answer:
      "Our sweet spot is story-driven video—YouTube shows, docs, and creator-led formats. We engineer repeatable structures that scale beyond one-off campaigns.",
    order: 3,
    category: 'content',
    isActive: true,
  },
  {
    id: 4,
    question: "Are you a production house or an agency?",
    answer:
      "Neither. We're a content-first media lab. We combine editorial DNA from journalism, production muscle from studios, and culture sense from the streets.",
    order: 4,
    category: 'general',
    isActive: true,
  },
  {
    id: 5,
    question: "How do you select creators to work with?",
    answer:
      "We look for storytellers who think like journalists but move like entrepreneurs. Technical skills matter, but cultural awareness and authentic voice matter more.",
    order: 5,
    category: 'creators',
    isActive: true,
  },
  {
    id: 6,
    question: "What makes your approach different?",
    answer:
      "We build formats over campaigns. Creators as partners. Content at the core. We don't chase trends—we shape culture with stories that stick.",
    order: 6,
    category: 'general',
    isActive: true,
  },
];

type FaqConsolidatedProps = {
  variant?: 'default' | 'sidebar' | 'minimal';
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  showSidebar?: boolean;
  customData?: IFaq[];
  className?: string;
};

export default function FaqConsolidated({
  variant = 'default',
  title,
  subtitle,
  showSearch = false,
  showSidebar = false,
  customData,
  className = ''
}: FaqConsolidatedProps) {
  const data = customData || faq_data;

  // Default variant (original faq-area)
  if (variant === 'default') {
    return (
      <div className={`fq-faq-area fq-faq-bdr pt-80 pb-140 ${className}`}>
        <div className="container">
          <div className="row">
            <div className={showSidebar ? "col-xl-8 col-lg-8" : "col-12"}>
              <div className="fq-faq-wrapper">
                <div className="tp-service-2-accordion-box">
                  <div className="accordion" id="accordionExample">
                    {data.map((item, idx) => (
                      <FaqItem key={item.id || idx} item={item} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {showSidebar && (
              <div className="col-xl-4 col-lg-4">
                <div className="fq-faq-sidebar">
                  <div className="fq-faq-sidebar-content">
                    <h4 className="fq-faq-sidebar-title">Q&A</h4>
                    <p>
                      Got questions about channels, creators, <br /> or collaborations?
                      Find answers here.
                    </p>
                  </div>
                  <div className="fq-faq-sidebar-thumb">
                    <Image
                      className="w-100"
                      src={faq_banner}
                      alt="faq-banner"
                      style={{height:'auto'}}
                    />
                  </div>
                  {showSearch && (
                    <div className="fq-faq-sidebar-input p-relative">
                      <input type="text" placeholder="Search questions" />
                      <button className="fq-faq-sidebar-search">
                        <Search />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Sidebar variant (original faq-area-2)
  if (variant === 'sidebar') {
    return (
      <div className={`tp-service-2-area tp-service-2-pt pb-150 ${className}`}>
        <div className="container">
          <div className="row align-items-start">
            <div className="col-xl-4 col-lg-5">
              <div className="tp-price-inner-faq">
                <div className="tp-service-2-title-box pt-25 pb-120">
                  <h4 className="tp-service-2-title mb-20 tp_title_anim">
                    {title || "Frequently Asked Question"}
                  </h4>
                  <p className="tp_title_anim">
                    {subtitle || "We believe in making life-long connections through great communication."}
                  </p>
                </div>
                <div className="tp-service-2-shape-img text-center text-lg-start">
                  <Image src={shape} alt="shape" />
                </div>
              </div>
            </div>
            <div className="col-xl-8 col-lg-7">
              <div className="tp-price-inner-faq-wrap">
                <div className="fq-faq-wrapper">
                  <div className="tp-service-2-accordion-box">
                    <div className="accordion" id="accordionExample">
                      {data.map((item, idx) => (
                        <FaqItem key={item.id || idx} item={item} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Minimal variant (just the accordion)
  return (
    <div className={`fq-faq-wrapper ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h4 className="mb-2">{title}</h4>}
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}
      <div className="tp-service-2-accordion-box">
        <div className="accordion" id="accordionExample">
          {data.map((item, idx) => (
            <FaqItem key={item.id || idx} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
