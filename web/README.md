# Codiner Web Applications

This folder contains all web-related applications and assets for the Codiner platform.

## 📁 Folder Structure

```
web/
├── landing-page/          # Marketing website (HTML/CSS/JS)
│   ├── assets/           # Website files (HTML, CSS, JS, images)
│   │   ├── index.html    # Main landing page with authentication
│   │   ├── logo.png      # Codiner branding
│   │   ├── favicon.ico   # Browser favicon
│   │   └── README.md     # Website documentation
│   ├── index.html        # Redirect to assets/
│   └── README.md         # Landing page deployment guide
│
├── dashboard/            # Next.js web application (React/TypeScript)
│   ├── src/              # Source code
│   │   ├── app/          # Next.js app router pages
│   │   ├── components/   # Reusable React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and services
│   │   └── types/        # TypeScript type definitions
│   ├── public/           # Static assets
│   ├── package.json      # Dependencies and scripts
│   ├── next.config.ts    # Next.js configuration
│   └── README.md         # Dashboard documentation
│
└── templates/            # Pre-built application templates
    ├── blog-cms/         # Blog/CMS template
    ├── dashboard-analytics/  # Analytics dashboard
    ├── ecommerce-platform/  # E-commerce platform
    ├── full-stack-app/   # Full-stack application
    ├── saas-starter/     # SaaS starter kit
    └── social-media-app/ # Social media platform
```

## 🚀 Applications Overview

### 1. **Landing Page** (`landing-page/`)
- **Technology**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Purpose**: Marketing website with lead generation
- **Features**: Authentication modal, email capture, conversion optimization
- **Deployment**: Static hosting (Netlify, Vercel, etc.)

### 2. **Dashboard** (`dashboard/`)
- **Technology**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Purpose**: Main web application for Codiner users
- **Features**: AI app generation, code editor, collaboration tools
- **Authentication**: Supabase integration

### 3. **Templates** (`templates/`)
- **Technology**: Vite, React, TypeScript, Tailwind CSS
- **Purpose**: Pre-built application starters
- **Features**: Production-ready code with advanced integrations

## 🛠️ Development Setup

### Landing Page
```bash
cd web/landing-page
python -m http.server 8080
# Visit: http://localhost:8080
```

### Dashboard
```bash
cd web/dashboard
npm install
npm run dev
# Visit: http://localhost:3000
```

### Templates
```bash
cd web/templates/[template-name]
npm install
npm run dev
# Visit: http://localhost:5173
```

## 📦 Key Features

### Landing Page Features
- ✅ **Authentication Modal** - Email/password + Google/GitHub OAuth
- ✅ **Email Verification** - 6-digit passcode system
- ✅ **Conversion Optimization** - Multiple CTAs and lead capture
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **SEO Optimized** - Meta tags and structured data

### Dashboard Features
- ✅ **AI App Generation** - Natural language to app creation
- ✅ **Code Editor** - Monaco Editor with live preview
- ✅ **Real-time Collaboration** - Multi-user editing
- ✅ **Template Marketplace** - Pre-built components and apps
- ✅ **Deployment Integration** - Vercel, Netlify, AWS support

### Template Features
- ✅ **Production Ready** - Enterprise-grade code quality
- ✅ **Advanced Integrations** - Supabase, payment processing, real-time
- ✅ **Modern Architecture** - TypeScript, React 18, Vite
- ✅ **Responsive Design** - Mobile-first, accessible UI
- ✅ **Developer Experience** - Hot reload, type checking, testing

## 🔧 Technology Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **Next.js 16** - Full-stack React framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library

### UI Components
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Beautiful icons
- **shadcn/ui** - Re-usable component system
- **React Hook Form** - Form management
- **Zustand** - State management

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Testing framework
- **Playwright** - E2E testing

### Integrations
- **Supabase** - Backend-as-a-Service
- **Socket.io** - Real-time communication
- **Monaco Editor** - Code editing
- **JSZip** - File compression
- **File Saver** - Client-side downloads

## 🎨 Design System

### Colors
```css
Primary: #3b82f6 (Blue)
Secondary: #8b5cf6 (Purple)
Success: #10b981 (Green)
Warning: #f59e0b (Orange)
Error: #ef4444 (Red)
```

### Typography
- **Headlines**: Inter (sans-serif)
- **Body**: Inter (sans-serif)
- **Code**: JetBrains Mono (monospace)

### Principles
- **Accessibility First** - WCAG 2.1 AA compliant
- **Mobile First** - Responsive design approach
- **Performance Focused** - Optimized loading and interactions
- **Developer Friendly** - Clear component APIs and documentation

## 🚀 Deployment

### Landing Page
```bash
# Deploy to Netlify
cd web/landing-page/assets
netlify deploy --prod
```

### Dashboard
```bash
# Deploy to Vercel
cd web/dashboard
vercel --prod
```

### Templates
```bash
# Deploy individual templates
cd web/templates/[template-name]
vercel --prod
```

## 📊 Analytics & Monitoring

### Built-in Analytics
- **Google Analytics 4** - User behavior tracking
- **Conversion Tracking** - Signups, downloads, engagement
- **Error Monitoring** - Sentry integration ready
- **Performance Monitoring** - Core Web Vitals tracking

## 🔒 Security

### Authentication
- **Supabase Auth** - Secure authentication service
- **OAuth Integration** - Google, GitHub, enterprise SSO
- **Email Verification** - Account security
- **Session Management** - Secure token handling

### Data Protection
- **GDPR Compliant** - Privacy-first approach
- **Data Encryption** - End-to-end encryption
- **Secure APIs** - Protected endpoints
- **Audit Logging** - Security event tracking

## 🌍 Internationalization

### Multi-language Support
- **i18n Ready** - Framework for translations
- **RTL Support** - Right-to-left languages
- **Currency Formatting** - Regional pricing
- **Date Localization** - Cultural date formats

## 📞 Support & Documentation

### Resources
- **Component Documentation** - Storybook integration
- **API Documentation** - OpenAPI specifications
- **User Guides** - Comprehensive tutorials
- **Developer Docs** - Technical documentation

### Community
- **GitHub Issues** - Bug reports and feature requests
- **Discord Community** - User discussions
- **Blog** - Updates and tutorials
- **Newsletter** - Product updates

---

## 🎯 Project Goals

1. **Unified Experience** - Consistent design and functionality across all web apps
2. **Developer Productivity** - Streamlined development workflow with modern tools
3. **User Experience** - Intuitive, accessible, and performant applications
4. **Scalability** - Enterprise-ready architecture and deployment
5. **Innovation** - Cutting-edge features with AI and real-time capabilities

---

**Built with ❤️ by the Codiner team - Empowering developers with AI-driven tools** ⚡
