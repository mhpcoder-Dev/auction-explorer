import { AuctionItem, DataSource } from '@/types/auction';
import { classifyAsset } from './assetClassifier';

// Mock data for development - will be replaced with real API calls
export const DATA_SOURCES: DataSource[] = [
  {
    id: 'us-public-domain',
    name: 'GSA Auctions',
    country: 'United States',
    attribution: {
      required: false,
      text: 'Source: GSA Auctions (public domain)',
      link: 'https://gsaauctions.gov/',
      license: 'Public Domain'
    }
  },
  {
    id: 'uk-ogl',
    name: 'UK Register of Surplus Land',
    country: 'United Kingdom',
    attribution: {
      required: true,
      text: 'Contains public sector information licensed under the Open Government Licence v3.0',
      link: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
      license: 'OGL v3.0'
    }
  },
  {
    id: 'canada-ogl',
    name: 'GCSurplus Historical Sold Items',
    country: 'Canada',
    attribution: {
      required: true,
      text: 'Contains information licensed under the Open Government Licence – Canada',
      link: 'https://open.canada.ca/en/open-government-licence-canada',
      license: 'OGL-Canada'
    }
  }
];

// Generate mock auction items for demonstration
function generateMockItems(): AuctionItem[] {
  const items: AuctionItem[] = [];
  const now = new Date();
  const endDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  // US Items
  items.push({
    id: 'gsa-001',
    title: 'Commercial Building - Downtown Office Space',
    description: 'Well-maintained 5-story commercial office building in prime downtown location. Approximately 25,000 sq ft of leasable space. Recent renovations include updated HVAC systems, modern electrical infrastructure, and energy-efficient windows. Excellent transportation access with nearby metro stations and parking facilities. Ideal for corporate offices, coworking spaces, or mixed-use development.',
    shortDescription: '5-story commercial office building, 25,000 sq ft',
    location: 'Washington, DC',
    country: 'United States',
    state: 'District of Columbia',
    city: 'Washington',
    assetType: 'land-buildings',
    auctionStartDate: now.toISOString(),
    auctionEndDate: endDate.toISOString(),
    sourceUrl: 'https://gsaauctions.gov/',
    sourceName: 'GSA Auctions',
    isActive: true,
    isFuture: false,
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    licenseId: 'us-public-domain',
    fetchedAt: now.toISOString(),
    createdAt: now.toISOString()
  });

  items.push({
    id: 'gsa-002',
    title: '2018 Ford F-150 Pickup Truck',
    description: 'Government surplus pickup truck in good condition. 4WD, V8 engine, approximately 45,000 miles. Well-maintained with complete service records. Features include crew cab, towing package, bed liner, and tonneau cover. Regular oil changes and tire rotations performed. Clean title, no accidents. All original equipment and manuals included.',
    shortDescription: '2018 Ford F-150, 4WD, 45k miles',
    location: 'Austin, TX',
    country: 'United States',
    state: 'Texas',
    city: 'Austin',
    assetType: 'cars',
    auctionStartDate: now.toISOString(),
    auctionEndDate: endDate.toISOString(),
    sourceUrl: 'https://gsaauctions.gov/',
    sourceName: 'GSA Auctions',
    isActive: true,
    isFuture: false,
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop',
    licenseId: 'us-public-domain',
    fetchedAt: now.toISOString(),
    createdAt: now.toISOString()
  });

  items.push({
    id: 'gsa-003',
    title: 'Utility Trailer - Dual Axle',
    description: 'Heavy-duty utility trailer with dual axles. 16-foot bed, excellent for hauling equipment or vehicles. Features include rear ramp gate, side access door, interior tie-down points, and weatherproof construction. Recent tire replacement and brake service. DOT compliant with all lights functioning. Maximum payload capacity 7,000 lbs. Clear title and registration documents included.',
    shortDescription: 'Heavy-duty 16-foot dual axle utility trailer',
    location: 'Phoenix, AZ',
    country: 'United States',
    state: 'Arizona',
    city: 'Phoenix',
    assetType: 'trailers',
    auctionStartDate: now.toISOString(),
    auctionEndDate: endDate.toISOString(),
    sourceUrl: 'https://gsaauctions.gov/',
    sourceName: 'GSA Auctions',
    isActive: true,
    isFuture: false,
    images: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600&fit=crop'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600&fit=crop',
    licenseId: 'us-public-domain',
    fetchedAt: now.toISOString(),
    createdAt: now.toISOString()
  });

  items.push({
    id: 'gsa-004',
    title: 'Harley-Davidson Police Motorcycle',
    description: 'Retired police motorcycle in working condition. Well-maintained, ready for civilian use. Police equipment can be removed. Approximately 28,000 miles with complete maintenance records. Engine runs strong with no mechanical issues. New battery and fresh fluids. Clean title ready for transfer. Includes all original equipment manuals and service documentation.',
    shortDescription: 'Retired police motorcycle, working condition',
    location: 'Miami, FL',
    country: 'United States',
    state: 'Florida',
    city: 'Miami',
    assetType: 'motorcycles',
    auctionStartDate: now.toISOString(),
    auctionEndDate: endDate.toISOString(),
    sourceUrl: 'https://gsaauctions.gov/',
    sourceName: 'GSA Auctions',
    isActive: true,
    isFuture: false,
    images: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&h=600&fit=crop'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&h=600&fit=crop',
    licenseId: 'us-public-domain',
    fetchedAt: now.toISOString(),
    createdAt: now.toISOString()
  });

  // UK Items
  items.push({
    id: 'uk-001',
    title: 'Surplus Land Parcel - Former Council Property',
    description: 'Approximately 2.5 acres of land formerly used for council operations. Zoned for mixed-use development. Flat terrain with existing access road and utilities nearby. Planning permission considerations for residential or commercial development. Located in growing neighborhood with good transport links. Site has been cleared and is ready for development. Full survey and soil reports available.',
    shortDescription: '2.5 acres surplus land, mixed-use zoning',
    location: 'Manchester',
    country: 'United Kingdom',
    region: 'Greater Manchester',
    city: 'Manchester',
    assetType: 'land-buildings',
    auctionEndDate: endDate.toISOString(),
    sourceUrl: 'https://www.data.gov.uk/dataset/49b15726-1603-4618-b7bb-38af6ed111e8',
    sourceName: 'UK Register of Surplus Land',
    isActive: true,
    isFuture: false,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&h=600&fit=crop'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
    licenseId: 'uk-ogl',
    fetchedAt: now.toISOString(),
    createdAt: now.toISOString()
  });

  items.push({
    id: 'uk-002',
    title: 'Government Fleet Vehicle - 2019 Vauxhall Astra',
    description: 'Former government fleet vehicle in good condition. Regular maintenance records available. Approximately 35,000 miles with full service history. 1.4 turbo petrol engine, manual transmission. MOT valid until next year. Well-maintained interior and exterior. All standard equipment functioning properly including air conditioning, parking sensors, and infotainment system.',
    shortDescription: '2019 Vauxhall Astra, ex-government fleet',
    location: 'London',
    country: 'United Kingdom',
    region: 'Greater London',
    city: 'London',
    assetType: 'cars',
    auctionEndDate: endDate.toISOString(),
    sourceUrl: 'https://www.data.gov.uk/',
    sourceName: 'UK Register of Surplus Land',
    isActive: true,
    isFuture: false,
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop',
    licenseId: 'uk-ogl',
    fetchedAt: now.toISOString(),
    createdAt: now.toISOString()
  });

  // Canada Items
  items.push({
    id: 'canada-001',
    title: 'Office Furniture Lot - Desks and Chairs',
    description: 'Previously sold government surplus office furniture. Historical listing for reference. This lot included 25 office desks, 50 ergonomic chairs, and various filing cabinets. All items were in good working condition at time of sale. This listing is maintained for historical purposes and shows typical surplus office equipment available through government sales.',
    shortDescription: 'Office furniture lot (Historical)',
    location: 'Ottawa, ON',
    country: 'Canada',
    region: 'Ontario',
    city: 'Ottawa',
    assetType: 'other',
    sourceUrl: 'https://open.canada.ca/data/en/dataset/1a09c5c1-3554-4b70-9e53-6322a72ec7d4',
    sourceName: 'GCSurplus Historical Sold Items',
    isActive: false,
    isFuture: false,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    licenseId: 'canada-ogl',
    fetchedAt: now.toISOString(),
    createdAt: now.toISOString()
  });

  return items;
}

