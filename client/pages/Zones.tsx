import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Plus,
  Search,
  Edit,
  Trash2,
  Phone,
  Church,
  Users,
  Calendar,
  Eye,
} from "lucide-react";
import type { Zone, ZoneFormData } from "@shared/types";

// Mock data for demonstration
const mockZones: Zone[] = [
  {
    id_zone: "1",
    nom_zone: "Zone Centre",
    paroisse: "Cathédrale Notre-Dame",
    directeur_spirituel: "Père Jean Martin",
    contact_directeur: "+33 1 23 45 67 89",
    date_creation: new Date("2020-01-15"),
    actif: true,
  },
  {
    id_zone: "2",
    nom_zone: "Zone Nord",
    paroisse: "Saint-Pierre de Montmartre",
    directeur_spirituel: "Père Michel Dubois",
    contact_directeur: "+33 1 34 56 78 90",
    date_creation: new Date("2019-03-20"),
    actif: true,
  },
  {
    id_zone: "3",
    nom_zone: "Zone Sud",
    paroisse: "Sainte-Thérèse de Lisieux",
    directeur_spirituel: "Père Antoine Laurent",
    contact_directeur: "+33 1 45 67 89 01",
    date_creation: new Date("2021-09-10"),
    actif: true,
  },
  {
    id_zone: "4",
    nom_zone: "Zone Est",
    paroisse: "Saint-Joseph",
    directeur_spirituel: "Père François Moreau",
    contact_directeur: "+33 1 56 78 90 12",
    date_creation: new Date("2020-11-05"),
    actif: false,
  },
];

export default function Zones() {
  const [zones, setZones] = useState<Zone[]>(mockZones);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [formData, setFormData] = useState<ZoneFormData>({
    nom_zone: "",
    paroisse: "",
    directeur_spirituel: "",
    contact_directeur: "",
  });

  const filteredZones = useMemo(() => {
    return zones.filter(
      (zone) =>
        zone.nom_zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        zone.paroisse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        zone.directeur_spirituel
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
  }, [zones, searchTerm]);

  const activeZones = zones.filter((z) => z.actif).length;
  const totalPraesidia = 48; // Mock data

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingZone) {
      // Update existing zone
      setZones(
        zones.map((zone) =>
          zone.id_zone === editingZone.id_zone
            ? { ...zone, ...formData }
            : zone,
        ),
      );
    } else {
      // Create new zone
      const newZone: Zone = {
        id_zone: (zones.length + 1).toString(),
        ...formData,
        date_creation: new Date(),
        actif: true,
      };
      setZones([...zones, newZone]);
    }

    // Reset form
    setFormData({
      nom_zone: "",
      paroisse: "",
      directeur_spirituel: "",
      contact_directeur: "",
    });
    setEditingZone(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (zone: Zone) => {
    setEditingZone(zone);
    setFormData({
      nom_zone: zone.nom_zone,
      paroisse: zone.paroisse,
      directeur_spirituel: zone.directeur_spirituel,
      contact_directeur: zone.contact_directeur,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (zoneId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette zone ?")) {
      setZones(zones.filter((zone) => zone.id_zone !== zoneId));
    }
  };

  const toggleStatus = (zoneId: string) => {
    setZones(
      zones.map((zone) =>
        zone.id_zone === zoneId ? { ...zone, actif: !zone.actif } : zone,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des Zones
          </h1>
          <p className="text-muted-foreground">
            Administration des zones géographiques et paroisses
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingZone(null);
                setFormData({
                  nom_zone: "",
                  paroisse: "",
                  directeur_spirituel: "",
                  contact_directeur: "",
                });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Zone
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingZone ? "Modifier la Zone" : "Nouvelle Zone"}
              </DialogTitle>
              <DialogDescription>
                {editingZone
                  ? "Modifiez les informations de la zone."
                  : "Ajoutez une nouvelle zone géographique."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nom_zone">Nom de la zone</Label>
                <Input
                  id="nom_zone"
                  value={formData.nom_zone}
                  onChange={(e) =>
                    setFormData({ ...formData, nom_zone: e.target.value })
                  }
                  placeholder="ex: Zone Centre"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paroisse">Paroisse</Label>
                <Input
                  id="paroisse"
                  value={formData.paroisse}
                  onChange={(e) =>
                    setFormData({ ...formData, paroisse: e.target.value })
                  }
                  placeholder="ex: Cathédrale Notre-Dame"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="directeur_spirituel">Directeur spirituel</Label>
                <Input
                  id="directeur_spirituel"
                  value={formData.directeur_spirituel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      directeur_spirituel: e.target.value,
                    })
                  }
                  placeholder="ex: Père Jean Martin"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_directeur">Contact du directeur</Label>
                <Input
                  id="contact_directeur"
                  type="tel"
                  value={formData.contact_directeur}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact_directeur: e.target.value,
                    })
                  }
                  placeholder="ex: +33 1 23 45 67 89"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  {editingZone ? "Modifier" : "Créer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zones Actives</CardTitle>
            <MapPin className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeZones}</div>
            <p className="text-xs text-muted-foreground">
              sur {zones.length} zones total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Praesidia Total
            </CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPraesidia}</div>
            <p className="text-xs text-muted-foreground">
              répartis dans les zones
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Moyenne par Zone
            </CardTitle>
            <Church className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(totalPraesidia / activeZones)}
            </div>
            <p className="text-xs text-muted-foreground">
              praesidia par zone active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Zones</CardTitle>
          <CardDescription>
            Gérez les zones géographiques et leurs informations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, paroisse ou directeur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zone</TableHead>
                  <TableHead>Paroisse</TableHead>
                  <TableHead>Directeur Spirituel</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date Création</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredZones.map((zone) => (
                  <TableRow key={zone.id_zone}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        {zone.nom_zone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Church className="h-4 w-4 text-muted-foreground" />
                        {zone.paroisse}
                      </div>
                    </TableCell>
                    <TableCell>{zone.directeur_spirituel}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {zone.contact_directeur}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {zone.date_creation?.toLocaleDateString("fr-FR")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={zone.actif ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => toggleStatus(zone.id_zone)}
                      >
                        {zone.actif ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(zone)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(zone.id_zone)}
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
