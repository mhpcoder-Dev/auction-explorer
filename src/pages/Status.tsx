import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { fetchAuctionItems, DATA_SOURCES } from '@/lib/dataFetcher';

export default function Status() {
  const { data, isLoading } = useQuery({
    queryKey: ['auction-items'],
    queryFn: fetchAuctionItems,
  });

  const getStatusInfo = (sourceId: string) => {
    const itemCount = data?.items.filter((item) => item.sourceName.toLowerCase().includes(sourceId)).length || 0;
    const hasError = data?.errors.some((error) => error.source.toLowerCase().includes(sourceId));

    return { itemCount, hasError };
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const lastUpdate = new Date();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 text-foreground">System Status</h1>
          <p className="text-lg text-muted-foreground">
            Monitor the health and status of data sources.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Last Update</CardTitle>
            <CardDescription>Most recent data fetch across all sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg font-medium">{formatDate(lastUpdate)}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Data refreshes automatically every 10 minutes
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {DATA_SOURCES.map((source) => {
            const { itemCount, hasError } = getStatusInfo(source.id);
            const isActive = !isLoading && !hasError;

            return (
              <Card key={source.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {source.name}
                        {isActive ? (
                          <Badge variant="default" className="bg-success">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : hasError ? (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Error
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" />
                            Loading
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>Country: {source.country}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active Items:</span>
                      <span className="text-lg font-semibold">{itemCount}</span>
                    </div>

                    {hasError && (
                      <div className="bg-destructive/10 p-3 rounded-lg">
                        <p className="text-sm text-destructive">
                          {data?.errors.find((e) => e.source.includes(source.id))?.error ||
                            'Unable to fetch data from this source'}
                        </p>
                      </div>
                    )}

                    {source.id === 'canada-gcsurplus' && (
                      <div className="bg-info/10 p-3 rounded-lg">
                        <p className="text-sm text-info-foreground">
                          <strong>Note:</strong> This dataset contains historical sold items.
                          Active auction listings are not available from this source.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 bg-muted/30">
          <CardHeader>
            <CardTitle>About Status Monitoring</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              This page provides real-time status information for all connected data sources.
              If a source is experiencing issues, the system will continue to display data from
              other available sources.
            </p>
            <p>
              <strong>Limitations:</strong> Some datasets (like Canada GCSurplus) provide only
              historical or sold items, not active auctions. These limitations are noted on each
              source's status card.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
