import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { logger } from '@/utils/logger'

// Create Sanity client only if valid project ID exists
function createSanityClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  // Try write token first, then read token as fallback
  const token = process.env.SANITY_WRITE_TOKEN || process.env.NEXT_PUBLIC_SANITY_READ_TOKEN;


  // Only create client if we have a valid project ID
  if (projectId && /^[a-z0-9-]+$/.test(projectId)) {
    const client = createClient({
      projectId,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
      useCdn: false, // Disable CDN for fresh data
      token: token, // Add read token if available
    });
    return client;
  }

  return null;
}

export const sanityClient = createSanityClient();

// Image URL builder
const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

// Helper function to generate image URLs from Sanity image references
export function urlFor(source: SanityImageSource) {
  if (!builder) {
    console.error('No Sanity image builder available');
    return null;
  }
  return builder.image(source);
}

// Helper function to get image URL from Sanity image object
export function getSanityImageUrl(image: any, width?: number, height?: number, bustCache: boolean = true): string {
  if (!image?.asset?._ref) {
    return '/assets/img/placeholder.jpg'; // Fallback image
  }

  try {
    const urlBuilder = urlFor(image);
    if (!urlBuilder) {
      return '/assets/img/placeholder.jpg';
    }

    let url = urlBuilder.auto('format').quality(90);

    if (width && height) {
      url = url.width(width).height(height).fit('crop');
    } else if (width) {
      url = url.width(width);
    } else if (height) {
      url = url.height(height);
    }

    const baseUrl = url.url();
    if (!baseUrl) {
      return '/assets/img/placeholder.jpg';
    }

    // Add cache-busting parameter to force browsers to fetch updated images
    // This ensures that when images are replaced in Sanity, the new version is loaded
    if (bustCache) {
      const separator = baseUrl.includes('?') ? '&' : '?';
      // Use a daily timestamp to balance cache freshness with CDN efficiency
      const cacheBuster = Math.floor(Date.now() / (1000 * 60 * 60 * 24)); // Changes once per day
      return `${baseUrl}${separator}v=${cacheBuster}`;
    }

    return baseUrl;
  } catch (error) {
    console.error('Error generating Sanity image URL:', error);
    return '/assets/img/placeholder.jpg';
  }
}

// Helper function to fetch data - CMS ONLY mode when fallback is empty array
export async function fetchSanityData(query: string, params: any = {}, fallback: any = null) {

  try {
    if (!sanityClient || !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      console.error('Sanity client or project ID is not available');

      // In CMS-ONLY mode, return empty array instead of fallback
      if (Array.isArray(fallback) && fallback.length === 0) {
        console.debug('CMS-ONLY mode: returning empty array');
        return [];
      }
      return fallback;
    }

    const data = await sanityClient.fetch(query, params);

    const result = data || (Array.isArray(fallback) && fallback.length === 0 ? [] : fallback);
    return result;
  } catch (error) {
    console.error('Error fetching Sanity data:', error);
    // In CMS-ONLY mode, return empty array instead of fallback
    if (Array.isArray(fallback) && fallback.length === 0) {
      return [];
    }
    return fallback;
  }
}

// Homepage static images from Sanity (1 Page 1 Folder structure)
export async function getHomepageImages() {
  const query = `{
    "heroImages": *[_type == "homepageImage" && folder == "Section 1 Page 1" && category == "Hero Section"]{
      _id,
      title,
      "url": image.asset->url,
      alt,
      originalPath,
      folder,
      priority
    },
    "serviceIcons": *[_type == "homepageImage" && folder == "Section 1 Page 1" && category == "Service Section"]{
      _id,
      title,
      "url": image.asset->url,
      alt,
      originalPath,
      folder,
      priority
    },
    "awardImages": *[_type == "homepageImage" && folder == "Section 1 Page 1" && category == "Award Section"]{
      _id,
      title,
      "url": image.asset->url,
      alt,
      originalPath,
      folder
    },
    "footerElements": *[_type == "homepageImage" && folder == "Section 1 Page 1" && category == "Footer Section"]{
      _id,
      title,
      "url": image.asset->url,
      alt,
      originalPath,
      folder
    },
    "projectBackground": *[_type == "homepageImage" && folder == "Section 1 Page 1" && category == "Background Images"][0]{
      _id,
      title,
      "url": image.asset->url,
      alt,
      folder
    },
    "projectShape": *[_type == "homepageImage" && folder == "Section 1 Page 1" && title match "Project Text Shape"][0]{
      _id,
      title,
      "url": image.asset->url,
      alt,
      folder
    }
  }`;

  const fallback = {
    heroImages: [],
    serviceIcons: [],
    awardImages: [],
    footerElements: [],
    projectBackground: null,
    projectShape: null
  };

  return fetchSanityData(query, {}, fallback);
}

// Brand Collaboration data for homepage
export async function getBrandCollaborationData() {
  const query = `*[_type == "brandCollaboration" && status == "active"]{
    _id,
    brandName,
    "logo": logo[0].image.asset->url,
    "logoAlt": logo[0].alt,
    slug
  } | order(_createdAt desc)`;

  const fallback = [
    {
      _id: 'brand-1',
      brandName: 'Sample Brand 1',
      logo: '/assets/img/home-01/brand/brand-1.png',
      logoAlt: 'Sample Brand 1 Logo'
    }
  ];

  return fetchSanityData(query, {}, fallback);
}

// YouTube Channels data for homepage project section (max 10)
export async function getYouTubeChannelsForHomepage() {
  const query = `*[_type == "youtubeId"]{
    _id,
    channel_number,
    category,
    channel_name,
    "heroImage": select(
      defined(heroImage[0].image.asset) => {
        "url": heroImage[0].image.asset->url,
        "alt": coalesce(heroImage[0].alt, heroImage[0].image.alt, channel_name)
      },
      defined(heroImage[0].asset) => {
        "url": heroImage[0].asset->url,
        "alt": coalesce(heroImage[0].alt, channel_name)
      },
      defined(heroImage.image.asset) => {
        "url": heroImage.image.asset->url,
        "alt": coalesce(heroImage.alt, channel_name)
      },
      defined(heroImage.asset) => {
        "url": heroImage.asset->url,
        "alt": coalesce(heroImage.alt, channel_name)
      }
    ),
    "image": coalesce(
      heroImage[0].image.asset->url,
      heroImage[0].asset->url,
      heroImage.image.asset->url,
      heroImage.asset->url,
      logoImage[0].image.asset->url,
      thumbnailExample[0].image.asset->url,
      visual_identity_images[0].image.asset->url
    ),
    "imageAlt": coalesce(
      heroImage[0].alt,
      heroImage.alt,
      heroImage[0].image.alt,
      heroImage.image.alt,
      logoImage[0].alt,
      thumbnailExample[0].alt,
      visual_identity_images[0].alt,
      channel_name
    ),
    cta_button_url,
    channel,
    date_started,
    slug
  } | order(channel_number asc)[0...9]`;

  const fallback = [
    {
      _id: 'youtube-1',
      channel_number: '01',
      category: 'Entertainment',
      channel_name: 'Sample Channel',
      heroImage: {
        url: '/assets/img/home-01/project/project-1-1.jpg',
        alt: 'Sample Channel'
      },
      image: '/assets/img/home-01/project/project-1-1.jpg',
      imageAlt: 'Sample Channel',
      cta_button_url: '#',
      channel: 'Creator Name',
      slug: { current: 'sample-channel' }
    }
  ];

  return fetchSanityData(query, {}, fallback);
}

