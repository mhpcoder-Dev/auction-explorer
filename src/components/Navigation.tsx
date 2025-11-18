import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Gavel } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Active Listings' },
    { path: '/future', label: 'Future Items' },
    { path: '/attributions', label: 'Attributions' },
    { path: '/status', label: 'Status' },
  ];

  return (
    <nav className="bg-card border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary rounded-lg group-hover:bg-primary/90 transition-colors">
              <Gavel className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Moneymeta</h1>
              <p className="text-xs text-muted-foreground">Government Auction Aggregator</p>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? 'default' : 'ghost'}
                size="sm"
                asChild
              >
                <Link to={item.path}>{item.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
