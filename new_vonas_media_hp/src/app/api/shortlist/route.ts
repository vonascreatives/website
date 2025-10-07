import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

// Rate limiting store (in-memory, would use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  return ip;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    // Find existing shortlist
    const shortlist = await writeClient.fetch(
      `*[_type == "shortlist" && sessionId == $sessionId][0]{
        _id,
        sessionId,
        creators[]->{
          _id,
          name,
          slug,
          "image": coalesce(
            heroImage[0].image.asset->url,
            heroImage.image.asset->url,
            image.asset->url
          ),
          "imageAlt": coalesce(
            heroImage[0].alt,
            heroImage.alt,
            imageAlt,
            name
          ),
          mainCategory,
          mainPlatform,
          totalFollowers,
          "followers": coalesce(
            followers,
            subscribers,
            totalFollowers,
            metrics[0].followers
          )
        },
        status
      }`,
      { sessionId }
    );

    return NextResponse.json({
      shortlist: shortlist || { sessionId, creators: [], status: 'draft' }
    });

  } catch (error) {
    console.error('Shortlist GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    
    if (!rateLimit(ip, 30, 60000)) { // 30 requests per minute
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await request.json();
    const { sessionId, creatorId, action } = body;

    if (!sessionId || !creatorId || !['add', 'remove'].includes(action)) {
      return NextResponse.json(
        { error: 'sessionId, creatorId, and action (add/remove) are required' },
        { status: 400 }
      );
    }

    // Validate creator exists
    const creatorExists = await writeClient.fetch(
      `*[(_type == "creator" || _type == "exclusiveCreator") && _id == $creatorId][0]._id`,
      { creatorId }
    );

    if (!creatorExists) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }

    // Find or create shortlist
    let shortlist = await writeClient.fetch(
      `*[_type == "shortlist" && sessionId == $sessionId][0]`,
      { sessionId }
    );

    if (!shortlist) {
      // Create new shortlist
      shortlist = await writeClient.create({
        _type: 'shortlist',
        sessionId,
        creators: action === 'add' ? [{ _type: 'reference', _ref: creatorId }] : [],
        status: 'draft',
        lastUpdated: new Date().toISOString(),
        ipAddress: ip,
      });
    } else {
      // Update existing shortlist
      const currentCreators = shortlist.creators || [];
      const creatorRefs = currentCreators.map((c: any) => c._ref);
      
      let updatedCreators;
      if (action === 'add') {
        if (!creatorRefs.includes(creatorId)) {
          updatedCreators = [...currentCreators, { _type: 'reference', _ref: creatorId }];
        } else {
          updatedCreators = currentCreators; // Already exists
        }
      } else {
        updatedCreators = currentCreators.filter((c: any) => c._ref !== creatorId);
      }

      await writeClient
        .patch(shortlist._id)
        .set({
          creators: updatedCreators,
          lastUpdated: new Date().toISOString(),
        })
        .commit();
    }

    // Return updated shortlist with populated creators
    const updatedShortlist = await writeClient.fetch(
      `*[_type == "shortlist" && sessionId == $sessionId][0]{
        _id,
        sessionId,
        creators[]->{
          _id,
          name,
          slug,
          "image": coalesce(
            heroImage[0].image.asset->url,
            heroImage.image.asset->url,
            image.asset->url
          ),
          "imageAlt": coalesce(
            heroImage[0].alt,
            heroImage.alt,
            imageAlt,
            name
          ),
          mainCategory,
          mainPlatform,
          totalFollowers,
          "followers": coalesce(
            followers,
            subscribers,
            totalFollowers,
            metrics[0].followers
          )
        },
        status
      }`,
      { sessionId }
    );

    return NextResponse.json({
      success: true,
      action,
      shortlist: updatedShortlist,
    });

  } catch (error) {
    console.error('Shortlist POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
