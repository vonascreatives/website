'use client';
import React, { CSSProperties } from "react";
import Image from "next/image";
import shape from '@/assets/img/home-08/hero/shape-1.png';

const imgStyle: CSSProperties = { height: "auto" };

interface StudioHeroData {
  _id?: string;
  title: string;
  heroImageLeft: string | null;
  heroImageLeftAlt?: string;
  heroImageRight: string | null;
  heroImageRightAlt?: string;
  shapeImage: string | null;
  shapeImageAlt?: string;
  thumbnailImages: Array<{
    url: string | null;
    alt: string;
    displayOrder: number;
  }>;
}

interface StudioPanelOneCmsProps {
  studioHeroData: StudioHeroData;
}

export default function StudioPanelOneCms({ studioHeroData }: StudioPanelOneCmsProps) {
  // Sort thumbnails by display order just in case
  const sortedThumbnails = [...studioHeroData.thumbnailImages].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  return (
    <div className="panel-2 tp-studio-height">
      <div className="tp-studio-hero-area tp-studio-hero-space tp-studio-height tp-studio-plr p-relative fix pt-145 pb-145">
        {studioHeroData.heroImageLeft && (
          <div className="tp-studio-hero-img-1 d-none d-xl-block">
            <Image 
              src={studioHeroData.heroImageLeft} 
              alt={studioHeroData.heroImageLeftAlt || 'Hero image'} 
              width={200}
              height={100}
              style={imgStyle} 
            />
          </div>
        )}
        {studioHeroData.heroImageRight && (
          <div className="tp-studio-hero-img-2 d-none d-xl-block">
            <Image 
              src={studioHeroData.heroImageRight} 
              alt={studioHeroData.heroImageRightAlt || 'Hero image'} 
              width={200}
              height={100}
              style={imgStyle} 
            />
          </div>
        )}
        <div className="container container-1480">
          <div className="row align-items-center">
            <div className="col-xl-7">
              <div className="tp-studio-hero-title-box p-relative">
                <h1 className="tp-studio-hero-title">
                  {studioHeroData.title}
                </h1>
                <span className="tp-studio-hero-shape-1 d-none d-md-block">
                  <Image
                    src={studioHeroData.shapeImage || shape}
                    alt={studioHeroData.shapeImageAlt || "Shape decoration"}
                    width={70}
                    height={120}
                    style={imgStyle}
                  />
                </span>
              </div>
            </div>
            <div className="col-xl-5">
              <div className="tp-studio-hero-right">
                <div className="row gx-90">
                  <div className="col-xl-6 col-lg-6 col-md-6">
                    {sortedThumbnails[0]?.url && (
                      <div className="tp-studio-hero-thumb mb-90 text-end">
                        <Image
                          src={sortedThumbnails[0].url}
                          alt={sortedThumbnails[0].alt || 'Thumbnail 1'}
                          width={400}
                          height={500}
                          style={imgStyle}
                        />
                      </div>
                    )}
                    {sortedThumbnails[1]?.url && (
                      <div className="tp-studio-hero-thumb text-end">
                        <Image
                          src={sortedThumbnails[1].url}
                          alt={sortedThumbnails[1].alt || 'Thumbnail 2'}
                          width={400}
                          height={500}
                          style={imgStyle}
                        />
                      </div>
                    )}
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6">
                    {sortedThumbnails[2]?.url && (
                      <div className="tp-studio-hero-thumb mb-90 text-end">
                        <Image
                          src={sortedThumbnails[2].url}
                          alt={sortedThumbnails[2].alt || 'Thumbnail 3'}
                          width={400}
                          height={500}
                          style={imgStyle}
                        />
                      </div>
                    )}
                    {sortedThumbnails[3]?.url && (
                      <div className="tp-studio-hero-thumb text-end">
                        <Image
                          src={sortedThumbnails[3].url}
                          alt={sortedThumbnails[3].alt || 'Thumbnail 4'}
                          width={400}
                          height={500}
                          style={imgStyle}
                        />
                      </div>
                    )}
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
