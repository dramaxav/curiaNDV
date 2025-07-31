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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PhotoUpload from "@/components/PhotoUpload";
import {
  UserCheck,
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  Calendar,
  AlertTriangle,
  Phone,
  Mail,
  Crown,
  Users,
} from "lucide-react";
import type { Officier, OfficierFormData, Praesidium } from "@shared/types";

// Mock data
const mockPraesidia: Praesidium[] = [
  {
    id_praesidium: "1",
    id_zone: "1",
    nom_praesidium: "Notre-Dame du Rosaire",
    date_creation: new Date(),
    directeur_spirituel: "Père Jean",
    type_praesidium: "adulte",
    actif: true,
  },
  {
    id_praesidium: "2",
    id_zone: "1",
    nom_praesidium: "Saint-Jean-Baptiste",
    date_creation: new Date(),
    directeur_spirituel: "Père Jean",
    type_praesidium: "adulte",
    actif: true,
  },
  {
    id_praesidium: "3",
    id_zone: "2",
    nom_praesidium: "Sainte-Thérèse",
    date_creation: new Date(),
    directeur_spirituel: "Père Michel",
    type_praesidium: "junior",
    actif: true,
  },
];

const mockOfficiers: Officier[] = [
  {
    id_officier: "1",
    id_praesidium: "1",
    nom_prenom: "Marie Dupont",
    poste: "Président",
    date_debut_mandat: new Date("2023-01-01"),
    date_fin_mandat: new Date("2024-12-31"),
    telephone: "+33 1 23 45 67 89",
    email: "marie.dupont@email.com",
    actif: true,
  },
  {
    id_officier: "2",
    id_praesidium: "1",
    nom_prenom: "Jean Martin",
    poste: "Vice-Président",
    date_debut_mandat: new Date("2023-01-01"),
    date_fin_mandat: new Date("2024-12-31"),
    telephone: "+33 1 34 56 78 90",
    email: "jean.martin@email.com",
    actif: true,
  },
  {
    id_officier: "3",
    id_praesidium: "2",
    nom_prenom: "Sophie Laurent",
    poste: "Secrétaire",
    date_debut_mandat: new Date("2023-06-01"),
    date_fin_mandat: new Date("2025-05-31"),
    telephone: "+33 1 45 67 89 01",
    email: "sophie.laurent@email.com",
    actif: true,
  },
  {
    id_officier: "4",
    id_praesidium: "2",
    nom_prenom: "Pierre Moreau",
    poste: "Trésorier",
    date_debut_mandat: new Date("2022-01-01"),
    date_fin_mandat: new Date("2024-03-31"),
    telephone: "+33 1 56 78 90 12",
    email: "pierre.moreau@email.com",
    actif: true,
  },
];

