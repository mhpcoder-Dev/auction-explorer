import { AuctionItem } from '@/types/auction';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, Calendar, Share2, Clock } from 'lucide-react';
import { getAssetTypeLabel } from '@/lib/assetClassifier';
import { toast } from 'sonner';
import CommentThread from './CommentThread';
import { DATA_SOURCES } from '@/lib/dataFetcher';

interface ItemModalProps {
  item: AuctionItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ItemModal({ item, open, onOpenChange }: ItemModalProps) {
  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}#item-${item.id}+expand`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLicenseInfo = () => {
    const source = DATA_SOURCES.find(s => s.id === item.licenseId);
    return source?.attribution;
  };

  const licenseInfo = getLicenseInfo();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="font-medium">
              {getAssetTypeLabel(item.assetType)}
            </Badge>
            {!item.isActive && (
              <Badge variant="outline">Historical</Badge>
            )}
          </div>
          <DialogTitle className="text-2xl">{item.title}</DialogTitle>
          <DialogDescription className="text-base">
            {item.shortDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Large Image */}
          {item.imageUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>{item.location}, {item.country}</span>
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

            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>Last updated: {formatDate(item.fetchedAt)}</span>
            </div>
          </div>

          {/* Full Description */}
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed">{item.description}</p>
          </div>

          {/* Attribution */}
          {licenseInfo && (
            <div className="border-l-4 border-primary/30 bg-muted/50 p-4 rounded">
              <h4 className="font-semibold text-sm mb-2">Data Source & License</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {licenseInfo.text}
              </p>
              <div className="flex gap-2 text-xs">
                <a
                  href={licenseInfo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {licenseInfo.license}
                </a>
              </div>
            </div>
          )}

          {/* Source Info */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Source: {item.sourceName}</p>
            <p>Item ID: {item.id}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="default"
              className="flex-1"
              onClick={() => window.open(item.sourceUrl, '_blank', 'noopener,noreferrer')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Original Source
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              title="Share this item"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Comments */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Comments</h3>
            <CommentThread itemId={item.id} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
