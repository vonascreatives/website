import React from "react";
import { scroller } from "react-scroll";
import { ScrollDown } from "../svg";

interface AboutUsHeroProps {
  heroImages?: {
    _id: string;
    title: string;
    url: string;
    alt: string;
    placement?: string;
  }[];
}

export default function AboutUsHero({ heroImages }: AboutUsHeroProps) {
  const scrollTo = () => {
    scroller.scrollTo('about-info', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
    });
  };
  
  // Get hero image with fallback
  const heroImage = heroImages && heroImages.length > 0 
    ? heroImages[0] 
    : {
        url: '/assets/img/inner-about/hero/hero-1.jpg',
        alt: 'About page hero background'
      };
  
  return (
    <div
      className="ab-inner-hero-area ab-inner-hero-bg p-relative"
      style={{
        backgroundImage: `url(${heroImage.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '400px'
      }}
    >
      <div className="breadcurmb-site d-none">
        <h6>About Us</h6>
      </div>
      <div className="ab-inner-hero-scroll smooth">
        <a className="pointer" onClick={scrollTo}>
          <span>
            Scroll to explore
            <ScrollDown />
          </span>
        </a>
      </div>
      <div className="container container-1480">
        <div className="row">
          <div className="col-xl-8">
            <div
              className="ab-inner-hero-title-box"
              data-lag="0.2"
              data-stagger="0.08"
            >
              <span className="ab-inner-hero-subtitle">
                VONAS <br /> Media
              </span>
              <h1 className="ab-inner-hero-title tp-char-animation">
                Building Creator Culture
              </h1>
              <p>Digital content with lasting cultural impact</p>
            </div>
          </div>
        </div>
        <div className="row justify-content-end">
          <div className="col-xl-5 col-lg-8">
            <div
              className="ab-inner-hero-content"
              data-lag="0.2"
              data-stagger="0.08"
            >
              <p>
                Vonas builds, scales & delivers channels & content formats
                that drive culture,
              </p>
               <a className="tp-btn-white-sm border-style" href="#">Our Journey</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
