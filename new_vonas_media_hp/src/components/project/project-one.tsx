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
  
  // Create display items - use CMS data or fallback
  const displayItems = hasChannels 
    ? normalizedChannels.slice(0, 6) // Show max 6 channels
    : fallbackChannels;

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
        className="tp-project-4-area project-panel-area"
        style={{ 
          backgroundImage: "url(/assets/img/home-04/brand/overly.png)",
          width: "100%",
          maxWidth: "none",
          margin: "0",
          padding: "0",
          paddingBottom: "120px",
          boxSizing: "border-box",
          lineHeight: "0",
          fontSize: "0"
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
            // Use the simplified heroImageUrl from the query
            imageSrc = item.heroImageUrl || item.logoImageUrl || fallbackChannels[index % fallbackChannels.length].img;
          } else {
            imageSrc = item.img;
          }
          
          const altText = isCMSItem
            ? (item.heroImageAlt || item.imageAlt || title)
            : title;
          
          const slug = isCMSItem ? getChannelSlug(item) : null;
          const href = slug ? `/channels/${slug}` : "/channels";

          return (
            <div 
              key={item._id || item.id || index} 
              className="tp-project-4-bg project-panel"
              style={{
                width: '100%',
                maxWidth: '1920px',
                margin: '0 auto',
                padding: '0',
                position: 'relative',
                display: 'block',
                lineHeight: '0',
                fontSize: '0',
                marginTop: '0',
                marginBottom: '0'
              }}
            >
              <Link href={href} style={{ display: 'block', width: '100%', position: 'relative', lineHeight: '0', fontSize: '0' }}>
                <div 
                  className="tp-project-4-thumb"
                  style={{ 
                    position: 'relative', 
                    width: '100%',
                    maxHeight: '800px',
                    height: 'auto',
                    aspectRatio: '16/9',
                    overflow: 'hidden',
                    margin: '0',
                    padding: '0',
                    display: 'block',
                    lineHeight: '0',
                    fontSize: '0'
                  }}
                >
                  {imageSrc ? (
                    <Image 
                      src={imageSrc} 
                      alt={altText}
                      width={1920}
                      height={1080}
                      style={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: "cover",
                        objectPosition: "center",
                        display: 'block',
                        verticalAlign: 'top',
                        margin: '0',
                        padding: '0',
                        border: 'none',
                        outline: 'none',
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden'
                      }}
                      priority={index < 2}
                      quality={90}
                      sizes="(max-width: 1920px) 100vw, 1920px"
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
                      No Image Available
                    </div>
                  )}
                  <div 
                    className="tp-project-4-content z-index"
                    style={{
                      position: 'absolute',
                      bottom: '50px',
                      left: '50px',
                      right: '50px',
                      zIndex: 10,
                      pointerEvents: 'none',
                      lineHeight: 'normal'
                    }}
                  >
                    <h4 
                      className="tp-project-4-title tp_reveal_anim-2" 
                      style={{ 
                        margin: 0,
                        fontSize: 'clamp(60px, 6vw, 96px)',
                        lineHeight: '1',
                        fontWeight: '700',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {title}
                    </h4>
                  </div>
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
