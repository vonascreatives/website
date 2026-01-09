import React from "react";
import Image from "next/image";
import { Hand } from "../svg";

// Static imports as fallbacks
import shape from "@/assets/img/inner-about/about/shape-1.png";
import ab_1 from "@/assets/img/inner-about/about/about-1.jpg";
import ab_2 from "@/assets/img/inner-about/about/about-3.jpg";
import ab_3 from "@/assets/img/inner-about/about/about-2.jpg";

interface AboutUsAreaProps {
  aboutSectionImages?: {
    _id: string;
    title: string;
    url: string;
    alt: string;
    placement?: string;
    notes?: string;
    displayOrder?: number;
  }[];
}

export default function AboutUsArea({ aboutSectionImages }: AboutUsAreaProps) {
  // Helper function to get image by order and pattern
  const getImageByOrder = (order: number, pattern: string, fallbackSrc: any, fallbackAlt: string) => {
    if (aboutSectionImages && aboutSectionImages.length > 0) {
      // First try to find by display order
      let image = aboutSectionImages.find(img => img.displayOrder === order);

      // If not found, try pattern matching
      if (!image) {
        image = aboutSectionImages.find(img =>
          img.placement?.toLowerCase().includes(pattern.toLowerCase()) ||
          img.title?.toLowerCase().includes(pattern.toLowerCase()) ||
          img.notes?.toLowerCase().includes(pattern.toLowerCase())
        );
      }

      // If still not found, try by index
      if (!image && aboutSectionImages[order - 1]) {
        image = aboutSectionImages[order - 1];
      }

      if (image) {
        return { src: image.url, alt: image.alt };
      }
    }

    return { src: fallbackSrc, alt: fallbackAlt };
  };

  // Get specific images with fallbacks (using display order)
  const shapeImage = getImageByOrder(1, 'shape', shape, 'About section decorative shape');
  const mainImage = getImageByOrder(2, 'main', ab_1, 'About section main image');
  const secondaryImage = getImageByOrder(3, 'secondary', ab_2, 'About section secondary image');
  const tertiaryImage = getImageByOrder(4, 'tertiary', ab_3, 'About section tertiary image');
  return (
    <div className="ab-about-area ab-about-mt pb-90 z-index-5">
      <div className="container container-1480">
        <div className="ab-about-thumb-wrap mb-180">
          <div className="row align-items-end">
            <div className="col-xl-6 col-lg-6 col-md-6">
              <div className="ab-about-left-thumb">
                <Image
                  data-speed=".7"
                  src={mainImage.src}
                  alt={mainImage.alt || "About section main image"}
                  style={{ height: "auto" }}
                  width={600}
                  height={338}
                />
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6">
              <div className="ab-about-right-thumb p-relative">
                <Image
                  data-speed="1.1"
                  className="inner-img z-index-5"
                  src={secondaryImage.src}
                  alt={secondaryImage.alt || "About section secondary image"}
                  style={{ height: "auto" }}
                  width={300}
                  height={169}
                />
                <Image
                  data-speed="0.9"
                  src={tertiaryImage.src}
                  alt={tertiaryImage.alt || "About section tertiary image"}
                  style={{ height: "auto" }}
                  width={300}
                  height={169}
                />
              </div>
            </div>
          </div>
        </div>
        <div id="about-info" className="row">
          <div className="col-xxl-9">
            <div className="ab-about-content p-relative">
              <span>
                <Hand />
                Hi!
              </span>
              <p className="tp-dropcap tp_fade_bottom">
                We are a content-first media lab connecting Philippine creators with brands.
                From talent management to show production, we&apos;re your strategic partner in the creator economy!
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-9">
            <div className="row">
              <div className="col-xl-5 col-lg-5 col-md-4 mb-40">
                <div className="ab-about-category-title-box p-relative">
                  <h4 className="ab-about-category-title">
                    Our Services <br />
                    <span>WHAT WE DO</span>
                  </h4>
                  <Image
                    className="ab-about-shape-1 d-none d-md-block"
                    src={shapeImage.src}
                    alt={shapeImage.alt || "About section decorative shape"}
                    width={100}
                    height={100}
                  />
                </div>
              </div>
              <div className="col-xl-7 col-lg-7 col-md-8">
                <div className="row">
                  <div className="col-xl-6 col-lg-6 col-md-6 mb-40">
                    <div className="ab-about-category-list category-space-1 tp_fade_bottom">
                      <ul>
                        <li>Channel Building</li>
                        <li>Content Strategy</li>
                        <li>Creator Support</li>
                        <li>Format Engineering</li>
                        <li>Video Production</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 mb-40">
                    <div className="ab-about-category-list category-space-2 tp_fade_bottom">
                      <ul>
                        <li>Brand Storytelling</li>
                        <li>Documentary Shorts</li>
                        <li>Cultural Research</li>
                        <li>Platform Strategy</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
