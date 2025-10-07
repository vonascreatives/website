# FAQ Categories and Organization

## Category Structure

### 1. Company Foundation
- **FAQ-001 to FAQ-007**: Company overview, vision, mission, values
- **Focus**: Basic company information and organizational culture
- **Audience**: All team members, especially new hires

### 2. Team Management & Organization  
- **FAQ-008 to FAQ-015**: Team structure, onboarding, communication
- **Focus**: Internal team operations and collaboration
- **Audience**: All team members, managers, new hires

### 3. Content Production
- **FAQ-016 to FAQ-023**: Video production, social media, guest management
- **Focus**: Core content creation workflows
- **Audience**: Content creators, interns, production team

### 4. Show-Specific Information
- **FAQ-024 to FAQ-030**: Individual show formats and requirements
- **Focus**: Show-specific production and content guidelines  
- **Audience**: Production team, hosts, content creators

### 5. Tools & Technology
- **FAQ-031 to FAQ-037**: Software, databases, automation tools
- **Focus**: Technical tools and system usage
- **Audience**: All team members, IT support, new hires

### 6. External Collaboration
- **FAQ-038 to FAQ-042**: Freelancers, partnerships, CRM
- **Focus**: External relationships and business development
- **Audience**: Management, business development team, project managers

### 7. Policies & Procedures
- **FAQ-043 to FAQ-046**: HR policies, SOPs, operational procedures
- **Focus**: Administrative and operational policies
- **Audience**: All team members, HR, management

### 8. Internship Program
- **FAQ-047 to FAQ-050**: Intern-specific information and processes
- **Focus**: Internship program details and expectations
- **Audience**: Interns, intern supervisors, HR

## FAQ Reusability Strategy

### Cross-Reference System
- Each FAQ has a unique ID (FAQ-XXX) for easy referencing
- Knowledge articles reference relevant FAQs using these IDs
- Multiple knowledge articles can reference the same FAQ

### Tag System
- **Primary Tags**: Main category classification
- **Secondary Tags**: Specific topics and themes
- **Audience Tags**: Target user groups (interns, core-team, management)

### Update and Maintenance
- FAQs marked with [To be populated] require content from source materials
- Regular review schedule needed for accuracy
- Version control for FAQ updates

## Implementation in Sanity CMS

### Proposed Structure
```
FAQ Collection:
├── FAQ Document Type
│   ├── id: string (unique identifier)
│   ├── question: string
│   ├── answer: rich text
│   ├── category: reference to Category
│   ├── tags: array of strings
│   ├── relatedKnowledge: array of references
│   └── lastUpdated: datetime

Knowledge Article Type:
├── title: string
├── subheadline: string  
├── overviewSteps: array of strings
├── fullDescription: rich text
├── mediaResources: array of objects
├── relatedFAQs: array of references to FAQ
└── category: reference to Category
```

### Benefits of This Structure
1. **Reusable Components**: FAQs can be referenced by multiple knowledge articles
2. **Consistent Information**: Single source of truth for common questions
3. **Easy Maintenance**: Update FAQ once, reflects everywhere
4. **Flexible Organization**: Multiple ways to categorize and find information
5. **Scalable Structure**: Easy to add new FAQs and categories