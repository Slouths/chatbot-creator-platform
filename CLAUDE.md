# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start the development server (Next.js + Convex)
- `npm run build` - Build the production app
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run convex` - Start Convex development environment
- `npx convex dev` - Initialize and run Convex backend in development mode

## Environment Setup

1. Copy `.env.example` to `.env.local` and configure:
   - Convex deployment URL and keys
   - Clerk authentication keys
   - AI service API keys (OpenAI, Anthropic)
   - Social platform API keys (WhatsApp, Meta/Facebook)

2. Initialize shadcn/ui components:
   ```bash
   npx shadcn@latest init --defaults
   npx shadcn@latest add button input card dialog dropdown-menu form label select textarea toast progress skeleton
   ```

3. Start Convex backend: `npx convex dev`

## Architecture Overview

This is a full-stack SaaS platform for creating AI chatbots with multi-platform deployment capabilities.

### Frontend Stack
- **Next.js 15** with App Router and React 19
- **TypeScript** for type safety
- **TailwindCSS** + **shadcn/ui** for styling
- **Framer Motion** for animations
- **Clerk** for authentication

### Backend Stack
- **Convex** for serverless backend, database, and real-time features
- Database schema includes: organizations, users, chatbots, conversations, knowledge_bases, analytics_events, deployments
- Authentication configured through Clerk JWT integration

### Key Features
- Visual chatbot builder with conversation flows
- Multi-platform deployment (Website, WhatsApp, Instagram, Facebook Messenger)
- AI integration (GPT-4, Claude-3, custom models)
- Real-time analytics and conversation tracking
- Organization-based multi-tenancy with role-based access

### Project Structure
- `src/app/` - Next.js pages (auth, dashboard, API routes)
- `src/components/` - React components organized by feature
  - `ui/` - shadcn/ui components
  - `chatbot/` - Chatbot builder, analytics, deployment
  - `dashboard/` - Dashboard-specific components
  - `landing/` - Marketing page components
- `src/lib/` - Utilities, AI integrations, analytics, validations
- `convex/` - Backend functions and database schema

### Database Schema Key Tables
- `organizations` - Multi-tenant organization management with subscription tiers
- `chatbots` - Bot configuration, AI models, conversation flows, deployment settings
- `conversations` - Chat history across all platforms with metadata
- `knowledge_bases` - Document storage with embeddings for RAG
- `analytics_events` - Comprehensive event tracking

## Development Workflow

1. Both Next.js and Convex dev servers must be running simultaneously
2. Database changes require updating `convex/schema.ts`
3. Authentication flows through Clerk with custom organization management
4. AI integrations are handled in `src/lib/ai/`
5. Platform-specific webhook handlers in `src/app/api/webhooks/`

## Important Configuration Files

- `components.json` - shadcn/ui configuration with New York style
- `next.config.js` - Convex integration, image domains, strict TypeScript/ESLint
- `convex/auth.config.ts` - Clerk JWT authentication setup
- `convex/schema.ts` - Complete database schema with multi-tenant structure