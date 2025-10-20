# Test Plan & Quality Assurance

## Overview
This document outlines comprehensive test cases for the Vonas Media website, covering functionality, content management, user experience, and technical performance.

---

## Table of Contents
1. [Content Management Tests](#content-management-tests)
2. [Frontend Functionality Tests](#frontend-functionality-tests)
3. [Responsive Design Tests](#responsive-design-tests)
4. [SEO & Performance Tests](#seo--performance-tests)
5. [Integration Tests](#integration-tests)
6. [Browser Compatibility Tests](#browser-compatibility-tests)
7. [Accessibility Tests](#accessibility-tests)

---

## Content Management Tests

### Sanity Studio Access

- [ ] Can access Sanity Studio at configured URL
- [ ] Login with Google authentication works
- [ ] Login with email magic link works
- [ ] User permissions correctly restrict non-editors
- [ ] Studio loads without console errors
- [ ] All schema types visible in sidebar

### Use Case Management

**Create New Use Case**:
- [ ] Can create new use case document
- [ ] Title field accepts text input
- [ ] Slug auto-generates from title
- [ ] Can manually edit slug
- [ ] Hero image upload works
- [ ] Image hotspot adjustment works
- [ ] Alt text field accepts input
- [ ] All required fields show validation
- [ ] Can add multiple content sections
- [ ] Can reorder sections via drag-and-drop
- [ ] Can delete sections
- [ ] Gallery images accept multiple uploads
- [ ] Display order field accepts numbers only
- [ ] Featured toggle works
- [ ] isActive toggle works
- [ ] Tags field accepts multiple entries
- [ ] Can save as draft
- [ ] Can publish successfully
- [ ] Published use case appears on website

**Edit Existing Use Case**:
- [ ] Can find and open existing use case
- [ ] All fields populate with saved data
- [ ] Can edit and save changes
- [ ] Changes reflect on website after republish
- [ ] Can unpublish (set isActive to false)
- [ ] Unpublished use case disappears from website

**Delete Use Case**:
- [ ] Can access delete option
- [ ] Confirmation dialog appears
- [ ] Deleted use case removed from Sanity
- [ ] Deleted use case no longer on website

### Affiliate Links Management

- [ ] Can create new affiliate link
- [ ] Offer text field works
- [ ] App name field works
- [ ] Year field accepts text
- [ ] Image upload works with alt text
- [ ] Affiliate URL validates HTTPS
- [ ] Invalid URLs show error message
- [ ] Hover text field accepts input
- [ ] Display order accepts numbers
- [ ] isActive toggle works
- [ ] Featured toggle works
- [ ] Can publish affiliate link
- [ ] Published link appears on website
- [ ] Link redirects to correct URL
- [ ] Can edit existing affiliate link
- [ ] Can delete affiliate link

### Award Management

- [ ] Can create new award
- [ ] Title field works
- [ ] Subtitle field works
- [ ] Award date picker works
- [ ] Image upload works (logo/badge)
- [ ] Organization field accepts text
- [ ] Category dropdown shows options
- [ ] Project URL field accepts valid URLs
- [ ] Description field accepts text
- [ ] Display order field works
- [ ] Featured toggle works
- [ ] isActive toggle works
- [ ] Can publish award
- [ ] Award appears on website
- [ ] Can edit existing award
- [ ] Can reorder awards

### Fun Facts Management

- [ ] Can edit existing fun facts document
- [ ] Title field works
- [ ] Subtitle field works
- [ ] Can add new fact items
- [ ] Fact title field accepts text (UPPERCASE)
- [ ] Count field accepts numbers only
- [ ] Suffix field accepts text (+, %, K, M)
- [ ] Display order field works
- [ ] Can reorder facts
- [ ] Can delete fact items
- [ ] Page location dropdown works
- [ ] isActive toggle works
- [ ] Changes publish successfully
- [ ] Facts display correctly on website
- [ ] Counter animation works on website

### Studio Hero Management

- [ ] Can edit studio hero document
- [ ] Title field works
- [ ] Hero image left upload works
- [ ] Hero image right upload works
- [ ] Shape image upload works
- [ ] Can add thumbnail images (max 4)
- [ ] Cannot add more than 4 thumbnails
- [ ] Thumbnail display order works (1-4)
- [ ] Alt text required for thumbnails
- [ ] Page location dropdown works
- [ ] isActive toggle works
- [ ] Changes publish successfully
- [ ] Hero section displays on website
- [ ] Images load correctly

### Studio Testimonials Management

- [ ] Can edit testimonials document
- [ ] Section title field works
- [ ] Subtitle field works
- [ ] Shape image upload works
- [ ] Can add new testimonial items
- [ ] Client name field works
- [ ] Designation field works
- [ ] Testimonial text field works (50-500 chars)
- [ ] Company logo upload works
- [ ] Display order field works
- [ ] Featured toggle works
- [ ] Can reorder testimonials
- [ ] Can delete testimonials
- [ ] Page location dropdown works
- [ ] isActive toggle works
- [ ] Changes publish successfully
- [ ] Testimonials display on website
- [ ] Testimonial carousel works

### Studio Counter Stats Management

- [ ] Can edit counter stats document
- [ ] Title field works (optional)
- [ ] Can add new counter items
- [ ] Label field works
- [ ] Count field accepts numbers
- [ ] Prefix field works
- [ ] Suffix field works
- [ ] Display order field works
- [ ] Can add 1-10 counters
- [ ] Can reorder counters
- [ ] Can delete counters
- [ ] Page location dropdown works
- [ ] isActive toggle works
- [ ] Changes publish successfully
- [ ] Counters display on website
- [ ] Counter animation triggers on scroll

### FAQ Management

- [ ] Can edit FAQ section document
- [ ] Sidebar title field works
- [ ] Sidebar description field works
- [ ] Sidebar banner upload works
- [ ] Search placeholder field works
- [ ] Can add new FAQ items
- [ ] Question field works
- [ ] Answer field works
- [ ] Order field works
- [ ] Category dropdown works
- [ ] isActive toggle works per item
- [ ] Can reorder FAQ items
- [ ] Can delete FAQ items
- [ ] Changes publish successfully
- [ ] FAQs display on website
- [ ] FAQ accordion expand/collapse works
- [ ] FAQ search functionality works

---

## Frontend Functionality Tests

### Homepage

**Hero Section**:
- [ ] Hero section loads without errors
- [ ] Hero title displays correctly
- [ ] Hero images load
- [ ] CTA buttons are clickable
- [ ] CTA buttons navigate to correct pages
- [ ] Hero animations play on load
- [ ] Responsive on mobile devices

**Services Section**:
- [ ] Service cards display
- [ ] Service icons load
- [ ] Service descriptions visible
- [ ] Hover effects work
- [ ] Links navigate correctly

**Project/Channel Showcase**:
- [ ] Projects load from Sanity
- [ ] Images display correctly
- [ ] Project cards are clickable
- [ ] Navigation to project details works
- [ ] Carousel/slider controls work
- [ ] Autoplay functions correctly

**Use Case Section**:
- [ ] Featured use case displays if available
- [ ] Use case content loads from Sanity
- [ ] Fallback content shows if no featured use case
- [ ] Images load correctly
- [ ] CTA button navigates to details page

**Brand Collaboration**:
- [ ] Brand logos load
- [ ] Logos are properly sized
- [ ] Marquee animation works smoothly
- [ ] Brands link to correct pages (if applicable)

**Awards Section**:
- [ ] Award badges display
- [ ] Award information shows correctly
- [ ] Display order is respected
- [ ] Hover effects work

**Fun Facts/Counter Stats**:
- [ ] Counters display
- [ ] Animation triggers on viewport entry
- [ ] Numbers count up to correct values
- [ ] Prefixes and suffixes display correctly

**Testimonials**:
- [ ] Testimonials load
- [ ] Client names and designations show
- [ ] Company logos display
- [ ] Carousel navigation works
- [ ] Auto-rotation works (if enabled)

### Channels Page

- [ ] Channels list loads from Sanity
- [ ] All active channels display
- [ ] Channel images load correctly
- [ ] Channel names and descriptions show
- [ ] Filter functionality works (if applicable)
- [ ] Search functionality works (if applicable)
- [ ] Clicking channel navigates to detail page
- [ ] Pagination works (if applicable)

### Channel Detail Page

- [ ] Page loads with correct channel data
- [ ] Hero image displays
- [ ] Channel name and description show
- [ ] Visual identity images load
- [ ] Concept images load
- [ ] Typography information displays
- [ ] Color palette shows correctly
- [ ] Bullets/list items display
- [ ] Share links work
- [ ] CTA button links correctly
- [ ] Previous/Next navigation works

### Creators Page

- [ ] Creators list loads from Sanity
- [ ] All active creators display
- [ ] Creator images load
- [ ] Creator names and categories show
- [ ] Filter by category works
- [ ] Filter by platform works
- [ ] Filter by niche works
- [ ] Search functionality works (if applicable)
- [ ] Pagination works
- [ ] Clicking creator navigates to profile

### Creator Profile Page

- [ ] Profile loads with correct creator data
- [ ] Hero image displays
- [ ] Creator name and headline show
- [ ] Bio displays correctly
- [ ] Gallery images load
- [ ] Metrics display (followers, etc.)
- [ ] Selected work shows
- [ ] Social links work
- [ ] Availability status shows
- [ ] Languages display
- [ ] Rating displays (if applicable)

### Use Cases/Portfolio Page

- [ ] Use cases list loads
- [ ] All active use cases display
- [ ] Thumbnail images load
- [ ] Use case titles and summaries show
- [ ] Filter by tag works (if applicable)
- [ ] Clicking use case navigates to details
- [ ] Display order is respected

### Use Case Detail Page

- [ ] Page loads with correct use case data
- [ ] Hero background image displays
- [ ] Title and subtitle show
- [ ] Project info displays (client, services, industry, date)
- [ ] Summary displays
- [ ] All content sections render
- [ ] Section titles and goals show
- [ ] Case details text displays correctly
- [ ] Gallery images load and carousel works
- [ ] Full-width image displays
- [ ] Grid images display in layout
- [ ] Website URL link works
- [ ] Tags display

### Affiliate Links Page

- [ ] Affiliate links load from Sanity
- [ ] All active links display
- [ ] Images load correctly
- [ ] Offer text and app names show
- [ ] Year displays
- [ ] Display order is respected
- [ ] Isotope filtering works (if applicable)
- [ ] Hover effects work
- [ ] Clicking link opens in new tab
- [ ] Affiliate URLs track correctly

### About Page

- [ ] Hero section loads
- [ ] Hero title and description display
- [ ] About content loads from Sanity
- [ ] Intro paragraph displays
- [ ] Values/mission/vision sections show
- [ ] About images load
- [ ] Fun facts section displays
- [ ] Team members section loads (if on about)
- [ ] Awards section shows (if on about)

### FAQ Page

- [ ] FAQ section loads from Sanity
- [ ] Sidebar title and description show
- [ ] Sidebar banner image displays
- [ ] FAQ items load
- [ ] Only active FAQs display
- [ ] Order is respected
- [ ] Accordion expand/collapse works
- [ ] Search box is functional
- [ ] Search filters questions correctly
- [ ] Category filtering works (if applicable)

### Contact Page

- [ ] Contact form displays
- [ ] Name field accepts input
- [ ] Email field validates email format
- [ ] Message field accepts input
- [ ] Required field validation works
- [ ] Submit button is clickable
- [ ] Form submission works
- [ ] Success message displays
- [ ] Error handling works

### Navigation

**Header/Navigation**:
- [ ] Logo displays and links to home
- [ ] Navigation menu items display
- [ ] Menu items navigate correctly
- [ ] Dropdown menus work (if applicable)
- [ ] Mobile hamburger menu works
- [ ] Mobile menu opens/closes correctly
- [ ] Active page is highlighted
- [ ] Sticky header works on scroll (if applicable)

**Footer**:
- [ ] Footer displays on all pages
- [ ] Footer links navigate correctly
- [ ] Social media icons work
- [ ] Copyright text displays
- [ ] Newsletter signup works (if applicable)

---

## Responsive Design Tests

### Mobile Devices (320px - 767px)

- [ ] Homepage displays correctly
- [ ] Navigation menu is accessible
- [ ] Images scale appropriately
- [ ] Text is readable (font size)
- [ ] Buttons are tappable (min 44×44px)
- [ ] Forms are usable
- [ ] Carousels/sliders work with touch
- [ ] No horizontal scrolling
- [ ] Spacing is appropriate
- [ ] All interactive elements work

### Tablets (768px - 1024px)

- [ ] Layout adapts to tablet width
- [ ] Images scale correctly
- [ ] Navigation is accessible
- [ ] Grid layouts display properly
- [ ] Touch interactions work
- [ ] Orientation change handled (portrait/landscape)

### Desktop (1025px+)

- [ ] Full desktop layout displays
- [ ] Max-width containers work
- [ ] Multi-column layouts display
- [ ] Hover effects work on desktop
- [ ] Large images display at full quality

### Specific Breakpoints

**Test at**:
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone X)
- [ ] 414px (iPhone Plus)
- [ ] 768px (iPad Portrait)
- [ ] 1024px (iPad Landscape)
- [ ] 1280px (Laptop)
- [ ] 1920px (Desktop HD)
- [ ] 2560px (4K)

---

## SEO & Performance Tests

### SEO Metadata

**Homepage**:
- [ ] Title tag present and relevant
- [ ] Meta description present (155 chars)
- [ ] Open Graph tags present
- [ ] Twitter Card tags present
- [ ] Canonical URL set
- [ ] Language attribute set

**Dynamic Pages**:
- [ ] Unique title per page
- [ ] Unique meta description per page
- [ ] Open Graph image set
- [ ] Structured data present (if applicable)
- [ ] Breadcrumbs marked up (if applicable)

### Performance

**Page Load**:
- [ ] Homepage loads in under 3 seconds
- [ ] Dynamic pages load in under 3 seconds
- [ ] Images are optimized (WebP)
- [ ] Images use lazy loading
- [ ] Critical CSS inlined
- [ ] JavaScript is deferred/async
- [ ] No render-blocking resources

**Core Web Vitals**:
- [ ] LCP (Largest Contentful Paint) under 2.5s
- [ ] FID (First Input Delay) under 100ms
- [ ] CLS (Cumulative Layout Shift) under 0.1
- [ ] TTFB (Time to First Byte) under 600ms

**Lighthouse Scores**:
- [ ] Performance score 90+
- [ ] Accessibility score 90+
- [ ] Best Practices score 90+
- [ ] SEO score 90+

### URL Structure

- [ ] URLs are clean and readable
- [ ] Slugs are lowercase with hyphens
- [ ] No trailing slashes
- [ ] Dynamic routes work correctly
- [ ] 404 page shows for invalid URLs
- [ ] Redirects work correctly

### Sitemap & Robots

- [ ] /sitemap.xml generates correctly
- [ ] All public pages in sitemap
- [ ] /robots.txt accessible
- [ ] Robots.txt allows crawling

---

## Integration Tests

### Sanity CMS Integration

**Data Fetching**:
- [ ] Sanity client initializes correctly
- [ ] Environment variables load
- [ ] GROQ queries execute successfully
- [ ] Data fetches work on server-side
- [ ] Error handling works for failed queries
- [ ] Fallback data displays if Sanity unavailable

**Image Handling**:
- [ ] Sanity images load via image URL builder
- [ ] Image transformations work (resize, format)
- [ ] Hotspot positioning works
- [ ] Alt text passes through correctly
- [ ] Missing images show fallback

**Real-time Updates**:
- [ ] Published content appears on site
- [ ] Unpublished content doesn't appear
- [ ] Updated content reflects changes
- [ ] ISR revalidation works (if configured)

### Form Integrations

- [ ] Contact form submits data
- [ ] Email notifications work (if configured)
- [ ] Form validation works client-side
- [ ] Form validation works server-side
- [ ] Error messages display correctly
- [ ] Success messages display
- [ ] CSRF protection works (if applicable)

---

## Browser Compatibility Tests

### Desktop Browsers

**Chrome (Latest)**:
- [ ] All functionality works
- [ ] Layout displays correctly
- [ ] Animations work
- [ ] No console errors

**Firefox (Latest)**:
- [ ] All functionality works
- [ ] Layout displays correctly
- [ ] Animations work
- [ ] No console errors

**Safari (Latest)**:
- [ ] All functionality works
- [ ] Layout displays correctly
- [ ] Animations work
- [ ] Image formats supported
- [ ] No console errors

**Edge (Latest)**:
- [ ] All functionality works
- [ ] Layout displays correctly
- [ ] No console errors

### Mobile Browsers

**iOS Safari**:
- [ ] Touch interactions work
- [ ] Layout displays correctly
- [ ] Forms work correctly
- [ ] Video/media plays

**Chrome Mobile**:
- [ ] Touch interactions work
- [ ] Layout displays correctly
- [ ] Forms work correctly

**Samsung Internet**:
- [ ] Basic functionality works
- [ ] Layout displays correctly

---

## Accessibility Tests

### Keyboard Navigation

- [ ] Can tab through all interactive elements
- [ ] Focus indicators visible
- [ ] Tab order is logical
- [ ] Escape key closes modals/dropdowns
- [ ] Enter key activates buttons/links
- [ ] Skip to content link works

### Screen Reader Support

- [ ] Page title announced
- [ ] Headings structure is logical (h1, h2, h3)
- [ ] Images have alt text
- [ ] Links have descriptive text
- [ ] Buttons have accessible labels
- [ ] Form inputs have labels
- [ ] Error messages announced
- [ ] Dynamic content changes announced

### Color Contrast

- [ ] Text meets WCAG AA contrast (4.5:1)
- [ ] Large text meets WCAG AA (3:1)
- [ ] UI components meet contrast requirements
- [ ] Focus indicators meet contrast requirements

### Forms

- [ ] All inputs have labels
- [ ] Required fields marked
- [ ] Error messages associated with inputs
- [ ] Error messages descriptive
- [ ] Success messages announced

### ARIA

- [ ] ARIA labels used where appropriate
- [ ] ARIA roles used correctly
- [ ] ARIA states updated (expanded, selected)
- [ ] Live regions used for dynamic content

---

## Security Tests

### Input Validation

- [ ] XSS protection on all inputs
- [ ] SQL injection prevention
- [ ] No sensitive data in URLs
- [ ] File upload restrictions (if applicable)

### Environment Variables

- [ ] Sensitive keys not exposed to client
- [ ] API tokens secured
- [ ] Environment-specific configs work

### HTTPS

- [ ] Site uses HTTPS
- [ ] Mixed content warnings resolved
- [ ] Secure cookies (if applicable)

---

## Edge Cases & Error Handling

### Missing Content

- [ ] Page handles missing Sanity data gracefully
- [ ] Fallback content displays
- [ ] No undefined errors in console
- [ ] 404 page for missing dynamic routes

### Empty States

- [ ] Empty use cases list shows message
- [ ] Empty gallery shows placeholder
- [ ] No data from Sanity shows fallback

### Long Content

- [ ] Long titles don't break layout
- [ ] Long descriptions truncate or wrap correctly
- [ ] Large images scale appropriately

### Network Issues

- [ ] Slow connection doesn't break site
- [ ] Failed API calls handled
- [ ] Loading states shown during fetch
- [ ] Error messages user-friendly

---

## Deployment & Production Tests

### Pre-Deployment

- [ ] All tests pass locally
- [ ] Build completes without errors
- [ ] Environment variables configured
- [ ] No console errors in production build
- [ ] TypeScript errors resolved
- [ ] ESLint warnings addressed

### Post-Deployment

- [ ] Site accessible at production URL
- [ ] All pages load correctly
- [ ] Sanity CMS integration works
- [ ] Images load from CDN
- [ ] Analytics tracking works (if configured)
- [ ] Error monitoring active (if configured)
- [ ] DNS configured correctly
- [ ] SSL certificate valid

### Smoke Tests (Production)

- [ ] Homepage loads
- [ ] Can navigate to at least 5 different pages
- [ ] Forms submit successfully
- [ ] Contact form sends emails
- [ ] Sanity Studio accessible
- [ ] Can publish content and see on site

---

## Regression Testing

**After Updates**:
- [ ] Run all critical path tests
- [ ] Test previously fixed bugs
- [ ] Check affected areas
- [ ] Verify integrations still work

**Monthly Maintenance**:
- [ ] Review and update content
- [ ] Check for broken links
- [ ] Review analytics for errors
- [ ] Update dependencies if needed
- [ ] Run full test suite

---

## Test Environment Setup

### Required Tools

- [ ] Modern browser (Chrome, Firefox, Safari)
- [ ] Browser DevTools
- [ ] Responsive design mode / Device emulator
- [ ] Lighthouse (Chrome DevTools)
- [ ] WAVE accessibility checker
- [ ] Screen reader (NVDA, JAWS, or VoiceOver)

### Test Data

- [ ] Sample use cases created in Sanity
- [ ] Test affiliate links with valid URLs
- [ ] Sample creators with complete profiles
- [ ] Test images uploaded
- [ ] FAQ items populated
- [ ] Testimonials added

---

## Bug Reporting Template

When a test fails, report using this format:

```
**Title**: Brief description of issue

**Priority**: Critical / High / Medium / Low

**Environment**:
- Browser: [Chrome 120]
- Device: [Desktop / Mobile]
- OS: [Windows 11 / iOS 17]
- URL: [specific page URL]

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Result**: What should happen

**Actual Result**: What actually happened

**Screenshots/Videos**: [attach if applicable]

**Console Errors**: [paste any console errors]
```

---

## Test Sign-Off

### Pre-Launch Checklist

- [ ] All critical tests pass
- [ ] All high-priority tests pass
- [ ] Known issues documented
- [ ] Accessibility audit complete
- [ ] Performance benchmarks met
- [ ] SEO audit complete
- [ ] Browser compatibility verified
- [ ] Mobile responsiveness verified
- [ ] Content review complete
- [ ] Security checks passed

**Tested By**: _______________  
**Date**: _______________  
**Approved By**: _______________  
**Date**: _______________

---

**Last Updated**: October 2025  
**Test Plan Version**: 1.0
