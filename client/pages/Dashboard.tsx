import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  MapPin, 
  Shield, 
  UserCheck, 
  Calculator, 
  Bell,
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function Dashboard() {
  const kpis = [
    { 
      title: 'Zones Actives', 
      value: '12', 
      change: '+2',
      changeType: 'positive',
      icon: MapPin,
      description: '2 nouvelles zones ce mois'
    },
    { 
      title: 'Praesidia', 
      value: '48', 
      change: '+5',
      changeType: 'positive',
      icon: Shield,
      description: '5 nouveaux praesidia'
    },
    { 
      title: 'Membres Actifs', 
      value: '324', 
      change: '+18',
      changeType: 'positive',
      icon: Users,
      description: '18 nouvelles adhésions'
    },
    { 
      title: 'Taux de Présence', 
      value: '87%', 
      change: '-3%',
      changeType: 'negative',
      icon: Activity,
      description: 'Moyenne mensuelle'
    }
  ];

  const alerts = [
    {
      type: 'warning',
      title: 'Fin de Mandat Proche',
      message: '3 officiers terminent leur mandat ce mois',
      time: '2 jours',
      priority: 'high'
    },
    {
      type: 'info',
      title: 'Réunion Programmée',
      message: 'Conseil de Zone Centre - Vendredi 15h',
      time: '5 jours',
      priority: 'medium'
    },
    {
      type: 'success',
      title: 'Contributions Reçues',
      message: 'Toutes les contributions du mois collectées',
      time: '1 semaine',
      priority: 'low'
    }
  ];

  const financialSummary = [
    { praesidium: 'Notre-Dame du Rosaire', contributions: 450, depenses: 320, solde: 130 },
    { praesidium: 'Saint-Jean-Baptiste', contributions: 380, depenses: 250, solde: 130 },
    { praesidium: 'Sainte-Thérèse', contributions: 520, depenses: 400, solde: 120 },
    { praesidium: 'Saint-Pierre', contributions: 290, depenses: 180, solde: 110 }
  ];

  const upcomingEvents = [
    { title: 'Assemblée Générale Zone Nord', date: '2024-02-15', type: 'assembly' },
    { title: 'Formation Nouveaux Membres', date: '2024-02-18', type: 'formation' },
    { title: 'Retraite Spirituelle', date: '2024-02-22', type: 'spiritual' },
    { title: 'Réunion Conseil', date: '2024-02-25', type: 'meeting' }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de la gestion de la Légion de Marie
          </p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Nouvelle Réunion
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  {kpi.changeType === 'positive' ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  )}
                  <span className={kpi.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}>
                    {kpi.change}
                  </span>
                  <span className="ml-1">{kpi.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Alerts */}
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alertes et Notifications
              </CardTitle>
              <CardDescription>
                Informations importantes nécessitant une attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{alert.title}</h4>
                        <Badge variant={getAlertColor(alert.priority) as any} className="text-xs">
                          {alert.priority === 'high' ? 'Urgent' : 
                           alert.priority === 'medium' ? 'Important' : 'Info'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">Il y a {alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Événements à Venir
              </CardTitle>
              <CardDescription>
                Prochaines activités et réunions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Financial Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Aperçu Financier par Praesidium
          </CardTitle>
          <CardDescription>
            Résumé des contributions, dépenses et soldes du mois en cours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {financialSummary.map((item, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-lg">
                <h4 className="font-medium text-sm">{item.praesidium}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Contributions</span>
                    <span className="text-green-600 font-medium">+{item.contributions}€</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Dépenses</span>
                    <span className="text-red-600 font-medium">-{item.depenses}€</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Solde</span>
                      <span className="font-bold text-primary">{item.solde}€</span>
                    </div>
                    <Progress 
                      value={(item.solde / item.contributions) * 100} 
                      className="h-2 mt-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
