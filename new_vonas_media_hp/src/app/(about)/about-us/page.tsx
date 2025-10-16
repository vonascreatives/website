import React from "react";
import { Metadata } from "next";
import AboutUsMain from "@/_pages/about/about-us";
import { getAboutPageImages, getBrandCollaborationData, getTeamMembersData } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Vonas Media - About Us",
};

// Force revalidation every 10 seconds during development
export const revalidate = 10;

// Fetch About Us page data from Sanity using existing functions
async function getAboutUsData() {
  try {
    console.log('🔍 ABOUT PAGE: Starting data fetch...');
    
    // Use existing functions from sanity.ts
    const aboutPageImages = await getAboutPageImages();
    console.log('🖼️ About page images fetched:', aboutPageImages ? 'success' : 'failed');
    
    const brandCollaborations = await getBrandCollaborationData();
    console.log('🤝 Brand collaborations fetched:', Array.isArray(brandCollaborations) ? `${brandCollaborations.length} items` : 'failed');
    
    const teamMembers = await getTeamMembersData();
    console.log('👥 Team members fetched:', Array.isArray(teamMembers) ? `${teamMembers.length} items` : 'failed');
    console.log('👥 First team member:', teamMembers?.[0]?.name || 'No team members');
    
    const result = {
      aboutPageImages,
      brandCollaborations,
      teamMembers
    };
    
    console.log('✅ ABOUT PAGE: Data fetch complete');
    console.log('📊 Final team members count:', Array.isArray(result.teamMembers) ? result.teamMembers.length : 'N/A');
    
    return result;
  } catch (error) {
    console.error('❌ Error fetching About Us data:', error);
    return {
      aboutPageImages: {
        heroImages: [{
          _id: 'fallback-hero',
          title: 'About Hero',
          url: '/assets/img/inner-about/hero/hero-1.jpg',
          alt: 'About page hero background'
        }],
        galleryImages: [],
        backgroundShapes: [],
        brandLogos: []
      },
      brandCollaborations: [],
      teamMembers: []
    };
  }
}

const AboutUsPage = async () => {
  const { aboutPageImages, brandCollaborations, teamMembers } = await getAboutUsData();
  
  return (
    <AboutUsMain 
      aboutPageImages={aboutPageImages}
      brandCollaborations={brandCollaborations}
      teamMembers={teamMembers}
    />
  );
};

export default AboutUsPage;
