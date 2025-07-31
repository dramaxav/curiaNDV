import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  Shield,
  UserCheck,
  Heart,
  Filter
} from 'lucide-react';

interface Alerte {
  id_alerte: string;
  type: 'fin_mandat' | 'reunion_manquee' | 'contribution_manquante' | 'membre_inactif' | 'promesse_due';
  titre: string;
  description: string;
  priorite: 'haute' | 'moyenne' | 'basse';
  date_creation: Date;
  date_echeance?: Date;
  statut: 'active' | 'resolue' | 'ignoree';
  entite_concernee: string;
  actions_suggerees: string[];
}

const mockAlertes: Alerte[] = [
  {
    id_alerte: '1',
    type: 'fin_mandat',
    titre: 'Fin de mandat - Président',
    description: 'Le mandat de Marie Dubois en tant que Président du praesidium Notre-Dame du Rosaire se termine dans 15 jours.',
    priorite: 'haute',
    date_creation: new Date('2024-01-20'),
    date_echeance: new Date('2024-02-15'),
    statut: 'active',
    entite_concernee: 'Notre-Dame du Rosaire',
    actions_suggerees: ['Organiser une assemblée générale', 'Préparer les élections', 'Notifier les membres']
  },
  {
    id_alerte: '2',
    type: 'reunion_manquee',
    titre: 'Réunion manquée',
    description: 'Le praesidium Saint-Jean-Baptiste n\'a pas tenu sa réunion hebdomadaire depuis 2 semaines.',
    priorite: 'moyenne',
    date_creation: new Date('2024-01-25'),
    statut: 'active',
    entite_concernee: 'Saint-Jean-Baptiste',
    actions_suggerees: ['Contacter le président', 'Vérifier les disponibilités', 'Reprogrammer la réunion']
  },
  {
    id_alerte: '3',
    type: 'contribution_manquante',
    titre: 'Contributions en retard',
    description: 'Le praesidium Sainte-Thérèse n\'a pas soumis son rapport financier du mois dernier.',
    priorite: 'moyenne',
    date_creation: new Date('2024-01-28'),
    date_echeance: new Date('2024-02-10'),
    statut: 'active',
    entite_concernee: 'Sainte-Thérèse',
    actions_suggerees: ['Contacter le trésorier', 'Rappeler les échéances', 'Proposer une aide']
  },
  {
    id_alerte: '4',
    type: 'membre_inactif',
    titre: 'Membre inactif depuis 3 mois',
    description: 'Pierre Laurent n\'a pas participé aux réunions depuis 3 mois. Suivi requis.',
    priorite: 'basse',
    date_creation: new Date('2024-01-15'),
    statut: 'active',
    entite_concernee: 'Pierre Laurent',
    actions_suggerees: ['Contact personnel', 'Visite à domicile', 'Évaluer la situation']
  },
  {
    id_alerte: '5',
    type: 'promesse_due',
    titre: 'Promesse en attente',
    description: 'Jean Dupont est probationnaire depuis 18 mois. Il peut maintenant faire sa promesse.',
    priorite: 'moyenne',
    date_creation: new Date('2024-01-30'),
    statut: 'active',
    entite_concernee: 'Jean Dupont',
    actions_suggerees: ['Préparer la cérémonie', 'Formation spirituelle', 'Fixer une date']
  },
  {
    id_alerte: '6',
    type: 'fin_mandat',
    titre: 'Mandat terminé avec succès',
    description: 'Le mandat de Sophie Martin comme secrétaire s\'est terminé et un nouveau secrétaire a été élu.',
    priorite: 'basse',
    date_creation: new Date('2024-01-10'),
    statut: 'resolue',
    entite_concernee: 'Notre-Dame du Rosaire',
    actions_suggerees: []
  }
];

