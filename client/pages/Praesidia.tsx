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
import { 
  Shield, 
  Plus, 
  Search,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Users,
  Clock,
  Church
} from 'lucide-react';
import type { Praesidium, PraesidiumFormData, Zone } from '@shared/types';

// Mock data
const mockZones: Zone[] = [
  { id_zone: '1', nom_zone: 'Zone Centre', paroisse: 'Cathédrale Notre-Dame', directeur_spirituel: 'Père Jean Martin', contact_directeur: '+33 1 23 45 67 89', actif: true },
  { id_zone: '2', nom_zone: 'Zone Nord', paroisse: 'Saint-Pierre de Montmartre', directeur_spirituel: 'Père Michel Dubois', contact_directeur: '+33 1 34 56 78 90', actif: true },
  { id_zone: '3', nom_zone: 'Zone Sud', paroisse: 'Sainte-Thérèse de Lisieux', directeur_spirituel: 'Père Antoine Laurent', contact_directeur: '+33 1 45 67 89 01', actif: true }
];

const mockPraesidia: Praesidium[] = [
  {
    id_praesidium: '1',
    id_zone: '1',
    nom_praesidium: 'Notre-Dame du Rosaire',
    date_creation: new Date('2020-01-15'),
    directeur_spirituel: 'Père Jean Martin',
    type_praesidium: 'senior',
    actif: true,
    lieu_reunion: 'Salle paroissiale',
    horaire_reunion: 'Mardi 19h30'
  },
  {
    id_praesidium: '2',
    id_zone: '1',
    nom_praesidium: 'Saint-Jean-Baptiste',
    date_creation: new Date('2019-03-20'),
    directeur_spirituel: 'Père Jean Martin',
    type_praesidium: 'senior',
    actif: true,
    lieu_reunion: 'Sacristie',
    horaire_reunion: 'Jeudi 20h00'
  },
  {
    id_praesidium: '3',
    id_zone: '2',
    nom_praesidium: 'Sainte-Thérèse de Lisieux',
    date_creation: new Date('2021-09-10'),
    directeur_spirituel: 'Père Michel Dubois',
    type_praesidium: 'junior',
    actif: true,
    lieu_reunion: 'Salle de catéchisme',
    horaire_reunion: 'Samedi 14h00'
  },
  {
    id_praesidium: '4',
    id_zone: '2',
    nom_praesidium: 'Saint-Pierre Auxiliaire',
    date_creation: new Date('2020-11-05'),
    directeur_spirituel: 'Père Michel Dubois',
    type_praesidium: 'auxiliaire',
    actif: false,
    lieu_reunion: 'Domicile',
    horaire_reunion: 'Flexible'
  }
];

