"use client";

import Link from "next/link";
import { ProtectedRoute } from "@/app/protected-route";
import Layout from "@/app/components/Layout";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import {
  Shield,
  MapPin,
  Users,
  UserCheck,
  Calculator,
  Bell,
  TrendingUp,
  Calendar,
  Activity,
  Heart,
  Star,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const stats = [
    {
      title: "Zones Actives",
      value: "12",
      icon: MapPin,
      color: "text-blue-600",
    },
    { title: "Praesidia", value: "48", icon: Shield, color: "text-green-600" },
    {
      title: "Membres Actifs",
      value: "324",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Officiers",
      value: "72",
      icon: UserCheck,
      color: "text-orange-600",
    },
  ];

  const quickActions = [
    {
      title: "Gérer les Zones",
      description: "Administrer les zones et paroisses",
      href: "/zones",
      icon: MapPin,
    },
    {
      title: "Praesidia",
      description: "Consulter et gérer les praesidia",
      href: "/praesidia",
      icon: Shield,
    },
    {
      title: "Registre des Membres",
      description: "Gestion des adhésions et statuts",
      href: "/members",
      icon: Users,
    },
    {
      title: "Finances",
      description: "Suivi des contributions et dépenses",
      href: "/finances",
      icon: Calculator,
    },
  ];

  const recentActivity = [
    {
      type: "new_member",
      message: "Nouveau membre ajouté - Marie Dubois",
      time: "2h",
      icon: Users,
    },
    {
      type: "mandate_end",
      message: "Fin de mandat - Président Praesidium St-Jean",
      time: "1j",
      icon: Bell,
    },
    {
      type: "contribution",
      message: "Contribution reçue - 150€ Praesidium Notre-Dame",
      time: "2j",
      icon: Calculator,
    },
    {
      type: "meeting",
      message: "Réunion programmée - Zone Centre",
      time: "3j",
      icon: Calendar,
    },
  ];

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary/80 p-8 text-primary-foreground">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                  <Shield className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1">Légion de Marie</h1>
                  <p className="text-primary-foreground/80">
                    Plateforme de Gestion du Conseil
                  </p>
                </div>
              </div>
              <p className="text-lg text-primary-foreground/90 max-w-2xl">
                Gérez efficacement les informations administratives, spirituelles et
                financières du Conseil de la Légion de Marie en respectant la
                structure hiérarchique établie.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <Button variant="secondary" asChild>
                  <Link href="/dashboard">
                    Tableau de Bord
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Badge variant="secondary" className="gap-1">
                  <Heart className="h-3 w-3" />
                  Concilium Legionis Mariae
                </Badge>
              </div>
            </div>
            <div
              className={
                'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-20'
              }
            ></div>
          </div>

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      +12% ce mois
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Quick Actions */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Actions Rapides
                  </CardTitle>
                  <CardDescription>
                    Accédez rapidement aux fonctionnalités principales
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={action.title}
                        href={action.href}
                        className="group flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                      >
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium group-hover:text-primary transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Activité Récente
                </CardTitle>
                <CardDescription>Dernières actions dans le système</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-3 pb-3 last:pb-0 border-b last:border-0"
                      >
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center mt-0.5">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">
                            il y a {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/dashboard">
                    Voir tout
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités de la Plateforme</CardTitle>
              <CardDescription>
                Un système complet pour la gestion de la Légion de Marie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 font-medium">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    Gestion des Zones
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Administration des zones géographiques et leurs paroisses
                    associées avec directeurs spirituels.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 font-medium">
                    <Shield className="h-4 w-4 text-green-500" />
                    Praesidia
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Suivi complet des praesidia, leurs types, dates de création et
                    structure organisationnelle.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 font-medium">
                    <UserCheck className="h-4 w-4 text-purple-500" />
                    Gestion des Officiers
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Suivi des mandats, postes et responsabilités des officiers avec
                    alertes automatiques.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 font-medium">
                    <Users className="h-4 w-4 text-orange-500" />
                    Registre des Membres
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Gestion des adhésions, statuts (actif, probationnaire,
                    auxiliaire) et dates de promesse.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 font-medium">
                    <Calendar className="h-4 w-4 text-red-500" />
                    Suivi des Présences
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Enregistrement des présences aux réunions avec statuts détaillés
                    (présent, absent, excusé).
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 font-medium">
                    <Calculator className="h-4 w-4 text-yellow-500" />
                    Gestion Financière
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Suivi des contributions, dépenses et soldes pour chaque
                    praesidium avec rapports détaillés.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
