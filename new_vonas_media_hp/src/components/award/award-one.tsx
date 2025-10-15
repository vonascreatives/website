"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";

import a_1 from "@/assets/img/home-01/award/award-1.png";
import a_2 from "@/assets/img/home-01/award/award-2.png";
import a_3 from "@/assets/img/home-01/award/award-3.png";
import a_4 from "@/assets/img/home-01/award/award-4.png";
import a_5 from "@/assets/img/home-01/award/award-5.png";
import a_6 from "@/assets/img/home-01/award/award-6.png";
import { Leaf } from "../svg";

// Static fallback data
const award_data = [
  {
    id: 1,
    img: a_1,
    subtitle: "x2",
    title: "FWA, Site of the Day",
    date: "Jun 24, 2024",
  },
  {
    id: 2,
    img: a_2,
    subtitle: "x3",
    title: "Awwwards Interior Excellence",
    date: "Nov 24, 2022",
  },
  {
    id: 3,
    img: a_3,
    subtitle: "x1",
    title: "Loki boundary pushing year in Review 2022",
    date: "May 24, 2012",
  },
  {
    id: 4,
    img: a_4,
    subtitle: "x1",
    title: "The New Liko Tools Website is Live.",
    date: "Sep 10, 2021",
  },
  {
    id: 5,
    img: a_5,
    subtitle: "x2",
    title: "Digital Agencies Worldwide",
    date: "Jun 12, 2021",
  },
  {
    id: 6,
    img: a_6,
    subtitle: "x1",
    title: "FWA, Site of the Day",
    date: "Aug 18, 2022",
  },
];

// Type for CMS award data
export type AwardData = {
  _id: string;
  title: string;
  slug: string;
  subtitle: string;
  awardDate: string;
  imageUrl: string;
  imageAlt?: string;
  organization?: string;
  category?: string;
  projectUrl?: string;
  description?: string;
  displayOrder: number;
  featured?: boolean;
  isActive: boolean;
};

// Unified type for both CMS and static data
type AwardItem = {
  id: string | number;
  img: StaticImageData | string;
  subtitle: string;
  title: string;
  date: string;
  alt?: string;
};

// prop type
type IProps = {
  cls?: string;
  abStyle?: boolean;
  awards?: AwardData[]; 
};

const AwardOne = ({cls="pt-125 pb-125", abStyle=false, awards}: IProps) => {
  const displayAwards: AwardItem[] = awards && awards.length > 0
    ? awards.map((award, index) => ({
        id: index + 1, 
        img: award.imageUrl,
        subtitle: award.subtitle,
        title: award.title,
        date: new Date(award.awardDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: '2-digit' 
        }),
        alt: award.imageAlt || award.title,
      }))
    : award_data;

  const [activeThumb, setActiveThumb] = React.useState(
    displayAwards[0]?.id || 1
  );

  return (
    <div className={`tp-award-area ${cls}`}>
      <div className="container container-1630">
        <div className="row">
          <div className="col-xxl-6 col-xl-7">
            {!abStyle && (
              <div className="tp-award-title-box">
                <h4 className="tp-section-title tp-char-animation">
                  Awards <br /> <span>& Recognition</span>
                </h4>
              </div>
            )}
            {abStyle && (
              <div className="ab-award-title-sm">
                <span>
                  <Leaf />
                  Awards & Recognition
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-xl-4 col-lg-4 col-md-12">
            <div className="tp-award-list-thumb-wrap p-relative">
              <div
                id="tp-award-thumb"
                className={`tp-award-list-thumb-${activeThumb}`}
              >
                {displayAwards.map((item) => {
                  const isActive = activeThumb === item.id;
                  return (
                    <Image
                      key={item.id}
                      className={`tp-award-list-thumb-${item.id}`}
                      src={item.img}
                      alt={item.alt || "Award image"}
                      width={typeof item.img === 'string' ? 500 : undefined}
                      height={typeof item.img === 'string' ? 500 : undefined}
                      style={{
                        display: isActive ? 'block' : 'none',
                        width: '100%',
                        height: 'auto',
                        position: isActive ? 'relative' : 'absolute',
                        opacity: isActive ? 1 : 0,
                        visibility: isActive ? 'visible' : 'hidden'
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="col-xl-8 col-lg-8 col-md-12">
            <div className="tp-award-list-wrap">
              {displayAwards.map((item) => (
                <div
                  key={item.id}
                  onMouseEnter={() => {
                    setActiveThumb(item.id);
                  }}
                  className="tp-award-list-item d-flex align-items-center justify-content-between tp_fade_bottom"
                  rel={`tp-award-list-thumb-${item.id}`}
                >
                  <div className="tp-award-list-content-left d-flex align-items-center">
                    <span>{item.subtitle}</span>
                    <p>{item.title}</p>
                  </div>
                  <div className="tp-award-list-content-right">
                    <span>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwardOne;
