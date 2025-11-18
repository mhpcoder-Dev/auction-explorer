import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import { AssetType } from '@/types/auction';
import { getAssetTypeLabel } from '@/lib/assetClassifier';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCountries: string[];
  onCountryToggle: (country: string) => void;
  selectedAssetTypes: AssetType[];
  onAssetTypeToggle: (assetType: AssetType) => void;
  availableCountries: string[];
}

export default function SearchFilters({
  searchQuery,
  onSearchChange,
  selectedCountries,
  onCountryToggle,
  selectedAssetTypes,
  onAssetTypeToggle,
  availableCountries,
}: SearchFiltersProps) {
  const assetTypes: AssetType[] = ['land-buildings', 'trailers', 'cars', 'motorcycles', 'bikes', 'other'];

  const clearAllFilters = () => {
    onSearchChange('');
    selectedCountries.forEach(country => onCountryToggle(country));
    selectedAssetTypes.forEach(type => onAssetTypeToggle(type));
  };

  const hasActiveFilters = searchQuery || selectedCountries.length > 0 || selectedAssetTypes.length > 0;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search auctions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold mb-2">Countries</h3>
          <div className="flex flex-wrap gap-2">
            {availableCountries.map((country) => (
              <Badge
                key={country}
                variant={selectedCountries.includes(country) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/90"
                onClick={() => onCountryToggle(country)}
              >
                {country}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Asset Types</h3>
          <div className="flex flex-wrap gap-2">
            {assetTypes.map((type) => (
              <Badge
                key={type}
                variant={selectedAssetTypes.includes(type) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/90"
                onClick={() => onAssetTypeToggle(type)}
              >
                {getAssetTypeLabel(type)}
              </Badge>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="w-full"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        )}
      </div>
    </div>
  );
}
