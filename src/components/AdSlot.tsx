interface AdSlotProps {
  id: string;
  position: 'header' | 'footer' | 'sidebar' | 'in-feed';
  className?: string;
}

export default function AdSlot({ id, position, className = '' }: AdSlotProps) {
  // In production, this would integrate with actual ad networks
  // For now, show a placeholder that makes it clear where ads will appear
  
  const heights: Record<typeof position, string> = {
    header: 'h-24',
    footer: 'h-20',
    sidebar: 'h-64',
    'in-feed': 'h-32',
  };

  return (
    <div
      id={id}
      className={`${heights[position]} w-full bg-muted/30 border border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center ${className}`}
      data-ad-position={position}
    >
      <div className="text-center text-muted-foreground">
        <p className="text-sm font-medium">Ad Space</p>
        <p className="text-xs">{position}</p>
      </div>
    </div>
  );
}
