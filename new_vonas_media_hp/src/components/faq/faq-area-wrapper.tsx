"use client";
import React from "react";
import Image from "next/image";
import { Search } from "../svg";
import faq_banner from '@/assets/img/inner-faq/faq/banner-faq.jpg';
import FaqItem from "./faq-item";

type IFaqItem = {
  question: string;
  answer: string;
  order: number;
  category?: string;
  isActive: boolean;
}

type IFaqData = {
  _id: string;
  sidebarTitle: string;
  sidebarDescription: string;
  sidebarBannerUrl: string | null;
  sidebarBannerAlt: string;
  searchPlaceholder: string;
  items: IFaqItem[];
}

type FaqAreaWrapperProps = {
  initialFaqData?: IFaqData;
}

const defaultFaqData: IFaqData = {
  _id: 'faq-default',
  sidebarTitle: 'Q&A',
  sidebarDescription: 'Got questions about channels, creators, or collaborations?\nFind answers here.',
  sidebarBannerUrl: null,
  sidebarBannerAlt: 'faq-banner',
  searchPlaceholder: 'Search questions',
  items: [
    {
      question: "Do you only work with exclusive creators?",
      answer: "No. We work with both in-house creators and non-exclusive collaborators. All get access to the same strategy, editorial edge, and production craft from our team.",
      order: 1,
      category: 'general',
      isActive: true
    },
    {
      question: "Can brands build a channel with you?",
      answer: "Yes. We design, launch, and scale channels that brands fully own. We treat every channel like a startup with identity, audience, format, and growth strategy.",
      order: 2,
      category: 'brands',
      isActive: true
    }
  ]
};

export default function FaqAreaWrapper({ initialFaqData }: FaqAreaWrapperProps) {
  const faqData = initialFaqData || defaultFaqData;

  return (
    <div className="fq-faq-area fq-faq-bdr pt-80 pb-140">
      <div className="container">
        <div className="row">
          <div className="col-xl-8 col-lg-8">
            <div className="fq-faq-wrapper">
              <div className="tp-service-2-accordion-box">
                <div className="accordion" id="accordionExample">
                  {faqData.items.map((item, index) => (
                    <FaqItem key={`faq-${index}`} item={item} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4">
            <div className="fq-faq-sidebar">
              <div className="fq-faq-sidebar-content">
                <h4 className="fq-faq-sidebar-title">{faqData.sidebarTitle}</h4>
                <p style={{ whiteSpace: 'pre-line' }}>
                  {faqData.sidebarDescription}
                </p>
              </div>
              <div className="fq-faq-sidebar-thumb">
                <Image
                  className="w-100"
                  src={faqData.sidebarBannerUrl || faq_banner}
                  alt={faqData.sidebarBannerAlt}
                  width={400}
                  height={300}
                  style={{height:'auto'}}
                />
              </div>
              <div className="fq-faq-sidebar-input p-relative">
                <input type="text" placeholder={faqData.searchPlaceholder} />
                <button className="fq-faq-sidebar-search">
                  <Search />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
