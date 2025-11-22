import { AuctionItem } from '@/types/auction';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Maximize2, MapPin, Calendar, MessageSquare } from 'lucide-react';
import { getAssetTypeLabel } from '@/lib/assetClassifier';
import { useState, useEffect } from 'react';
import ItemModal from './ItemModal';
import { supabase } from '@/integrations/supabase/client';
import { DATA_SOURCES } from '@/lib/dataFetcher';

interface ItemCardProps {
  item: AuctionItem;
}

export default function ItemCard({ item }: ItemCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  
  useEffect(() => {
    // Fetch comment count
    const fetchCommentCount = async () => {
      const { count } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('item_id', item.id)
        .eq('status', 'approved');
      
      setCommentCount(count || 0);
    };

    fetchCommentCount();

    // Subscribe to comment changes
    const channel = supabase
      .channel(`comments-${item.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `item_id=eq.${item.id}`
        },
        () => {
          fetchCommentCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [item.id]);

  // Check if modal should open on mount (deep link with expand)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === `#item-${item.id}+expand`) {
      setShowModal(true);
    }
  }, [item.id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getLicenseHint = () => {
    const source = DATA_SOURCES.find(s => s.id === item.licenseId);
    if (!source?.attribution) return null;
    
    if (source.attribution.license === 'Public Domain') {
      return `Source: ${item.sourceName}`;
    }
    return `${source.attribution.license} — ${item.country}`;
  };

  const licenseHint = getLicenseHint();

  return (
    <>
      <Card 
        id={`item-${item.id}`}
        className="scroll-mt-24 shadow-card hover:shadow-lg transition-shadow duration-300"
      >
        <article>
          {/* Image */}
          {item.imageUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </a>
          )}

          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="font-medium">
                    {getAssetTypeLabel(item.assetType)}
                  </Badge>
                  {!item.isActive && (
                    <Badge variant="outline">Historical</Badge>
                  )}
                </div>
                
                {/* Clickable Title */}
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                </a>
                
                {/* Clickable Description */}
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  <CardDescription className="text-base">
                    {item.shortDescription}
                  </CardDescription>
                </a>
              </div>

              {/* Expand Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowModal(true)}
                title="View details"
                className="flex-shrink-0"
              >
                <Maximize2 className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{item.location}</span>
              </div>
              
              {(item.auctionStartDate || item.auctionEndDate) && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span>
                    {item.auctionStartDate && `Starts: ${formatDate(item.auctionStartDate)}`}
                    {item.auctionStartDate && item.auctionEndDate && ' • '}
                    {item.auctionEndDate && `Ends: ${formatDate(item.auctionEndDate)}`}
                  </span>
                </div>
              )}
            </div>

            {/* Attribution Hint */}
            {licenseHint && (
              <p className="text-xs text-muted-foreground italic">
                {licenseHint}
              </p>
            )}
          </CardContent>

          <CardFooter className="flex items-center gap-3">
            {/* Comment Count Badge */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</span>
            </button>
          </CardFooter>
        </article>
      </Card>

      <ItemModal item={item} open={showModal} onOpenChange={setShowModal} />
    </>
  );
}
