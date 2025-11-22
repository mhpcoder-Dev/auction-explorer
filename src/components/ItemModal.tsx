import { AuctionItem } from '@/types/auction';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Share2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAssetTypeLabel } from '@/lib/assetClassifier';
import { toast } from 'sonner';
import CommentThread from './CommentThread';
import { DATA_SOURCES } from '@/lib/dataFetcher';
import { useState } from 'react';

interface ItemModalProps {
  item: AuctionItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ItemModal({ item, open, onOpenChange }: ItemModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = item.images || (item.imageUrl ? [item.imageUrl] : []);
  
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
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
          {/* Image Carousel */}
          {images.length > 0 && (
            <div className="space-y-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <img
                  src={images[currentImageIndex]}
                  alt={`${item.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                      onClick={prevImage}
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                      onClick={nextImage}
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img
                        src={img}
                        alt={`${item.title} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
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
                <span className="text-muted-foreground">
                  {licenseInfo.license} • {licenseInfo.link}
                </span>
              </div>
            </div>
          )}

          {/* Source Info */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Source: {item.sourceName}</p>
            <p>Source URL: {item.sourceUrl}</p>
            <p>Item ID: {item.id}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleShare}
              title="Share this item"
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Copy Share Link
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
