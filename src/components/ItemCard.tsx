import { AuctionItem } from '@/types/auction';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, MapPin, Calendar, Share2, MessageSquare } from 'lucide-react';
import { getAssetTypeLabel } from '@/lib/assetClassifier';
import { toast } from 'sonner';
import { useState } from 'react';
import CommentThread from './CommentThread';

interface ItemCardProps {
  item: AuctionItem;
}

export default function ItemCard({ item }: ItemCardProps) {
  const [showComments, setShowComments] = useState(false);
  
  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}#item-${item.id}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card 
      id={`item-${item.id}`}
      className="scroll-mt-24 shadow-card hover:shadow-lg transition-shadow duration-300"
    >
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
            <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
            <CardDescription className="text-base">
              {item.shortDescription}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{item.location}</span>
          </div>
          
          {(item.auctionStartDate || item.auctionEndDate) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {item.auctionStartDate && `Starts: ${formatDate(item.auctionStartDate)}`}
                {item.auctionStartDate && item.auctionEndDate && ' • '}
                {item.auctionEndDate && `Ends: ${formatDate(item.auctionEndDate)}`}
              </span>
            </div>
          )}
        </div>

        <p className="text-sm text-foreground/80 leading-relaxed">
          {item.description}
        </p>

        {item.sourceName && (
          <p className="text-xs text-muted-foreground">
            Source: {item.sourceName}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <div className="flex gap-2 w-full">
          <Button
            variant="default"
            className="flex-1"
            onClick={() => window.open(item.sourceUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Source
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
            title="Share this item"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowComments(!showComments)}
            title="Comments"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>

        {showComments && (
          <div className="w-full pt-3 border-t">
            <CommentThread itemId={item.id} />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
