import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {Swiper,SwiperSlide} from 'swiper/react';
import {Autoplay} from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';
import Social from '@/components/social/social';
import { Dots } from '@/components/svg';

// fallback images
import full_img from '@/assets/img/inner-project/custom/custom-big-1.jpg';
import port_1 from '@/assets/img/inner-project/custom/port-1.jpg';
import port_2 from '@/assets/img/inner-project/custom/port-2.jpg';
import port_3 from '@/assets/img/inner-project/custom/port-3.jpg';

// fallback slider images
const fallback_slider_images = [port_1,port_2,port_3,port_2];

// slider setting
const slider_setting:SwiperOptions = {
  slidesPerView: 3,
  loop: true,
  autoplay: true,
  spaceBetween: 20,
  speed: 1000,
  breakpoints: {
    '1400': {
      slidesPerView: 3,
    },
    '1200': {
      slidesPerView: 3,
    },
    '992': {
      slidesPerView: 2,
    },
    '768': {
      slidesPerView: 2,
    },
    '576': {
      slidesPerView: 1,
    },
    '0': {
      slidesPerView: 1,
    },
  },
}

interface PortfolioDetailsCustomLightAreaProps {
  channel?: any;
  navigation?: {
    prevChannel: { name: string; slug: string; channel_number: string } | null;
    nextChannel: { name: string; slug: string; channel_number: string } | null;
  };
}

