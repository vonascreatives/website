import React from "react";
import Image from "next/image";
import { Search } from "../svg";
import faq_banner from '@/assets/img/inner-faq/faq/banner-faq.jpg';
import FaqItem from "./faq-item";

// type 
type IFaq = {
  id: number;
  question: string;
  answer: string;
}
// faq data
export const faq_data:IFaq[] = [
  {
    id: 1,
    question: "Do you only work with exclusive creators?",
    answer:
      "No. We work with both in-house creators and non-exclusive collaborators. All get access to the same strategy, editorial edge, and production craft from our team.",
  },
  {
    id: 2,
    question: "Can brands build a channel with you?",
    answer:
      "Yes. We design, launch, and scale channels that brands fully own. We treat every channel like a startup with identity, audience, format, and growth strategy.",
  },
  {
    id: 3,
    question: "What types of content do you focus on?",
    answer:
      "Our sweet spot is story-driven video—YouTube shows, docs, and creator-led formats. We engineer repeatable structures that scale beyond one-off campaigns.",
  },
  {
    id: 4,
    question: "Are you a production house or an agency?",
    answer:
      "Neither. We're a content-first media lab. We combine editorial DNA from journalism, production muscle from studios, and culture sense from the streets.",
  },
  {
    id: 5,
    question: "How do you select creators to work with?",
    answer:
      "We look for storytellers who think like journalists but move like entrepreneurs. Technical skills matter, but cultural awareness and authentic voice matter more.",
  },
  {
    id: 6,
    question: "What makes your approach different?",
    answer:
      "We build formats over campaigns. Creators as partners. Content at the core. We don't chase trends—we shape culture with stories that stick.",
  },
];

export default function FaqArea() {
  return (
    <div className="fq-faq-area fq-faq-bdr pt-80 pb-140">
      <div className="container">
        <div className="row">
          <div className="col-xl-8 col-lg-8">
            <div className="fq-faq-wrapper">
              <div className="tp-service-2-accordion-box">
                <div className="accordion" id="accordionExample">
                  {faq_data.map((item) => (
                    <FaqItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
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
              <div className="fq-faq-sidebar-input p-relative">
                <input type="text" placeholder="Search questions" />
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
