import React from "react";
import Image from "next/image";
import Link from "next/link";

// fallback service images
import s_1 from "@/assets/img/home-01/service/service-icon-1.png";
import s_2 from "@/assets/img/home-01/service/service-icon-2.png";
import s_3 from "@/assets/img/home-01/service/service-icon-3.png";
import s_4 from "@/assets/img/home-01/service/service-icon-4.png";

type IProps = {
  homepageImages?: any;
};

const ServiceOne = ({ homepageImages }: IProps) => {
  // Get service icons from CMS or use fallbacks
  const getServiceIcon = (title: string, fallback: any) => {
    if (homepageImages?.serviceIcons) {
      const icon = homepageImages.serviceIcons.find((img: any) => 
        img.title.toLowerCase().includes(title.toLowerCase())
      );
      return icon?.url || fallback;
    }
    return fallback;
  };
  
  // service data with dynamic icons
  const service_data = [
    {
      id: 1,
      title: "CHANNEL BUILDING",
      desc: "We launch digital shows that build loyal audiences and drive real engagement across platforms.",
      icon: getServiceIcon("Channel Building", s_1),
      isUrl: typeof getServiceIcon("Channel Building", s_1) === 'string' && getServiceIcon("Channel Building", s_1).startsWith('http')
    },
    {
      id: 2,
      title: "CREATOR SUPPORT",
      desc: "In-house talent management supporting 20+ creators with growth strategies and brand partnerships.",
      icon: getServiceIcon("Creator Support", s_2),
      isUrl: typeof getServiceIcon("Creator Support", s_2) === 'string' && getServiceIcon("Creator Support", s_2).startsWith('http')
    },
    {
      id: 3,
      title: "FORMAT DESIGN",
      desc: "We engineer repeatable show formats—from concept to execution—that scale across channels.",
      icon: getServiceIcon("Format Design", s_3),
      isUrl: typeof getServiceIcon("Format Design", s_3) === 'string' && getServiceIcon("Format Design", s_3).startsWith('http')
    },
    {
      id: 4,
      title: "BRAND STORIES",
      desc: "Partner with brands to create authentic content that connects with Filipino audiences.",
      icon: getServiceIcon("Brand Stories", s_4),
      isUrl: typeof getServiceIcon("Brand Stories", s_4) === 'string' && getServiceIcon("Brand Stories", s_4).startsWith('http')
    },
  ];
  return (
    <div className="tp-service-area pt-180 pb-80 tp-btn-trigger">
      <div className="container container-1630">
        <div className="row">
          <div className="col-xl-6 col-lg-6">
            <div className="tp-service-title-box p-relative">
              <h4 className="tp-section-title tp_fade_bottom">
                Shows
                <br />
                <span>Formats</span>
              </h4>
            </div>
            <div className="tp-service-left-btn tp-btn-bounce">
              <Link className="tp-btn-border" href="/service">
                <span className="tp-btn-border-wrap">
                  <span className="text-1">Explore Our Shows</span>
                  <span className="text-2">Explore Our Shows</span>
                </span>
              </Link>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <div className="tp-service-right-wrap">
              {service_data.map((s, i) => (
                <div
                  key={s.id}
                  className="tp-service-item d-flex align-items-start mb-75 tp_fade_bottom"
                >
                  <div className="tp-service-icon">
                    {s.isUrl ? (
                      <Image 
                        src={s.icon} 
                        alt={`${s.title} icon`} 
                        width={60}
                        height={60}
                        style={{ height: "auto", maxHeight: "60px" }} 
                      />
                    ) : (
                      <Image src={s.icon} alt={`${s.title} icon`} style={{ height: "auto" }} />
                    )}
                  </div>
                  <div className="tp-service-content">
                    <h4 className="tp-service-title-sm order-0">
                      <Link href="/service-details">{s.title}</Link>
                    </h4>
                    <p className="order-1">{s.desc}</p>
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

export default ServiceOne;