export default function Praesidia() {
  const [praesidia, setPraesidia] = useState<Praesidium[]>(mockPraesidia);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPraesidium, setEditingPraesidium] = useState<Praesidium | null>(null);
  const [formData, setFormData] = useState<PraesidiumFormData>({
    id_zone: '',
    nom_praesidium: '',
    date_creation: new Date(),
    directeur_spirituel: '',
    type_praesidium: 'senior',
    lieu_reunion: '',
    horaire_reunion: ''
  });

  const filteredPraesidia = useMemo(() => {
    return praesidia.filter(praesidium => {
      const matchesSearch = praesidium.nom_praesidium.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           praesidium.directeur_spirituel.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesZone = selectedZone === 'all' || praesidium.id_zone === selectedZone;
      const matchesType = selectedType === 'all' || praesidium.type_praesidium === selectedType;
      
      return matchesSearch && matchesZone && matchesType;
    });
  }, [praesidia, searchTerm, selectedZone, selectedType]);

  const stats = {
    total: praesidia.length,
    actifs: praesidia.filter(p => p.actif).length,
    senior: praesidia.filter(p => p.type_praesidium === 'senior').length,
    junior: praesidia.filter(p => p.type_praesidium === 'junior').length,
    auxiliaire: praesidia.filter(p => p.type_praesidium === 'auxiliaire').length
  };

  const getZoneName = (zoneId: string) => {
    const zone = mockZones.find(z => z.id_zone === zoneId);
    return zone ? zone.nom_zone : 'Zone inconnue';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'senior': return 'default';
      case 'junior': return 'secondary';
      case 'auxiliaire': return 'outline';
      default: return 'default';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPraesidium) {
      setPraesidia(praesidia.map(p => 
        p.id_praesidium === editingPraesidium.id_praesidium 
          ? { ...p, ...formData }
          : p
      ));
    } else {
      const newPraesidium: Praesidium = {
        id_praesidium: (praesidia.length + 1).toString(),
        ...formData,
        actif: true
      };
      setPraesidia([...praesidia, newPraesidium]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id_zone: '',
      nom_praesidium: '',
      date_creation: new Date(),
      directeur_spirituel: '',
      type_praesidium: 'senior',
      lieu_reunion: '',
      horaire_reunion: ''
    });
    setEditingPraesidium(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (praesidium: Praesidium) => {
    setEditingPraesidium(praesidium);
    setFormData({
      id_zone: praesidium.id_zone,
      nom_praesidium: praesidium.nom_praesidium,
      date_creation: praesidium.date_creation,
      directeur_spirituel: praesidium.directeur_spirituel,
      type_praesidium: praesidium.type_praesidium,
      lieu_reunion: praesidium.lieu_reunion || '',
      horaire_reunion: praesidium.horaire_reunion || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (praesidiumId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce praesidium ?')) {
      setPraesidia(praesidia.filter(p => p.id_praesidium !== praesidiumId));
    }
  };

  const toggleStatus = (praesidiumId: string) => {
    setPraesidia(praesidia.map(p =>
      p.id_praesidium === praesidiumId
        ? { ...p, actif: !p.actif }
        : p
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Praesidia</h1>
          <p className="text-muted-foreground">
            Administration des praesidia et leur structure organisationnelle
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Praesidium
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingPraesidium ? 'Modifier le Praesidium' : 'Nouveau Praesidium'}
              </DialogTitle>
              <DialogDescription>
                {editingPraesidium 
                  ? 'Modifiez les informations du praesidium.'
                  : 'Ajoutez un nouveau praesidium à une zone.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom_praesidium">Nom du Praesidium</Label>
                  <Input
                    id="nom_praesidium"
                    value={formData.nom_praesidium}
                    onChange={(e) => setFormData({...formData, nom_praesidium: e.target.value})}
                    placeholder="ex: Notre-Dame du Rosaire"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zone">Zone</Label>
                  <Select 
                    value={formData.id_zone} 
                    onValueChange={(value) => setFormData({...formData, id_zone: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockZones.filter(z => z.actif).map((zone) => (
                        <SelectItem key={zone.id_zone} value={zone.id_zone}>
                          {zone.nom_zone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type_praesidium">Type</Label>
                  <Select 
                    value={formData.type_praesidium} 
                    onValueChange={(value: any) => setFormData({...formData, type_praesidium: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="senior">Sénior</SelectItem>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="auxiliaire">Auxiliaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_creation">Date de création</Label>
                  <Input
                    id="date_creation"
                    type="date"
                    value={formData.date_creation.toISOString().split('T')[0]}
                    onChange={(e) => setFormData({...formData, date_creation: new Date(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="directeur_spirituel">Directeur spirituel</Label>
                <Input
                  id="directeur_spirituel"
                  value={formData.directeur_spirituel}
                  onChange={(e) => setFormData({...formData, directeur_spirituel: e.target.value})}
                  placeholder="ex: Père Jean Martin"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lieu_reunion">Lieu de réunion</Label>
                  <Input
                    id="lieu_reunion"
                    value={formData.lieu_reunion}
                    onChange={(e) => setFormData({...formData, lieu_reunion: e.target.value})}
                    placeholder="ex: Salle paroissiale"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horaire_reunion">Horaire de réunion</Label>
                  <Input
                    id="horaire_reunion"
                    value={formData.horaire_reunion}
                    onChange={(e) => setFormData({...formData, horaire_reunion: e.target.value})}
                    placeholder="ex: Mardi 19h30"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingPraesidium ? 'Modifier' : 'Créer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.actifs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Séniors</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.senior}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Juniors</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.junior}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auxiliaires</CardTitle>
            <Shield className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.auxiliaire}</div>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Praesidia</CardTitle>
          <CardDescription>
            Gérez les praesidia et leurs informations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou directeur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Toutes les zones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les zones</SelectItem>
                {mockZones.map((zone) => (
                  <SelectItem key={zone.id_zone} value={zone.id_zone}>
                    {zone.nom_zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tous types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="senior">Sénior</SelectItem>
                <SelectItem value="junior">Junior</SelectItem>
                <SelectItem value="auxiliaire">Auxiliaire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Praesidium</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Directeur Spirituel</TableHead>
                  <TableHead>Réunion</TableHead>
                  <TableHead>Date Création</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPraesidia.map((praesidium) => (
                  <TableRow key={praesidium.id_praesidium}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        {praesidium.nom_praesidium}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {getZoneName(praesidium.id_zone)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeColor(praesidium.type_praesidium) as any}>
                        {praesidium.type_praesidium}
                      </Badge>
                    </TableCell>
                    <TableCell>{praesidium.directeur_spirituel}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {praesidium.horaire_reunion}
                        </div>
                        <div className="flex items-center gap-1">
                          <Church className="h-3 w-3 text-muted-foreground" />
                          {praesidium.lieu_reunion}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {praesidium.date_creation.toLocaleDateString('fr-FR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={praesidium.actif ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => toggleStatus(praesidium.id_praesidium)}
                      >
                        {praesidium.actif ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(praesidium)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(praesidium.id_praesidium)}
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
