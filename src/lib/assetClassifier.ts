import { AssetType } from '@/types/auction';

const ASSET_KEYWORDS: Record<AssetType, string[]> = {
  'land-buildings': [
    'land', 'parcel', 'property', 'building', 'lot', 'acreage', 
    'real estate', 'commercial property', 'residential property',
    'warehouse', 'office', 'facility', 'estate', 'tract'
  ],
  'trailers': [
    'trailer', 'semi-trailer', 'hauler', 'utility trailer',
    'cargo trailer', 'flatbed trailer'
  ],
  'cars': [
    'car', 'sedan', 'coupe', 'hatchback', 'suv', 'vehicle',
    'automobile', 'truck', 'van', 'pickup'
  ],
  'motorcycles': [
    'motorcycle', 'motorbike', 'bike with engine', 'scooter',
    'dirt bike', 'sport bike', 'cruiser'
  ],
  'bikes': [
    'bicycle', 'e-bike', 'electric bike', 'mountain bike',
    'road bike', 'cycle', 'pedal bike'
  ],
  'other': []
};

const ASSET_PRIORITY: AssetType[] = [
  'land-buildings',
  'trailers',
  'cars',
  'motorcycles',
  'bikes',
  'other'
];

export function classifyAsset(
  category?: string,
  title?: string,
  description?: string
): AssetType {
  const searchText = [category, title, description]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  // Check each asset type in priority order
  for (const assetType of ASSET_PRIORITY) {
    if (assetType === 'other') continue;
    
    const keywords = ASSET_KEYWORDS[assetType];
    for (const keyword of keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return assetType;
      }
    }
  }

  return 'other';
}

export function getAssetTypePriority(assetType: AssetType): number {
  return ASSET_PRIORITY.indexOf(assetType);
}

export function getAssetTypeLabel(assetType: AssetType): string {
  const labels: Record<AssetType, string> = {
    'land-buildings': 'Land & Buildings',
    'trailers': 'Trailers',
    'cars': 'Cars',
    'motorcycles': 'Motorcycles',
    'bikes': 'Bikes',
    'other': 'Other'
  };
  return labels[assetType];
}