export default function PortfolioDetailsCustomLightArea({ channel, navigation }: PortfolioDetailsCustomLightAreaProps) {
  console.log('Channel data received:', channel); // Debug log
  
  
  // Extract channel data with fallbacks
  const channelNumber = channel?.channel_number || '01';
  const channelName = channel?.channel_name || 'Sample Channel';
  const channelDescription = channel?.intro_description_text || 
    (channel?.intro_description && channel.intro_description[0]?.children?.[0]?.text) || 
    `Discover the creative journey behind ${channelName}. This channel represents our commitment to building engaging content that resonates with audiences and creates meaningful connections through storytelling.`;
  const channelDate = channel?.date_started ? new Date(channel.date_started).getFullYear() : '2024';
  const channelCategory = channel?.category || 'Content Creation';
  const channelCreator = channel?.channel || 'Vonas Media';
  const visualIdentitySubtitle = channel?.visual_identity_subtitle || 'Visual Identity';
  const visualIdentityDescription = channel?.visual_identity_description_text || 
    (channel?.visual_identity_description && channel.visual_identity_description[0]?.children?.[0]?.text) ||
    `The design approach for ${channelName} focuses on creating a cohesive visual language that reflects the channel's personality and connects with the target audience. Every element is carefully crafted to enhance the storytelling experience.`;
  const visualIdentityBullets = channel?.visual_identity_bullets || ['CONTENT STRATEGY', 'VISUAL BRANDING', 'AUDIENCE ENGAGEMENT', 'CHANNEL OPTIMIZATION'];
  
  // Extract images from Sanity with fallbacks
  const heroImage = channel?.visual_identity_images?.[0]?.url || full_img;
  const conceptImages = channel?.concept_images || [];
  
  // Create slider images array (use Sanity images if available, fallback to static)
  let slider_images = [];
  if (channel?.visual_identity_images && channel.visual_identity_images.length > 0) {
    slider_images = channel.visual_identity_images.map((img: any) => img.url).filter((url: string) => url);
  }
  if (channel?.concept_images && channel.concept_images.length > 0) {
    const conceptUrls = channel.concept_images.map((img: any) => img.url).filter((url: string) => url);
    slider_images = [...slider_images, ...conceptUrls];
  }
  if (slider_images.length === 0) {
    slider_images = fallback_slider_images;
  }
  
  
  // Extract concept section data
  const conceptSubtitle = channel?.concept_subtitle || 'The Concept';
  const conceptText1 = channel?.concept_text_block_1_text || 
    (channel?.concept_text_block_1 && channel.concept_text_block_1[0]?.children?.[0]?.text) ||
    `The creative approach for ${channelName} centers on authentic storytelling that resonates with the target audience.`;
  const conceptText2 = channel?.concept_text_block_2_text ||
    (channel?.concept_text_block_2 && channel.concept_text_block_2[0]?.children?.[0]?.text) ||
    'We build and activate brands through cultural insight, strategic vision, and the power of emotion across every element of its expression.';
  
  return (
    <>
      {/* portfolio details area */}
      <div className="pd-custom-area pt-145 pb-80">
        <div className="container">
            <div className="row">
              <div className="col-xl-8 col-lg-8">
                  <div className="project-details-1-title-box">
                    <span className="project-details-1-subtitle"><i>{channelNumber}</i>{channelCategory}</span>
                    <h4 className="project-details-1-title fs-100 tp-char-animation">{channelName}</h4>
                    <p className="mb-35 tp_title_anim">{channelDescription}</p>
                    <Link className="project-details-custom-link" href={channel?.cta_button_url || "#"}>
                      {channel?.cta_button_url ? 'Visit Channel' : 'Learn More'}
                    </Link>
                  </div>
              </div>
              <div className="col-xl-4 col-lg-4">
                  <div className="pd-custom-info-wrap">
                    <div className="project-details-1-info-wrap">
                        <div className="project-details-1-info tp_fade_bottom">
                          <span>Creator</span>
                          <h4>{channelCreator}</h4>
                        </div>
                        <div className="project-details-1-info tp_fade_bottom">
                          <span>Started</span>
                          <h4>{channelDate}</h4>
                        </div>
                        <div className="project-details-1-info tp_fade_bottom">
                          <span>Category</span>
                          <h4>{channelCategory}</h4>
                        </div>
                        <div className="project-details-1-info tp_fade_bottom">
                          <span>Share</span>
                          <div className="project-details-2-social">
                              <Social/>
                          </div>
                        </div>
                    </div>
                  </div>
              </div>
            </div>
        </div>
      </div>
      {/* portfolio details area */}

      {/* full image */}
      <div className="pd-custom-full-img">
        <Image 
          data-speed=".8" 
          src={heroImage} 
          alt={channel?.visual_identity_images?.[0]?.alt || `${channelName} hero image`} 
          width={1200} 
          height={600} 
          style={{height: "auto"}} 
        />
      </div>
      {/* full image */}

      {/* details title area */}
      <div className="pd-visual-content-area pt-125 pb-125">
          <div className="container">
              <div className="row">
                <div className="col-xl-6">
                    <div className="pd-visual-content-left">
                      <div className="pd-visual-title-box">
                          <span className="pd-visual-subtitle tp_fade_bottom">{channelNumber}</span>
                          <h4 className="project-details-1-title fs-100 fw-700 tp-char-animation">
                            {channel?.visual_identity_subtitle || 'Visual Identity'}
                          </h4>
                      </div>
                    </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-6">
                    <div className="pd-visual-left-text">
                      <span className="tp-char-animation">
                        {channel?.visual_identity_left_text || `Visually match ${channelCreator} personal style`}
                      </span>
                    </div>
                </div>
                <div className="col-xl-6">
                    <div className="pd-visual-right-content">
                      <p className="tp_title_anim">{visualIdentityDescription}</p>
                      <div className="pd-visual-right-list">
                          <ul className="tp_fade_bottom">
                            {visualIdentityBullets.map((bullet: string, index: number) => (
                              <li key={index}>{bullet}</li>
                            ))}
                          </ul>
                      </div>
                    </div>
                </div>
              </div>

          </div>
        </div>
      {/* details title area */}


      {/* slider images area */}
      <div className="pd-visual-slider-wrap pb-120">
          <Swiper {...slider_setting} modules={[Autoplay]} className="swiper-container pd-visual-slider-active">
              {slider_images.map((imgSrc: string, index: number) => (
                <SwiperSlide key={index}>
                  <div className="pd-visual-slider-thumb fix">
                    <Image 
                      src={imgSrc} 
                      alt={`${channelName} portfolio image ${index + 1}`} 
                      width={400}
                      height={300}
                      style={{height:"auto", width: "100%"}}
                    />
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      {/* slider images area */}

      {/* details text */}
      <div className="pd-visual-content-area pb-80">
        <div className="container">
            <div className="row">
              <div className="col-xl-6">
                  <div className="pd-visual-content-left">
                    <div className="pd-visual-title-box">
                        <span className="pd-visual-subtitle tp_fade_bottom">02</span>
                        <h4 className="project-details-1-title fs-100 fw-700 tp-char-animation">{conceptSubtitle}</h4>
                    </div>
                  </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-6">
                  <div className="pd-visual-left-text">
                    <span className="tp-char-animation">{`Creative vision for ${channelName}`}</span>
                  </div>
              </div>
              <div className="col-xl-6">
                  <div className="pd-visual-right-content tp_title_anim">
                    <p>{conceptText1}</p>
                    <p>{conceptText2}</p>
                  </div>
              </div>
            </div>
        </div>
      </div>
      {/* details text */}


      {/* details navigation */}
      <div className="pd-navigation-area">
        <div className="container">
            <div className="row">
              <div className="col-xl-12">
                  <div className="project-details-1-navigation d-flex justify-content-between align-items-center">
                    {navigation?.prevChannel ? (
                      <Link className="project-details-1-prev" href={`/channels/${navigation.prevChannel.slug}`}>
                          <i className="fa-sharp fa-regular fa-arrow-left"></i>
                          <span>Prev</span>
                      </Link>
                    ) : (
                      <div className="project-details-1-prev text-muted">
                          <i className="fa-sharp fa-regular fa-arrow-left"></i>
                          <span>Prev</span>
                      </div>
                    )}
                    <Link href="/channels">
                        <span>
                          <Dots/>
                        </span>
                    </Link>
                    {navigation?.nextChannel ? (
                      <Link className="project-details-1-next" href={`/channels/${navigation.nextChannel.slug}`}>
                          <span>Next</span>
                          <i className="fa-sharp fa-regular fa-arrow-right"></i>
                      </Link>
                    ) : (
                      <div className="project-details-1-next text-muted">
                          <span>Next</span>
                          <i className="fa-sharp fa-regular fa-arrow-right"></i>
                      </div>
                    )}
                  </div>
              </div>
            </div>
        </div>
      </div>
      {/* details navigation */}
    </>
  )
}
