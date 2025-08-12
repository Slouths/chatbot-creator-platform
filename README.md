# AI Chatbot Creator Platform

A modern, full-stack SaaS platform for creating and deploying AI-powered chatbots across multiple channels including WhatsApp, Instagram, Facebook Messenger, and websites.

## ✨ Features

- **No-Code Bot Builder**: Visual drag-and-drop interface for creating conversation flows
- **Multi-Platform Deployment**: Deploy to WhatsApp, Instagram, Facebook Messenger, and websites
- **AI Integration**: Support for OpenAI GPT-4, Anthropic Claude, and custom models
- **Real-time Analytics**: Comprehensive dashboard with conversation metrics and insights
- **Team Collaboration**: Organization-based user management with role-based access
- **Enterprise Security**: SOC 2 compliant with end-to-end encryption
- **Modern UI**: Apple-inspired design with smooth animations and dark mode

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Clerk account (for authentication)
- Convex account (for backend)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your API keys and configuration values.

3. **Initialize shadcn/ui**
   ```bash
   npx shadcn@latest init --defaults
   npx shadcn@latest add button input card dialog dropdown-menu form label select textarea toast progress skeleton
   ```

4. **Initialize Convex**
   ```bash
   npx convex dev
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS
- **UI Components**: shadcn/ui, Radix UI
- **Animations**: Framer Motion
- **Backend**: Convex (serverless)
- **Authentication**: Clerk
- **Database**: Convex (built-in)
- **Deployment**: Vercel
- **AI Integration**: OpenAI, Anthropic

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
│   ├── ui/             # shadcn/ui components
│   ├── landing/        # Landing page sections
│   ├── dashboard/      # Dashboard components
│   ├── chatbot/        # Chatbot builder components
│   └── animations/     # Animation components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── styles/             # Additional CSS styles

convex/                 # Convex backend functions and schema
├── schema.ts           # Database schema
├── auth.config.ts      # Authentication configuration
└── *.ts               # Server functions
```

## 🔧 Next Steps

1. Set up your Clerk account and get API keys
2. Set up your Convex account and deploy the schema
3. Fill in your environment variables
4. Initialize shadcn/ui components
5. Start customizing the platform

## 📄 License

This project is licensed under the MIT License.
