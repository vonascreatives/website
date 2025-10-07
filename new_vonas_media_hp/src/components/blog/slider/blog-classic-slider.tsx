'use client';
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { SwiperOptions } from "swiper/types";
import { Navigation, Pagination } from "swiper/modules";
import { ScrollDown } from "@/components/svg";
import { blog_classic } from "@/data/blog-data";
import { scroller } from "react-scroll";

// slider setting
const slider_setting: SwiperOptions = {
  slidesPerView: 1,
  loop: true,
  autoplay: false,
  spaceBetween: 0,
  speed: 1000,
  pagination: {
    el: ".blog-sidebar-dot",
    clickable: true,
  },
  navigation: {
    nextEl: ".blog-sidebar-prev",
    prevEl: ".blog-sidebar-next",
  },
};

interface BlogClassicSliderProps {
  featuredArticles?: any[];
}

export default function BlogClassicSlider({ featuredArticles = [] }: BlogClassicSliderProps) {
  // Use CMS featured articles or fallback to template data
  const slider_blog_data = featuredArticles.length > 0 
    ? featuredArticles.slice(0, 3) // Show top 3 latest articles
    : [...blog_classic.filter((b) => b.blogHeroSlider)];

  const scrollTo = () => {
    scroller.scrollTo('postbox', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
    });
  };
  return (
    <div className="blog-sidebar-slider-area">
      <div className="blog-sidebar-slider-wrapper p-relative">
        <div className="blog-sidebar-scrollbar smooth">
          <a className="pointer" onClick={scrollTo}>
            Scroll to explore
            <span>
              <ScrollDown />
            </span>
          </a>
        </div>
        <div className="blog-sidebar-arrow-box">
          <button className="blog-sidebar-prev">Next</button>
          <button className="blog-sidebar-next d-none">prev</button>
        </div>
        <Swiper
          {...slider_setting}
          modules={[Navigation, Pagination]}
          className="swiper-container blog-sidebar-slider-active"
        >
          {slider_blog_data.map((item) => {
            // Handle both CMS data format and template data format
            const isFromCMS = item._id && !item.id;
            const itemId = isFromCMS ? item._id : item.id;
            const itemTitle = isFromCMS ? item.title : item.title;
            const itemCategory = isFromCMS ? (item.category || 'News') : item.category;
            const itemDate = isFromCMS 
              ? new Date(item.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
              : item.date;
            const authorName = isFromCMS ? item.author?.name || 'Vonas Media' : item.author;
            const authorPhoto = isFromCMS ? (item.author?.photo || '/assets/img/team/author-default.jpg') : item.avatar;
            const linkUrl = isFromCMS ? `/news/${item.slug?.current}` : `/(blog)/blog-details/${item.id}`;
            
            return (
              <SwiperSlide key={itemId}>
                <div
                  className="blog-sidebar-slider-bg blog-sidebar-slider-height d-flex align-items-center pt-170 pb-120"
                  style={{ backgroundImage: `url(/assets/img/inner-blog/blog-sidebar/blog-sidebar-bg.jpg)` }}
                >
                  <div className="container">
                    <div className="row">
                      <div className="col-xl-9">
                        <div className="blog-sidebar-content-box">
                          <div className="blog-sidebar-avatar-box d-flex align-items-center">
                            <Image
                              src={authorPhoto}
                              alt="avatar"
                              width={50}
                              height={50}
                              style={{ borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <span>{authorName}</span>
                          </div>
                          <div className="blog-sidebar-title-box">
                            <span className="blog-sidebar-slider-meta">
                              {itemCategory} . {itemDate}
                            </span>
                            <h4 className="blog-sidebar-slider-title tp-char-animation">
                              {itemTitle}
                            </h4>
                            <Link href={linkUrl}
                              className="blog-sidebar-slider-link"
                            >
                              Read More
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