export default function Officers() {
  const [officiers, setOfficiers] = useState<Officier[]>(mockOfficiers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPraesidium, setSelectedPraesidium] = useState<string>("all");
  const [selectedPoste, setSelectedPoste] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOfficier, setEditingOfficier] = useState<Officier | null>(null);
  const [formData, setFormData] = useState<OfficierFormData>({
    id_praesidium: "",
    nom_prenom: "",
    poste: "Président",
    date_debut_mandat: new Date(),
    date_fin_mandat: new Date(),
    telephone: "",
    email: "",
    photo: "",
  });

  const filteredOfficiers = useMemo(() => {
    return officiers.filter((officier) => {
      const matchesSearch = officier.nom_prenom
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesPraesidium =
        selectedPraesidium === "all" ||
        officier.id_praesidium === selectedPraesidium;
      const matchesPoste =
        selectedPoste === "all" || officier.poste === selectedPoste;

      return matchesSearch && matchesPraesidium && matchesPoste;
    });
  }, [officiers, searchTerm, selectedPraesidium, selectedPoste]);

  // Calculer les alertes de fin de mandat
  const mandatesExpiringSoon = useMemo(() => {
    const now = new Date();
    const twoMonthsFromNow = new Date();
    twoMonthsFromNow.setMonth(now.getMonth() + 2);

    return officiers.filter((officier) => {
      const finMandat = new Date(officier.date_fin_mandat);
      return officier.actif && finMandat <= twoMonthsFromNow && finMandat > now;
    });
  }, [officiers]);

  const stats = {
    total: officiers.length,
    actifs: officiers.filter((o) => o.actif).length,
    presidents: officiers.filter((o) => o.poste === "Président" && o.actif)
      .length,
    fin_mandat_proche: mandatesExpiringSoon.length,
  };

  const getPraesidiumName = (praesidiumId: string) => {
    const praesidium = mockPraesidia.find(
      (p) => p.id_praesidium === praesidiumId,
    );
    return praesidium ? praesidium.nom_praesidium : "Praesidium inconnu";
  };

  const getPosteIcon = (poste: string) => {
    switch (poste) {
      case "Président":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "Vice-Président":
        return <Shield className="h-4 w-4 text-blue-500" />;
      case "Secrétaire":
        return <Edit className="h-4 w-4 text-green-500" />;
      case "Trésorier":
        return <UserCheck className="h-4 w-4 text-purple-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDaysUntilExpiry = (dateFinMandat: Date) => {
    const now = new Date();
    const finMandat = new Date(dateFinMandat);
    const diffTime = finMandat.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getMandateStatus = (dateFinMandat: Date) => {
    const daysLeft = getDaysUntilExpiry(dateFinMandat);

    if (daysLeft < 0)
      return { status: "expired", color: "destructive", text: "Expiré" };
    if (daysLeft <= 30)
      return {
        status: "critical",
        color: "destructive",
        text: `${daysLeft}j restants`,
      };
    if (daysLeft <= 60)
      return {
        status: "warning",
        color: "default",
        text: `${daysLeft}j restants`,
      };
    return { status: "active", color: "default", text: "Actif" };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingOfficier) {
      setOfficiers(
        officiers.map((o) =>
          o.id_officier === editingOfficier.id_officier
            ? { ...o, ...formData }
            : o,
        ),
      );
    } else {
      const newOfficier: Officier = {
        id_officier: (officiers.length + 1).toString(),
        ...formData,
        actif: true,
      };
      setOfficiers([...officiers, newOfficier]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id_praesidium: "",
      nom_prenom: "",
      poste: "Président",
      date_debut_mandat: new Date(),
      date_fin_mandat: new Date(),
      telephone: "",
      email: "",
      photo: "",
    });
    setEditingOfficier(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (officier: Officier) => {
    setEditingOfficier(officier);
    setFormData({
      id_praesidium: officier.id_praesidium,
      nom_prenom: officier.nom_prenom,
      poste: officier.poste,
      date_debut_mandat: officier.date_debut_mandat,
      date_fin_mandat: officier.date_fin_mandat,
      telephone: officier.telephone || "",
      email: officier.email || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (officierId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet officier ?")) {
      setOfficiers(officiers.filter((o) => o.id_officier !== officierId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des Officiers
          </h1>
          <p className="text-muted-foreground">
            Suivi des mandats et responsabilités des officiers
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvel Officier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingOfficier ? "Modifier l'Officier" : "Nouvel Officier"}
              </DialogTitle>
              <DialogDescription>
                {editingOfficier
                  ? "Modifiez les informations de l'officier."
                  : "Ajoutez un nouvel officier à un praesidium."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom_prenom">Nom et Prénom</Label>
                  <Input
                    id="nom_prenom"
                    value={formData.nom_prenom}
                    onChange={(e) =>
                      setFormData({ ...formData, nom_prenom: e.target.value })
                    }
                    placeholder="ex: Marie Dupont"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="praesidium">Praesidium</Label>
                  <Select
                    value={formData.id_praesidium}
                    onValueChange={(value) =>
                      setFormData({ ...formData, id_praesidium: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un praesidium" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPraesidia
                        .filter((p) => p.actif)
                        .map((praesidium) => (
                          <SelectItem
                            key={praesidium.id_praesidium}
                            value={praesidium.id_praesidium}
                          >
                            {praesidium.nom_praesidium}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="poste">Poste</Label>
                <Select
                  value={formData.poste}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, poste: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Président">Président</SelectItem>
                    <SelectItem value="Vice-Président">
                      Vice-Président
                    </SelectItem>
                    <SelectItem value="Secrétaire">Secrétaire</SelectItem>
                    <SelectItem value="Trésorier">Trésorier</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_debut_mandat">Début de mandat</Label>
                  <Input
                    id="date_debut_mandat"
                    type="date"
                    value={
                      formData.date_debut_mandat.toISOString().split("T")[0]
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_debut_mandat: new Date(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_fin_mandat">Fin de mandat</Label>
                  <Input
                    id="date_fin_mandat"
                    type="date"
                    value={formData.date_fin_mandat.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_fin_mandat: new Date(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) =>
                      setFormData({ ...formData, telephone: e.target.value })
                    }
                    placeholder="ex: +33 1 23 45 67 89"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="ex: marie.dupont@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Photo de l'officier</Label>
                <PhotoUpload
                  currentPhotoUrl={formData.photo}
                  onPhotoChange={(photoUrl) =>
                    setFormData({ ...formData, photo: photoUrl || "" })
                  }
                  size="md"
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
                  {editingOfficier ? "Modifier" : "Créer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alertes de fin de mandat */}
      {mandatesExpiringSoon.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Attention:</strong> {mandatesExpiringSoon.length} mandat(s)
            expire(nt) bientôt. Planifiez les renouvellements nécessaires.
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Officiers
            </CardTitle>
            <UserCheck className="h-4 w-4 text-blue-500" />
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
            <CardTitle className="text-sm font-medium">Présidents</CardTitle>
            <Crown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.presidents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fins de Mandat
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.fin_mandat_proche}</div>
            <p className="text-xs text-muted-foreground">dans 2 mois</p>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Officiers</CardTitle>
          <CardDescription>
            Gérez les officiers et suivez leurs mandats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={selectedPraesidium}
              onValueChange={setSelectedPraesidium}
            >
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Tous les praesidia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les praesidia</SelectItem>
                {mockPraesidia.map((praesidium) => (
                  <SelectItem
                    key={praesidium.id_praesidium}
                    value={praesidium.id_praesidium}
                  >
                    {praesidium.nom_praesidium}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPoste} onValueChange={setSelectedPoste}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tous postes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous postes</SelectItem>
                <SelectItem value="Président">Président</SelectItem>
                <SelectItem value="Vice-Président">Vice-Président</SelectItem>
                <SelectItem value="Secrétaire">Secrétaire</SelectItem>
                <SelectItem value="Trésorier">Trésorier</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Officier</TableHead>
                  <TableHead>Praesidium</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead>Mandat</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOfficiers.map((officier) => {
                  const mandateStatus = getMandateStatus(
                    officier.date_fin_mandat,
                  );
                  return (
                    <TableRow key={officier.id_officier}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          {officier.photo ? (
                            <img
                              src={officier.photo}
                              alt={officier.nom_prenom}
                              className="w-8 h-8 rounded-full object-cover border"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              {getPosteIcon(officier.poste)}
                            </div>
                          )}
                          <div>
                            <div className="font-medium">
                              {officier.nom_prenom}
                            </div>
                            {officier.photo && (
                              <div className="text-xs text-muted-foreground">
                                Photo disponible
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          {getPraesidiumName(officier.id_praesidium)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{officier.poste}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {officier.date_debut_mandat.toLocaleDateString(
                              "fr-FR",
                            )}{" "}
                            -{" "}
                            {officier.date_fin_mandat.toLocaleDateString(
                              "fr-FR",
                            )}
                          </div>
                          <Badge
                            variant={mandateStatus.color as any}
                            className="mt-1 text-xs"
                          >
                            {mandateStatus.text}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {officier.telephone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {officier.telephone}
                            </div>
                          )}
                          {officier.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              {officier.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={officier.actif ? "default" : "secondary"}
                        >
                          {officier.actif ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(officier)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(officier.id_officier)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
