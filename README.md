# Perplexica 🔍

> A powerful AI chat platform with custom color theming, multi-model support, and rich markdown rendering. Built with Next.js 15 and powered by multiple AI providers.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/NextAuth-4.24-1a1a1a?style=for-the-badge&logo=next-auth&logoColor=white" alt="NextAuth">
  <img src="https://img.shields.io/badge/PostgreSQL-Drizzle-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

---

## 🚀 Overview

Perplexica is a modern AI chat application that brings together the best of multiple AI model providers with a beautifully customizable interface. Built with the latest web technologies, it offers real-time streaming conversations, persistent chat history, and a unique color theming system that lets you personalize every aspect of the UI.

---

## ✅ Key Features

### 🎨 Custom Color Theme System
- **HSL-Based Color Variables**: Fine-tune hue, saturation, and lightness for every UI element
- **Dynamic Theme Switching**: Seamlessly toggle between vibrant colored themes and neutral "boring" modes
- **Real-time Filter Controls**: Adjust hue rotation, contrast, and saturation on the fly
- **Four Theme Variants**:
  - Default (Pink/Magenta themed)
  - Dark (Deep purple/pink with high contrast)
  - Boring Light (Grayscale light mode)
  - Boring Dark (Grayscale dark mode)
- **CSS Custom Properties**: Over 30 customizable color variables including:
  - Background, foreground, cards, popovers
  - Primary, secondary, muted, accent colors
  - Sidebar, chat border, input gradients
  - Interactive overlays with HSLA transparency

### 🤖 Multi-Model Provider Support
Integrates with leading AI providers for maximum flexibility:
- **Google AI**: Gemini 2.5 Flash, Gemini 2.5 Pro, Gemini 2 Flash Thinking
- **Groq**: Llama 3.3 70b, Llama 4 Maverick, Qwen qwq-32b, DeepSeek R1 (Llama Distilled)
- **OpenRouter**: GPT-4o, Claude 3.5 Sonnet, DeepSeek Chat
- **Custom Model Capabilities**: Vision, Web Search, PDF processing, Reasoning
- **Model Icons**: Beautiful provider logos using @lobehub/icons
- **Easy Switching**: Change models mid-conversation

### 🔐 NextAuth Authentication
- **Credential-Based Login**: Secure email/password authentication
- **JWT Strategy**: Stateless session management with JSON Web Tokens
- **Password Hashing**: bcryptjs for secure password storage
- **Custom User Schema**: Extended user profiles with username support
- **Session Callbacks**: Custom JWT and session handlers
- **Protected Routes**: Middleware-based route protection

### 📝 Rich Markdown Support
- **react-markdown** with **remark-gfm** for GitHub Flavored Markdown
- **Syntax Highlighting**: Code blocks with react-syntax-highlighter
- **Custom Prose Styling**: Typography optimized for readability
- **Full GFM Support**:
  - Tables with styled borders
  - Task lists with custom checkboxes
  - Blockquotes with colored left borders
  - Autolinks, strikethrough, footnotes
- **Inline Code**: Styled code snippets with contrasting backgrounds
- **Copy Functionality**: One-click code block copying
- **Theme-Aware**: Adapts styling to light/dark modes

### 🗂️ Persistent Chat History
- **PostgreSQL Database**: Powered by Drizzle ORM with type-safe queries
- **Three-Table Schema**:
  - `users`: Authentication and user profiles
  - `chats`: Conversation metadata with titles and timestamps
  - `messages`: Individual messages with parent-child relationships
- **Automatic Timestamps**: Created and updated timestamps on all entities
- **Chat Organization**: Title generation, pinning, and search
- **Message Threading**: Support for conversation branching
- **Database Migrations**: Version-controlled schema with Drizzle Kit
- **Indexed Queries**: Optimized lookups on user_id, chat_id, and timestamps

### 🌐 Web Search Integration
- **Exa AI Integration**: Real-time web search capabilities
- **Recent Content**: Prioritizes results from the last 7 days
- **Smart Summaries**: AI-generated content summaries
- **5-Source Results**: Curated information from multiple sources
- **Autoprompt**: Enhanced query understanding

### 🎛️ Additional Features
- **Real-time Streaming**: Token-by-token response rendering with ReadableStream
- **Message Editing**: Edit and resend messages
- **Retry Functionality**: Regenerate AI responses
- **Message Counter**: Track API usage per user
- **Responsive Design**: Mobile-first, fully responsive layout
- **Framer Motion Animations**: Smooth, fluid UI transitions
- **Custom Font Support**: Proxima Nova, Inter, Comic Sans MS
- **Turbo Mode**: Next.js Turbo for lightning-fast development

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling with custom theme
- **Framer Motion**: Animation library
- **React Markdown**: Markdown rendering with syntax highlighting
- **Lucide React**: Beautiful icon library

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **NextAuth**: Authentication framework
- **Drizzle ORM**: Type-safe database toolkit
- **PostgreSQL**: Relational database
- **Bcrypt**: Password hashing
- **JWT**: Token-based authentication

