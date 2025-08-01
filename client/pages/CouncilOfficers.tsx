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
import PhotoUpload from "@/components/PhotoUpload";
import {
  Crown,
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  AlertTriangle,
  Phone,
  Mail,
  Shield,
  Users,
  Award,
  Calculator,
} from "lucide-react";

interface OfficierConseil {
  id_officier_conseil: string;
  nom_prenom: string;
  poste:
    | "Président du Conseil"
    | "Vice-Président du Conseil"
    | "Secrétaire du Conseil"
    | "Trésorier du Conseil"
    | "Directeur Spirituel"
    | "Responsable Formation";
  date_debut_mandat: Date;
  date_fin_mandat: Date;
  telephone?: string;
  email?: string;
  photo?: string;
  zone_supervision?: string;
  actif: boolean;
}

interface OfficierConseilFormData {
  nom_prenom: string;
  poste:
    | "Président du Conseil"
    | "Vice-Président du Conseil"
    | "Secrétaire du Conseil"
    | "Trésorier du Conseil"
    | "Directeur Spirituel"
    | "Responsable Formation";
  date_debut_mandat: Date;
  date_fin_mandat: Date;
  telephone?: string;
  email?: string;
  photo?: string;
  zone_supervision?: string;
}

const mockOfficiersConseil: OfficierConseil[] = [
  {
    id_officier_conseil: "1",
    nom_prenom: "Monseigneur Paul Nkomo",
    poste: "Directeur Spirituel",
    date_debut_mandat: new Date("2022-01-01"),
    date_fin_mandat: new Date("2025-12-31"),
    telephone: "+237 6 XX XX XX XX",
    email: "directeur.spirituel@legiondemarie.cm",
    actif: true,
  },
  {
    id_officier_conseil: "2",
    nom_prenom: "Marie-Claire Atangana",
    poste: "Président du Conseil",
    date_debut_mandat: new Date("2023-01-01"),
    date_fin_mandat: new Date("2024-12-31"),
    telephone: "+237 6 YY YY YY YY",
    email: "president@legiondemarie.cm",
    zone_supervision: "Toutes les zones",
    actif: true,
  },
  {
    id_officier_conseil: "3",
    nom_prenom: "Jean-Baptiste Mballa",
    poste: "Vice-Président du Conseil",
    date_debut_mandat: new Date("2023-01-01"),
    date_fin_mandat: new Date("2024-12-31"),
    telephone: "+237 6 ZZ ZZ ZZ ZZ",
    email: "vicepresident@legiondemarie.cm",
    zone_supervision: "Zones Nord et Est",
    actif: true,
  },
  {
    id_officier_conseil: "4",
    nom_prenom: "Françoise Eyenga",
    poste: "Secrétaire du Conseil",
    date_debut_mandat: new Date("2023-06-01"),
    date_fin_mandat: new Date("2025-05-31"),
    telephone: "+237 6 AA AA AA AA",
    email: "secretaire@legiondemarie.cm",
    actif: true,
  },
];

