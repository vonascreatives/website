# ProjectionDocs - Knowledge Base Interface

## Overview

ProjectionDocs is a modern documentation and knowledge base interface designed for production teams. The application provides a clean, GitBook-style interface for managing and accessing production workflows, team operations, and YouTube show documentation. The current app is built with Next.js (React 18 + TypeScript), features a comprehensive navigation system with 7 main sections including Company Foundation, Team & Operations, Production Workflows, YouTube Shows, Tools & Systems, External Partnerships, and Policies & Procedures, and integrates Sanity CMS.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15 (React 18 + TypeScript)
- **UI Library**: Shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management with custom query client configuration
- **Routing**: Wouter for lightweight client-side routing
- **Component Structure**: Modular component architecture with separate layout, content, and UI component directories

### Backend Architecture
- **Runtime**: Node.js with Next.js App Router (API routes under `src/app/api`)
- **Language**: TypeScript with ES modules
- **Development**: `next dev` (HMR) — app and API run on one port
- **Storage Interface**: Abstract storage layer with in-memory implementation for development
- **API Structure**: RESTful API design with `/api` prefix routing

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Connection**: Neon Database serverless PostgreSQL
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Development Storage**: In-memory storage implementation for rapid development

### Authentication and Authorization
- **Session Management**: Not configured. Add per-product needs (e.g., NextAuth.js) if required.
- **User Schema**: Basic user model with username/password authentication
- **Security**: Password hashing and session-based authentication

### External Dependencies
- **Database**: Neon Database (@neondatabase/serverless) for serverless PostgreSQL
- **UI Components**: Comprehensive Radix UI component library for accessible primitives
- **Development Tools**: Replit-specific plugins for development environment integration
- **Styling**: Tailwind CSS with PostCSS for processing
- **Build Tools**: Next.js for development and optimized production builds
- **Validation**: Zod with Drizzle-Zod for schema validation
- **Utilities**: Date-fns for date manipulation, class-variance-authority for component variants
