'use client';
import React from "react";
import Image from "next/image";
import { SwiperOptions } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import CounterTwo from "../counter/counter-two";
import CounterTwoCms from "../counter/counter-two-cms";
import { NextArrow, PrevArrow } from "../svg";
import shape from '@/assets/img/home-08/testimonial/test-1.png';

// slider setting
const slider_setting: SwiperOptions = {
  slidesPerView: 1,
  autoplay: true,
  navigation: {
    prevEl: ".tp-studio-prev",
    nextEl: ".tp-studio-next",
  },
};

interface TestimonialItem {
  clientName: string;
  designation: string;
  testimonialText: string;
  companyLogo: string | null;
  companyLogoAlt?: string;
  displayOrder: number;
  featured?: boolean;
}

interface StudioTestimonialData {
  _id?: string;
  sectionTitle: string;
  subtitle: string;
  shapeImage: string | null;
  shapeImageAlt?: string;
  testimonials: TestimonialItem[];
}

interface StudioPanelFourCmsProps {
  style_2?: boolean;
  testimonialData: StudioTestimonialData;
  counterData?: any;
}

export default function StudioPanelFourCms({ style_2 = false, testimonialData, counterData }: StudioPanelFourCmsProps) {
  return (
    <div className={`${style_2 ? '' : 'panel-2 tp-studio-height'}`}>
      <div className={`tp-studio-testimonial-area tp-studio-plr black-bg p-relative fix tp-studio-testimonial-xs-space ${style_2 ? 'tm-testimonial-height' : 'tp-studio-height'}`}>
        <div className="tp-studio-testimonial-title-box d-none d-md-block">
          <h4 className="tp-studio-testimonial-title">{testimonialData.sectionTitle}</h4>
        </div>
        <div className="container container-1330">
          <div className="tp-studio-funfact-wrap">
            {/* counter area */}
            {counterData ? (
              <CounterTwoCms counterData={counterData} />
            ) : (
              <CounterTwo />
            )}
            {/* counter area */}
          </div>
          <div className="tp-studio-testimonial-wrap pt-120">
            <div className="row align-items-start">
              <div className="col-xl-3 col-lg-3 d-none d-lg-block">
                <div className="tp-studio-testimonial-shape">
                  <Image 
                    src={testimonialData.shapeImage || shape} 
                    alt={testimonialData.shapeImageAlt || 'Shape decoration'} 
                    width={400}
                    height={400}
                    style={{ height: "auto" }} 
                  />
                </div>
              </div>
              <div className="col-xl-2 col-lg-2 col-md-3">
                <div className="tp-studio-testimonial-top-title">
                  <span>{testimonialData.subtitle}</span>
                </div>
              </div>
              <div className="col-xl-7 col-lg-7 col-md-9">
                <div className="tp-studio-testimonial-wrapper">
                  <div className="tp-studio-testimonial-slider-wrap p-relative">
                    <div className="tp-studio-testimonial-arrow">
                      <button className="tp-studio-prev">
                        <span>
                          <PrevArrow />
                        </span>
                      </button>
                      <button className="tp-studio-next">
                        <span>
                          <NextArrow />
                        </span>
                      </button>
                    </div>
                    <Swiper
                      {...slider_setting}
                      modules={[Navigation]}
                      navigation={{
                        prevEl: '.tp-studio-prev',
                        nextEl: '.tp-studio-next',
                      }}
                      className="swiper-container tp-studio-testimonial-active fix"
                    >
                      {testimonialData.testimonials.map((item, index) => (
                        <SwiperSlide key={index}>
                          <div className="tp-studio-testimonial-item">
                            <div className="tp-studio-testimonial-text">
                              <p>{item.testimonialText}</p>
                            </div>
                            <div className="tp-studio-testimonial-user-info-box d-flex align-items-center">
                              <div className="tp-studio-testimonial-user-info">
                                <h4 className="tp-studio-testimonial-user-name">
                                  {item.clientName}
                                </h4>
                                <span>{item.designation}</span>
                              </div>
                              <div className="tp-studio-testimonial-line d-none d-md-block">
                                <span></span>
                              </div>
                              {item.companyLogo && (
                                <div className="tp-studio-testimonial-logo">
                                  <Image 
                                    src={item.companyLogo} 
                                    alt={item.companyLogoAlt || item.clientName} 
                                    width={120}
                                    height={60}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
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
