import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { SwiperOptions } from "swiper/types";

import BlogSidebar from "./blog-sidebar";
import { blog_classic } from "@/data/blog-data";
import { Quote, QuoteTwo } from "../svg";
import usePagination from "@/hooks/use-pagination";
import { IBlogDT } from "@/types/blog-d-t";
import PaginationCom from "../ui/pagination";

// slider setting
const slider_setting: SwiperOptions = {
  slidesPerView: 1,
  loop: true,
  autoplay: false,
  spaceBetween: 0,
  speed: 1000,
  effect: "fade",
  pagination: {
    el: ".blog-sidebar-dot",
    clickable: true,
  },
  navigation: {
    prevEl: ".postbox-arrow-prev",
    nextEl: ".postbox-arrow-next",
  },
};

// prop type
type IProps = {
  setIsVideoOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setVideoId: React.Dispatch<React.SetStateAction<string>>;
  blogs?: any[];
};

export default function BlogClassicArea({setIsVideoOpen,setVideoId, blogs = []}:IProps) {
  // Use CMS data if available, otherwise fallback to template data
  const blog_items = blogs.length > 0 ? blogs : [...blog_classic.filter((b) => !b.blogHeroSlider)];
  const { currentItems, handlePageClick, pageCount } = usePagination<any>(blog_items,6);

  function handleVideoModal(id: string) {
    setIsVideoOpen(true);
    setVideoId(id);
  }
  return (
    <section
      id="postbox"
      className="postbox__area tp-blog-sidebar-sticky-area pt-120 pb-80"
    >
      <div className="container">
        <div className="row">
          <div className="col-xxl-8 col-xl-8 col-lg-8">
            <div className="postbox__wrapper">
              {currentItems.map((item) => {
                // Handle both CMS data format and template data format
                const isFromCMS = item._id && !item.id;
                const itemId = isFromCMS ? item.slug?.current || item._id : item.id;
                const itemTitle = isFromCMS ? item.title : item.title;
                const itemImage = isFromCMS ? item.heroImage : item.img;
                const itemImageAlt = isFromCMS ? item.heroImageAlt : 'blog-img';
                const itemCategory = isFromCMS ? (item.category || 'News') : item.category;
                const itemDate = isFromCMS 
                  ? new Date(item.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                  : item.date;
                const itemDescription = isFromCMS ? item.excerpt : item.desc;
                const linkUrl = isFromCMS ? `/news/${item.slug?.current}` : `/(blog)/blog-details/${item.id}`;
                const readTime = isFromCMS ? `${Math.ceil(item.readTime || 5)} min read` : null;
                const authorName = isFromCMS ? item.author?.name : null;
                
                return (
                  <article key={itemId} className="postbox__item mb-80">
                    {/* Only show image if we have one and it's not a special quote post */}
                    {itemImage && !item.blogQuote && !item.blogQuoteTwo && !item.imgSlider && (
                      <div className="postbox__thumb">
                        <Link href={linkUrl}>
                          <Image 
                            src={itemImage} 
                            alt={itemImageAlt}
                            width={800}
                            height={450}
                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                          />
                        </Link>
                        {item.video && (
                          <div className="postbox__play-btn">
                            <a
                              className="popup-video pointer"
                              onClick={() => handleVideoModal(item.videoId!)}
                            >
                              <i className="fa-sharp fa-solid fa-play"></i>
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Image slider for template data */}
                    {item.imgSlider && (
                      <div className="postbox__thumb w-img">
                        <div className="postbox__thumb-slider p-relative">
                          <Swiper
                            {...slider_setting}
                            modules={[Navigation, Pagination]}
                            className="swiper-container postbox__thumb-slider-active fix"
                          >
                            {item.images &&
                              item.images.map((src: string, i: number) => (
                                <SwiperSlide key={i}>
                                  <Image src={src} alt="" width={800} height={450} style={{ width: '100%', height: 'auto' }} />
                                </SwiperSlide>
                              ))}
                          </Swiper>
                          <div className="postbox__slider-arrow-wrap d-none d-sm-block">
                            <button className="postbox-arrow-prev">
                              <i className="fa-sharp fa-solid fa-arrow-left"></i>
                            </button>
                            <button className="postbox-arrow-next">
                              <i className="fa-sharp fa-solid fa-arrow-right"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Regular content */}
                    {!item.blogQuote && !item.blogQuoteTwo && (
                      <div className="postbox__content">
                        <div className="postbox__meta">
                          <span>
                            {itemCategory}
                            {itemDate && ` • ${itemDate}`}
                            {readTime && ` • ${readTime}`}
                            {authorName && ` • By ${authorName}`}
                          </span>
                        </div>
                        <h3 className="postbox__title">
                          <Link href={linkUrl}>{itemTitle}</Link>
                        </h3>
                        {itemDescription && (
                          <div className="postbox__text">
                            <p>{itemDescription}</p>
                          </div>
                        )}
                        <div className="postbox__read-more">
                          <Link href={linkUrl} className="tp-btn-border-lg">
                            read more
                          </Link>
                        </div>
                      </div>
                    )}
                    
                    {/* Template quote styles - keep for backward compatibility */}
                    {item.blogQuoteTwo && (
                      <div className="postbox__link-post-wrap d-flex align-items-center">
                        <span className="postbox__link-post-icon">
                          <Quote />
                        </span>
                        <p>
                          MERGE DIFFERENT TO CREATE A PERFECT <br /> PLAYLIST FOR
                          EACH.
                        </p>
                      </div>
                    )}
                    {item.blogQuote && (
                      <div className="postbox__blockquote">
                        <blockquote>
                          <span className="postbox__blockquote-icon">
                            <QuoteTwo />
                          </span>
                          <p>
                            Lorem ipsum dolor sit amet, consetetur sadipscing
                            elitr,uyam erat.!
                          </p>
                          <span className="postbox__blockquote-info">
                            SEM SMITH, CREATIVE DIRECTOR
                          </span>
                        </blockquote>
                      </div>
                    )}
                  </article>
                );
              })}

              <div className="basic-pagination">
                <nav>
                  <PaginationCom
                    handlePageClick={handlePageClick}
                    pageCount={pageCount}
                  />
                </nav>
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-xl-4 col-lg-4">
            {/* blog sidebar area */}
            <BlogSidebar 
              recentPosts={blog_items.slice(0, 3)} 
              categories={blogs.length > 0 ? Array.from(new Set(blogs.flatMap((b: any) => b.categories || []))) : []}
            />
            {/* blog sidebar area */}
          </div>
        </div>
      </div>
    </section>
  );
}
