# Ayvlo Web App

Modern Next.js 15 frontend for Ayvlo's Autonomous Business Intelligence platform.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.7
- **Styling:** Tailwind CSS + shadcn/ui components
- **State Management:** Zustand
- **Data Fetching:** TanStack Query
- **Authentication:** Auth0
- **Charts:** Recharts
- **Animations:** Framer Motion

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your values

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (marketing)/       # Public marketing pages
│   │   ├── page.tsx       # Home page
│   │   ├── product/       # Product page
│   │   ├── pricing/       # Pricing page
│   │   └── blog/          # Blog/Resources
│   ├── (dashboard)/       # Authenticated dashboard
│   │   ├── dashboard/     # Main dashboard
│   │   ├── metrics/       # Metrics management
│   │   ├── anomalies/     # Anomaly feed
│   │   ├── actions/       # Action workflows
│   │   └── settings/      # Settings & integrations
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── home/             # Homepage sections
│   ├── dashboard/        # Dashboard components
│   └── providers.tsx     # Context providers
├── lib/                  # Utilities
│   ├── api.ts           # API client
│   ├── auth.ts          # Auth utilities
│   └── utils.ts         # Helper functions
└── styles/              # Global styles
    └── globals.css      # Tailwind + custom CSS
```

## Design System

### Colors

```typescript
// Light Theme
--bg-primary: #F8F8F8
--bg-secondary: #F0F0F2
--text-primary: #1E1F23
--accent-taupe: #C6A678
--accent-blue: #3F8EFC

// Dark Theme
--bg-primary: #0E0E11
--bg-secondary: #1E1F23
--text-primary: #F8F8F8
```

### Typography

- **Display:** Space Grotesk (72px, bold)
- **Headings:** Inter (56px, 40px, 28px)
- **Body:** Inter (16px, 20px)
- **Code:** JetBrains Mono

### Components

- Buttons: `btn-primary`, `btn-secondary`
- Cards: `card` with hover effects
- Inputs: `input` with focus states

## Features

### Marketing Pages
- ✅ Hero with animated background
- ✅ Feature cards (Detect → Explain → Act)
- ✅ Value proposition with product mockup
- ✅ Testimonials & social proof
- ✅ CTA sections
- ✅ Responsive footer

### Dashboard (Coming Soon)
- [ ] Dark theme UI
- [ ] Real-time metrics
- [ ] Anomaly feed
- [ ] Action workflows
- [ ] Settings & integrations

## Development

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Format code
pnpm format
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build
docker build -t ayvlo-web .

# Run
docker run -p 3000:3000 ayvlo-web
```

## Environment Variables

Required:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `AUTH0_CLIENT_ID` - Auth0 application ID
- `AUTH0_CLIENT_SECRET` - Auth0 secret
- `AUTH0_ISSUER_BASE_URL` - Auth0 domain

Optional:
- `NEXT_PUBLIC_GA_ID` - Google Analytics
- `NEXT_PUBLIC_MIXPANEL_TOKEN` - Mixpanel analytics

## Performance

- Server-side rendering for marketing pages
- Static generation where possible
- Image optimization with Next/Image
- Code splitting by route
- Font optimization with next/font

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation
- Screen reader support
- Focus indicators
- Semantic HTML

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## License

Copyright © 2025 Ayvlo Inc.
