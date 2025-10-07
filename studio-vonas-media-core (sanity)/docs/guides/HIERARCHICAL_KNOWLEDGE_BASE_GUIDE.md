# VONAS Media Hierarchical Knowledge Base - Complete Guide

## 🎉 System Overview

Your hierarchical knowledge base is now fully operational with unlimited nesting, YouTube show organization, and intelligent auto-assignment capabilities.

## 📊 Current Structure

```
📁 About VONAS Media
├── 📋 Company Overview  
├── 🎯 Vision & Mission
└── 💎 Company Values

📁 Internship Program  
├── 📝 Intern Onboarding
└── 📖 Intern Handbook

📁 Freelancer Management
├── 📋 Work Collaboration Guidelines  
└── 💰 Rates & Payment Terms

📁 YouTube Channels
├── 🎙️ Off the Record
│   ├── 📄 About Off the Record
│   ├── 🎬 Shooting Guidelines (with Descript video)
│   └── ✂️ Editing Workflow
├── 🔥 Passions
│   ├── 📄 About Passions
│   └── 📋 Pre-Production
├── 🏙️ Skyline
├── 🇵🇭 Tatak  
└── 🚪 At the Backdoor

📁 Software & Tools
├── 🎨 Content Creation Tools (with Descript video)
└── 🤖 Automation & Integration
```

## 🚀 Key Features

### ✅ **Unlimited Hierarchical Nesting**
- Create folders within folders at any depth
- Easy reorganization by changing parent references
- Visual tree structure in Sanity Studio

### ✅ **YouTube Show Organization**
- Each show has its own dedicated folder
- Auto-tagging based on show content
- Production stage tracking (Pre-Production → Shooting → Editing → Distribution)

### ✅ **Smart Auto-Assignment Rules**
Auto-folder assignment works by analyzing content for keywords:

| Keywords | Assigned To | Tags Added |
|----------|-------------|------------|
| "off the record", "candid interview" | Off the Record folder | `off-the-record`, `candid` |
| "passions", "passion" | Passions folder | `passions`, `creator-journey` |  
| "shooting", "filming", "camera" | Production stage: shooting | `shooting`, `production` |
| "editing", "post-production" | Production stage: editing | `editing`, `post-production` |
| "freelancer", "contractor" | Freelancer Management | `freelancers`, `external` |
| "intern", "internship" | Internship Program | `interns`, `training` |

### ✅ **Rich Content Support**
- **Rich Text**: Full markdown/HTML editing for content
- **Video Recording**: Descript video URLs
- **Supporting Documents**: Guidjar guide URLs  
- **Media Files**: Additional attachments and resources
- **Overview Steps**: Simple bullet point lists

### ✅ **Flexible Studio Navigation**
Multiple ways to browse content:
- **🌲 Hierarchical View**: See the full tree structure
- **📺 By YouTube Show**: Filter content by show
- **🎬 By Production Stage**: Filter by workflow stage  
- **📁 By Type**: Folders, documents, shows separately
- **🎯 Special Views**: Top-level items, items with videos, etc.

## 🛠️ How to Use

### Adding New Content
1. **Create New Item**: Go to Knowledge Base → All Knowledge Items
2. **Choose Type**: Folder, Document, YouTube Show, Production Stage
3. **Set Parent**: Choose which folder it belongs to (or leave blank for top-level)
4. **Add Content**: Rich text, videos, documents as needed
5. **Auto-Assignment**: System will suggest folder and tags based on content

### Moving Items
1. **Edit Item**: Open the item you want to move
2. **Change Parent**: Select new parent folder from dropdown
3. **Save**: Item moves instantly to new location

### Using Auto-Assignment
```bash
# Test assignment rules
node scripts/auto-folder-assignment.js test

# Analyze all items (dry run)
node scripts/auto-folder-assignment.js analyze

# Apply suggestions to all items
node scripts/auto-folder-assignment.js analyze --apply

# Analyze specific item
node scripts/auto-folder-assignment.js assign <item-id>
```

## 📝 Content Templates

### YouTube Show Structure Template
```
📺 [Show Name] (itemType: youtube-show)
├── 📄 About [Show Name] (overview and format)
├── 📋 Pre-Production (planning workflows)
├── 🎬 Shooting Guidelines (production requirements)
├── ✂️ Editing Workflow (post-production process)
└── 📢 Distribution (publishing and promotion)
```

### Content Item Template
```
Title: Clear, descriptive title
Sub-headline: 1-3 sentence summary
Parent: Choose appropriate folder
Item Type: Document/Folder/YouTube Show/Production Stage
YouTube Show: Which show this belongs to (if applicable)
Production Stage: Which stage of production (if applicable)
Content: Rich text with full description
Overview Steps: Key bullet points
Video Recording: Descript URL
Supporting Documents: Guidjar URL  
Tags: Relevant keywords for filtering
```

## 🔄 Data Fetching (GROQ Queries)

### Get Full Hierarchy (Flat List)
```groq
*[_type=="kbItem" && !hidden]{
  _id, title, "slug": slug.current, "parentId": parent->_id,
  order, icon, itemType, youtubeShow, productionStage
} | order(order asc, title asc)
```

### Get YouTube Show Content
```groq
*[_type=="kbItem" && youtubeShow == "off-the-record"] | order(order asc) {
  title, itemType, productionStage, videoRecording, supportingDocuments
}
```

### Get Production Stage Content  
```groq
*[_type=="kbItem" && productionStage == "shooting"] {
  title, youtubeShow, content, videoRecording
}
```

### Get Specific Path
```groq
*[_type=="kbItem" && slug.current == "shooting-guidelines" 
  && parent->slug.current == "off-the-record"][0]{
  title, content, videoRecording, supportingDocuments
}
```

## 🎯 Next Steps

1. **Expand Each Show**: Add more specific content for each YouTube show
2. **Import Real Documents**: Use the hierarchy to organize existing content
3. **Set Up Workflows**: Define production workflows for each show
4. **Train Team**: Show team members how to use the system
5. **Customize Rules**: Adjust auto-assignment rules based on usage

## 🔧 Advanced Features

- **Unlimited Depth**: Create sub-folders within sub-folders infinitely
- **Cross-References**: Link related content across different sections  
- **Version Control**: Track changes to content over time
- **Access Control**: Hide sensitive content with the `hidden` field
- **Bulk Operations**: Use scripts for mass organization and cleanup

---

Your hierarchical knowledge base system is production-ready and designed to grow with your media company! 🚀