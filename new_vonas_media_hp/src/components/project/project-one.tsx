"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import ProjectTextLine from "./project-text-line";

// Fallback images for when CMS is not available
import p_1 from "@/assets/img/home-01/project/project-1-1.jpg";
import p_2 from "@/assets/img/home-01/project/project-1-2.jpg";
import p_3 from "@/assets/img/home-01/project/project-1-3.jpg";
import p_4 from "@/assets/img/home-01/project/project-1-4.jpg";

type FallbackChannel = {
  id: number;
  title: string;
  img: StaticImageData;
};

const fallbackChannels: FallbackChannel[] = [
  { id: 1, title: "Silkvision", img: p_1 },
  { id: 2, title: "Egatan", img: p_2 },
  { id: 3, title: "Métrica", img: p_3 },
  { id: 4, title: "Fiedunit", img: p_4 },
];

type ProjectOneProps = {
  channels?: any[];
  homepageImages?: any;
};

type ChannelRecord = {
  _id?: string;
  title?: string;
  channel_name?: string;
  slug?: { current?: string } | string;
  heroImage?: { url?: string; alt?: string } | null;
  image?: string | StaticImageData;
  imageAlt?: string;
  [key: string]: any;
};

const getChannelSlug = (channel?: ChannelRecord | null) => {
  if (!channel) return undefined;
  const rawSlug = channel.slug as any;
  if (!rawSlug) return undefined;
  if (typeof rawSlug === "string") return rawSlug;
  return rawSlug.current;
};

const ProjectOne = ({ channels, homepageImages }: ProjectOneProps) => {
  // Use CMS data if available, otherwise fallback to static data
  const normalizedChannels = Array.isArray(channels) ? channels.filter(Boolean) : [];
  const hasChannels = normalizedChannels.length > 0;
  
  // Debug: Log what we're receiving from CMS
  console.log('ProjectOne - channels received:', channels);
  console.log('ProjectOne - normalizedChannels:', normalizedChannels);
  console.log('ProjectOne - hasChannels:', hasChannels);
  
  // Create display items - use CMS data or fallback
  const displayItems = hasChannels 
    ? normalizedChannels.slice(0, 6) // Show max 6 channels
    : fallbackChannels;
    
  console.log('ProjectOne - displayItems:', displayItems);

  return (
    <>
      {/* Project text line in normal container */}
      <div className="tp-project-area">
        <div className="container-fluid p-0">
          <div className="row g-0">
            <div className="col-xl-12">
              <ProjectTextLine />
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio section - full viewport width */}
      <div
        className="tp-project-4-area pb-120 project-panel-area"
        style={{ 
          backgroundImage: "url(/assets/img/home-04/brand/overly.png)",
          width: "100vw",
          minWidth: "100vw",
          position: "relative",
          left: "50%",
          transform: "translateX(-50%)",
          overflow: "visible",
          boxSizing: "border-box",
          margin: "0"
        }}
      >
        {displayItems.map((item, index) => {
          // Determine if this is a CMS item or fallback
          const isCMSItem = item._id && item.channel_name;
          
          // Handle both CMS data and fallback data
          const title = isCMSItem 
            ? (item.channel_name || item.title || `Channel ${index + 1}`)
            : item.title;
          
          // Extract image with proper fallback chain
          let imageSrc;
          if (isCMSItem) {
            // Try to get CMS image, fallback to static if none
            imageSrc = item.heroImage?.url || item.image || fallbackChannels[index % fallbackChannels.length].img;
          } else {
            imageSrc = item.img;
          }
          
          const altText = isCMSItem
            ? (item.heroImage?.alt || item.imageAlt || title)
            : title;
          
          const slug = isCMSItem ? getChannelSlug(item) : null;
          const href = slug ? `/channels/${slug}` : "/channels";
          
          // Debug each item
          console.log(`Item ${index}:`, {
            title,
            imageSrc,
            isCMSItem,
            hasHeroImage: !!item.heroImage?.url,
            hasImageField: !!item.image
          });

          return (
            <div key={item._id || item.id || index} className="tp-project-4-bg project-panel">
              <Link href={href}>
                <div 
                  className="tp-project-4-thumb"
                  style={{ 
                    position: 'relative', 
                    width: '100%', 
                    minHeight: '500px' 
                  }}
                >
                  {imageSrc && (
                    <Image 
                      src={imageSrc} 
                      alt={altText}
                      fill
                      sizes="100vw"
                      style={{ 
                        objectFit: "cover"
                      }}
                      priority={index < 2} // Prioritize first two images
                      onError={(e) => {
                        console.error(`Image failed to load for ${title}:`, imageSrc);
                      }}
                    />
                  )}
                </div>
                <div className="tp-project-4-content z-index">
                  <h4 className="tp-project-4-title tp_reveal_anim-2">
                    {title}
                  </h4>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ProjectOne;
