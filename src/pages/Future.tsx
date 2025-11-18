import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAuctionItems, groupItemsByCountry } from '@/lib/dataFetcher';
import ItemCard from '@/components/ItemCard';
import SearchFilters from '@/components/SearchFilters';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Info } from 'lucide-react';
import { AssetType } from '@/types/auction';

export default function Future() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedAssetTypes, setSelectedAssetTypes] = useState<AssetType[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['auction-items'],
    queryFn: fetchAuctionItems,
  });

  const filteredItems = useMemo(() => {
    if (!data?.items) return [];

    return data.items.filter((item) => {
      // Only show future/upcoming items
      if (!item.isFuture) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          item.title.toLowerCase().includes(query) ||
          item.shortDescription.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      if (selectedCountries.length > 0 && !selectedCountries.includes(item.country)) {
        return false;
      }

      if (selectedAssetTypes.length > 0 && !selectedAssetTypes.includes(item.assetType)) {
        return false;
      }

      return true;
    });
  }, [data?.items, searchQuery, selectedCountries, selectedAssetTypes]);

  const groupedItems = useMemo(() => {
    return groupItemsByCountry(filteredItems);
  }, [filteredItems]);

  const availableCountries = useMemo(() => {
    if (!data?.items) return [];
    return [...new Set(data.items.filter(item => item.isFuture).map(item => item.country))];
  }, [data?.items]);

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const toggleAssetType = (assetType: AssetType) => {
    setSelectedAssetTypes((prev) =>
      prev.includes(assetType) ? prev.filter((t) => t !== assetType) : [...prev, assetType]
    );
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load future items. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 text-foreground">Future & Upcoming Items</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Potential future listings from government sources (not currently active).
          </p>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Note: Some data sources (e.g., Canada GCSurplus) provide historical or sold items only.
              Future availability may be limited depending on the source's dataset.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <SearchFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCountries={selectedCountries}
              onCountryToggle={toggleCountry}
              selectedAssetTypes={selectedAssetTypes}
              onAssetTypeToggle={toggleAssetType}
              availableCountries={availableCountries}
            />
          </aside>

          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="space-y-8">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-64 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No future items available at this time. Check back later or view active listings.
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                {Array.from(groupedItems.entries()).map(([country, locationGroups]) => (
                  <div key={country} className="space-y-6">
                    <h2 className="text-3xl font-bold text-foreground border-b-2 border-primary pb-2">
                      {country}
                    </h2>

                    {Array.from(locationGroups.entries()).map(([location, items]) => (
                      <div key={`${country}-${location}`} className="space-y-4">
                        <h3 className="text-xl font-semibold text-foreground/90">
                          {location}
                        </h3>
                        <div className="grid gap-4">
                          {items.map((item) => (
                            <ItemCard key={item.id} item={item} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