export async function fetchAuctionItems(): Promise<{
  items: AuctionItem[];
  errors: { source: string; error: string }[];
}> {
  // In production, this would fetch from real APIs
  // For now, return mock data
  const items = generateMockItems();
  const errors: { source: string; error: string }[] = [];

  return { items, errors };
}

export function groupItemsByCountry(items: AuctionItem[]) {
  const grouped = new Map<string, Map<string, AuctionItem[]>>();

  items.forEach(item => {
    if (!grouped.has(item.country)) {
      grouped.set(item.country, new Map());
    }
    
    const countryGroup = grouped.get(item.country)!;
    const location = item.state || item.region || item.city || 'Other';
    
    if (!countryGroup.has(location)) {
      countryGroup.set(location, []);
    }
    
    countryGroup.get(location)!.push(item);
  });

  // Sort items within each location by asset type priority
  grouped.forEach(countryGroup => {
    countryGroup.forEach((items, location) => {
      items.sort((a, b) => {
        const priorityA = ['land-buildings', 'trailers', 'cars', 'motorcycles', 'bikes', 'other'].indexOf(a.assetType);
        const priorityB = ['land-buildings', 'trailers', 'cars', 'motorcycles', 'bikes', 'other'].indexOf(b.assetType);
        return priorityA - priorityB;
      });
    });
  });

  return grouped;
}
