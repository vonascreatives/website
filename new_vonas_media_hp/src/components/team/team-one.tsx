"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import { SwiperOptions } from "swiper/types";
import TeamItem from "./team-item";
import TeamModal from "../modal/team-modal";
import { getCreatorFollowerCount } from "@/utils/formatFollowers";

const slider_setting: SwiperOptions = {
  slidesPerView: 6,
  loop: true,
  autoplay: false,
  spaceBetween: 30,
  breakpoints: {
    "1400": {
      slidesPerView: 6,
    },
    "1200": {
      slidesPerView: 4,
    },
    "992": {
      slidesPerView: 4,
    },
    "768": {
      slidesPerView: 3,
    },
    "576": {
      slidesPerView: 2,
    },
    "0": {
      slidesPerView: 1,
    },
  },
};

// prop type
type IProps = {
  spacing?: string;
  creators?: any[];
};
const TeamOne = ({ spacing = "pt-20", creators }: IProps) => {
  const [showModal, setShowModal] = React.useState(false);
  const [teamItem, setTeamItem] = React.useState<any | null>(null);
  
  // Strictly use CMS creators only - no fallback data
  // Return null if no creators from CMS
  if (!creators || creators.length === 0) {
    return null;
  }
  
  // Deduplicate team members by name to avoid showing duplicates
  const deduplicateTeamMembers = (members: any[]) => {
    const seen = new Set();
    return members.filter(member => {
      const key = `${member.name}-${member.role}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };
  
  // Use only CMS creators data - deduplicate and sort
  let displayData = deduplicateTeamMembers(creators);

  // Prioritize items by follower count (highest first), then by having images
  displayData = [...displayData].sort((a, b) => {
    // Get follower counts
    const aFollowers = getCreatorFollowerCount(a);
    const bFollowers = getCreatorFollowerCount(b);

    // Sort by followers (descending - highest first)
    if (aFollowers !== bFollowers) {
      return bFollowers - aFollowers;
    }

    // If follower counts are equal, prioritize items with images
    const aHasImage = Boolean(a.image || a.photo);
    const bHasImage = Boolean(b.image || b.photo);

    if (aHasImage && !bHasImage) return -1;
    if (!aHasImage && bHasImage) return 1;
    return 0;
  });
  
  
  function handleTeamModal(team: any) {
    setShowModal(!showModal);
    setTeamItem(team);
  }
  return (
    <>
      <div className={`tp-team-area ${spacing} pb-120 fix`}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-team-slider-wrapper">
                <Swiper
                  {...slider_setting}
                  modules={[Autoplay, FreeMode]}
                  className="swiper-container tp-team-slider-active"
                >
                  {displayData.map((t) => (
                    <SwiperSlide key={t.id || t._id}>
                      <TeamItem item={t} handleTeamModal={handleTeamModal} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* team modal */}
      {teamItem && (
        <TeamModal
          setShowModal={setShowModal}
          showModal={showModal}
          teamItem={teamItem}
        />
      )}
      {/* team modal */}
    </>
  );
};

export default TeamOne;
