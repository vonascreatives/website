import React from "react";
import Image from "next/image";
import Link from "next/link";
// images
import shape from '@/assets/img/home-08/hero/shape-1.png';
import port_1 from "@/assets/img/home-12/portfolio/port-1.jpg";
import port_2 from "@/assets/img/home-12/portfolio/port-2.jpg";
import port_3 from "@/assets/img/home-12/portfolio/port-3.jpg";
import port_4 from "@/assets/img/home-12/portfolio/port-4.jpg";
import port_5 from "@/assets/img/home-12/portfolio/port-5.jpg";
import port_6 from "@/assets/img/home-12/portfolio/port-6.jpg";

const portfolio_data = [
  {
    id: 1,
    img: port_1,
    title: "Digital Thinker",
    slug: "digital-thinker",
  },
  {
    id: 2,
    img: port_2,
    title: "Magazine Cover",
    slug: "magazine-cover",
  },
  {
    id: 3,
    img: port_3,
    title: "Twin Tigers",
    slug: "twin-tigers",
  },
  {
    id: 4,
    img: port_4,
    title: "Squarespace Brand",
    slug: "squarespace-brand",
  },
  {
    id: 5,
    img: port_5,
    title: "Markus Erikkson",
    slug: "markus-erikkson",
  },
  {
    id: 6,
    img: port_6,
    title: "Twin Tigers",
    slug: "twin-tigers-2",
  },
];

interface StudioPanelThreeProps {
  channels?: any[]; // YouTube channels data from CMS (youtubeId collection)
}

export default function StudioPanelThree({ channels }: StudioPanelThreeProps) {
  // Use YouTube channels from CMS or fallback to static portfolio data
  const displayData = channels && channels.length > 0 
    ? channels.map((ch, index) => {
        // Generate slug: use real slug if exists, otherwise create from channel name
        const generatedSlug = ch.slug?.current || 
          ch.channel_name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 
          `channel-${index + 1}`;
        
        return {
          id: index + 1,
          img: ch.image || ch.heroImage || portfolio_data[index]?.img,
          title: ch.channel_name || ch.name || portfolio_data[index]?.title,
          slug: generatedSlug, // This is now always a string
          channel_number: ch.channel_number
        };
      })
    : portfolio_data;
  return (
    <div className="panel-2 tp-studio-height">
      <div className="tp-studio-portfolio-area d-flex align-items-end tp-studio-height tp-studio-plr p-relative fix pt-100 pb-60">
        <div className="tp-studio-portfolio-shape d-none d-md-block">
          <Image src={shape} alt="shape" style={{height:"auto"}} />
        </div>
        <div className="container container-1630">
          <div className="row align-items-end counter-row">
            <div className="col-xl-3 col-lg-6">
              <div className="tp-studio-portfolio-title-box">
                <h4 className="tp-studio-portfolio-title">
                  Our YouTube <br /> Channels
                </h4>
                <p>
                  Content formats that scale and stories that stick like culture itself
                </p>
                <Link
                  className="tp-btn-black-sm"
                  href="/creators"
                >
                  View All Channels
                </Link>
              </div>
            </div>
            <div className="col-xl-9 col-lg-12">
              <div className="tp-studio-line-wrap p-relative">
                <div className="tp-studio-portfolio-wrap p-relative tp-marker-tab">
                  {displayData.map((item) => (
                    <div
                      key={item.id}
                      className="tp-studio-portfolio-item p-relative"
                    >
                      <div className="tp-studio-portfolio-inner-title-box">
                        <h4 className="tp-studio-portfolio-inner-title">
                          <Link href={`/channels/${item.slug}`}>{item.title}</Link>
                          <span>{(item as any).channel_number || (item.id < 9 ? `0${item.id}` : item.id)}</span>
                        </h4>
                      </div>
                      <div className="tp-studio-portfolio-img">
                        <Image
                          src={item.img}
                          alt={item.title || "channel image"}
                          width={400}
                          height={225}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <span id="myline"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
