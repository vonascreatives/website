"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import "@/styles/project-banner-fullwidth.css";


import ProjectTextLine from "./project-text-line";

// Fallback images from project-three (home-04/portfolio)
import p_1 from "@/assets/img/home-04/portfolio/port-1.jpg";
import p_2 from "@/assets/img/home-04/portfolio/port-2.jpg";
import p_3 from "@/assets/img/home-04/portfolio/port-3.jpg";
import p_4 from "@/assets/img/home-04/portfolio/port-4.jpg";

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

      {/* Portfolio section - full width */}
      <div
        className="tp-project-4-area pb-120 project-panel-area"
        style={{ backgroundImage: "url(/assets/img/home-04/brand/overly.png)" }}
      >
        <div className="container-fluid p-0">
          <div className="row g-0">
            <div className="col-xl-12">
              {displayItems.map((item, index) => {
                const title = hasChannels
                  ? (item.channel_name || item.title || `Channel ${index + 1}`)
                  : item.title;

                const imageSrc = hasChannels
                  ? (item.heroImage?.url || item.image || fallbackChannels[index % fallbackChannels.length].img)
                  : item.img;

                const altText = hasChannels
                  ? (item.heroImage?.alt || item.imageAlt || title)
                  : title;

                const slug = hasChannels ? getChannelSlug(item) : null;
                const href = slug ? `/channels/${slug}` : "/channels";

                return (
                  <div key={item._id || item.id || index} className="tp-project-4-bg project-panel">
                    <Link href={href}>
                      <div className="tp-project-4-thumb">
                        <Image
                          src={imageSrc}
                          alt={altText}
                          width={2560}
                          height={1440}
                          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                          priority={index < 2}
                        />
                      </div>
                      <div className="tp-project-4-content z-index">
                        <h4 className="tp-project-4-title tp_reveal_anim-2" style={{ fontSize: "clamp(6rem, 6vw, 6.5rem)" }}>
                          {title}
                        </h4>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectOne;