export default function Alerts() {
  const [alertes, setAlertes] = useState<Alerte[]>(mockAlertes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriorite, setSelectedPriorite] = useState<string>('all');
  const [selectedStatut, setSelectedStatut] = useState<string>('active');

  const filteredAlertes = useMemo(() => {
    return alertes.filter(alerte => {
      const matchesSearch = alerte.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           alerte.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           alerte.entite_concernee.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || alerte.type === selectedType;
      const matchesPriorite = selectedPriorite === 'all' || alerte.priorite === selectedPriorite;
      const matchesStatut = selectedStatut === 'all' || alerte.statut === selectedStatut;
      
      return matchesSearch && matchesType && matchesPriorite && matchesStatut;
    });
  }, [alertes, searchTerm, selectedType, selectedPriorite, selectedStatut]);

  const stats = {
    total: alertes.length,
    actives: alertes.filter(a => a.statut === 'active').length,
    hautes: alertes.filter(a => a.priorite === 'haute' && a.statut === 'active').length,
    resolues_semaine: alertes.filter(a => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return a.statut === 'resolue' && a.date_creation >= weekAgo;
    }).length
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fin_mandat': return <UserCheck className="h-4 w-4 text-orange-500" />;
      case 'reunion_manquee': return <Calendar className="h-4 w-4 text-red-500" />;
      case 'contribution_manquante': return <Bell className="h-4 w-4 text-yellow-500" />;
      case 'membre_inactif': return <Users className="h-4 w-4 text-blue-500" />;
      case 'promesse_due': return <Heart className="h-4 w-4 text-purple-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'fin_mandat': return 'Fin de mandat';
      case 'reunion_manquee': return 'Réunion manquée';
      case 'contribution_manquante': return 'Contribution manquante';
      case 'membre_inactif': return 'Membre inactif';
      case 'promesse_due': return 'Promesse due';
      default: return type;
    }
  };

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'haute': return 'destructive';
      case 'moyenne': return 'default';
      case 'basse': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'active': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'resolue': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ignoree': return <Clock className="h-4 w-4 text-gray-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleStatusChange = (alerteId: string, newStatus: 'active' | 'resolue' | 'ignoree') => {
    setAlertes(alertes.map(alerte =>
      alerte.id_alerte === alerteId
        ? { ...alerte, statut: newStatus }
        : alerte
    ));
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Il y a ${diffInDays}j`;
    }
  };

  const getTimeUntilDeadline = (date?: Date) => {
    if (!date) return null;
    
    const now = new Date();
    const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 0) {
      return { text: 'Échéance dépassée', color: 'text-red-600' };
    } else if (diffInHours < 24) {
      return { text: `${diffInHours}h restantes`, color: 'text-orange-600' };
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return { text: `${diffInDays}j restants`, color: 'text-blue-600' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alertes et Notifications</h1>
          <p className="text-muted-foreground">
            Système d'alertes pour le suivi des activités de la Légion de Marie
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Bell className="h-3 w-3" />
            {stats.actives} alertes actives
          </Badge>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alertes</CardTitle>
            <Bell className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actives</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.actives}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Haute Priorité</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.hautes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Résolues (7j)</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolues_semaine}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtrer les Alertes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les alertes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type d'alerte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="fin_mandat">Fin de mandat</SelectItem>
                <SelectItem value="reunion_manquee">Réunion manquée</SelectItem>
                <SelectItem value="contribution_manquante">Contribution manquante</SelectItem>
                <SelectItem value="membre_inactif">Membre inactif</SelectItem>
                <SelectItem value="promesse_due">Promesse due</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPriorite} onValueChange={setSelectedPriorite}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes priorités</SelectItem>
                <SelectItem value="haute">Haute</SelectItem>
                <SelectItem value="moyenne">Moyenne</SelectItem>
                <SelectItem value="basse">Basse</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatut} onValueChange={setSelectedStatut}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="active">Actives</SelectItem>
                <SelectItem value="resolue">Résolues</SelectItem>
                <SelectItem value="ignoree">Ignorées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlertes.map((alerte) => {
          const deadline = getTimeUntilDeadline(alerte.date_echeance);
          return (
            <Card key={alerte.id_alerte} className={`${
              alerte.priorite === 'haute' && alerte.statut === 'active' ? 'border-red-200 bg-red-50/30' : ''
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5">
                      {getTypeIcon(alerte.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{alerte.titre}</h3>
                        <Badge variant={getPrioriteColor(alerte.priorite) as any} className="text-xs">
                          {alerte.priorite}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getTypeName(alerte.type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {alerte.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          {alerte.entite_concernee}
                        </span>
                        <span>{getTimeAgo(alerte.date_creation)}</span>
                        {deadline && (
                          <span className={deadline.color}>
                            {deadline.text}
                          </span>
                        )}
                      </div>
                      {alerte.actions_suggerees.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Actions suggérées:</p>
                          <div className="flex flex-wrap gap-1">
                            {alerte.actions_suggerees.map((action, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {action}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="flex items-center gap-1 mr-2">
                      {getStatutIcon(alerte.statut)}
                      <span className="text-xs text-muted-foreground capitalize">
                        {alerte.statut === 'resolue' ? 'Résolue' : 
                         alerte.statut === 'ignoree' ? 'Ignorée' : 'Active'}
                      </span>
                    </div>
                    {alerte.statut === 'active' && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(alerte.id_alerte, 'resolue')}
                          className="text-xs"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Résoudre
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStatusChange(alerte.id_alerte, 'ignoree')}
                          className="text-xs"
                        >
                          Ignorer
                        </Button>
                      </div>
                    )}
                    {alerte.statut !== 'active' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStatusChange(alerte.id_alerte, 'active')}
                        className="text-xs"
                      >
                        Réactiver
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {filteredAlertes.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Aucune alerte trouvée
              </h3>
              <p className="text-sm text-muted-foreground">
                Modifiez vos critères de recherche pour voir plus d'alertes.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