### AI Providers
- **@google/generative-ai**: Google's Gemini models
- **groq-sdk**: Groq's language models
- **OpenRouter**: Unified API for multiple providers
- **Exa AI**: Web search integration

---

## 📦 Installation

### Prerequisites
- Node.js 20+
- PostgreSQL database (local or hosted, e.g. Railway, Neon, Render)
- API keys for AI providers

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/perplexica.git
cd perplexica
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Environment variables**

Create a `.env.local` file in the project root (see [Environment Variables](#-environment-variables) below).

4. **PostgreSQL Setup**

   You can use any PostgreSQL provider (local, Railway, Neon, Render, etc.):

   - **Local**: Install PostgreSQL and create a database:
     ```sql
     CREATE DATABASE perplexica;
     ```
   - **Hosted**: Create a project on [Neon](https://neon.tech), [Railway](https://railway.app), or [Render](https://render.com) and copy the connection string.

   Then run the Drizzle migrations to set up the schema:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

5. **Run development server**
```bash
pnpm dev
```

Visit `http://localhost:3000`

---

## 🔑 Environment Variables

Create a `.env.local` file in your project root:

```env
# ─── Database ───────────────────────────────────────────────────────────────
# PostgreSQL connection string
DATABASE_URL=postgresql://user:password@localhost:5432/perplexica

# ─── NextAuth ───────────────────────────────────────────────────────────────
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=http://localhost:3000

# ─── AI Providers ───────────────────────────────────────────────────────────
# Google Gemini — https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your-gemini-api-key

# Groq — https://console.groq.com/keys
GROQ_API_KEY=your-groq-api-key

# OpenRouter — https://openrouter.ai/keys
OPENROUTER_API_KEY=your-openrouter-api-key

# ─── Web Search ─────────────────────────────────────────────────────────────
# Exa — https://dashboard.exa.ai/api-keys
EXA_API_KEY=your-exa-api-key
```

### Environment Variables Checklist
- ✅ `DATABASE_URL` — PostgreSQL connection string
- ✅ `NEXTAUTH_SECRET` — Random secret for NextAuth (min 32 chars)
- ✅ `NEXTAUTH_URL` — Your deployment URL
- ✅ `GEMINI_API_KEY` — Google AI API key
- ✅ `GROQ_API_KEY` — Groq API key
- ✅ `OPENROUTER_API_KEY` — OpenRouter API key
- ✅ `EXA_API_KEY` — Exa web search API key

---


## 📁 Project Structure

```
perplexica/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── chat/         # Chat streaming
│   │   └── chats/        # Chat CRUD
│   ├── auth/             # Auth pages
│   ├── chat/             # Chat interface
│   ├── settings/         # Settings page
│   └── globals.css       # Theme system
├── components/            # React components
│   ├── ChatArea.tsx      # Main chat interface
│   ├── ChatMessage.tsx   # Message rendering
│   ├── CodeBlock.tsx     # Syntax highlighting
│   ├── Sidebar.tsx       # Navigation
│   └── ui/               # UI primitives
├── db/                    # Database
│   ├── schema.ts         # Drizzle schema
│   ├── queries.ts        # Query helpers
│   └── migrations/       # Schema versions
├── lib/                   # Utilities
│   ├── auth.ts           # NextAuth config
│   ├── models.ts         # Model definitions
│   └── WebSearch.ts      # Search integration
└── types/                 # TypeScript types
```

---

## 🚀 Deployment

### Running Locally

1. **Clone and install**
   ```bash
   git clone https://github.com/yourusername/perplexica.git
   cd perplexica
   pnpm install
   ```

2. **Set up environment variables**
   Create a `.env.local` file with all required variables (see [Environment Variables](#-environment-variables)).

3. **Set up PostgreSQL**
   - Install PostgreSQL locally, then:
     ```sql
     CREATE DATABASE perplexica;
     ```
   - Set `DATABASE_URL=postgresql://user:password@localhost:5432/perplexica` in `.env.local`

4. **Run migrations**
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

6. **Or build and run in production mode**
   ```bash
   pnpm build
   pnpm start
   ```
   Open [http://localhost:3000](http://localhost:3000).

---
