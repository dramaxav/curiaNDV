"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@app/lib/utils";
import { Button } from "@components/ui/button";
import { Avatar, AvatarFallback } from "@components/ui/avatar";
import { Badge } from "@components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { useAuth } from "@app/providers";
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
  ChevronRight,
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { name: "Accueil", href: "/", icon: Home, permission: null },
  {
    name: "Tableau de bord",
    href: "/dashboard",
    icon: Users,
    permission: null,
  },
  {
    name: "Zones",
    href: "/zones",
    icon: MapPin,
    permission: "view_all_praesidia",
  },
  { name: "Praesidia", href: "/praesidia", icon: Shield, permission: null },
  {
    name: "Officiers des Praesidia",
    href: "/officers",
    icon: UserCheck,
    permission: null,
  },
  {
    name: "Officiers du Conseil",
    href: "/council-officers",
    icon: Crown,
    permission: "view_all_praesidia",
  },
  { name: "Membres", href: "/members", icon: Users, permission: null },
  { name: "Présences", href: "/attendance", icon: UserCheck, permission: null },
  {
    name: "Manifestations",
    href: "/meetings",
    icon: Calendar,
    permission: null,
  },
  {
    name: "Finances",
    href: "/finances",
    icon: Calculator,
    permission: "view_finances",
  },
  {
    name: "Finance Praesidium",
    href: "/praesidium-finance",
    icon: Calculator,
    permission: "manage_praesidium",
  },
  {
    name: "Archives",
    href: "/archives",
    icon: Archive,
    permission: "view_all_reports",
  },
  { name: "Alertes", href: "/alerts", icon: Bell, permission: null },
  {
    name: "Approbations",
    href: "/approvals",
    icon: Shield,
    permission: "approve_accounts,approve_finances",
  },
  {
    name: "Gestion Comptes",
    href: "/account-management",
    icon: Settings,
    permission: "approve_accounts",
  },
];

export default function Layout({ children }: LayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { utilisateur, logout, hasPermission } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getVisibleNavigationItems = () => {
    return navigationItems.filter((item) => {
      if (!item.permission) return true;

      if (item.permission.includes(',')) {
        const permissions = item.permission.split(',').map(p => p.trim());
        return permissions.some(permission => hasPermission(permission as any));
      }

      return hasPermission(item.permission as any);
    });
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavItems = () => (
    <nav className="space-y-1">
      {getVisibleNavigationItems().map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        const linkContent = (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
              isCollapsed && "justify-center px-2",
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
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
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
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar collapsible */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r transition-all duration-300",
          "hidden md:flex",
          isCollapsed ? "w-16" : "w-64",
          "md:translate-x-0",
          isMobileMenuOpen ? "flex w-64 translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header with collapse button */}
        <div className="flex items-center justify-between p-4 border-b">
          <div
            className={cn(
              "flex items-center gap-2",
              isCollapsed && "justify-center",
            )}
          >
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
      </div>

      {/* Main content area */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ml-0",
          isCollapsed ? "md:ml-16" : "md:ml-64",
        )}
      >
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center justify-between px-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-4 ml-auto">
              {/* Notifications */}
              <Link href="/alerts">
                <Button variant="ghost" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
              </Link>

              {/* User section */}
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {utilisateur ? getInitials(utilisateur.nom_prenom) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">
                    {utilisateur?.nom_prenom}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {utilisateur?.poste}
                    {utilisateur?.type_utilisateur === "officier_conseil" && (
                      <Badge variant="secondary" className="text-xs ml-2">
                        Conseil
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Settings */}
                <Link href="/settings">
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>

                {/* Logout */}
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container py-6 px-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