// Home page data
export async function getHomeData() {
  const query = `{
    "hero": {
      "subtitle": "Hey Creators! We're",
      "mainTitle": "Content Channel Lab",
      "description": "Bold digital channel builders partnering with creators and brands that make content with impact. We build formats that scale—stories that stick like culture itself."
    },
    "services": {
      "subtitle": "We Build Bold",
      "title": "Content Formats",
      "buttonText": "View Our Work"
    }
  }`;

  const fallback = {
    hero: {
      subtitle: "Hey Creators! We're",
      mainTitle: "Content Channel Lab",
      description: "Bold digital channel builders partnering with creators and brands that make content with impact. We build formats that scale—stories that stick like culture itself."
    },
    services: {
      subtitle: "We Build Bold",
      title: "Content Formats",
      buttonText: "View Our Work"
    }
  };

  return fetchSanityData(query, {}, fallback);
}

// About page data
export async function getAboutData() {
  const query = `{
    "hero": coalesce(
      *[_type == "aboutPage" && defined(status) && status == "published"][0]{
        heroSubtitle,
        heroTitle,
        heroDescription
      },
      {
        "heroSubtitle": "Content channel lab",
        "heroTitle": "Building Channel Culture",
        "heroDescription": "Digital content with maximum cultural impact"
      }
    ),
    "content": coalesce(
      *[_type == "aboutPage" && defined(status) && status == "published"][0]{
        introParagraph,
        values,
        mission,
        vision
      },
      {
        "introParagraph": "We are a content-first media lab that specializes in building bold digital channels and formats for creators and brands.",
        "values": [
          {
            "title": "Bold Formats",
            "description": "We experiment with storytelling formats that capture attention and retain audiences."
          },
          {
            "title": "Creator Partnerships",
            "description": "We collaborate with creators to build sustainable content ecosystems."
          },
          {
            "title": "Data-Driven Decisions",
            "description": "Every programming decision is backed by research, analytics, and audience insights."
          }
        ],
        "mission": "Build and scale digital channels that feel like culture itself.",
        "vision": "Become the go-to studio for creators and brands designing the next generation of content formats."
      }
    )
  }`;

  const fallback = {
    hero: {
      heroSubtitle: "Content channel lab",
      heroTitle: "Building Channel Culture",
      heroDescription: "Digital content with maximum cultural impact"
    },
    content: {
      introParagraph:
        "We are a content-first media lab that specializes in building bold digital channels and formats for creators and brands.",
      values: [
        {
          title: "Bold Formats",
          description: "We experiment with storytelling formats that capture attention and retain audiences."
        },
        {
          title: "Creator Partnerships",
          description: "We collaborate with creators to build sustainable content ecosystems."
        },
        {
          title: "Data-Driven Decisions",
          description: "Every programming decision is backed by research, analytics, and audience insights."
        }
      ],
      mission: "Build and scale digital channels that feel like culture itself.",
      vision: "Become the go-to studio for creators and brands designing the next generation of content formats."
    }
  };

  return fetchSanityData(query, {}, fallback);
}

// Channels data (uses YouTube ID collection for channels page)
export async function getChannelsData() {
  const query = `*[_type == "youtubeId"] | order(channel_number asc) {
    _id,
    channel_number,
    category,
    channel_name,
    "name": channel_name,
    slug,
    "image": coalesce(
      visual_identity_images[0].image.asset->url,
      heroImage[0].image.asset->url,
      logoImage[0].image.asset->url,
      thumbnailExample[0].image.asset->url
    ),
    "imageAlt": coalesce(
      visual_identity_images[0].alt,
      heroImage[0].alt,
      logoImage[0].alt,
      thumbnailExample[0].alt,
      channel_name
    ),
    "about": coalesce(
      intro_description[0].children[0].text, 
      "Discover " + channel_name + " - engaging content that connects with audiences."
    ),
    channel,
    date_started,
    focus,
    cta_button_url
  }`;

  const fallback = [
    {
      _id: '1',
      name: 'Off the Record',
      slug: { current: 'off-the-record' },
      image: '/assets/img/home-01/project/project-1-1.jpg',
      imageAlt: 'Off the Record channel logo',
      about: 'Unfiltered life stories from the Philippines.',
      category: 'entertainment',
      country: 'Philippines',
      language: 'en',
      metrics: [
        { platform: 'youtube', followers: 120000, views: 2000000 },
        { platform: 'tiktok', followers: 85000, views: 500000 }
      ],
      tags: ['documentary', 'lifestyle', 'philippines']
    },
    {
      _id: '2',
      name: 'FRMWRKD',
      slug: { current: 'frmwrkd' },
      image: '/assets/img/home-01/project/project-1-2.jpg',
      imageAlt: 'FRMWRKD channel logo',
      about: 'Smart takes on sales, marketing, and operations.',
      category: 'business',
      country: 'Philippines',
      language: 'en',
      metrics: [
        { platform: 'youtube', followers: 85000, views: 1500000 },
        { platform: 'instagram', followers: 45000, views: 800000 }
      ],
      tags: ['business', 'marketing', 'sales']
    },
    {
      _id: '3',
      name: 'Island Influencers',
      slug: { current: 'island-influencers' },
      image: '/assets/img/home-01/project/project-1-3.jpg',
      imageAlt: 'Island Influencers channel logo',
      about: 'Conversations with creators shaping tomorrow.',
      category: 'education',
      country: 'Philippines',
      language: 'en',
      metrics: [
        { platform: 'youtube', followers: 95000, views: 1200000 },
        { platform: 'spotify', followers: 25000, views: 300000 }
      ],
      tags: ['interviews', 'creators', 'culture']
    }
  ];

  return fetchSanityData(query, {}, fallback);
}

// Exclusive Creators data - unified collection
export async function getCreatorsData() {
  // Query both `exclusiveCreator` and legacy `creator` types and normalize fields
  const query = `*[_type in ["exclusiveCreator", "creator"]]{
    _id,
    _type,
    name,
    slug,
    // headline may exist on exclusiveCreator; fallback to niche/headline-like text
    "headline": coalesce(headline, niche, mainCategory),
    // Normalize images from different schemas
    "image": coalesce(
      heroImage[0].image.asset->url,
      heroImage.image.asset->url,
      image.asset->url,
      heroImage[0].asset->url
    ),
    "imageAlt": coalesce(
      heroImage[0].alt,
      heroImage.alt,
      image.alt,
      name
    ),
    // Normalize category/niche fields
    "mainCategory": coalesce(niche, mainCategory),
    "niches": coalesce(niches, [coalesce(niche, mainCategory)]),
    // Platform and follower fields normalized across both types
    "mainPlatform": coalesce(mainPlatform, "youtube"),
    "totalFollowers": coalesce(totalFollowers, followers, subscribers),
    "followers": coalesce(subscribers, followers, totalFollowers),
    socialLinks,
    availability,
    featured,
    verified,
    location,
    exclusiveContent,
    joinDate,
    bio
  } | order(featured desc, name asc)`;

  return fetchSanityData(query, {}, []);
}

