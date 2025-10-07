import React from "react";
import Image from "next/image";

// images
import shape_1 from "@/assets/img/home-01/team/team-details-shape-1.png";
import shape_2 from "@/assets/img/home-01/team/team-details-shape-2.png";
import t_details from "@/assets/img/home-01/team/team-details-1.png";
import { ITeamDT } from "@/types/team-d-t";

// prop type
type IProps = {
  item: ITeamDT;
}

export default function TeamDetailsArea({ item }: IProps) {
  return (
    <div className="tm-details-wrapper p-relative">
      <div className="tm-details-shape-1">
        <Image src={shape_1} alt="shape" />
      </div>
      <div className="tm-details-shape-2">
        <Image src={shape_2} alt="shape" />
      </div>
      <div className="container">
        <div className="row align-items-center align-items-xxl-end">
          <div className="col-xl-6 col-lg-6 col-md-7">
            <div className="tm-details-content-wrap z-index-5">
              <div className="tm-details-title-box mb-20">
                <span className="tm-hero-subtitle">{item?.designation}</span>
                <h4 className="tm-details-title">{item?.name}</h4>
              </div>
              <div className="tm-details-text">
                <p>
                  {item?.bioText || item?.bio || 
                    "I'm an illustrator, working for brands. My work is fuelled by my observing nature and ongoing curiosity, utilizing simple shapes to tell all sorts of stories. My clear signature applies to both my personal work as well as my commercial commissions. Among my clients are Google, The New York Times, The New Yorker, Facebook, Vogue, TED and Twitter. Oh and I like to paint. Which still feels very new to me and slows me down."}
                </p>
              </div>
              {/* Channel Section - Only show if team member has connected YouTube channels */}
              {item?.youtubeChannels && item.youtubeChannels.length > 0 && (
                <div className="tm-details-portfolio mb-50">
                  <span className="tm-details-social-title">Channels:</span>
                  {item.youtubeChannels.map((channel) => {
                    // Check if we have a valid slug for internal navigation
                    const hasValidSlug = channel.slug?.current && channel.slug.current.trim() !== '';
                    
                    // Generate a slug from the channel name if none exists
                    const generatedSlug = channel.channel_name
                      ?.toLowerCase()
                      .replace(/\s+/g, '-')
                      .replace(/[^a-z0-9-]/g, '')
                      .replace(/-+/g, '-')
                      .replace(/^-|-$/g, '');
                    
                    // Use existing slug or generated slug for internal navigation
                    const channelSlug = hasValidSlug ? channel.slug.current : generatedSlug;
                    
                    // Always try internal navigation first, fallback to external URL
                    const shouldBeClickable = channelSlug || (channel.cta_button_url && channel.cta_button_url.trim() !== '');
                    
                    if (shouldBeClickable) {
                      const href = channelSlug ? `/channels/${channelSlug}` : channel.cta_button_url;
                      const target = channelSlug ? '_self' : '_blank';
                      
                      return (
                        <a 
                          key={channel._id} 
                          href={href}
                          target={target}
                          rel="noopener noreferrer"
                          className="tm-details-portfolio-link"
                          title={channelSlug ? `View ${channel.channel_name} profile` : `Visit ${channel.channel_name} on YouTube`}
                        >
                          {channel.channel_name}
                          {!hasValidSlug && <i className="fas fa-external-link-alt" style={{marginLeft: '5px', fontSize: '12px'}}></i>}
                        </a>
                      );
                    } else {
                      // Show as non-clickable text if neither slug nor URL is available
                      return (
                        <span 
                          key={channel._id}
                          className="tm-details-portfolio-text"
                          title="Channel profile not available"
                          style={{color: '#666', cursor: 'not-allowed', opacity: 0.7}}
                        >
                          {channel.channel_name}
                        </span>
                      );
                    }
                  })}
                </div>
              )}
              
              {/* Social Links */}
              {item?.socialLinks && Object.keys(item.socialLinks).length > 0 && (
                <div className="tm-details-social">
                  <span className="tm-details-social-title">Follow:</span>
                  {item.socialLinks.facebook && (
                    <a href={item.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  )}
                  {item.socialLinks.twitter && (
                    <a href={item.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-twitter"></i>
                    </a>
                  )}
                  {item.socialLinks.linkedin && (
                    <a href={item.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  )}
                  {item.socialLinks.instagram && (
                    <a href={item.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-instagram"></i>
                    </a>
                  )}
                  {item.socialLinks.website && (
                    <a href={item.socialLinks.website} target="_blank" rel="noopener noreferrer">
                      <i className="fas fa-globe"></i>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-5">
            <div className="tm-details-thumb" style={{position: 'relative', overflow: 'hidden'}}>
              <Image 
                src={item?.image || t_details} 
                alt={`${item?.name || 'Team member'} - ${item?.designation || 'Team member'}`}
                width={500}
                height={500}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
