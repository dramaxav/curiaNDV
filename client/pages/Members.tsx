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
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  UserPlus,
  UserMinus,
} from "lucide-react";
import type { Membre, MembreFormData, Praesidium } from "@shared/types";
import { useAuth, useIsPraesidiumOfficer } from "@/contexts/AuthContext";

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

const mockMembres: Membre[] = [
  {
    id_membre: "1",
    id_praesidium: "1",
    nom_prenom: "Marie Dubois",
    statut: "actif",
    date_adhesion: new Date("2022-01-15"),
    date_promesse: new Date("2023-01-15"),
    telephone: "+33 1 23 45 67 89",
    email: "marie.dubois@email.com",
    adresse: "123 Rue de la Paix, 75001 Paris",
    date_naissance: new Date("1985-05-20"),
    actif: true,
  },
  {
    id_membre: "2",
    id_praesidium: "1",
    nom_prenom: "Jean Dupont",
    statut: "probationnaire",
    date_adhesion: new Date("2023-09-01"),
    telephone: "+33 1 34 56 78 90",
    email: "jean.dupont@email.com",
    adresse: "456 Avenue des Champs, 75008 Paris",
    date_naissance: new Date("1978-11-12"),
    actif: true,
  },
  {
    id_membre: "3",
    id_praesidium: "2",
    nom_prenom: "Sophie Martin",
    statut: "auxiliaire",
    date_adhesion: new Date("2021-06-10"),
    date_promesse: new Date("2022-06-10"),
    telephone: "+33 1 45 67 89 01",
    email: "sophie.martin@email.com",
    adresse: "789 Rue Saint-Honoré, 75001 Paris",
    date_naissance: new Date("1990-03-08"),
    actif: true,
  },
  {
    id_membre: "4",
    id_praesidium: "3",
    nom_prenom: "Pierre Laurent",
    statut: "inactif",
    date_adhesion: new Date("2020-03-01"),
    date_promesse: new Date("2021-03-01"),
    telephone: "+33 1 56 78 90 12",
    email: "pierre.laurent@email.com",
    adresse: "321 Boulevard Saint-Germain, 75006 Paris",
    date_naissance: new Date("1982-07-25"),
    actif: false,
  },
];

