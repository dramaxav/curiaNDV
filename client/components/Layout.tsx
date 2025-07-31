import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
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
  LogOut,
  Calendar,
  Archive,
  Crown
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { name: 'Accueil', href: '/', icon: Home, permission: null },
  { name: 'Tableau de bord', href: '/dashboard', icon: Users, permission: null },
  { name: 'Zones', href: '/zones', icon: MapPin, permission: 'view_all_praesidia' },
  { name: 'Praesidia', href: '/praesidia', icon: Shield, permission: null },
  { name: 'Officiers des Praesidia', href: '/officers', icon: UserCheck, permission: null },
  { name: 'Officiers du Conseil', href: '/council-officers', icon: Crown, permission: 'view_all_praesidia' },
  { name: 'Membres', href: '/members', icon: Users, permission: null },
  { name: 'Présences', href: '/attendance', icon: UserCheck, permission: null },
  { name: 'Manifestations', href: '/meetings', icon: Calendar, permission: null },
  { name: 'Finances', href: '/finances', icon: Calculator, permission: 'view_finances' },
  { name: 'Archives', href: '/archives', icon: Archive, permission: 'view_all_reports' },
  { name: 'Alertes', href: '/alerts', icon: Bell, permission: null },
  { name: 'Approbations', href: '/approvals', icon: Shield, permission: 'approve_accounts' },
];

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { utilisateur, logout, hasPermission } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getVisibleNavigationItems = () => {
    return navigationItems.filter(item => {
      if (!item.permission) return true;
      return hasPermission(item.permission);
    });
  };

  const NavItems = ({ mobile = false }) => (
    <nav className={cn("space-y-2", mobile && "pt-4")}>
      {getVisibleNavigationItems().map((item) => {
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
                <div className="mt-auto pt-4 border-t space-y-4">
                  {/* User Info Mobile */}
                  <div className="flex items-center gap-3 px-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {utilisateur ? getInitials(utilisateur.nom_prenom) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{utilisateur?.nom_prenom}</div>
                      <div className="text-xs text-muted-foreground truncate">{utilisateur?.poste}</div>
                      {utilisateur?.type_utilisateur === 'officier_conseil' && (
                        <Badge variant="secondary" className="text-xs mt-1">Conseil</Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" asChild>
                      <Link to="/settings">
                        <Settings className="h-4 w-4" />
                        Paramètres
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 text-muted-foreground"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </Button>
                  </div>
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
            <nav className="hidden xl:flex items-center space-x-1">
              {getVisibleNavigationItems().map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    <span className="hidden 2xl:inline">{item.name}</span>
                    <span className="xl:inline 2xl:hidden">
                      {item.name === 'Officiers des Praesidia' ? 'Off. Praes.' :
                       item.name === 'Officiers du Conseil' ? 'Off. Conseil' :
                       item.name === 'Tableau de bord' ? 'Dashboard' :
                       item.name.length > 8 ? item.name.substring(0, 8) + '...' : item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              {/* User Info */}
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium">{utilisateur?.nom_prenom}</div>
                  <div className="text-xs text-muted-foreground">
                    {utilisateur?.poste}
                    {utilisateur?.type_utilisateur === 'officier_conseil' && (
                      <Badge variant="secondary" className="ml-1 text-xs">Conseil</Badge>
                    )}
                  </div>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {utilisateur ? getInitials(utilisateur.nom_prenom) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/alerts">
                    <Bell className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/settings">
                    <Settings className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Déconnexion">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
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
          <div className="border-t p-4 space-y-4">
            {/* User Info Desktop Sidebar */}
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {utilisateur ? getInitials(utilisateur.nom_prenom) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{utilisateur?.nom_prenom}</div>
                <div className="text-xs text-muted-foreground truncate">{utilisateur?.poste}</div>
                {utilisateur?.type_utilisateur === 'officier_conseil' && (
                  <Badge variant="secondary" className="text-xs mt-1">Conseil</Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" asChild>
                <Link to="/settings">
                  <Settings className="h-4 w-4" />
                  Paramètres
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-muted-foreground"
                onClick={handleLogout}
              >
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
