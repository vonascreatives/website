import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ITeamDT } from "@/types/team-d-t";

// prop type 
type IProps = {
  item: any;
  handleTeamModal(team: any): void;
}

export default function TeamItem({ item,handleTeamModal }:IProps) {
  // Handle both creator and team data structures
  const displayImage = item.image || item.photo || "/assets/img/home-01/team/team-1-1.jpg";
  const displayName = item.name;
  const displayDesignation = item.designation || item.role || item.headline || "Creator";
  const displayBio = item.bioText || (item.bio && item.bio[0]?.children?.[0]?.text) || item.description || '';
  
  // Check if this is Sanity team member data (has slug) or static creator data
  const creatorSlug = item.slug?.current || item.slug;
  const isCreator = Boolean(creatorSlug);
  const creatorUrl = isCreator ? `/creators/${creatorSlug}` : null;
  
  // Transform creator data to team data structure for modal
  const modalData = {
    id: item.id || item._id,
    image: displayImage,
    name: displayName,
    designation: displayDesignation,
    ...item,
  };
  
  return (
    <div className="tp-team-item tp-hover-btn-wrapper marque fix mb-30">
      <div className="tp-hover-btn-item tp-team-img-portrait">
        <Image
          src={displayImage}
          alt={`${displayName} - ${displayDesignation}`}
          fill
          sizes="(min-width: 1400px) 200px, (min-width: 992px) 25vw, (min-width: 576px) 40vw, 90vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="tp-team-content">
        <span>{displayDesignation}</span>
        <h4 className="tp-team-title-sm">
          {creatorUrl ? (
            <Link href={creatorUrl}>{displayName}</Link>
          ) : (
            <a href="#" onClick={() => handleTeamModal(modalData)}>{displayName}</a>
          )}
        </h4>
      </div>
    </div>
  );
}
