import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Plus, 
  Search,
  Edit,
  Trash2,
  Shield,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import type { Praesidium } from '@shared/types';

interface Reunion {
  id_reunion: string;
  id_praesidium: string;
  titre: string;
  date_reunion: Date;
  heure_debut: string;
  heure_fin: string;
  lieu: string;
  ordre_du_jour: string;
  statut: 'planifiee' | 'en_cours' | 'terminee' | 'annulee';
  participants_attendus: number;
  participants_presents?: number;
}

// Mock data
const mockPraesidia: Praesidium[] = [
  { id_praesidium: '1', id_zone: '1', nom_praesidium: 'Notre-Dame du Rosaire', date_creation: new Date(), directeur_spirituel: 'Père Jean', type_praesidium: 'adulte', actif: true },
  { id_praesidium: '2', id_zone: '1', nom_praesidium: 'Saint-Jean-Baptiste', date_creation: new Date(), directeur_spirituel: 'Père Jean', type_praesidium: 'adulte', actif: true },
  { id_praesidium: '3', id_zone: '2', nom_praesidium: 'Sainte-Thérèse', date_creation: new Date(), directeur_spirituel: 'Père Michel', type_praesidium: 'junior', actif: true }
];

const mockReunions: Reunion[] = [
  {
    id_reunion: '1',
    id_praesidium: '1',
    titre: 'Réunion Hebdomadaire',
    date_reunion: new Date('2024-02-15'),
    heure_debut: '19:30',
    heure_fin: '21:00',
    lieu: 'Salle paroissiale',
    ordre_du_jour: 'Prière, rapport des membres, planning missions',
    statut: 'planifiee',
    participants_attendus: 12,
    participants_presents: 10
  },
  {
    id_reunion: '2',
    id_praesidium: '2',
    titre: 'Assemblée Générale',
    date_reunion: new Date('2024-02-20'),
    heure_debut: '20:00',
    heure_fin: '22:00',
    lieu: 'Sacristie',
    ordre_du_jour: 'Élection des officiers, bilan annuel',
    statut: 'planifiee',
    participants_attendus: 15
  },
  {
    id_reunion: '3',
    id_praesidium: '3',
    titre: 'Formation Jeunes',
    date_reunion: new Date('2024-02-10'),
    heure_debut: '14:00',
    heure_fin: '16:00',
    lieu: 'Salle de catéchisme',
    ordre_du_jour: 'Formation spirituelle, activités missionnaires',
    statut: 'terminee',
    participants_attendus: 8,
    participants_presents: 7
  }
];