export default function Members() {
  const { utilisateur } = useAuth();
  const isPraesidiumOfficer = useIsPraesidiumOfficer();
  const [membres, setMembres] = useState<Membre[]>(mockMembres);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPraesidium, setSelectedPraesidium] = useState<string>("all");
  const [selectedStatut, setSelectedStatut] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMembre, setEditingMembre] = useState<Membre | null>(null);
  const [formData, setFormData] = useState<MembreFormData>({
    id_praesidium: "",
    nom_prenom: "",
    statut: "probationnaire",
    date_adhesion: new Date(),
    telephone: "",
    email: "",
    adresse: "",
    date_naissance: new Date(),
    photo: "",
  });

  const filteredMembres = useMemo(() => {
    return membres.filter((membre) => {
      // Si c'est un officier de praesidium, ne montrer que les membres de son praesidium
      if (isPraesidiumOfficer && utilisateur?.id_praesidium !== membre.id_praesidium) {
        return false;
      }

      const matchesSearch =
        membre.nom_prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (membre.email &&
          membre.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPraesidium =
        selectedPraesidium === "all" ||
        membre.id_praesidium === selectedPraesidium;
      const matchesStatut =
        selectedStatut === "all" || membre.statut === selectedStatut;

      return matchesSearch && matchesPraesidium && matchesStatut;
    });
  }, [membres, searchTerm, selectedPraesidium, selectedStatut, isPraesidiumOfficer, utilisateur]);

  const stats = {
    total: membres.length,
    actifs: membres.filter((m) => m.statut === "actif").length,
    probationnaires: membres.filter((m) => m.statut === "probationnaire")
      .length,
    auxiliaires: membres.filter((m) => m.statut === "auxiliaire").length,
    inactifs: membres.filter((m) => m.statut === "inactif").length,
    avec_promesse: membres.filter((m) => m.date_promesse).length,
  };

  const getPraesidiumName = (praesidiumId: string) => {
    const praesidium = mockPraesidia.find(
      (p) => p.id_praesidium === praesidiumId,
    );
    return praesidium ? praesidium.nom_praesidium : "Praesidium inconnu";
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "actif":
        return "default";
      case "probationnaire":
        return "secondary";
      case "auxiliaire":
        return "outline";
      case "inactif":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "actif":
        return <Users className="h-4 w-4 text-green-500" />;
      case "probationnaire":
        return <UserPlus className="h-4 w-4 text-orange-500" />;
      case "auxiliaire":
        return <Heart className="h-4 w-4 text-purple-500" />;
      case "inactif":
        return <UserMinus className="h-4 w-4 text-red-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const calculateAge = (dateNaissance: Date) => {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingMembre) {
      setMembres(
        membres.map((m) =>
          m.id_membre === editingMembre.id_membre ? { ...m, ...formData } : m,
        ),
      );
    } else {
      const newMembre: Membre = {
        id_membre: (membres.length + 1).toString(),
        ...formData,
        actif: formData.statut !== "inactif",
      };
      setMembres([...membres, newMembre]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id_praesidium: "",
      nom_prenom: "",
      statut: "probationnaire",
      date_adhesion: new Date(),
      telephone: "",
      email: "",
      adresse: "",
      date_naissance: new Date(),
      photo: "",
    });
    setEditingMembre(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (membre: Membre) => {
    setEditingMembre(membre);
    setFormData({
      id_praesidium: membre.id_praesidium,
      nom_prenom: membre.nom_prenom,
      statut: membre.statut,
      date_adhesion: membre.date_adhesion,
      date_promesse: membre.date_promesse,
      telephone: membre.telephone || "",
      email: membre.email || "",
      adresse: membre.adresse || "",
      date_naissance: membre.date_naissance || new Date(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (membreId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
      setMembres(membres.filter((m) => m.id_membre !== membreId));
    }
  };

  const promoteToActive = (membreId: string) => {
    setMembres(
      membres.map((m) =>
        m.id_membre === membreId
          ? { ...m, statut: "actif", date_promesse: new Date(), actif: true }
          : m,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Registre des Membres
          </h1>
          <p className="text-muted-foreground">
            Gestion des adhésions, statuts et promesses des membres
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Membre
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>
                {editingMembre ? "Modifier le Membre" : "Nouveau Membre"}
              </DialogTitle>
              <DialogDescription>
                {editingMembre
                  ? "Modifiez les informations du membre."
                  : "Ajoutez un nouveau membre à un praesidium."}
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
                    placeholder="ex: Marie Dubois"
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

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="statut">Statut</Label>
                  <Select
                    value={formData.statut}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, statut: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="probationnaire">
                        Probationnaire
                      </SelectItem>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="auxiliaire">Auxiliaire</SelectItem>
                      <SelectItem value="inactif">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_adhesion">Date d'adhésion</Label>
                  <Input
                    id="date_adhesion"
                    type="date"
                    value={formData.date_adhesion.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_adhesion: new Date(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_promesse">Date de promesse</Label>
                  <Input
                    id="date_promesse"
                    type="date"
                    value={
                      formData.date_promesse?.toISOString().split("T")[0] || ""
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_promesse: e.target.value
                          ? new Date(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_naissance">Date de naissance</Label>
                <Input
                  id="date_naissance"
                  type="date"
                  value={
                    formData.date_naissance?.toISOString().split("T")[0] || ""
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date_naissance: e.target.value
                        ? new Date(e.target.value)
                        : undefined,
                    })
                  }
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
                    placeholder="ex: marie.dubois@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse</Label>
                <Textarea
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) =>
                    setFormData({ ...formData, adresse: e.target.value })
                  }
                  placeholder="ex: 123 Rue de la Paix, 75001 Paris"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Photo (URL ou Base64)</Label>
                <Input
                  id="photo"
                  value={formData.photo}
                  onChange={(e) =>
                    setFormData({ ...formData, photo: e.target.value })
                  }
                  placeholder="ex: https://example.com/photo.jpg ou data:image/..."
                />
                <p className="text-xs text-muted-foreground">
                  Format recommandé: photo passport, 150x200px
                </p>
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
                  {editingMembre ? "Modifier" : "Créer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
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
              Probationnaires
            </CardTitle>
            <UserPlus className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.probationnaires}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auxiliaires</CardTitle>
            <Heart className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.auxiliaires}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactifs</CardTitle>
            <UserMinus className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactifs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promesses</CardTitle>
            <Heart className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avec_promesse}</div>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Membres</CardTitle>
          <CardDescription>
            Gérez les membres et suivez leur évolution spirituelle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou email..."
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
            <Select value={selectedStatut} onValueChange={setSelectedStatut}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tous statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="probationnaire">Probationnaire</SelectItem>
                <SelectItem value="auxiliaire">Auxiliaire</SelectItem>
                <SelectItem value="inactif">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membre</TableHead>
                  <TableHead>Praesidium</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Adhésion</TableHead>
                  <TableHead>Promesse</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Âge</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembres.map((membre) => (
                  <TableRow key={membre.id_membre}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {membre.photo ? (
                          <img
                            src={membre.photo}
                            alt={membre.nom_prenom}
                            className="w-8 h-8 rounded-full object-cover border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            {getStatutIcon(membre.statut)}
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{membre.nom_prenom}</div>
                          {membre.photo && (
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
                        {getPraesidiumName(membre.id_praesidium)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatutColor(membre.statut) as any}>
                        {membre.statut}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {membre.date_adhesion.toLocaleDateString("fr-FR")}
                      </div>
                    </TableCell>
                    <TableCell>
                      {membre.date_promesse ? (
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-pink-500" />
                          {membre.date_promesse.toLocaleDateString("fr-FR")}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {membre.telephone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {membre.telephone}
                          </div>
                        )}
                        {membre.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {membre.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {membre.date_naissance
                        ? `${calculateAge(membre.date_naissance)} ans`
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {membre.statut === "probationnaire" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => promoteToActive(membre.id_membre)}
                            className="text-green-600 hover:text-green-600"
                          >
                            <Heart className="h-4 w-4 mr-1" />
                            Promesse
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(membre)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(membre.id_membre)}
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
