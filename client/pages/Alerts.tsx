import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Filter,
  UserX,
  FileText
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { AlerteProbation, Membre, Praesidium } from '@shared/types';

interface Alerte {
  id_alerte: string;
  type: 'fin_mandat' | 'reunion_manquee' | 'contribution_manquante' | 'membre_inactif' | 'promesse_due' | 'probation_prolongee';
  titre: string;
  description: string;
  priorite: 'haute' | 'moyenne' | 'basse';
  date_creation: Date;
  date_echeance?: Date;
  statut: 'active' | 'resolue' | 'ignoree';
  entite_concernee: string;
  actions_suggerees: string[];
}

// Mock data pour les membres en probation
const mockMembres: Membre[] = [
  {
    id_membre: '1',
    id_praesidium: '1',
    nom_prenom: 'Jean Martin',
    statut: 'probationnaire',
    date_adhesion: new Date('2023-10-15'), // Plus de 3 mois
    actif: true
  },
  {
    id_membre: '2',
    id_praesidium: '1',
    nom_prenom: 'Sophie Dubois',
    statut: 'probationnaire',
    date_adhesion: new Date('2023-08-20'), // Plus de 5 mois
    actif: true
  },
  {
    id_membre: '3',
    id_praesidium: '2',
    nom_prenom: 'Paul Ngata',
    statut: 'probationnaire',
    date_adhesion: new Date('2024-01-10'), // Moins de 3 mois
    actif: true
  }
];

const mockPraesidia: Praesidium[] = [
  { id_praesidium: '1', id_zone: '1', nom_praesidium: 'Notre-Dame du Rosaire', date_creation: new Date(), directeur_spirituel: 'Père Jean', type_praesidium: 'adulte', actif: true },
  { id_praesidium: '2', id_zone: '1', nom_praesidium: 'Saint-Jean-Baptiste', date_creation: new Date(), directeur_spirituel: 'Père Jean', type_praesidium: 'adulte', actif: true }
];

const mockAlertesBase: Alerte[] = [
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
  const { utilisateur, hasPermission } = useAuth();
  const [alertes, setAlertes] = useState<Alerte[]>(mockAlertesBase);
  const [alertesProbation, setAlertesProbation] = useState<AlerteProbation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriorite, setSelectedPriorite] = useState<string>('all');
  const [selectedStatut, setSelectedStatut] = useState<string>('active');

  // Fonction pour vérifier et générer les alertes de probation
  const checkProbationAlerts = () => {
    const now = new Date();
    const troisMoisEnMs = 3 * 30 * 24 * 60 * 60 * 1000; // Approximation 3 mois

    const membresEnProbationLongue = mockMembres.filter(membre => {
      if (membre.statut !== 'probationnaire' || !membre.actif) return false;

      const dureeMs = now.getTime() - membre.date_adhesion.getTime();
      return dureeMs >= troisMoisEnMs;
    });

    const nouvellesAlertesProbation: AlerteProbation[] = membresEnProbationLongue.map(membre => {
      const praesidium = mockPraesidia.find(p => p.id_praesidium === membre.id_praesidium);
      const dureeMois = Math.floor((now.getTime() - membre.date_adhesion.getTime()) / (30 * 24 * 60 * 60 * 1000));

      return {
        id_alerte: `prob_${membre.id_membre}`,
        id_membre: membre.id_membre,
        nom_membre: membre.nom_prenom,
        id_praesidium: membre.id_praesidium,
        nom_praesidium: praesidium?.nom_praesidium || 'Praesidium inconnu',
        date_debut_probation: membre.date_adhesion,
        duree_probation_mois: dureeMois,
        statut: 'active',
        date_creation: now
      };
    });

    setAlertesProbation(nouvellesAlertesProbation);

    // Ajouter les alertes de probation aux alertes générales
    const alertesProbationConverties: Alerte[] = nouvellesAlertesProbation.map(alert => ({
      id_alerte: alert.id_alerte,
      type: 'probation_prolongee',
      titre: `Probation prolongée - ${alert.nom_membre}`,
      description: `${alert.nom_membre} est en probation depuis ${alert.duree_probation_mois} mois dans le praesidium ${alert.nom_praesidium}. Il est temps de considérer sa promesse.`,
      priorite: 'haute' as const,
      date_creation: alert.date_creation,
      date_echeance: new Date(alert.date_debut_probation.getTime() + (6 * 30 * 24 * 60 * 60 * 1000)), // 6 mois max
      statut: 'active' as const,
      entite_concernee: alert.nom_praesidium,
      actions_suggerees: [
        'Contacter les officiers du praesidium',
        'Évaluer la formation du membre',
        'Programmer la cérémonie de promesse',
        'Préparer les documents nécessaires'
      ]
    }));

    setAlertes(prev => {
      // Enlever les anciennes alertes de probation et ajouter les nouvelles
      const alertesSansProbation = prev.filter(a => a.type !== 'probation_prolongee');
      return [...alertesSansProbation, ...alertesProbationConverties];
    });
  };

  // Vérifier les alertes de probation au chargement et toutes les heures
  useEffect(() => {
    checkProbationAlerts();
    const interval = setInterval(checkProbationAlerts, 60 * 60 * 1000); // Toutes les heures
    return () => clearInterval(interval);
  }, []);

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
      case 'probation_prolongee': return <UserX className="h-4 w-4 text-red-600" />;
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
      case 'probation_prolongee': return 'Probation prolongée';
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

    // Si c'est une alerte de probation, mettre à jour aussi la liste des alertes de probation
    if (alerteId.startsWith('prob_')) {
      setAlertesProbation(prev => prev.map(alert =>
        alert.id_alerte === alerteId
          ? { ...alert, statut: newStatus as any, traite_par: utilisateur?.id_utilisateur, date_traitement: new Date() }
          : alert
      ));
    }
  };

  const handleProbationAlert = (alerteId: string, action: 'promesse' | 'formation' | 'ignore') => {
    const alerteProbation = alertesProbation.find(a => a.id_alerte === alerteId);
    if (!alerteProbation) return;

    let message = '';
    switch (action) {
      case 'promesse':
        message = `Cérémonie de promesse programmée pour ${alerteProbation.nom_membre}`;
        break;
      case 'formation':
        message = `Formation complémentaire organisée pour ${alerteProbation.nom_membre}`;
        break;
      case 'ignore':
        message = `Alerte mise en attente pour ${alerteProbation.nom_membre}`;
        break;
    }

    // Marquer l'alerte comme traitée
    handleStatusChange(alerteId, action === 'ignore' ? 'ignoree' : 'resolue');

    console.log(`Action: ${action} - ${message}`);
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
            Syst��me d'alertes pour le suivi des activités de la Légion de Marie
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