export default function CouncilOfficers() {
  const [officiers, setOfficiers] =
    useState<OfficierConseil[]>(mockOfficiersConseil);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPoste, setSelectedPoste] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOfficier, setEditingOfficier] =
    useState<OfficierConseil | null>(null);
  const [formData, setFormData] = useState<OfficierConseilFormData>({
    nom_prenom: "",
    poste: "Président du Conseil",
    date_debut_mandat: new Date(),
    date_fin_mandat: new Date(),
    telephone: "",
    email: "",
    photo: "",
    zone_supervision: "",
  });

  const filteredOfficiers = useMemo(() => {
    return officiers.filter((officier) => {
      const matchesSearch = officier.nom_prenom
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesPoste =
        selectedPoste === "all" || officier.poste === selectedPoste;

      return matchesSearch && matchesPoste;
    });
  }, [officiers, searchTerm, selectedPoste]);

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
    directeur_spirituel: officiers.filter(
      (o) => o.poste === "Directeur Spirituel" && o.actif,
    ).length,
    fin_mandat_proche: mandatesExpiringSoon.length,
  };

  const getPosteIcon = (poste: string) => {
    switch (poste) {
      case "Président du Conseil":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "Vice-Président du Conseil":
        return <Shield className="h-4 w-4 text-blue-500" />;
      case "Secrétaire du Conseil":
        return <Edit className="h-4 w-4 text-green-500" />;
      case "Trésorier du Conseil":
        return <Calculator className="h-4 w-4 text-purple-500" />;
      case "Directeur Spirituel":
        return <Award className="h-4 w-4 text-red-500" />;
      case "Responsable Formation":
        return <Users className="h-4 w-4 text-orange-500" />;
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
          o.id_officier_conseil === editingOfficier.id_officier_conseil
            ? { ...o, ...formData }
            : o,
        ),
      );
    } else {
      const newOfficier: OfficierConseil = {
        id_officier_conseil: (officiers.length + 1).toString(),
        ...formData,
        actif: true,
      };
      setOfficiers([...officiers, newOfficier]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nom_prenom: "",
      poste: "Président du Conseil",
      date_debut_mandat: new Date(),
      date_fin_mandat: new Date(),
      telephone: "",
      email: "",
      photo: "",
      zone_supervision: "",
    });
    setEditingOfficier(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (officier: OfficierConseil) => {
    setEditingOfficier(officier);
    setFormData({
      nom_prenom: officier.nom_prenom,
      poste: officier.poste,
      date_debut_mandat: officier.date_debut_mandat,
      date_fin_mandat: officier.date_fin_mandat,
      telephone: officier.telephone || "",
      email: officier.email || "",
      photo: officier.photo || "",
      zone_supervision: officier.zone_supervision || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (officierId: string) => {
    if (
      confirm("Êtes-vous sûr de vouloir supprimer cet officier du conseil ?")
    ) {
      setOfficiers(
        officiers.filter((o) => o.id_officier_conseil !== officierId),
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Officiers du Conseil
          </h1>
          <p className="text-muted-foreground">
            Gestion des officiers du Conseil de la Légion de Marie
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvel Officier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>
                {editingOfficier
                  ? "Modifier l'Officier du Conseil"
                  : "Nouvel Officier du Conseil"}
              </DialogTitle>
              <DialogDescription>
                {editingOfficier
                  ? "Modifiez les informations de l'officier du conseil."
                  : "Ajoutez un nouvel officier au conseil de la Légion de Marie."}
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
                    placeholder="ex: Marie-Claire Atangana"
                    required
                  />
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
                      <SelectItem value="Président du Conseil">
                        Président du Conseil
                      </SelectItem>
                      <SelectItem value="Vice-Président du Conseil">
                        Vice-Président du Conseil
                      </SelectItem>
                      <SelectItem value="Secrétaire du Conseil">
                        Secrétaire du Conseil
                      </SelectItem>
                      <SelectItem value="Trésorier du Conseil">
                        Trésorier du Conseil
                      </SelectItem>
                      <SelectItem value="Directeur Spirituel">
                        Directeur Spirituel
                      </SelectItem>
                      <SelectItem value="Responsable Formation">
                        Responsable Formation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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

              <div className="space-y-2">
                <Label htmlFor="zone_supervision">Zone(s) de supervision</Label>
                <Input
                  id="zone_supervision"
                  value={formData.zone_supervision}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      zone_supervision: e.target.value,
                    })
                  }
                  placeholder="ex: Toutes les zones, Zone Nord et Est"
                />
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
                    placeholder="ex: +237 6 XX XX XX XX"
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
                    placeholder="ex: president@legiondemarie.cm"
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
            du conseil expire(nt) bientôt. Planifiez les renouvellements
            nécessaires.
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
            <Crown className="h-4 w-4 text-blue-500" />
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
            <CardTitle className="text-sm font-medium">
              Directeur Spirituel
            </CardTitle>
            <Award className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.directeur_spirituel}
            </div>
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
          <CardTitle>Liste des Officiers du Conseil</CardTitle>
          <CardDescription>
            Gérez les officiers du conseil et suivez leurs mandats
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
            <Select value={selectedPoste} onValueChange={setSelectedPoste}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Tous les postes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les postes</SelectItem>
                <SelectItem value="Président du Conseil">
                  Président du Conseil
                </SelectItem>
                <SelectItem value="Vice-Président du Conseil">
                  Vice-Président du Conseil
                </SelectItem>
                <SelectItem value="Secrétaire du Conseil">
                  Secrétaire du Conseil
                </SelectItem>
                <SelectItem value="Trésorier du Conseil">
                  Trésorier du Conseil
                </SelectItem>
                <SelectItem value="Directeur Spirituel">
                  Directeur Spirituel
                </SelectItem>
                <SelectItem value="Responsable Formation">
                  Responsable Formation
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Officier</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead>Mandat</TableHead>
                  <TableHead>Zone de Supervision</TableHead>
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
                    <TableRow key={officier.id_officier_conseil}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          {officier.photo ? (
                            <img
                              src={
                                (() => {
                                  try {
                                    const photoData = JSON.parse(officier.photo);
                                    return photoData.base64 || officier.photo;
                                  } catch {
                                    return officier.photo;
                                  }
                                })()
                              }
                              alt={officier.nom_prenom}
                              className="w-8 h-8 rounded-full object-cover border cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => {
                                try {
                                  const photoData = JSON.parse(officier.photo);
                                  if (photoData.localPath) {
                                    alert(`Chemin local de la photo:\n${photoData.fullPath || photoData.localPath}`);
                                  } else {
                                    alert(`Chemin de la photo:\n${officier.photo}`);
                                  }
                                } catch {
                                  alert(`Chemin de la photo:\n${officier.photo}`);
                                }
                              }}
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
                          {getPosteIcon(officier.poste)}
                          <Badge variant="outline">{officier.poste}</Badge>
                        </div>
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
                        <span className="text-sm">
                          {officier.zone_supervision || "-"}
                        </span>
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
                            onClick={() =>
                              handleDelete(officier.id_officier_conseil)
                            }
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
