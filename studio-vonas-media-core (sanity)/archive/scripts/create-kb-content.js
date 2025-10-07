const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: '5cywtc7a',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // You'll need to set this
  apiVersion: '2023-01-01'
});

async function createKnowledgeBaseContent() {
  try {
    // Create Post-Production -> Editing content
    const postProductionEditing = {
      _type: 'knowledgeBase',
      title: 'Video Editing Fundamentals',
      slug: {
        _type: 'slug',
        current: 'post-production-editing-fundamentals'
      },
      summary: 'Essential techniques and workflows for professional video editing in post-production.',
      parentCategory: 'postproduction',
      subCategory: 'Editing',
      nestingLevel: 2,
      topic: 'Editing',
      tags: ['editing', 'post-production', 'workflow', 'fundamentals'],
      body: [
        {
          _type: 'block',
          _key: 'block1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span1',
              text: 'Video editing is the cornerstone of post-production, transforming raw footage into compelling narratives. This guide covers essential editing techniques, workflow optimization, and industry best practices.'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'block2',
          style: 'h2',
          children: [
            {
              _type: 'span',
              _key: 'span2',
              text: 'Core Editing Principles'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'block3',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span3',
              text: '• Continuity and flow\n• Pacing and rhythm\n• Story structure\n• Color correction and grading\n• Audio synchronization'
            }
          ]
        }
      ],
      publishedAt: new Date().toISOString()
    };

    // Create YouTube -> Off The Record content
    const youtubeOffTheRecord = {
      _type: 'knowledgeBase',
      title: 'Off The Record Content Strategy',
      slug: {
        _type: 'slug',
        current: 'youtube-off-the-record-strategy'
      },
      summary: 'Behind-the-scenes content creation strategies for authentic YouTube engagement.',
      parentCategory: 'strategy',
      subCategory: 'Off The Record',
      nestingLevel: 2,
      topic: 'YouTube',
      tags: ['youtube', 'off-the-record', 'behind-scenes', 'authenticity', 'engagement'],
      body: [
        {
          _type: 'block',
          _key: 'block1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span1',
              text: 'Off-the-record content creates authentic connections with your YouTube audience by showing the real person behind the camera. This strategy builds trust and deeper engagement.'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'block2',
          style: 'h2',
          children: [
            {
              _type: 'span',
              _key: 'span2',
              text: 'Content Types'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'block3',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span3',
              text: '• Behind-the-scenes vlogs\n• Bloopers and outtakes\n• Personal stories and challenges\n• Workspace tours\n• Unscripted Q&A sessions'
            }
          ]
        }
      ],
      publishedAt: new Date().toISOString()
    };

    console.log('Creating Post-Production -> Editing content...');
    const result1 = await client.create(postProductionEditing);
    console.log('Created:', result1._id);

    console.log('Creating YouTube -> Off The Record content...');
    const result2 = await client.create(youtubeOffTheRecord);
    console.log('Created:', result2._id);

    console.log('✅ Successfully created both knowledge base entries!');
    
  } catch (error) {
    console.error('Error creating content:', error);
  }
}

createKnowledgeBaseContent();
