"use client";
import React, { useEffect, useState } from "react";
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

function FaqLoading() {
  return (
    <div className="fq-faq-area fq-faq-bdr pt-80 pb-140">
      <div className="container">
        <div className="row">
          <div className="col-xl-8 col-lg-8">
            <div className="fq-faq-wrapper">
              <p>Loading FAQs...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FaqAreaWrapper() {
  const [faqData, setFaqData] = useState<IFaqData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFaqData() {
      try {
        const response = await fetch('/api/faq');
        const data = await response.json();
        setFaqData(data);
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
        setFaqData({
          _id: 'faq-default',
          sidebarTitle: 'Q&A',
          sidebarDescription: 'Got questions about channels, creators, or collaborations?\nFind answers here.',
          sidebarBannerUrl: null,
          sidebarBannerAlt: 'faq-banner',
          searchPlaceholder: 'Search questions',
          items: []
        });
      } finally {
        setLoading(false);
      }
    }

    fetchFaqData();
  }, []);

  if (loading || !faqData) {
    return <FaqLoading />;
  }

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
