# Perplexica 🎨

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

## ✨ Key Features

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

### 💬 Rich Markdown Support
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

### 💻 Additional Features
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
- PostgreSQL database
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
Create a `.env.local` file:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/perplexica

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# AI Providers
GEMINI_API_KEY=your-gemini-key
GROQ_API_KEY=your-groq-key
OPENROUTER_API_KEY=your-openrouter-key

# Web Search
EXA_API_KEY=your-exa-key
```

4. **Database setup**
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

## 🎨 Color Theme Customization

Perplexica's theme system is built on CSS custom properties with HSL color space:

### Theme Variables
```css
:root {
  --hue-rotation: 0deg;
  --saturation-value: 100%;
  --contrast-value: 100%;
  
  /* Semantic colors */
  --background: 293.7 46.3% 92%;
  --foreground: 296 56% 21%;
  --primary: 334.2 74.9% 56.9%;
  --secondary: 314.7 61.6% 85.7%;
  
  /* Chat-specific */
  --chat-input-background: hsla(270,0%,100%,0.1);
  --chat-overlay: hsla(309,63%,92%,0.72);
}
```

### Customizing Colors
Modify `app/globals.css` to adjust:
- **Hue** (0-360): Shifts the entire color spectrum
- **Saturation** (0-100%): Controls color intensity
- **Lightness** (0-100%): Adjusts brightness

The theme system includes:
- 30+ CSS custom properties for granular control
- Separate light and dark mode color palettes
- Grayscale "boring" modes for accessibility
- HSLA values for transparent overlays

---

## 🤖 Adding New Models

Edit `lib/models.ts`:

```typescript
export const rawModels: Record<string, Omit<Model, "id">> = {
  "Your Model Name": {
    name: "Your Model Name",
    logo: YourIcon,
    info: "Description",
    capabilities: ["vision", "web"],
    favorite: true,
    premium: false,
    active: true
  },
  // ... more models
};
```

Available capabilities: `vision`, `web`, `pdf`, `reasoning`

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

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Railway/Render
1. Connect your repository
2. Set PostgreSQL database
3. Add environment variables
4. Deploy

### Environment Variables Checklist
- ✅ `DATABASE_URL` - PostgreSQL connection string
- ✅ `NEXTAUTH_SECRET` - Random secret for NextAuth
- ✅ `NEXTAUTH_URL` - Your deployment URL
- ✅ `GEMINI_API_KEY` - Google AI API key
- ✅ `GROQ_API_KEY` - Groq API key
- ✅ `OPENROUTER_API_KEY` - OpenRouter API key
- ✅ `EXA_API_KEY` - Exa web search API key

---

## 📝 Database Schema

### Users Table
```typescript
- id: UUID (primary key)
- email: Text (unique)
- hashedPassword: Text
- username: Text
- messageCount: Integer (default: 50)
- createdAt: Timestamp
```

### Chats Table
```typescript
- id: UUID (primary key)
- title: Text
- userId: UUID (foreign key)
- modelId: Text
- pinned: Boolean
- createdAt: Timestamp
- updatedAt: Timestamp
```

### Messages Table
```typescript
- id: UUID (primary key)
- chatId: UUID (foreign key)
- role: Text (user/assistant)
- content: Text
- parentId: UUID (self-reference)
- activeChildId: UUID (self-reference)
- createdAt: Timestamp
- updatedAt: Timestamp
```

---

## 🔥 Features in Detail

### Real-time Streaming
Perplexica uses Next.js Edge Runtime and ReadableStream for ultra-fast token streaming:

```typescript
const stream = new ReadableStream({
  async start(controller) {
    for await (const chunk of apiStream) {
      const text = chunk.text();
      controller.enqueue(new TextEncoder().encode(text));
    }
    controller.close();
  },
});
```

### Message Branching
Messages support parent-child relationships for conversation branching:
- Edit any message in the conversation
- Create alternate conversation paths
- Navigate between different response variations

### Theme System Architecture
Built on CSS custom properties for maximum flexibility:
- HSL color space for easy manipulation
- Separate variables for light/dark modes
- Glassmorphism effects with HSLA transparency
- Dynamic CSS variable updates via JavaScript

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Test changes before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [NextAuth](https://next-auth.js.org/) - Authentication for Next.js
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM for SQL databases
- [@lobehub/icons](https://github.com/lobehub/lobe-icons) - Beautiful AI provider icons
- [react-markdown](https://github.com/remarkjs/react-markdown) - Markdown rendering
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vercel](https://vercel.com/) - Deployment and hosting platform

---

## 📧 Support

For questions and support, please open an issue on GitHub or contact the maintainers.

---

<p align="center">
  <strong>Built with ❤️ using Next.js, NextAuth, and Drizzle ORM</strong>
</p>

<p align="center">
  <sub>Perplexica - Empowering conversations with AI</sub>
</p>
