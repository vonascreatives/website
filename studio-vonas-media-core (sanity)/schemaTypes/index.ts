// Document types
import author from './author'
import post from './post'
import mediaAsset from './mediaAsset'
import kb from './kb' // Clean KB schema
import kbCategory from './kbCategory'
import kbTag from './kbTag' // New tag system

// KB Page Builder Modules
import affiliateLink  from './affiliate-links'
import kbModules from './objects/kbModules'
import exclusiveCreator from './exclusiveCreator'
import creator from './creator'
import creatorReview from './creatorReview'
import shortlist from './shortlist'
import jobBoard from './jobBoard'
import teamMember from './teamMember'
import faq from './faqSimple'
import faqv2 from './faq-v2'
import brandCollaboration from './brandCollaboration'
import youtubeId from './youtubeId'
import homepageImage from './homepageImage'
import jobTests from './jobTests'

import studioHero from './studiohero'
import studioCounter from './studiocounterstats'
import studioTestimonial from './studiotestimonials'
import award  from './award'
import useCase from './usecase'
import funFact from './funfact'

// Folder type (migrated from sanity.folder)
import vonasFolder from './vonasFolder'

// Documentation types
import docsSection from './docsSection'
import docsPage from './docsPage'
import docsCodeBlock from './docsCodeBlock'
import docsCallout from './docsCallout'
import docsImage from './docsImage'
import docsTable from './docsTable'

// Object types
import {
  imageWithAlt,
  socialLinks,
  platformMetrics,
  seoFields,
  richBody,
  referencedVideo,
  contactInfo,
  creatorPackage,
  shareLinks,
  typography,
  colors,
  legacyGuidjar,
} from './objects'

export const schemaTypes = [
  // Document types
  post,
  author,
  teamMember,
  mediaAsset,
  // Affiliate Links 
  affiliateLink,
  // Knowledge Base
  kbCategory,
  kbTag, // New tag system
  kb, // Clean KB schema
  ...kbModules, // All page builder modules
  // Creators
  exclusiveCreator,
  creator,
  creatorReview,
  shortlist,
  jobBoard,
  faq,
  faqv2,
  brandCollaboration,
  youtubeId,
  homepageImage,
  jobTests,
  
  // Homepage Content Schemas
  studioHero,
  studioCounter,
  studioTestimonial,
  award,
  useCase,
  funFact,
  
  // Folder type (migrated from sanity.folder)
  vonasFolder,

  // Documentation types
  docsSection,
  docsPage,
  docsCodeBlock,
  docsCallout,
  docsImage,
  docsTable,
  
  // Object types
  imageWithAlt,
  socialLinks,
  platformMetrics,
  seoFields,
  richBody,
  referencedVideo,
  contactInfo,
  creatorPackage,
  shareLinks,
  typography,
  colors,
  legacyGuidjar,
]
