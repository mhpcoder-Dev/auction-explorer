import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { DATA_SOURCES } from '@/lib/dataFetcher';

export default function Attributions() {
  const sourcesWithAttribution = DATA_SOURCES.filter(
    (source) => source.attribution
  );

  const usSource = DATA_SOURCES.find((source) => source.country === 'United States');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 text-foreground">Data Sources & Attributions</h1>
          <p className="text-lg text-muted-foreground">
            Moneymeta aggregates data from official government sources. Below are the attributions
            and licensing information for each data source.
          </p>
        </div>

        <div className="space-y-6">
          {/* US Public Domain */}
          {usSource && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {usSource.name}
                  <a
                    href={usSource.attribution?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </CardTitle>
                <CardDescription>Country: {usSource.country}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>License:</strong> {usSource.attribution?.license}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {usSource.attribution?.text}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    US federal government data is in the public domain and may be used freely.
                    We recommend citing the source for transparency.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sources requiring attribution */}
          {sourcesWithAttribution.map((source) => {
            if (source.country === 'United States') return null; // Already handled above

            return (
              <Card key={source.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {source.name}
                    {source.attribution?.link && (
                      <a
                        href={source.attribution.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </CardTitle>
                  <CardDescription>Country: {source.country}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>License:</strong> {source.attribution?.license}
                    </p>
                    <p className="text-sm">
                      <strong>Attribution Required:</strong> Yes
                    </p>
                    <div className="bg-muted/50 p-3 rounded-lg mt-3">
                      <p className="text-sm">{source.attribution?.text}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 bg-muted/30">
          <CardHeader>
            <CardTitle>About Data Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              Moneymeta uses only official, publicly available data sources and APIs provided by
              government agencies. We do not scrape websites or bypass terms of service.
            </p>
            <p>
              All data is displayed with proper attribution as required by the respective licenses.
              For specific questions about data usage or licensing, please refer to the official
              source websites linked above.
            </p>
            <p>
              If you are a data provider and have questions or concerns about how your data is
              displayed, please contact us.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
