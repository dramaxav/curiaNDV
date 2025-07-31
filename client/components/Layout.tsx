import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  Crown,
  ChevronLeft,
  ChevronRight
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
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const NavItems = () => (
    <nav className="space-y-1">
      {getVisibleNavigationItems().map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;

        const linkContent = (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
              isCollapsed && "justify-center px-2"
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">{item.name}</span>}
          </Link>
        );

        if (isCollapsed) {
          return (
            <TooltipProvider key={item.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {linkContent}
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  {item.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }

        return linkContent;
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar collapsible */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Header avec bouton collapse */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-lg">Légion de Marie</span>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-3 overflow-y-auto">
          <NavItems />
        </div>

        {/* User section en bas */}
        <div className="border-t p-3 space-y-3">
          {/* User Info */}
          <div className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center"
          )}>
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {utilisateur ? getInitials(utilisateur.nom_prenom) : 'U'}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{utilisateur?.nom_prenom}</div>
                <div className="text-xs text-muted-foreground truncate">{utilisateur?.poste}</div>
                {utilisateur?.type_utilisateur === 'officier_conseil' && (
                  <Badge variant="secondary" className="text-xs mt-1">Conseil</Badge>
                )}
              </div>
            )}
          </div>

          {/* Settings et Logout */}
          <div className="space-y-1">
            {isCollapsed ? (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-full" asChild>
                        <Link to="/settings">
                          <Settings className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Paramètres
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-full" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Déconnexion
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Header simple pour notifications */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        isCollapsed ? "ml-16" : "ml-64"
      )}>
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center justify-end px-4 gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/alerts">
                <Bell className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container py-6 px-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
