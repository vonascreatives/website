# Knowledge Base Editor Guide

## Quick Start for Editors

### Creating Content

#### 1. New Page in Folder
- Navigate to the parent folder in the Knowledge Base section
- Click the menu (⋮) → "Create New Page"
- The parent, audience, and order will be auto-set from the folder context
- Choose your document type (guide, template, checklist, etc.)
- Build your page using the modular Page Builder

#### 2. Page Builder Modules
Each module appears with a clear label in Studio:

- **Hero**: Eye-catching header with background image and CTAs
- **Rich Text**: Main content with formatting, links, and callouts
- **Quote**: Highlighted quotes with attribution
- **Link Grid**: Organized grid of internal/external links
- **Gallery**: Image galleries with multiple layout options
- **Steps**: Step-by-step instructions with optional images
- **Checklist**: Interactive checklist items
- **FAQ List**: Manually entered or referenced FAQs
- **Embed**: YouTube, Vimeo, Descript, Guidjar embeds
- **Related Content**: Auto or manually curated related pages
- **Video with Annotations**: Videos with timestamped notes

### Navigation Structure

#### Page Hierarchy View
Access the tree view from Knowledge Base → Page Hierarchy to see your entire content structure at a glance. Click any item to edit directly.

#### Organizing Content
- **Sections**: Root-level categories (Company, Production, Shows, etc.)
- **Folders**: Organizational containers without content
- **Pages**: Actual content pages
- **Shows**: Special folders for show-specific content
- **Links**: External references

### Best Practices

#### 1. Consistent Tagging
Use the curated tag system:
- **Topic**: General subjects (hr, finance, creative)
- **Tool**: Software and systems (premiere-pro, slack, airtable)
- **Process**: Workflows (onboarding, post-production)
- **Department**: Team areas (production, operations)
- **Project**: Specific initiatives
- **Skill**: Competencies (editing, design)

#### 2. Audience Targeting
Set the appropriate audience for each piece:
- **All**: Public-facing content
- **Team**: Internal team members only
- **Interns**: Intern-specific content
- **Freelancers**: Contractor resources
- **Partners**: External partner documentation

#### 3. Document Types
Choose the right type for your content:
- **Policy**: Official company policies
- **SOP**: Standard operating procedures
- **Guide**: How-to documentation
- **Template**: Reusable document templates
- **Checklist**: Task lists and verification
- **FAQ**: Frequently asked questions
- **Playbook**: Strategic guides
- **Brief**: Project briefs
- **Contract**: Legal agreements
- **Rate Card**: Pricing information

### Content Governance

#### For Policies and SOPs
- **Owner Team**: Required - who maintains this document
- **Review Cycle**: Required - days between reviews (30-365)
- **Last Reviewed**: Track review dates
- System will flag overdue reviews automatically

#### Safety Levels
- **Public**: Can be shared externally
- **Internal**: Team use only
- **Confidential**: Restricted access

⚠️ **Important**: Confidential content cannot have "All" audience

### Smart Features

#### 1. Auto-Generated Fields
These fields are automatically populated:
- **Plain Text**: Extracted from your modules for search
- **AI Summary**: Auto-generated content summary
- **Keywords**: Extracted important terms
- **Chunks**: Content broken into searchable pieces
- **Q&A Pairs**: Generated questions and answers

#### 2. Related Content
Two modes available:
- **Automatic**: System finds related content based on tags, audience, and type
- **Manual**: You select specific related items

#### 3. Order Management
- Lower numbers appear first (default: 100)
- Drag-to-sort interface planned for future release
- Tip: Use increments of 10 for easy reordering (10, 20, 30...)

### Keyboard Shortcuts

- `Ctrl/Cmd + S`: Save document
- `Ctrl/Cmd + Alt + P`: Publish document
- `Ctrl/Cmd + /`: Search documents
- `Alt + N`: Create new item in current context

### URL Structure

URLs are automatically generated from the parent chain:
- Root section: `/company`
- Folder in section: `/company/policies`
- Page in folder: `/company/policies/remote-work-policy`