// Company Stats (calculated from other collections or separate doc)
export async function getCompanyStats() {
  // This could either be calculated from existing data or from a separate stats document
  const query = `{
    "totalChannels": count(*[_type == "channel"]),
    "totalCreators": count(*[_type == "creator"]),
    "totalFollowers": 2500000,
    "totalViews": 50000000
  }`;

  const fallback = {
    totalChannels: 15,
    totalCreators: 25,
    totalFollowers: 2500000,
    totalViews: 50000000
  };

  return fetchSanityData(query, {}, fallback);
}

// Helper function to generate slug from channel name (client-side)
function generateSlugFromName(channelName: string): string {
  return channelName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// YouTube Channel Details (for channel detail pages)
export async function getYouTubeChannelById(slug: string) {
  if (!sanityClient) {
    // Return fallback immediately if no Sanity client
    return {
      _id: 'fallback-youtube-channel',
      channel_number: '01',
      category: 'Content',
      channel_name: 'Sample Channel',
      intro_description: null,
      cta_button_url: '#',
      channel: 'Creator Name',
      date_started: new Date().toISOString().split('T')[0],
      focus: [],
      share_links: {},
      visual_identity_subtitle: null,
      visual_identity_description: null,
      visual_identity_bullets: [],
      typography: [],
      colors: [],
      visual_identity_images: [],
      concept_subtitle: null,
      concept_text_block_1: null,
      concept_text_block_2: null,
      concept_images: []
    };
  }

  const baseFields = `
    _id,
    channel_number,
    category,
    channel_name,
    "intro_description_text": intro_description[0].children[0].text,
    intro_description,
    cta_button_url,
    channel,
    date_started,
    focus,
    share_links,
    visual_identity_subtitle,
    "visual_identity_description_text": visual_identity_description[0].children[0].text,
    visual_identity_description,
    visual_identity_bullets,
    typography,
    colors,
    "visual_identity_images": visual_identity_images[]{
      "url": image.asset->url,
      "alt": alt
    },
    concept_subtitle,
    "concept_text_block_1_text": concept_text_block_1[0].children[0].text,
    concept_text_block_1,
    concept_text_block_2,
    "concept_images": concept_images[]{
      "url": image.asset->url,
      "alt": alt
    }`;

  try {
    // Strategy 1: Try exact slug match first
    let result = await sanityClient.fetch(
      `*[_type == "youtubeId" && slug.current == $slug][0]{${baseFields}}`,
      { slug }
    );

    if (result) {
      return result;
    }

    // Strategy 2: Get all channels and find by generated slug (client-side matching)
    const allChannels = await sanityClient.fetch(
      `*[_type == "youtubeId"]{_id, channel_name, slug, ${baseFields}}`
    );

    // Find channel by matching generated slug
    const matchedChannel = allChannels.find((channel: any) => {
      const generatedSlug = generateSlugFromName(channel.channel_name || '');
      return generatedSlug === slug;
    });

    if (matchedChannel) {
      return matchedChannel;
    }

    // Strategy 3: Try partial name matching as last resort
    const searchTerm = slug.replace(/-/g, ' ');
    result = await sanityClient.fetch(
      `*[_type == "youtubeId" && lower(channel_name) match lower($searchTerm)][0]{${baseFields}}`,
      { searchTerm: `*${searchTerm}*` }
    );

    if (result) {
      return result;
    }

  } catch (error) {
    console.error('Error fetching channel:', error);
  }

  // Final fallback - return null to indicate no channel found
  return null;
}

// Get channel navigation (next/previous)
export async function getChannelNavigation(currentSlug: string) {
  if (!sanityClient) {
    return { prevChannel: null, nextChannel: null };
  }

  try {
    // Get all channels ordered by channel_number
    const allChannels = await sanityClient.fetch(
      `*[_type == "youtubeId"] | order(channel_number asc) {
        _id,
        channel_name,
        slug,
        channel_number
      }`
    );

    // Find current channel index
    let currentIndex = -1;

    // Try to find by exact slug first
    currentIndex = allChannels.findIndex((ch: any) => ch.slug?.current === currentSlug);

    // If not found, try by generated slug
    if (currentIndex === -1) {
      currentIndex = allChannels.findIndex((ch: any) => {
        const generatedSlug = generateSlugFromName(ch.channel_name || '');
        return generatedSlug === currentSlug;
      });
    }

    if (currentIndex === -1) {
      return { prevChannel: null, nextChannel: null };
    }

    // Get previous and next channels
    const prevChannel = currentIndex > 0 ? allChannels[currentIndex - 1] : null;
    const nextChannel = currentIndex < allChannels.length - 1 ? allChannels[currentIndex + 1] : null;

    // Generate slugs for navigation
    const formatChannelForNav = (channel: any) => {
      if (!channel) return null;
      return {
        name: channel.channel_name,
        slug: channel.slug?.current || generateSlugFromName(channel.channel_name || ''),
        channel_number: channel.channel_number
      };
    };

    const navigation = {
      prevChannel: formatChannelForNav(prevChannel),
      nextChannel: formatChannelForNav(nextChannel)
    };

    return navigation;
  } catch (error) {
    console.error('❌ Error fetching channel navigation:', error);
    return { prevChannel: null, nextChannel: null };
  }
}

// Get Operations Manager for blog author sections
export async function getOperationsManager() {
  const query = `*[_type == "teamMember" && role match "*Operations Manager*"][0]{
    _id,
    name,
    slug,
    "image": photo[0].image.asset->url,
    "photoAlt": photo[0].alt,
    role,
    bio,
    socialLinks,
    email
  }`;

  const fallback = {
    _id: 'ops-manager-fallback',
    name: 'Operations Manager',
    image: '/assets/img/home-01/team/team-1-1.jpg',
    photoAlt: 'Operations Manager',
    role: 'Operations Manager',
    bio: [
      {
        _type: 'block',
        children: [
          { text: 'Managing operations and ensuring smooth execution of all projects.' }
        ]
      }
    ],
    email: null,
    socialLinks: null
  };

  try {
    const result = await fetchSanityData(query, {}, fallback);
    return result;
  } catch (error) {
    console.error('Error fetching Operations Manager:', error);
    return fallback;
  }
}

// Team Members (internal company team)
export async function getTeamMembersData() {

  const query = `*[_type == "teamMember"] | order(order asc){
    _id,
    name,
    slug,
    "photo": photo[0].image.asset->url,
    "photoAlt": photo[0].alt,
    role,
    "bioText": bio[0].children[0].text,
    bio,
    socialLinks,
    email,
    order
  }`;


  const fallback = [
    {
      _id: '1',
      name: 'Miguel Santos',
      slug: { current: 'miguel-santos' },
      photo: '/assets/img/home-01/team/team-1-1.jpg',
      photoAlt: 'Miguel Santos - Creative Director',
      role: 'Creative Director',
      bioText: 'Leading creative strategy and visual direction for all channel projects.',
      bio: 'Leading creative strategy and visual direction for all channel projects.',
      email: 'miguel@vonas-media.com',
      order: 1
    },
    {
      _id: '2',
      name: 'Ana Reyes',
      slug: { current: 'ana-reyes' },
      photo: '/assets/img/home-01/team/team-1-2.jpg',
      photoAlt: 'Ana Reyes - Head of Content',
      role: 'Head of Content',
      bioText: 'Overseeing content strategy and creator partnerships across all channels.',
      bio: 'Overseeing content strategy and creator partnerships across all channels.',
      email: 'ana@vonas-media.com',
      order: 2
    },
    {
      _id: '3',
      name: 'Carlos Mendoza',
      slug: { current: 'carlos-mendoza' },
      photo: '/assets/img/home-01/team/team-1-3.jpg',
      photoAlt: 'Carlos Mendoza - Technical Producer',
      role: 'Technical Producer',
      bioText: 'Managing technical aspects of video production and channel optimization.',
      bio: 'Managing technical aspects of video production and channel optimization.',
      email: 'carlos@vonas-media.com',
      order: 3
    }
  ];

  return fetchSanityData(query, {}, fallback);
}

// News/Blog data
export async function getNewsData() {
  const query = `*[_type == "post" && publishedAt != null] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    category,
    categories,
    tags,
    "heroImage": heroImage[0].image.asset->url,
    "heroImageAlt": heroImage[0].alt,
    "author": author->{
      name,
      "slug": slug.current,
      "photo": photo[0].image.asset->url,
      role
    },
    body,
    "readTime": length(body[_type == "block"].children[].text) / 200,
    seo
  }`;

  const fallback = [
    {
      _id: '1',
      title: 'The Future of Content Creation in 2024',
      slug: { current: 'future-of-content-creation-2024' },
      excerpt: 'Exploring how millennial content creators are revolutionizing the digital landscape with authentic storytelling and innovative formats.',
      publishedAt: '2024-01-15T10:00:00Z',
      category: 'technology',
      categories: ['content', 'technology', 'creators'],
      heroImage: '/assets/img/blog/blog-1-1.jpg',
      heroImageAlt: 'Content creation workspace',
      author: {
        name: 'Vonas Team',
        slug: 'vonas-team',
        photo: '/assets/img/team/author-1.jpg',
        role: 'Content Strategy'
      },
      body: [
        {
          _type: 'block',
          children: [{ text: 'The digital content landscape is experiencing a seismic shift, and creators are at the forefront of this transformation...' }]
        }
      ],
      readTime: 5
    },
    {
      _id: '2',
      title: 'Building Authentic Brand Partnerships',
      slug: { current: 'building-authentic-brand-partnerships' },
      excerpt: 'How modern businesses are adapting to work with content creators and influencers in the new digital economy.',
      publishedAt: '2024-01-10T14:30:00Z',
      category: 'business',
      categories: ['business', 'partnerships', 'strategy'],
      heroImage: '/assets/img/blog/blog-1-2.jpg',
      heroImageAlt: 'Business partnership meeting',
      author: {
        name: 'Vonas Team',
        slug: 'vonas-team',
        photo: '/assets/img/team/author-2.jpg',
        role: 'Business Development'
      },
      body: [
        {
          _type: 'block',
          children: [{ text: 'The creator economy has disrupted traditional business models across industries...' }]
        }
      ],
      readTime: 7
    }
  ];

  return fetchSanityData(query, {}, fallback);
}

// Single news article by slug
export async function getNewsArticleBySlug(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    category,
    categories,
    tags,
    "heroImage": heroImage[0].image.asset->url,
    "heroImageAlt": heroImage[0].alt,
    "author": author->{
      name,
      "slug": slug.current,
      "photo": photo[0].image.asset->url,
      "photoAlt": photo[0].alt,
      role,
      bio
    },
    body,
    "readTime": length(body[_type == "block"].children[].text) / 200,
    seo
  }`;

  const fallback = {
    _id: 'fallback-article',
    title: 'Sample News Article',
    slug: { current: slug },
    excerpt: 'This is a sample news article from our content team.',
    publishedAt: '2024-01-15T10:00:00Z',
    category: 'technology',
    categories: ['content', 'technology'],
    heroImage: '/assets/img/blog/blog-1-1.jpg',
    heroImageAlt: 'Sample news article hero image',
    author: {
      name: 'Vonas Team',
      slug: 'vonas-team',
      photo: '/assets/img/team/author-1.jpg',
      photoAlt: 'Vonas Team member',
      role: 'Content Strategy',
      bio: 'Our content strategy team creates insightful articles about the creator economy.'
    },
    body: [
      {
        _type: 'block',
        children: [{ text: 'This is a sample article showcasing our content capabilities...' }]
      }
    ],
    readTime: 5,
    seo: null
  };

  return fetchSanityData(query, { slug }, fallback);
}

// Knowledge Base data (for documentation-style content)
export async function getKnowledgeBaseData() {
  const query = `*[_type == "knowledgeBase"] | order(_createdAt desc){
    _id,
    title,
    slug,
    "excerpt": summary,
    "content": body[]{
      ...,
      _type == "image" => {
        ...,
        "url": asset->url,
        "alt": alt
      }
    },
    "category": topic,
    parentCategory,
    subCategory,
    nestingLevel,
    tags,
    "lastUpdated": _updatedAt,
    "order": 1,
    "featured": false,
    "difficulty": "Beginner",
    "readTime": 5,
    "author": "Vonas Team"
  }`;

  const fallback = [
    {
      _id: '1',
      title: 'Content Strategy Framework',
      slug: { current: 'content-strategy-framework' },
      excerpt: 'Our systematic approach to building content that scales and converts.',
      content: [
        {
          _type: 'block',
          children: [
            {
              text: 'Content strategy is the backbone of successful channel building. Our framework focuses on three core principles: audience understanding, format optimization, and cultural resonance.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ text: 'The Three Pillars' }]
        },
        {
          _type: 'block',
          children: [
            {
              text: '1. Audience Understanding: Deep research into viewer behavior, consumption patterns, and cultural context.'
            }
          ]
        },
        {
          _type: 'block',
          children: [
            {
              text: '2. Format Optimization: Testing and refining content structures for maximum engagement and retention.'
            }
          ]
        },
        {
          _type: 'block',
          children: [
            {
              text: '3. Cultural Resonance: Creating content that speaks to shared experiences and cultural moments.'
            }
          ]
        }
      ],
      category: 'Strategy',
      tags: ['content', 'strategy', 'framework'],
      lastUpdated: '2024-01-20',
      order: 1,
      featured: true,
      difficulty: 'Intermediate',
      readTime: 8,
      author: 'Vonas Strategy Team'
    },
    {
      _id: '2',
      title: 'Channel Launch Playbook',
      slug: { current: 'channel-launch-playbook' },
      excerpt: 'Step-by-step guide to launching channels that capture attention from day one.',
      content: [
        {
          _type: 'block',
          children: [
            {
              text: 'Launching a channel is more than just uploading content. It requires strategic positioning, audience preparation, and format validation.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ text: 'Pre-Launch Checklist' }]
        },
        {
          _type: 'block',
          children: [
            {
              text: '• Brand identity and visual assets ready\n• Content pipeline with 10+ pieces prepared\n• Community engagement strategy defined\n• Platform-specific optimization complete\n• Analytics and tracking systems in place'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ text: 'Launch Week Strategy' }]
        },
        {
          _type: 'block',
          children: [
            {
              text: 'The first week determines momentum. Focus on consistent posting, community building, and rapid iteration based on early feedback.'
            }
          ]
        }
      ],
      category: 'Launch',
      tags: ['launch', 'channels', 'playbook'],
      lastUpdated: '2024-01-18',
      order: 2,
      featured: true,
      difficulty: 'Beginner',
      readTime: 12,
      author: 'Vonas Launch Team'
    },
    {
      _id: '3',
      title: 'Creator Collaboration Guidelines',
      slug: { current: 'creator-collaboration-guidelines' },
      excerpt: 'Best practices for brands working with content creators on authentic partnerships.',
      content: [
        {
          _type: 'block',
          children: [
            {
              text: 'Successful creator partnerships require mutual respect, clear communication, and shared creative vision. Here are our proven guidelines.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ text: 'Partnership Principles' }]
        },
        {
          _type: 'block',
          children: [
            {
              text: 'Trust the creator\'s audience understanding. They know what resonates. Your role is to provide brand context and objectives, not dictate creative execution.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ text: 'Communication Framework' }]
        },
        {
          _type: 'block',
          children: [
            {
              text: '1. Brief collaboratively, not dictatorially\n2. Set clear expectations for deliverables and timeline\n3. Build in creative review cycles\n4. Respect the creator\'s brand voice\n5. Measure success through engagement, not just reach'
            }
          ]
        }
      ],
      category: 'Collaboration',
      tags: ['creators', 'brands', 'partnerships'],
      lastUpdated: '2024-01-15',
      order: 3,
      featured: false,
      difficulty: 'Intermediate',
      readTime: 6,
      author: 'Vonas Partnership Team'
    },
    {
      _id: '4',
      title: 'Video Production Essentials',
      slug: { current: 'video-production-essentials' },
      excerpt: 'Technical and creative fundamentals for producing content that stands out.',
      content: [
        {
          _type: 'block',
          children: [
            {
              text: 'Great video content combines technical excellence with creative storytelling. Here are the non-negotiables for professional production.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ text: 'Technical Standards' }]
        },
        {
          _type: 'block',
          children: [
            {
              text: '• 4K recording minimum (1080p export)\n• Clean audio with external recording\n• Color correction and grading workflow\n• Consistent lighting setup\n• Stable footage with proper framing'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ text: 'Creative Elements' }]
        },
        {
          _type: 'block',
          children: [
            {
              text: 'Strong opening hook, clear narrative structure, visual variety, pacing that matches content type, and memorable closing.'
            }
          ]
        }
      ],
      category: 'Production',
      tags: ['video', 'production', 'technical'],
      lastUpdated: '2024-01-12',
      order: 4,
      featured: false,
      difficulty: 'Advanced',
      readTime: 10,
      author: 'Vonas Production Team'
    },
    {
      _id: '5',
      title: 'Adobe Premiere Pro Essentials',
      slug: { current: 'adobe-premiere-pro-essentials' },
      excerpt: 'Master the fundamentals of Adobe Premiere Pro for professional video editing.',
      content: [
        {
          _type: 'block',
          children: [
            {
              text: 'Adobe Premiere Pro is the industry standard for video editing. This comprehensive guide covers essential tools and workflows for efficient editing.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ text: 'Project Setup & Organization' }]
        },
        {
          _type: 'block',
          children: [
            {
              text: 'Proper project organization is crucial. Create bins for footage, audio, graphics, and sequences. Use consistent naming conventions.'
            }
          ]
        }
      ],
      category: 'Production',
      parentCategory: 'postproduction',
      subCategory: 'editing',
      nestingLevel: 3,
      tags: ['premiere pro', 'editing', 'software'],
      lastUpdated: '2024-01-15',
      order: 5,
      featured: false,
      difficulty: 'Intermediate',
      readTime: 12,
      author: 'Vonas Post-Production Team'
    },
    {
      _id: '6',
      title: 'Final Cut Pro Advanced Techniques',
      slug: { current: 'final-cut-pro-advanced' },
      excerpt: 'Advanced editing techniques and workflows for Final Cut Pro users.',
      content: [
        {
          _type: 'block',
          children: [
            {
              text: 'Take your Final Cut Pro skills to the next level with advanced techniques for multicam editing, color correction, and audio mixing.'
            }
          ]
        }
      ],
      category: 'Production',
      parentCategory: 'postproduction',
      subCategory: 'editing',
      nestingLevel: 3,
      tags: ['final cut pro', 'editing', 'advanced'],
      lastUpdated: '2024-01-14',
      order: 6,
      featured: true,
      difficulty: 'Advanced',
      readTime: 15,
      author: 'Vonas Post-Production Team'
    },
    {
      _id: '7',
      title: 'Audio Mixing Fundamentals',
      slug: { current: 'audio-mixing-fundamentals' },
      excerpt: 'Essential audio mixing techniques for video content creators.',
      content: [
        {
          _type: 'block',
          children: [
            {
              text: 'Great audio can make or break your video content. Learn the fundamentals of mixing dialogue, music, and sound effects.'
            }
          ]
        }
      ],
      category: 'Production',
      parentCategory: 'postproduction',
      subCategory: 'audio',
      nestingLevel: 3,
      tags: ['audio', 'mixing', 'post-production'],
      lastUpdated: '2024-01-13',
      order: 7,
      featured: false,
      difficulty: 'Intermediate',
      readTime: 10,
      author: 'Vonas Audio Team'
    },
    {
      _id: '8',
      title: 'Analytics & Performance Tracking',
      slug: { current: 'analytics-performance-tracking' },
      excerpt: 'How to measure what matters and optimize content performance effectively.',
      content: [
        {
          _type: 'block',
          children: [
            {
              text: 'Data drives decisions. Here\'s how to track performance metrics that actually inform content strategy and channel growth.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ text: 'Key Metrics Framework' }]
        },
        {
          _type: 'block',
          children: [
            {
              text: 'Focus on engagement rate, watch time, click-through rates, and conversion metrics. Vanity metrics like views and followers matter less than audience behavior.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h3',
          children: [{ text: 'Analysis Tools' }]
        },
        {
          _type: 'block',
          children: [
            {
              text: 'Platform analytics, Google Analytics for web traffic, social listening tools, and custom tracking for specific campaign objectives.'
            }
          ]
        }
      ],
      category: 'Analytics',
      tags: ['analytics', 'performance', 'metrics'],
      lastUpdated: '2024-01-10',
      order: 5,
      featured: false,
      difficulty: 'Intermediate',
      readTime: 7,
      author: 'Vonas Analytics Team'
    }
  ];

  return fetchSanityData(query, {}, fallback);
}

// Channels page homepage images from Sanity CMS
export async function getChannelsPageImages() {
  const query = `{
    "heroImages": *[_type == "homepageImage" && category == "channels-hero" && isActive == true] | order(displayOrder asc) {
      _id,
      title,
      placement,
      "url": image[0].image.asset->url,
      "alt": image[0].alt,
      originalFilename,
      usage,
      notes
    },
    "serviceIcons": *[_type == "homepageImage" && category == "channels-services" && isActive == true] | order(displayOrder asc) {
      _id,
      title,
      placement,
      "url": image[0].image.asset->url,
      "alt": image[0].alt,
      originalFilename,
      usage
    },
    "testimonialImages": *[_type == "homepageImage" && category == "channels-testimonials" && isActive == true] | order(displayOrder asc) {
      _id,
      title,
      placement,
      "url": image[0].image.asset->url,
      "alt": image[0].alt,
      originalFilename,
      usage
    }
  }`;

  const fallback = {
    heroImages: [],
    serviceIcons: [],
    testimonialImages: []
  };

  return fetchSanityData(query, {}, fallback);
}

// About page static images from Sanity (homepageImage with About Us folder)
export async function getAboutPageImages() {
  const query = `{
    "heroImages": *[_type == "homepageImage" && folder == "About Us/images" && category == "Hero Section"] | order(displayOrder asc){
      _id,
      title,
      "url": image[0].image.asset->url,
      "alt": image[0].alt || title,
      placement,
      displayOrder
    },
    "aboutSectionImages": *[_type == "homepageImage" && folder == "About Us/images" && category == "Gallery Section"] | order(displayOrder asc){
      _id,
      title,
      "url": image[0].image.asset->url,
      "alt": image[0].alt || title,
      placement,
      notes,
      displayOrder
    },
    "backgroundShapes": *[_type == "homepageImage" && folder == "About Us/images" && category == "Background Images"] | order(displayOrder asc){
      _id,
      title,
      "url": image[0].image.asset->url,
      "alt": image[0].alt || title,
      placement
    }
  }`;

  const fallback = {
    heroImages: [
      {
        _id: 'fallback-about-hero',
        title: 'About Hero Background',
        url: '/assets/img/inner-about/hero/hero-1.jpg',
        alt: 'About page hero background',
        originalPath: 'assets/img/inner-about/hero/hero-1.jpg',
        placement: 'Hero background',
        displayOrder: 1
      }
    ],
    aboutSectionImages: [
      {
        _id: 'fallback-about-shape',
        title: 'About Shape Decoration',
        url: '/assets/img/inner-about/about/shape-1.png',
        alt: 'About section decorative shape',
        originalPath: 'assets/img/inner-about/about/shape-1.png',
        placement: 'Decorative shape',
        displayOrder: 1
      },
      {
        _id: 'fallback-about-1',
        title: 'About Image 1',
        url: '/assets/img/inner-about/about/about-1.jpg',
        alt: 'About section main image',
        originalPath: 'assets/img/inner-about/about/about-1.jpg',
        placement: 'Main content image',
        displayOrder: 2
      },
      {
        _id: 'fallback-about-2',
        title: 'About Image 2',
        url: '/assets/img/inner-about/about/about-2.jpg',
        alt: 'About section secondary image',
        originalPath: 'assets/img/inner-about/about/about-2.jpg',
        placement: 'Secondary image',
        displayOrder: 3
      },
      {
        _id: 'fallback-about-3',
        title: 'About Image 3',
        url: '/assets/img/inner-about/about/about-3.jpg',
        alt: 'About section tertiary image',
        originalPath: 'assets/img/inner-about/about/about-3.jpg',
        placement: 'Tertiary image',
        displayOrder: 4
      }
    ],
    backgroundShapes: [
      {
        _id: 'fallback-bg-shape',
        title: 'Brand Background Shape',
        url: '/assets/img/inner-about/brand/brand-bg-shape.png',
        alt: 'Brand section background shape',
        originalPath: 'assets/img/inner-about/brand/brand-bg-shape.png',
        placement: 'Background decoration'
      }
    ]
  };

  return fetchSanityData(query, {}, fallback);
}

// Knowledge Base categories for navigation
export async function getKnowledgeBaseCategories() {
  const query = `array::unique(*[_type == "knowledgeBase"].topic)`;

  const fallback = [
    'Strategy',
    'Launch',
    'Collaboration',
    'Production',
    'Analytics'
  ];

  return fetchSanityData(query, {}, fallback);
}

// Creator filter aggregations - CMS only, no fallback
export async function getCreatorFilterData() {
  // Query both exclusiveCreator and creator types for filter options
  const query = `{
    "categories": array::unique(*[_type in ["exclusiveCreator", "creator"]].mainCategory) + array::unique(*[_type in ["exclusiveCreator", "creator"]].niche),
    "platforms": array::unique(*[_type in ["exclusiveCreator", "creator"]].mainPlatform),
    "niches": array::unique(*[_type in ["exclusiveCreator", "creator"]].niches[]),
    "locations": array::unique(*[_type in ["exclusiveCreator", "creator"]].location)
  }`;

  // CMS only - return empty arrays if no data
  const emptyFallback = {
    categories: [],
    platforms: [],
    niches: [],
    locations: []
  };

  return fetchSanityData(query, {}, emptyFallback);
}

// Creators with filters and pagination - CMS only, no fallback
export async function getCreatorsWithFilters({
  mainCategory,
  mainPlatform,
  niche,
  offset = 0,
  limit = 9
}: {
  mainCategory?: string;
  mainPlatform?: string;
  niche?: string;
  offset?: number;
  limit?: number;
} = {}) {
  // Query both exclusiveCreator and creator types
  const query = `*[_type in ["exclusiveCreator", "creator"]
    && (!defined($mainCategory) || niche == $mainCategory || mainCategory == $mainCategory)
    && (!defined($mainPlatform) || mainPlatform == $mainPlatform)
    && (!defined($niche) || $niche in niches[] || niche == $niche)
  ]{
    _id,
    name,
    slug,
    featured,
    "mainCategory": coalesce(niche, mainCategory),
    mainPlatform,
    "image": coalesce(heroImage[0].image.asset->url, heroImage.image.asset->url, image.asset->url),
    "imageAlt": coalesce(heroImage[0].alt, heroImage.alt, image.alt, name),
    "followers": coalesce(subscribers, followers, totalFollowers)
  } | order(featured desc, name asc) [$offset...$end]`;

  const params = {
    mainCategory: mainCategory || undefined,
    mainPlatform: mainPlatform || undefined,
    niche: niche || undefined,
    offset,
    end: offset + limit - 1
  };

  // CMS only - return empty array if no data
  return fetchSanityData(query, params, []);
}

// Single creator detail - query both exclusiveCreator and creator types
export async function getCreatorBySlug(slug: string) {
  const query = `*[_type in ["exclusiveCreator", "creator"] && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    // Normalize headline across both types
    "headline": coalesce(headline, niche, mainCategory),
    // Normalize category fields
    "mainCategory": coalesce(niche, mainCategory),
    "niches": coalesce(niches, [coalesce(niche, mainCategory)]),
    // Pre-resolve image URLs - handle different schema patterns
    "heroImage": coalesce(
      heroImage[]{
        "image": image.asset->url,
        alt
      },
      select(
        defined(heroImage.image.asset) => [{
          "image": heroImage.image.asset->url,
          "alt": heroImage.alt
        }],
        defined(image.asset) => [{
          "image": image.asset->url,
          "alt": image.alt
        }]
      )
    ),
    "gallery": gallery[]{
      "image": image.asset->url,
      alt
    },
    "heroImageAlt": coalesce(heroImage[0].alt, heroImage.alt, image.alt, name),
    bio,
    // Normalize platform field
    "mainPlatform": coalesce(mainPlatform, "youtube"),
    metrics,
    // Handle different follower field names across types
    "totalFollowers": coalesce(totalFollowers, followers, subscribers),
    "followers": coalesce(subscribers, followers, totalFollowers),
    availability,
    languages,
    location,
    selectedWork[]{
      title,
      link,
      "thumb": thumb.image.asset->url,
      "thumbAlt": thumb.alt,
      date,
      "brand": brand->{
        _id,
        _type,
        "name": coalesce(brandName, name, title),
        "slug": slug.current,
        "logo": coalesce(logo[0].image.asset->url, brandLogo[0].image.asset->url, featuredImage[0].image.asset->url),
        website
      }
    },
    socialLinks,
    ratingAverage,
    ratingCount,
    seo,
    // Additional exclusiveCreator fields (will be null for creator type)
    exclusiveContent,
    joinDate,
    verified,
    featured,
    // Portfolio/recent work
    portfolio[]{
      title,
      type,
      "image": image.asset->url,
      alt
    }
  }`;

  // CMS connection is now working properly - no fallback needed
  return fetchSanityData(query, { slug }, null);
}

export async function getAwardsData() {
  const query = `*[_type == "award" && isActive == true] | order(displayOrder asc) {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    awardDate,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    organization,
    category,
    projectUrl,
    description,
    displayOrder,
    featured,
    isActive
  }`;

  // Fetch awards from Sanity CMS with no fallback
  return fetchSanityData(query, {}, []);
}

export async function getUseCasesData() {
  const query = `*[_type == "useCase" && isActive == true] | order(displayOrder asc) {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    "heroImageUrl": heroImage.asset->url,
    "heroImageAlt": heroImage.alt,
    websiteUrl,
    summary,
    client,
    services,
    industry,
    date,
    sections[]{
      sectionTitle,
      goal,
      caseDetails
    },
    "galleryImages": galleryImages[]{
      "url": asset->url,
      alt,
      caption
    },
    "fullWidthImageUrl": fullWidthImage.asset->url,
    "fullWidthImageAlt": fullWidthImage.alt,
    "gridImageLeftUrl": gridImageLeft.asset->url,
    "gridImageLeftAlt": gridImageLeft.alt,
    "gridImageRightUrl": gridImageRight.asset->url,
    "gridImageRightAlt": gridImageRight.alt,
    displayOrder,
    featured,
    tags
  }`;

  return fetchSanityData(query, {}, []);
}

export async function getFeaturedUseCase() {
  const query = `*[_type == "useCase" && isActive == true && featured == true] | order(displayOrder asc)[0]{
    _id,
    title,
    "slug": slug.current,
    subtitle,
    "heroImageUrl": heroImage.asset->url,
    "heroImageAlt": heroImage.alt,
    websiteUrl,
    summary,
    client,
    services,
    industry,
    date,
    sections[]{
      sectionTitle,
      goal,
      caseDetails
    },
    "galleryImages": galleryImages[]{
      "url": asset->url,
      alt,
      caption
    },
    "fullWidthImageUrl": fullWidthImage.asset->url,
    "fullWidthImageAlt": fullWidthImage.alt,
    "gridImageLeftUrl": gridImageLeft.asset->url,
    "gridImageLeftAlt": gridImageLeft.alt,
    "gridImageRightUrl": gridImageRight.asset->url,
    "gridImageRightAlt": gridImageRight.alt,
    displayOrder,
    featured,
    tags
  }`;

  const result = await fetchSanityData(query, {}, null);

  return result;
}

export async function getUseCaseBySlug(slug: string) {
  const query = `*[_type == "useCase" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    subtitle,
    "heroImageUrl": heroImage.asset->url,
    "heroImageAlt": heroImage.alt,
    websiteUrl,
    summary,
    client,
    services,
    industry,
    date,
    sections[]{
      sectionTitle,
      goal,
      caseDetails
    },
    "galleryImages": galleryImages[]{
      "url": asset->url,
      alt,
      caption
    },
    "fullWidthImageUrl": fullWidthImage.asset->url,
    "fullWidthImageAlt": fullWidthImage.alt,
    "gridImageLeftUrl": gridImageLeft.asset->url,
    "gridImageLeftAlt": gridImageLeft.alt,
    "gridImageRightUrl": gridImageRight.asset->url,
    "gridImageRightAlt": gridImageRight.alt,
    displayOrder,
    featured,
    tags
  }`;

  return fetchSanityData(query, { slug }, null);
}

export async function getFunFactsData(pageLocation: string = 'about') {
  const query = `*[_type == "funFact" && isActive == true && pageLocation == $pageLocation][0]{
    _id,
    title,
    subtitle,
    "facts": facts[] | order(displayOrder asc) {
      title,
      count,
      suffix,
      displayOrder
    },
    isActive,
    pageLocation
  }`;

  const fallback = {
    title: 'Agency Snapshots',
    subtitle: 'Fun Facts',
    facts: [
      {
        title: 'PROJECTS DELIVERED',
        count: 200,
        suffix: '+',
        displayOrder: 1
      },
      {
        title: 'YEARS OF EXCELLENCE',
        count: 5,
        suffix: '+',
        displayOrder: 2
      },
      {
        title: 'TEAM MEMBERS STRONG',
        count: 9,
        suffix: '+',
        displayOrder: 3
      },
      {
        title: 'AGENCY GROWTH RATE',
        count: 194,
        suffix: '%',
        displayOrder: 4
      }
    ]
  };

  return fetchSanityData(query, { pageLocation }, fallback);
}

export async function getStudioHeroData(pageLocation: string = 'studio-home') {
  const query = `*[_type == "studioHero" && isActive == true && pageLocation == $pageLocation][0]{
    _id,
    title,
    "heroImageLeft": heroImageLeft.asset->url,
    "heroImageLeftAlt": heroImageLeft.alt,
    "heroImageRight": heroImageRight.asset->url,
    "heroImageRightAlt": heroImageRight.alt,
    "shapeImage": shapeImage.asset->url,
    "shapeImageAlt": shapeImage.alt,
    "thumbnailImages": thumbnailImages[] | order(displayOrder asc) {
      "url": asset->url,
      alt,
      displayOrder
    },
    isActive,
    pageLocation
  }`;

  const fallback = {
    title: 'Content Channel Lab',
    heroImageLeft: '/assets/img/home-08/hero/img-1.jpg',
    heroImageLeftAlt: 'Hero image left',
    heroImageRight: '/assets/img/home-08/hero/img-2.jpg',
    heroImageRightAlt: 'Hero image right',
    shapeImage: '/assets/img/home-08/hero/shape-1.png',
    shapeImageAlt: 'Shape decoration',
    thumbnailImages: [
      {
        url: '/assets/img/home-08/hero/img-3.jpg',
        alt: 'Thumbnail 1',
        displayOrder: 1
      },
      {
        url: '/assets/img/home-08/hero/img-4.jpg',
        alt: 'Thumbnail 2',
        displayOrder: 2
      },
      {
        url: '/assets/img/home-08/hero/img-5.jpg',
        alt: 'Thumbnail 3',
        displayOrder: 3
      },
      {
        url: '/assets/img/home-08/hero/img-6.jpg',
        alt: 'Thumbnail 4',
        displayOrder: 4
      }
    ]
  };

  return fetchSanityData(query, { pageLocation }, fallback);
}

export async function getStudioTestimonialsData(pageLocation: string = 'studio-home') {
  const query = `*[_type == "studioTestimonial" && isActive == true && pageLocation == $pageLocation][0]{
    _id,
    sectionTitle,
    subtitle,
    "shapeImage": shapeImage.asset->url,
    "shapeImageAlt": shapeImage.alt,
    "testimonials": testimonials[] | order(displayOrder asc) {
      clientName,
      designation,
      testimonialText,
      "companyLogo": companyLogo.asset->url,
      "companyLogoAlt": companyLogo.alt,
      displayOrder,
      featured
    },
    isActive,
    pageLocation
  }`;

  const fallback = {
    sectionTitle: 'What Our Clients Say',
    subtitle: 'Testimonials:',
    shapeImage: '/assets/img/home-08/testimonial/test-1.png',
    shapeImageAlt: 'Testimonial shape',
    testimonials: [
      {
        clientName: 'Chris Hughes',
        designation: 'CEO | Gemini Skincare',
        testimonialText: '"Our office is something we are pleased with. We consider it the little magnet; it is wanting to come here and afterward difficult to leave it. Our office is additionally a big name."',
        companyLogo: '/assets/img/home-08/testimonial/test-logo-1.png',
        companyLogoAlt: 'Gemini Skincare logo',
        displayOrder: 1,
        featured: false
      },
      {
        clientName: 'Daniel Smith',
        designation: 'CEO | Gemini Skincare',
        testimonialText: '"Our office is something we are pleased with. We consider it the little magnet; it is wanting to come here and afterward difficult to leave it. Our office is additionally a big name."',
        companyLogo: '/assets/img/home-08/testimonial/test-logo-1.png',
        companyLogoAlt: 'Gemini Skincare logo',
        displayOrder: 2,
        featured: false
      },
      {
        clientName: 'Brandon Smith',
        designation: 'CEO | Gemini Skincare',
        testimonialText: '"Our office is something we are pleased with. We consider it the little magnet; it is wanting to come here and afterward difficult to leave it. Our office is additionally a big name."',
        companyLogo: '/assets/img/home-08/testimonial/test-logo-1.png',
        companyLogoAlt: 'Gemini Skincare logo',
        displayOrder: 3,
        featured: false
      }
    ]
  };

  return fetchSanityData(query, { pageLocation }, fallback);
}

export async function getStudioCounterData(pageLocation: string = 'studio-home') {
  const query = `*[_type == "studioCounter" && isActive == true && pageLocation == $pageLocation][0]{
    _id,
    title,
    "counters": counters[] | order(displayOrder asc) {
      label,
      count,
      prefix,
      suffix,
      displayOrder
    },
    isActive,
    pageLocation
  }`;

  const fallback = {
    title: null,
    counters: [
      {
        label: 'Experts',
        count: 54,
        prefix: '+',
        suffix: null,
        displayOrder: 1
      },
      {
        label: 'Projects',
        count: 21,
        prefix: '+',
        suffix: null,
        displayOrder: 2
      },
      {
        label: 'Years in business',
        count: 17,
        prefix: '+',
        suffix: null,
        displayOrder: 3
      },
      {
        label: 'Awards',
        count: 86,
        prefix: '+',
        suffix: null,
        displayOrder: 4
      },
      {
        label: 'Offices',
        count: 4,
        prefix: '+',
        suffix: null,
        displayOrder: 5
      }
    ]
  };

  return fetchSanityData(query, { pageLocation }, fallback);
}

export async function getFaqData() {
  const query = `*[_type == "faqV2"][0] {
    _id,
    sidebarTitle,
    sidebarDescription,
    "sidebarBannerUrl": sidebarBanner.asset->url,
    "sidebarBannerAlt": sidebarBanner.alt,
    searchPlaceholder,
    "items": items[isActive == true] | order(order asc) {
      question,
      answer,
      order,
      category,
      isActive
    }
  }`;


  const fallback = {
    _id: 'faq-default',
    sidebarTitle: 'Q&A',
    sidebarDescription: 'Got questions about channels, creators, or collaborations?\nFind answers here.',
    sidebarBannerUrl: null,
    sidebarBannerAlt: 'faq-banner',
    searchPlaceholder: 'Search questions',
    items: [
      {
        question: "Do you only work with exclusive creators?",
        answer: "No. We work with both in-house creators and non-exclusive collaborators. All get access to the same strategy, editorial edge, and production craft from our team.",
        order: 1,
        category: 'general',
        isActive: true
      },
      {
        question: "Can brands build a channel with you?",
        answer: "Yes. We design, launch, and scale channels that brands fully own. We treat every channel like a startup with identity, audience, format, and growth strategy.",
        order: 2,
        category: 'brands',
        isActive: true
      },
      {
        question: "What types of content do you focus on?",
        answer: "Our sweet spot is story-driven video—YouTube shows, docs, and creator-led formats. We engineer repeatable structures that scale beyond one-off campaigns.",
        order: 3,
        category: 'content',
        isActive: true
      },
      {
        question: "Are you a production house or an agency?",
        answer: "Neither. We're a content-first media lab. We combine editorial DNA from journalism, production muscle from studios, and culture sense from the streets.",
        order: 4,
        category: 'general',
        isActive: true
      },
      {
        question: "How do you select creators to work with?",
        answer: "We look for storytellers who think like journalists but move like entrepreneurs. Technical skills matter, but cultural awareness and authentic voice matter more.",
        order: 5,
        category: 'creators',
        isActive: true
      },
      {
        question: "What makes your approach different?",
        answer: "We build formats over campaigns. Creators as partners. Content at the core. We don't chase trends—we shape culture with stories that stick.",
        order: 6,
        category: 'general',
        isActive: true
      }
    ]
  };

  const result = await fetchSanityData(query, {}, fallback);

  return result;
}

// Affiliate Links data
export async function getAffiliateLinksData() {
  const query = `*[_type == "affiliateLink" && isActive == true] | order(displayOrder asc) {
    _id,
    offerText,
    "slug": slug.current,
    appName,
    year,
    "image": image.asset->url,
    "imageAlt": image.alt,
    affiliateUrl,
    hoverText,
    displayOrder,
    featured,
    isActive
  }`;

  const fallback = [
    {
      _id: '1',
      title: 'The Stage',
      slug: 'the-stage',
      category: 'Branding',
      year: '2024',
      image: '/assets/img/inner-project/portfolio-col-2/port-9.jpg',
      imageAlt: 'The Stage',
      affiliateUrl: '/portfolio-details-1',
      hoverText: 'View Demo',
      displayOrder: 1,
      featured: false,
      isActive: true
    },
    {
      _id: '2',
      title: 'Big dream',
      slug: 'big-dream',
      category: 'Creative',
      year: '2023',
      image: '/assets/img/inner-project/portfolio-col-2/port-8.jpg',
      imageAlt: 'Big dream',
      affiliateUrl: '/portfolio-details-1',
      hoverText: 'View Demo',
      displayOrder: 2,
      featured: false,
      isActive: true
    },
    {
      _id: '3',
      title: 'Sed Lectus',
      slug: 'sed-lectus',
      category: 'Concept',
      year: '2023',
      image: '/assets/img/inner-project/portfolio-col-2/port-7.jpg',
      imageAlt: 'Sed Lectus',
      affiliateUrl: '/portfolio-details-1',
      hoverText: 'View Demo',
      displayOrder: 3,
      featured: false,
      isActive: true
    },
  ];

  return fetchSanityData(query, {}, fallback);
}
