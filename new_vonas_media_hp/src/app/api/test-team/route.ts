import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';

export async function GET() {
  try {
    if (!sanityClient) {
      return NextResponse.json({ error: 'Sanity client not available' }, { status: 500 });
    }

    console.log('Testing actual website Sanity connection...');
    console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
    console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);

    // Test the exact query the website uses
    const teamMember = await sanityClient.fetch(`
      *[_type == "teamMember" && slug.current == $slug][0]{
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
          category
        }
      }
    `, { slug: 'sarah-johnson' });

    return NextResponse.json({
      success: true,
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      teamMember,
      hasYouTubeChannels: teamMember?.youtubeChannels?.length > 0,
      youtubeChannelsCount: teamMember?.youtubeChannels?.length || 0
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET
    }, { status: 500 });
  }
}