Slugs only need to be unique among siblings, so you can have:
- `/company/policies/template`
- `/production/templates/template`

### Tips for Efficiency

#### 1. Bulk Operations
- Use the migration script to update multiple documents
- Tag normalization happens automatically during migration

#### 2. Template Pages
Create template pages with common module configurations:
- Standard Policy Template (with governance fields)
- Guide Template (with steps and checklist)
- FAQ Template (with Q&A structure)

#### 3. Quick Search
Use the Search view to quickly find content by:
- Title or description
- Tags
- Document type
- Audience
- Recent updates

### Common Workflows

#### Creating a New Policy
1. Navigate to the appropriate folder
2. Create new page with type "Policy"
3. Set Owner Team and Review Cycle
4. Add Hero module with policy title
5. Add Rich Text for policy content
6. Add Steps module for procedures
7. Set audience and safety level
8. Publish when ready

#### Building a Training Guide
1. Create page with type "Guide"
2. Add Hero with engaging title
3. Use Steps module for instructions
4. Include Gallery for screenshots
5. Add Checklist for verification
6. Include Related Content for additional resources

#### Setting Up a Show Section
1. Create item with kind "Show"
2. Link YouTube show reference
3. Create subfolders for organization:
   - Pre-Production
   - Production
   - Post-Production
   - Distribution
4. Add pages within each folder

### Troubleshooting

#### Document Not Appearing
- Check if hidden flag is set
- Verify status is "published"
- Ensure parent exists (check for orphans)

#### Duplicate Slug Error
- Slugs must be unique among siblings
- Check if another item in same folder has same slug
- Use the slug generator to create unique variant

#### Content Not Updating in Search
- AI processing happens on publish
- Allow 1-2 minutes for vector DB update
- Check webhook logs for errors

### Help & Support

#### In-Editor Help
Look for the (?) icons next to fields for contextual help and examples.

#### Validation Messages
Red fields indicate required information. Hover over the error icon for details.

#### Schema Documentation
Access the schema browser in Studio Settings → Schema to see all available fields and their descriptions.

## Acceptance Criteria Checklist

Before launching the new KB system, verify:

✅ **Content Creation**
- [ ] Can create pages anywhere using same modules
- [ ] Module previews show clear labels
- [ ] All module types render correctly

✅ **Navigation**
- [ ] Breadcrumbs work from parent chain only
- [ ] URLs are deterministic from hierarchy
- [ ] Page Hierarchy tree updates live

✅ **Related Content**
- [ ] Auto-fill produces relevant suggestions
- [ ] Manual selection works correctly
- [ ] Excludes current page from results

✅ **AI Integration**
- [ ] Publish triggers webhook
- [ ] Plain text extracted correctly
- [ ] Chunks created and embedded
- [ ] Vector DB receives updates

✅ **Migration**
- [ ] Script identifies orphans
- [ ] Duplicate slugs reported
- [ ] Tags normalized properly
- [ ] Legacy content converted to modules

✅ **Governance**
- [ ] Policies require owner and review cycle
- [ ] Overdue reviews flagged
- [ ] Safety level validation works

## Environment Variables

Configure these in your `.env` file:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=your-write-token
SANITY_API_READ_TOKEN=your-read-token

# OpenAI (for AI processing)
OPENAI_API_KEY=your-openai-key
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIM=768

# Vector Database (choose one)
VECTOR_DB_TYPE=weaviate  # or 'qdrant'

# Weaviate
WEAVIATE_URL=http://localhost:8080

# Qdrant
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your-qdrant-key

# Webhook
WEBHOOK_SECRET=your-webhook-secret
```

## Next Steps

1. **Deploy Webhook**: Deploy the webhook handler to your serverless platform
2. **Configure Webhook**: Set up webhook in Sanity for kbItem publish events
3. **Run Migration**: Execute migration script with dry-run first
4. **Create Tags**: Populate the kbTag collection with your taxonomy
5. **Train Editors**: Share this guide with content creators
6. **Monitor**: Check webhook logs and migration reports regularly
