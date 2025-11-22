import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAuctionItems, groupItemsByCountry } from '@/lib/dataFetcher';
import ItemCard from '@/components/ItemCard';
import SearchFilters from '@/components/SearchFilters';
import AdSlot from '@/components/AdSlot';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { AssetType } from '@/types/auction';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedAssetTypes, setSelectedAssetTypes] = useState<AssetType[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['auction-items'],
    queryFn: fetchAuctionItems,
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });

  // Scroll to item if hash is present (handle both #item-id and #item-id+expand)
  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      const itemId = hash.replace('+expand', '');
      const element = document.getElementById(itemId);
      
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Only add ring if not expanding (modal will handle focus)
          if (!hash.includes('+expand')) {
            element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
            setTimeout(() => {
              element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
            }, 2000);
          }
        }, 100);
      }
    }
  }, [data]);

  const filteredItems = useMemo(() => {
    if (!data?.items) return [];

    return data.items.filter((item) => {
      // Only show active items on homepage
      if (!item.isActive) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          item.title.toLowerCase().includes(query) ||
          item.shortDescription.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Country filter
      if (selectedCountries.length > 0 && !selectedCountries.includes(item.country)) {
        return false;
      }

      // Asset type filter
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
    return [...new Set(data.items.filter(item => item.isActive).map(item => item.country))];
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
          <AlertDescription>Failed to load auction items. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdSlot id="ad-header" position="header" className="mb-6" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 text-foreground">
            Government Auctions & Surplus Sales
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Find active listings from official government sources across the United States, United Kingdom, Canada, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            <SearchFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCountries={selectedCountries}
              onCountryToggle={toggleCountry}
              selectedAssetTypes={selectedAssetTypes}
              onAssetTypeToggle={toggleAssetType}
              availableCountries={availableCountries}
            />
            <AdSlot id="ad-sidebar" position="sidebar" />
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3">
            {data?.errors && data.errors.length > 0 && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Some data sources are currently unavailable:{' '}
                  {data.errors.map((e) => e.source).join(', ')}
                </AlertDescription>
              </Alert>
            )}

            {isLoading ? (
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-64 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No active listings found matching your filters.
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                {Array.from(groupedItems.entries()).map(([country, locationGroups]) => (
                  <div key={country} className="space-y-6">
                    <h2 className="text-3xl font-bold text-foreground border-b-2 border-primary pb-2">
                      {country}
                    </h2>

                    {Array.from(locationGroups.entries()).map(([location, items], index) => (
                      <div key={`${country}-${location}`} className="space-y-4">
                        <h3 className="text-xl font-semibold text-foreground/90">
                          {location}
                        </h3>

                        {/* In-feed ad every 3 items in first location group */}
                        {index === 0 && items.length > 2 && (
                          <div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {items.slice(0, 3).map((item) => (
                                <ItemCard key={item.id} item={item} />
                              ))}
                            </div>
                            <AdSlot id={`ad-feed-${country}`} position="in-feed" className="my-4" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {items.slice(3).map((item) => (
                                <ItemCard key={item.id} item={item} />
                              ))}
                            </div>
                          </div>
                        )}

                        {(index !== 0 || items.length <= 2) && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {items.map((item) => (
                              <ItemCard key={item.id} item={item} />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <AdSlot id="ad-footer" position="footer" className="mt-8" />
    </div>
  );
}
