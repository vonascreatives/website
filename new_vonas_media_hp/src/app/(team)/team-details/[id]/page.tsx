import React from "react";
import { Metadata } from "next";
import TeamDetailsMain from "@/pages/team/team-details";
import { sanityClient } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Vonas Media - Team Member",
};

// Generate static params for team member slugs
export async function generateStaticParams() {
  if (!sanityClient) return [];
  
  try {
    const teamMembers = await sanityClient.fetch(`*[_type == "teamMember"].slug.current`);
    return teamMembers.map((slug: string) => ({
      id: slug,
    }));
  } catch (error) {
    console.error('Error generating team member params:', error);
    return [];
  }
}

// Helper function to generate slug from name
function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Fetch team member data from Sanity
async function getTeamMemberBySlug(slug: string) {
  if (!sanityClient) {
    console.warn('Sanity client not available, using fallback data');
    return {
      id: 1,
      name: 'Team Member',
      image: '/assets/img/home-01/team/team-1-1.jpg',
      designation: 'Team Member',
    };
  }

  try {
    // Strategy 1: Try exact slug match first
    let teamMember = await sanityClient.fetch(
      `*[_type == "teamMember" && slug.current == $slug][0]{
        _id,
        name,
        slug,
        role,
        "photo": photo[0].image.asset->url,
        "photoAlt": photo[0].alt,
        "bioText": bio[0].children[0].text,
        bio,
        socialLinks,
        email,
        order,
        "youtubeChannels": youtubeChannels[]->{
          _id,
          channel_name,
          slug,
          cta_button_url,
          category,
          channel_number
        }
      }`,
      { slug }
    );

    // Strategy 2: If not found, try to find by name-generated slug
    if (!teamMember) {
      const allTeamMembers = await sanityClient.fetch(
        `*[_type == "teamMember"]{
          _id,
          name,
          slug,
          role,
          "photo": photo[0].image.asset->url,
          "photoAlt": photo[0].alt,
          "bioText": bio[0].children[0].text,
          bio,
          socialLinks,
          email,
          order,
          "youtubeChannels": youtubeChannels[]->{
            _id,
            channel_name,
            slug,
            cta_button_url,
            category,
            channel_number
          }
        }`
      );
      
      // Find by matching generated slug from name
      teamMember = allTeamMembers.find((member: any) => {
        const generatedSlug = generateSlugFromName(member.name || '');
        return generatedSlug === slug;
      });
      
      // Strategy 3: Handle common slug variations
      if (!teamMember) {
        const slugVariations = {
          'sarah-johnson': 'sarah-johnson-clean',
          'emily-rodriguez': null // This person doesn't exist
        };
        
        const actualSlug = slugVariations[slug as keyof typeof slugVariations];
        if (actualSlug) {
          teamMember = await sanityClient.fetch(
            `*[_type == "teamMember" && slug.current == $actualSlug][0]{
              _id,
              name,
              slug,
              role,
              "photo": photo[0].image.asset->url,
              "photoAlt": photo[0].alt,
              "bioText": bio[0].children[0].text,
              bio,
              socialLinks,
              email,
              order,
              "youtubeChannels": youtubeChannels[]->{
                _id,
                channel_name,
                slug,
                cta_button_url,
                category,
                channel_number
              }
            }`,
            { actualSlug }
          );
        }
      }
    }

    if (!teamMember) {
      return null;
    }

    // Transform to match expected interface
    return {
      id: teamMember.order || 1,
      name: teamMember.name,
      image: teamMember.photo || '/assets/img/home-01/team/team-1-1.jpg',
      designation: teamMember.role || 'Team Member',
      bio: teamMember.bioText,
      email: teamMember.email,
      socialLinks: teamMember.socialLinks,
      youtubeChannels: teamMember.youtubeChannels || [],
      _id: teamMember._id,
      slug: teamMember.slug
    };
  } catch (error) {
    console.error('Error fetching team member:', error);
    return null;
  }
}

export default async function TeamDetailsPage({params}: {params: { id: string }}) {
  const teamMember = await getTeamMemberBySlug(params.id);
  
  return teamMember ? (
    <TeamDetailsMain item={teamMember} />
  ) : (
    <div className="text-center pt-100">
      <h2>Team Member Not Found</h2>
      <p>No team member found with slug: {params.id}</p>
      <a href="/about-us" className="tp-btn">Back to About</a>
    </div>
  );
}
