import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { logger } from '@/utils/logger';

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

// Rate limiting store (in-memory, would use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string, limit: number = 3, windowMs: number = 300000): boolean { // 3 reviews per 5 minutes
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

function sanitizeText(text: string): string {
  // Remove HTML tags and potential malicious content
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/https?:\/\/[^\s]+/g, '[LINK]') // Replace links
    .replace(/www\.[^\s]+/g, '[LINK]') // Replace www links
    .trim();
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50); // Max 50 reviews per request
    const offset = (page - 1) * limit;

    if (!creatorId) {
      return NextResponse.json({ error: 'creatorId is required' }, { status: 400 });
    }

    // Get approved reviews for the creator
    const reviews = await writeClient.fetch(
      `*[_type == "creatorReview" && creator._ref == $creatorId && status == "approved"] 
       | order(_createdAt desc) [$offset...$end] {
        _id,
        rating,
        title,
        body,
        tags,
        authorName,
        authorCompany,
        _createdAt
      }`,
      { 
        creatorId, 
        offset,
        end: offset + limit - 1
      }
    );

    // Get total count for pagination
    const totalCount = await writeClient.fetch(
      `count(*[_type == "creatorReview" && creator._ref == $creatorId && status == "approved"])`,
      { creatorId }
    );

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      }
    });

  } catch (error) {
    logger.error('Reviews GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    
    if (!rateLimit(ip)) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please wait before submitting another review.' }, { status: 429 });
    }

    const body = await request.json();
    const { 
      creatorId, 
      rating, 
      title, 
      body: reviewBody, 
      tags, 
      authorName, 
      authorEmail, 
      authorCompany,
      honeypot // Anti-spam honeypot field
    } = body;

    // Anti-spam: honeypot field should be empty
    if (honeypot && honeypot.trim() !== '') {
      logger.warn('Spam attempt detected - honeypot filled:', ip);
      return NextResponse.json({ error: 'Spam detected' }, { status: 400 });
    }

    // Validation
    if (!creatorId || !rating || !reviewBody || !authorName || !authorEmail) {
      return NextResponse.json(
        { error: 'creatorId, rating, body, authorName, and authorEmail are required' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be an integer between 1 and 5' }, { status: 400 });
    }

    if (reviewBody.length > 1000) {
      return NextResponse.json({ error: 'Review body must be 1000 characters or less' }, { status: 400 });
    }

    if (!validateEmail(authorEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate creator exists
    const creatorExists = await writeClient.fetch(
      `*[_type == "creator" && _id == $creatorId][0]._id`,
      { creatorId }
    );

    if (!creatorExists) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }

    // Check for duplicate reviews from same email within 24 hours
    const recentReview = await writeClient.fetch(
      `*[_type == "creatorReview" && creator._ref == $creatorId && authorEmail == $authorEmail && _createdAt > $dayAgo][0]._id`,
      { 
        creatorId, 
        authorEmail,
        dayAgo: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    );

    if (recentReview) {
      return NextResponse.json({ error: 'You can only submit one review per creator per day' }, { status: 400 });
    }

    // Sanitize input
    const sanitizedBody = sanitizeText(reviewBody);
    const sanitizedTitle = title ? sanitizeText(title) : null;
    const sanitizedAuthorName = sanitizeText(authorName);
    const sanitizedAuthorCompany = authorCompany ? sanitizeText(authorCompany) : null;

    // Create review with pending status
    const review = await writeClient.create({
      _type: 'creatorReview',
      creator: {
        _type: 'reference',
        _ref: creatorId,
      },
      rating,
      title: sanitizedTitle,
      body: sanitizedBody,
      tags: tags || [],
      authorName: sanitizedAuthorName,
      authorEmail,
      authorCompany: sanitizedAuthorCompany,
      status: 'pending',
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || '',
      honeypot: '', // Always store empty for security
    });

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully. It will be published after moderation.',
      reviewId: review._id,
    });

  } catch (error) {
    logger.error('Reviews POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