export default function Meetings() {
  const [reunions, setReunions] = useState<Reunion[]>(mockReunions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPraesidium, setSelectedPraesidium] = useState<string>('all');
  const [selectedStatut, setSelectedStatut] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReunion, setEditingReunion] = useState<Reunion | null>(null);
  
  const [formData, setFormData] = useState({
    id_praesidium: '',
    titre: '',
    date_reunion: new Date(),
    heure_debut: '',
    heure_fin: '',
    lieu: '',
    ordre_du_jour: '',
    participants_attendus: 0
  });

  const filteredReunions = useMemo(() => {
    return reunions.filter(reunion => {
      const matchesSearch = reunion.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           reunion.lieu.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPraesidium = selectedPraesidium === 'all' || reunion.id_praesidium === selectedPraesidium;
      const matchesStatut = selectedStatut === 'all' || reunion.statut === selectedStatut;
      
      return matchesSearch && matchesPraesidium && matchesStatut;
    });
  }, [reunions, searchTerm, selectedPraesidium, selectedStatut]);

  const stats = {
    total: reunions.length,
    planifiees: reunions.filter(r => r.statut === 'planifiee').length,
    terminees: reunions.filter(r => r.statut === 'terminee').length,
    cette_semaine: reunions.filter(r => {
      const now = new Date();
      const weekFromNow = new Date();
      weekFromNow.setDate(now.getDate() + 7);
      return r.date_reunion >= now && r.date_reunion <= weekFromNow;
    }).length
  };

  const getPraesidiumName = (praesidiumId: string) => {
    const praesidium = mockPraesidia.find(p => p.id_praesidium === praesidiumId);
    return praesidium ? praesidium.nom_praesidium : 'Praesidium inconnu';
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'planifiee': return 'default';
      case 'en_cours': return 'secondary';
      case 'terminee': return 'outline';
      case 'annulee': return 'destructive';
      default: return 'default';
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'planifiee': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'en_cours': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'terminee': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'annulee': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingReunion) {
      setReunions(reunions.map(r => 
        r.id_reunion === editingReunion.id_reunion 
          ? { ...r, ...formData, statut: 'planifiee' as const }
          : r
      ));
    } else {
      const newReunion: Reunion = {
        id_reunion: (reunions.length + 1).toString(),
        ...formData,
        statut: 'planifiee'
      };
      setReunions([...reunions, newReunion]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id_praesidium: '',
      titre: '',
      date_reunion: new Date(),
      heure_debut: '',
      heure_fin: '',
      lieu: '',
      ordre_du_jour: '',
      participants_attendus: 0
    });
    setEditingReunion(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (reunion: Reunion) => {
    setEditingReunion(reunion);
    setFormData({
      id_praesidium: reunion.id_praesidium,
      titre: reunion.titre,
      date_reunion: reunion.date_reunion,
      heure_debut: reunion.heure_debut,
      heure_fin: reunion.heure_fin,
      lieu: reunion.lieu,
      ordre_du_jour: reunion.ordre_du_jour,
      participants_attendus: reunion.participants_attendus
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (reunionId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réunion ?')) {
      setReunions(reunions.filter(r => r.id_reunion !== reunionId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Réunions</h1>
          <p className="text-muted-foreground">
            Planification et suivi des réunions de praesidium
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Réunion
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingReunion ? 'Modifier la Réunion' : 'Nouvelle Réunion'}
              </DialogTitle>
              <DialogDescription>
                {editingReunion 
                  ? 'Modifiez les informations de la réunion.'
                  : 'Planifiez une nouvelle réunion de praesidium.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titre">Titre de la réunion</Label>
                  <Input
                    id="titre"
                    value={formData.titre}
                    onChange={(e) => setFormData({...formData, titre: e.target.value})}
                    placeholder="ex: Réunion Hebdomadaire"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="praesidium">Praesidium</Label>
                  <Select 
                    value={formData.id_praesidium} 
                    onValueChange={(value) => setFormData({...formData, id_praesidium: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPraesidia.filter(p => p.actif).map((praesidium) => (
                        <SelectItem key={praesidium.id_praesidium} value={praesidium.id_praesidium}>
                          {praesidium.nom_praesidium}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_reunion">Date</Label>
                  <Input
                    id="date_reunion"
                    type="date"
                    value={formData.date_reunion.toISOString().split('T')[0]}
                    onChange={(e) => setFormData({...formData, date_reunion: new Date(e.target.value)})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heure_debut">Heure début</Label>
                  <Input
                    id="heure_debut"
                    type="time"
                    value={formData.heure_debut}
                    onChange={(e) => setFormData({...formData, heure_debut: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heure_fin">Heure fin</Label>
                  <Input
                    id="heure_fin"
                    type="time"
                    value={formData.heure_fin}
                    onChange={(e) => setFormData({...formData, heure_fin: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lieu">Lieu</Label>
                  <Input
                    id="lieu"
                    value={formData.lieu}
                    onChange={(e) => setFormData({...formData, lieu: e.target.value})}
                    placeholder="ex: Salle paroissiale"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="participants_attendus">Participants attendus</Label>
                  <Input
                    id="participants_attendus"
                    type="number"
                    min="1"
                    value={formData.participants_attendus}
                    onChange={(e) => setFormData({...formData, participants_attendus: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ordre_du_jour">Ordre du jour</Label>
                <Textarea
                  id="ordre_du_jour"
                  value={formData.ordre_du_jour}
                  onChange={(e) => setFormData({...formData, ordre_du_jour: e.target.value})}
                  placeholder="Points à aborder lors de la réunion..."
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingReunion ? 'Modifier' : 'Planifier'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Réunions</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planifiées</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.planifiees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.terminees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cette Semaine</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cette_semaine}</div>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Réunions</CardTitle>
          <CardDescription>
            Consultez et gérez toutes les réunions planifiées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par titre ou lieu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedPraesidium} onValueChange={setSelectedPraesidium}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Tous les praesidia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les praesidia</SelectItem>
                {mockPraesidia.map((praesidium) => (
                  <SelectItem key={praesidium.id_praesidium} value={praesidium.id_praesidium}>
                    {praesidium.nom_praesidium}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatut} onValueChange={setSelectedStatut}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tous statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="planifiee">Planifiée</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="terminee">Terminée</SelectItem>
                <SelectItem value="annulee">Annul��e</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Réunion</TableHead>
                  <TableHead>Praesidium</TableHead>
                  <TableHead>Date & Heure</TableHead>
                  <TableHead>Lieu</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReunions.map((reunion) => (
                  <TableRow key={reunion.id_reunion}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{reunion.titre}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-48">
                          {reunion.ordre_du_jour}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        {getPraesidiumName(reunion.id_praesidium)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {reunion.date_reunion.toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {reunion.heure_debut} - {reunion.heure_fin}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {reunion.lieu}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {reunion.participants_presents ? 
                          `${reunion.participants_presents}/${reunion.participants_attendus}` : 
                          reunion.participants_attendus
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatutIcon(reunion.statut)}
                        <Badge variant={getStatutColor(reunion.statut) as any}>
                          {reunion.statut === 'planifiee' ? 'Planifiée' :
                           reunion.statut === 'en_cours' ? 'En cours' :
                           reunion.statut === 'terminee' ? 'Terminée' : 'Annulée'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(reunion)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(reunion.id_reunion)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
