import { AuctionItem } from '@/types/auction';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, MessageSquare } from 'lucide-react';
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
  const primaryImage = item.images?.[0] || item.imageUrl;

  return (
    <>
      <Card 
        id={`item-${item.id}`}
        className="scroll-mt-24 shadow-card hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col h-full"
        onClick={() => setShowModal(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setShowModal(true);
          }
        }}
        aria-label={`View details for ${item.title}`}
      >
        <article className="flex flex-col h-full">
          {/* Image */}
          {primaryImage && (
            <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
              <img
                src={primaryImage}
                alt={item.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          )}

          <CardHeader className="flex-grow">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="font-medium">
                    {getAssetTypeLabel(item.assetType)}
                  </Badge>
                  {!item.isActive && (
                    <Badge variant="outline">Historical</Badge>
                  )}
                </div>
                
                <CardTitle className="text-xl mb-2 line-clamp-2">{item.title}</CardTitle>
                
                <CardDescription className="text-base line-clamp-3">
                  {item.shortDescription}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.location}</span>
              </div>
              
              {(item.auctionStartDate || item.auctionEndDate) && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span className="text-xs">
                    {item.auctionStartDate && `Starts: ${formatDate(item.auctionStartDate)}`}
                    {item.auctionStartDate && item.auctionEndDate && ' • '}
                    {item.auctionEndDate && `Ends: ${formatDate(item.auctionEndDate)}`}
                  </span>
                </div>
              )}
            </div>

            {/* Attribution Hint */}
            {licenseHint && (
              <p className="text-xs text-muted-foreground italic truncate">
                {licenseHint}
              </p>
            )}
          </CardContent>

          <CardFooter className="flex items-center gap-3 mt-auto">
            {/* Comment Count Badge */}
            {commentCount > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</span>
              </div>
            )}
          </CardFooter>
        </article>
      </Card>

      <ItemModal item={item} open={showModal} onOpenChange={setShowModal} />
    </>
  );
}
