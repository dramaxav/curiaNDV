import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  Home, 
  MapPin, 
  Users, 
  Shield, 
  UserCheck, 
  Calculator,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Tableau de bord', href: '/dashboard', icon: Users },
  { name: 'Zones', href: '/zones', icon: MapPin },
  { name: 'Praesidia', href: '/praesidia', icon: Shield },
  { name: 'Officiers', href: '/officers', icon: UserCheck },
  { name: 'Membres', href: '/members', icon: Users },
  { name: 'Présences', href: '/attendance', icon: UserCheck },
  { name: 'Réunions', href: '/meetings', icon: Calendar },
  { name: 'Finances', href: '/finances', icon: Calculator },
  { name: 'Alertes', href: '/alerts', icon: Bell },
];

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const NavItems = ({ mobile = false }) => (
    <nav className={cn("space-y-2", mobile && "pt-4")}>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => mobile && setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 px-2 py-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-lg">Légion de Marie</span>
                </div>
                <NavItems mobile />
                <div className="mt-auto pt-4 border-t">
                  <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
                    <Settings className="h-4 w-4" />
                    Paramètres
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2 md:mr-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:inline">Légion de Marie</span>
          </div>

          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/alerts">
                  <Bell className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:w-64 md:top-16">
        <div className="flex flex-col h-full bg-card border-r">
          <div className="flex-1 p-4">
            <NavItems />
          </div>
          <div className="border-t p-4">
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
                <Settings className="h-4 w-4" />
                Paramètres
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="md:pl-64 min-h-[calc(100vh-4rem)]">
        <div className="container py-6 px-4">
          {children}
        </div>
      </main>
    </div>
  );
}
