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

function rateLimit(ip: string, limit: number = 5, windowMs: number = 3600000): boolean { // 5 submissions per hour
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

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim();
}

async function uploadFileToSanity(file: File): Promise<any> {
  try {
    const buffer = await file.arrayBuffer();
    const asset = await writeClient.assets.upload('file', Buffer.from(buffer), {
      filename: file.name,
      contentType: file.type,
    });
    return asset;
  } catch (error) {
    logger.error('File upload error:', error);
    throw new Error(`Failed to upload ${file.name}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    
    if (!rateLimit(ip)) {
      return NextResponse.json({ 
        error: 'Rate limit exceeded. Please wait before submitting another project brief.' 
      }, { status: 429 });
    }

    // Parse form data for file uploads
    const formData = await request.formData();
    
    const sessionId = formData.get('sessionId') as string;
    const brandName = formData.get('brandName') as string;
    const contactEmail = formData.get('contactEmail') as string;
    const contactName = formData.get('contactName') as string;
    const message = formData.get('message') as string;
    const budget = formData.get('budget') as string;
    const timeline = formData.get('timeline') as string;

    // Validation
    if (!sessionId || !brandName || !contactEmail || !message) {
      return NextResponse.json({
        error: 'sessionId, brandName, contactEmail, and message are required'
      }, { status: 400 });
    }

    if (!validateEmail(contactEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (message.length > 2000) {
      return NextResponse.json({ error: 'Message must be 2000 characters or less' }, { status: 400 });
    }

    // Check if shortlist exists
    const existingShortlist = await writeClient.fetch(
      `*[_type == "shortlist" && sessionId == $sessionId][0]`,
      { sessionId }
    );

    if (!existingShortlist) {
      return NextResponse.json({ error: 'Shortlist not found' }, { status: 404 });
    }

    if (!existingShortlist.creators || existingShortlist.creators.length === 0) {
      return NextResponse.json({ 
        error: 'Please add at least one creator to your shortlist before submitting' 
      }, { status: 400 });
    }

    // Handle file uploads
    const files = formData.getAll('files') as File[];
    const uploadedFiles = [];

    if (files.length > 10) {
      return NextResponse.json({ 
        error: 'Maximum 10 files allowed' 
      }, { status: 400 });
    }

    for (const file of files) {
      if (file.size === 0) continue; // Skip empty files
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        return NextResponse.json({ 
          error: `File ${file.name} is too large. Maximum size is 10MB.` 
        }, { status: 400 });
      }

      // Check file type
      const allowedTypes = [
        'image/png', 'image/jpeg', 'image/jpg',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ 
          error: `File type ${file.type} not allowed. Only PNG, JPG, PDF, DOC, DOCX are permitted.` 
        }, { status: 400 });
      }

      try {
        const uploadedAsset = await uploadFileToSanity(file);
        uploadedFiles.push({
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: uploadedAsset._id,
          }
        });
      } catch (error) {
        logger.error('File upload failed:', error);
        return NextResponse.json({ 
          error: `Failed to upload file: ${file.name}` 
        }, { status: 500 });
      }
    }

    // Sanitize input
    const sanitizedBrandName = sanitizeText(brandName);
    const sanitizedContactName = contactName ? sanitizeText(contactName) : null;
    const sanitizedMessage = sanitizeText(message);

    // Update shortlist with brief and mark as submitted
    const updatedShortlist = await writeClient
      .patch(existingShortlist._id)
      .set({
        brief: {
          brandName: sanitizedBrandName,
          contactEmail,
          contactName: sanitizedContactName,
          message: sanitizedMessage,
          budget,
          timeline,
          attachments: uploadedFiles,
        },
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        ipAddress: ip,
      })
      .commit();

    // Get the full shortlist with populated creators for response
    const finalShortlist = await writeClient.fetch(
      `*[_type == "shortlist" && _id == $shortlistId][0]{
        _id,
        sessionId,
        creators[]->{
          _id,
          name,
          slug,
          "image": heroImage.image.asset->url,
          "imageAlt": heroImage.alt,
          mainCategory,
          mainPlatform,
          totalFollowers,
          "followers": coalesce(totalFollowers, sum(metrics[].followers))
        },
        brief,
        status,
        submittedAt
      }`,
      { shortlistId: existingShortlist._id }
    );

    return NextResponse.json({
      success: true,
      message: 'Project brief submitted successfully! We will review your requirements and get back to you soon.',
      shortlist: finalShortlist,
      submissionId: existingShortlist._id,
    });

  } catch (error) {
    logger.error('Checkout POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    // Get shortlist for checkout preview
    const shortlist = await writeClient.fetch(
      `*[_type == "shortlist" && sessionId == $sessionId][0]{
        _id,
        sessionId,
        creators[]->{
          _id,
          name,
          slug,
          "image": heroImage.image.asset->url,
          "imageAlt": heroImage.alt,
          mainCategory,
          mainPlatform,
          totalFollowers,
          "followers": coalesce(totalFollowers, sum(metrics[].followers))
        },
        brief,
        status,
        submittedAt
      }`,
      { sessionId }
    );

    if (!shortlist) {
      return NextResponse.json({ error: 'Shortlist not found' }, { status: 404 });
    }

    return NextResponse.json({ shortlist });

  } catch (error) {
    logger.error('Checkout GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
