# Moneymeta - Government Auction Aggregator

A production-ready web application that aggregates live government auctions and surplus sales from official, permitted data sources. Built with React, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

- **Active Listings Page**: Consolidated view of current government auctions grouped by country and asset type
- **Future Items Page**: Upcoming/potential items when available from sources
- **Deep Linking**: Shareable links to specific auction items
- **Comments System**: Per-item discussion threads with spam protection
- **Search & Filters**: Keyword search with country and asset type filters
- **Ad-Ready**: Pre-configured ad slots (header, footer, sidebar, in-feed)
- **Attributions**: Automatic attribution system for data sources
- **Status Monitoring**: Real-time health checks for all data sources
- **Responsive Design**: Mobile-first, accessible interface (WCAG 2.1 AA)

## 📋 Table of Contents

- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Data Sources](#data-sources)
- [Owner Admin Setup](#owner-admin-setup)
- [Ad Network Setup](#ad-network-setup)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Legal & Compliance](#legal--compliance)

## 🛠 Technology Stack

- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui + Radix primitives
- **Backend**: Supabase (Postgres + Row Level Security)
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Testing**: Jest + React Testing Library + Playwright (recommended)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd moneymeta
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   The `.env` file is automatically configured when using Lovable Cloud. If setting up independently:
   
   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:8080`

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔐 Environment Variables

All environment variables are prefixed with `VITE_` for Vite compatibility.

### Required Variables

```bash
# Supabase Configuration (Auto-configured with Lovable Cloud)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id

# Data Source API Keys (Add when integrating real APIs)
VITE_GSA_API_KEY=your_gsa_api_key

# Ad Configuration (Optional)
VITE_ADS_ENABLED=true
VITE_AD_CLIENT_ID=your_adsense_client_id

# Analytics (Optional)
VITE_ANALYTICS_ID=your_analytics_id

# Cache Settings
VITE_CACHE_TTL_MINUTES=10
```

### Getting API Keys

1. **GSA Auctions API**: Register at [api.data.gov](https://api.data.gov/signup/)
2. **UK Data**: No API key required for open government data
3. **Canada Data**: No API key required for open government data

## 📊 Data Sources

### Current Implementation

The application currently uses **mock data** for demonstration. To integrate real data sources:

#### 1. US - GSA Auctions API

**File**: `src/lib/dataFetcher.ts`

```typescript
// Replace mock data with:
const response = await fetch(
  `https://api.gsa.gov/assets/gsaauctions/v2/auctions?api_key=${import.meta.env.VITE_GSA_API_KEY}`
);
```

**Status**: Active auctions only
**Attribution**: Not required (public domain), but recommended

#### 2. UK - Register of Surplus Land

**Dataset**: [UK Open Data](https://www.data.gov.uk/dataset/49b15726-1603-4618-b7bb-38af6ed111e8)

- Download XLS/CSV periodically
- Parse and filter active/available parcels
- **Attribution**: Required (OGL v3)

#### 3. Canada - GCSurplus

**Dataset**: [Canada Open Data](https://open.canada.ca/data/en/dataset/1a09c5c1-3554-4b70-9e53-6322a72ec7d4)

- Historical sold items only
- Not suitable for "Active Listings"
- **Attribution**: Required (OGL-Canada)

### Adding New Sources

1. Update `DATA_SOURCES` in `src/lib/dataFetcher.ts`
2. Add attribution details
3. Implement data fetching function
4. Map fields to `AuctionItem` schema
5. Test classification and filtering

## 👤 Owner Admin Setup

As the owner, you must have **admin access** to all services:

### 1. Hosting Platform (Netlify/Vercel)

**Netlify**:
1. Sign up at [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables in Site Settings

**Vercel**:
1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Environment variables auto-detected from `.env`
4. Deploy

### 2. Supabase Backend

If using Lovable Cloud:
- Backend is automatically provisioned
- Access via Lovable Cloud tab
- No separate Supabase account needed

If self-hosting:
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Run migrations from `supabase/migrations/`
4. Copy project URL and anon key to `.env`

### 3. Comments Database

The database schema is already set up with:
- `comments` table with RLS policies
- `data_sources` table for status tracking
- Automatic timestamp triggers
- Spam prevention (rate limiting recommended)

**Moderation**: 
- Comments are approved by default
- To enable moderation: Update RLS policy to set status='pending'
- Create admin interface to approve/reject comments

## 💰 Ad Network Setup

### Google AdSense Integration

1. **Create AdSense Account**
   - Sign up at [google.com/adsense](https://www.google.com/adsense)
   - Submit your site for review
   - Wait for approval (typically 1-2 weeks)

2. **Get Your Ad Client ID**
   - Found in AdSense dashboard
   - Format: `ca-pub-XXXXXXXXXXXXXXXX`

3. **Configure Environment**
   ```bash
   VITE_ADS_ENABLED=true
   VITE_AD_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
   ```

4. **Update Ad Components**
   
   Edit `src/components/AdSlot.tsx`:
   ```tsx
   // Replace placeholder with actual ad code
   <ins className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={import.meta.env.VITE_AD_CLIENT_ID}
        data-ad-slot="YOUR_AD_SLOT_ID"
        data-ad-format="auto"></ins>
   ```

5. **Ad Placements**
   - Header: 728x90 (leaderboard)
   - Sidebar: 300x600 (half page)
   - In-feed: 300x250 (medium rectangle)
   - Footer: 728x90 (leaderboard)

### Alternative Networks

- **Media.net**: Similar to AdSense
- **PropellerAds**: Pop-unders and native ads
- **Ezoic**: AI-driven ad optimization

## 🚢 Deployment

### Automated Deployment

**Via Lovable**:
1. Click "Publish" button in Lovable interface
2. Follow deployment wizard
3. Custom domain setup available in settings

**Via Git Push**:
- Commits to main branch auto-deploy (if configured)
- Staging branches can be set up for testing

### Manual Deployment

**Netlify**:
```bash
npm install netlify-cli -g
npm run build
netlify deploy --prod
```

**Vercel**:
```bash
npm install vercel -g
npm run build
vercel --prod
```

### Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test deep linking functionality
- [ ] Check ad placements (if enabled)
- [ ] Test comment posting and display
- [ ] Verify mobile responsiveness
- [ ] Run accessibility audit
- [ ] Check SEO meta tags
- [ ] Monitor error logs

## 📁 Project Structure

```
moneymeta/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn UI components
│   │   ├── AdSlot.tsx       # Ad placement component
│   │   ├── CommentThread.tsx # Comments system
│   │   ├── ItemCard.tsx     # Auction item card
│   │   ├── Navigation.tsx   # Site navigation
│   │   └── SearchFilters.tsx # Search & filter UI
│   ├── lib/
│   │   ├── assetClassifier.ts  # Asset type detection
│   │   ├── dataFetcher.ts      # API integration
│   │   └── utils.ts            # Utility functions
│   ├── pages/
│   │   ├── Home.tsx         # Active listings
│   │   ├── Future.tsx       # Future items
│   │   ├── Attributions.tsx # Data attribution
│   │   ├── Status.tsx       # System health
│   │   └── NotFound.tsx     # 404 page
│   ├── types/
│   │   └── auction.ts       # TypeScript interfaces
│   ├── App.tsx              # Main app component
│   ├── index.css            # Design system tokens
│   └── main.tsx             # Entry point
├── supabase/
│   └── migrations/          # Database migrations
├── public/                  # Static assets
└── README.md               # This file
```

## 🧪 Testing

### Unit Tests (Recommended Setup)

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

**Test Asset Classifier**:
```typescript
// src/lib/__tests__/assetClassifier.test.ts
import { classifyAsset } from '../assetClassifier';

describe('Asset Classifier', () => {
  it('classifies land correctly', () => {
    expect(classifyAsset('Real Estate', 'Land Parcel', '')).toBe('land-buildings');
  });

  it('classifies vehicles correctly', () => {
    expect(classifyAsset('Vehicles', '2020 Ford F-150', '')).toBe('cars');
  });
});
```

### E2E Tests (Playwright Recommended)

```bash
npm install --save-dev @playwright/test
```

**Test Deep Linking**:
```typescript
// tests/deeplink.spec.ts
test('deep link scrolls to item', async ({ page }) => {
  await page.goto('/#item-gsa-001');
  await expect(page.locator('#item-gsa-001')).toBeInViewport();
});
```

### Accessibility Testing

Use Lighthouse or axe DevTools:
```bash
npm install --save-dev @axe-core/playwright
```

## ⚖️ Legal & Compliance

### Data Source Compliance

**✅ Permitted**: Official APIs, public downloads, permitted feeds
**❌ Prohibited**: Web scraping, bypassing terms of service, AI-based extraction

### Attribution Requirements

- **US Data**: Public domain, attribution recommended
- **UK Data**: OGL v3 attribution required
- **Canada Data**: OGL-Canada attribution required

### Content Policy

- No scraping or unauthorized data collection
- Respect robots.txt and API rate limits
- Display proper attribution per license terms
- Monitor and moderate user-generated content (comments)

### Privacy

- Comment system collects: display name, message, timestamp
- No user accounts or authentication required
- No PII collected beyond optional display names
- Consider adding Privacy Policy page for production

## 🔄 Maintenance

### Regular Tasks

- **Daily**: Monitor error logs and data source status
- **Weekly**: Review comment moderation queue (if enabled)
- **Monthly**: Update data source configurations
- **Quarterly**: Review and update attribution text

### Updating Data Sources

1. Edit `src/lib/dataFetcher.ts`
2. Update `DATA_SOURCES` configuration
3. Test data fetching and classification
4. Update attributions page if needed
5. Deploy changes

### Database Maintenance

Comments table can grow over time. Consider:
- Archiving old comments (>1 year)
- Implementing comment reporting
- Adding spam detection

## 📞 Support & Resources

- **Lovable Documentation**: [docs.lovable.dev](https://docs.lovable.dev/)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **React Query Docs**: [tanstack.com/query](https://tanstack.com/query/latest)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)

## 📝 License

This project structure and code are provided as-is. Data sources maintain their respective licenses (see Attributions page).

---

**Built with Lovable** | [Edit in Lovable](https://lovable.dev/)
