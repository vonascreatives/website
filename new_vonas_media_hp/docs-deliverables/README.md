# Vonas Media Website - Setup & Development Guide

## Overview
Vonas Media is a Next.js-based content channel lab platform integrated with Sanity CMS for content management. This guide covers local development setup, environment configuration, and available scripts.

---

## Prerequisites

- **Node.js**: v18.x or higher
- **npm** or **yarn**: Latest stable version
- **Git**: For version control
- **Sanity Account**: Required for CMS access

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/vonascreatives/website.git
cd website/new_vonas_media_hp
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=5cywtc7a
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03

# Optional: Analytics, External APIs
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id_here
```

#### How to Get Sanity Credentials:

1. **Project ID**: 
   - Go to [sanity.io/manage](https://sanity.io/manage)
   - Select your project
   - Copy the Project ID from the dashboard

2. **Tokens**:
   - Navigate to **API** tab in your Sanity project
   - Click **Add API Token**
   - For `NEXT_PUBLIC_SANITY_READ_TOKEN`: Create with **Viewer** permissions
   - For `SANITY_WRITE_TOKEN`: Create with **Editor** permissions

---

## Available Scripts

### Development

```bash
# Start Next.js development server
npm run dev

# Start Sanity Studio locally
npm run sanity
```

- **Next.js Dev**: Runs on `http://localhost:3000`
- **Sanity Studio**: Runs on `http://localhost:3333` (if configured)

### Production Build

```bash
# Build the Next.js application
npm run build

# Start production server
npm run start
```

### Linting

```bash
# Run ESLint checks
npm run lint
```

---

## Local Development Workflow

### 1. Start Development Servers

**Terminal 1 - Next.js:**
```bash
npm run dev
```

**Terminal 2 - Sanity Studio (if needed):**
```bash
cd studio-vonas-media-core
npm run dev
```

### 2. Access Applications

- **Website**: `http://localhost:3000`
- **Sanity Studio**: `http://localhost:3333` (or configured port)

### 3. Common Development Tasks

#### Adding New Content via Sanity:
1. Open Sanity Studio
2. Navigate to the relevant content type (Use Cases, Creators, etc.)
3. Click "Create new"
4. Fill in required fields
5. Click "Publish"
6. Content appears on website automatically

#### Testing Changes:
1. Make code changes
2. Hot reload will update browser automatically
3. Check browser console for errors
4. Test responsive design using DevTools

#### Working with Schemas:
- Schema files located in: `sanity/schemas/`
- After schema changes, restart Sanity Studio
- Run migrations if needed (see SCHEMA.md)

---

## Project Structure

```
new_vonas_media_hp/
├── src/
│   ├── app/                    # Next.js 13+ App Router pages
│   ├── components/             # React components
│   ├── lib/                    # Utilities & Sanity client
│   ├── types/                  # TypeScript definitions
│   └── styles/                 # Global styles
├── sanity/
│   └── schemas/                # Sanity schema definitions
├── public/
│   ├── assets/                 # Static images, fonts
│   └── images/                 # Public images
├── docs-deliverables/          # Documentation (this folder)
├── .env.local                  # Environment variables (create this)
├── next.config.mjs             # Next.js configuration
├── sanity.config.ts            # Sanity Studio config
└── package.json                # Dependencies & scripts
```

---

## Common Issues & Solutions

### Issue: Sanity Client Returns Null
**Cause**: Invalid or missing project ID  
**Solution**: 
- Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`
- Check that the ID matches your Sanity dashboard
- Restart dev server after changing env vars

### Issue: Images Not Loading
**Cause**: Missing Sanity read token or incorrect image URLs  
**Solution**:
- Ensure `NEXT_PUBLIC_SANITY_READ_TOKEN` is set
- Check image asset references in Sanity Studio
- Verify images are published (not drafts)

### Issue: Build Fails on Vercel
**Cause**: Missing environment variables or TypeScript errors  
**Solution**:
- Add all env vars to Vercel project settings
- Run `npm run build` locally first
- Check TypeScript errors with `npm run lint`

### Issue: Content Not Updating
**Cause**: Stale cache or unpublished changes  
**Solution**:
- Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
- Check content is published in Sanity Studio
- Verify `useCdn: false` in Sanity client config

---

## Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select `new_vonas_media_hp` as root directory

2. **Configure Environment Variables**:
   - Add all variables from `.env.local`
   - Use **Production** environment for live site

3. **Deploy**:
   - Push to `new_vonas_media_hp` branch
   - Vercel auto-deploys on push

### Environment-Specific Branches

- `new_vonas_media_hp`: Production (Vercel deployment)
- `devpatch-hp`: Main development branch
- `feature/*`: Feature development branches

---

## Development Best Practices

### 1. Branch Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add: Clear description of changes"

# Push and create PR
git push origin feature/your-feature-name
```

### 2. Commit Message Convention
- `Add:` - New features or files
- `Modify:` - Changes to existing code
- `Fix:` - Bug fixes
- `Remove:` - Deleted code/files
- `Merge:` - Branch merges

### 3. Testing Before PR
- [ ] Run `npm run build` successfully
- [ ] Test all modified pages
- [ ] Check responsive design
- [ ] Verify no console errors
- [ ] Test with different browsers

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## Support & Contact

For issues or questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check project documentation in `/docs-deliverables/`

---

**Last Updated**: October 2025  
**Version**: 0.1.0
