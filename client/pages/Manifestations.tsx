import { useState, useMemo, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
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
import { Checkbox } from "@/components/ui/checkbox";
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
  AlertCircle,
  Mail,
  Heart,
  BookOpen,
  Handshake,
  Church,
  MoreHorizontal,
  Bell,
} from "lucide-react";
import type { Manifestation, Praesidium } from "@shared/types";

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

const mockManifestations: Manifestation[] = [
  {
    id_manifestation: "1",
    titre: "Réunion Mensuelle du Conseil",
    description: "Réunion de coordination des praesidia",
    date_manifestation: new Date("2024-02-15"),
    heure_debut: "19:30",
    heure_fin: "21:00",
    lieu: "Salle paroissiale Notre-Dame",
    type_manifestation: "reunion",
    pour_tous_praesidia: true,
    organisateur_contact: "president@legiondemarie.org",
    statut: "planifiee",
    participants_attendus: 45,
    rappel_envoye: { une_semaine: false, trois_jours: false },
    date_creation: new Date(),
  },
  {
    id_manifestation: "2",
    titre: "Formation Spirituelle - La Vraie Dévotion",
    description:
      "Session de formation sur la vraie dévotion à Marie selon Saint Louis-Marie de Montfort",
    date_manifestation: new Date("2024-02-20"),
    heure_debut: "20:00",
    heure_fin: "22:00",
    lieu: "Centre paroissial Saint-Pierre",
    type_manifestation: "formation",
    pour_tous_praesidia: false,
    praesidia_concernes: ["1", "2"],
    organisateur_contact: "formation@legiondemarie.org",
    statut: "planifiee",
    participants_attendus: 20,
    rappel_envoye: { une_semaine: true, trois_jours: false },
    date_creation: new Date(),
  },
  {
    id_manifestation: "3",
    titre: "Visite aux Malades - Hôpital Général",
    description: "Mission de charité auprès des malades",
    date_manifestation: new Date("2024-02-10"),
    heure_debut: "14:00",
    heure_fin: "17:00",
    lieu: "Hôpital Général de Yaoundé",
    type_manifestation: "service_social",
    pour_tous_praesidia: true,
    statut: "terminee",
    participants_attendus: 15,
    participants_presents: 12,
    rappel_envoye: { une_semaine: true, trois_jours: true },
    date_creation: new Date(),
  },
];

export default function Manifestations() {
  const [manifestations, setManifestations] =
    useState<Manifestation[]>(mockManifestations);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatut, setSelectedStatut] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingManifestation, setEditingManifestation] =
    useState<Manifestation | null>(null);

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    date_manifestation: new Date(),
    heure_debut: "",
    heure_fin: "",
    lieu: "",
    type_manifestation: "reunion" as Manifestation["type_manifestation"],
    pour_tous_praesidia: true,
    praesidia_concernes: [] as string[],
    organisateur_contact: "",
    participants_attendus: 0,
  });

  // Simulation du système de rappels automatiques
  useEffect(() => {
    const checkRappels = () => {
      const now = new Date();
      const uneSemaine = new Date();
      uneSemaine.setDate(now.getDate() + 7);

      const troisJours = new Date();
      troisJours.setDate(now.getDate() + 3);

      setManifestations((prev) =>
        prev.map((manifestation) => {
          if (manifestation.statut !== "planifiee") return manifestation;

          const dateManif = new Date(manifestation.date_manifestation);
          const updatedRappel = { ...manifestation.rappel_envoye };

          // Rappel une semaine avant
          if (
            !updatedRappel?.une_semaine &&
            dateManif <= uneSemaine &&
            dateManif > troisJours
          ) {
            updatedRappel.une_semaine = true;
            console.log(
              `📧 Rappel 1 semaine envoyé pour: ${manifestation.titre}`,
            );
          }

          // Rappel trois jours avant
          if (
            !updatedRappel?.trois_jours &&
            dateManif <= troisJours &&
            dateManif > now
          ) {
            updatedRappel.trois_jours = true;
            console.log(
              `📧 Rappel 3 jours envoyé pour: ${manifestation.titre}`,
            );
          }

          return { ...manifestation, rappel_envoye: updatedRappel };
        }),
      );
    };

    // Vérifier les rappels toutes les minutes (en production, ce serait moins fréquent)
    const interval = setInterval(checkRappels, 60000);
    checkRappels(); // Vérification immédiate

    return () => clearInterval(interval);
  }, []);

  const filteredManifestations = useMemo(() => {
    return manifestations.filter((manifestation) => {
      const matchesSearch =
        manifestation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manifestation.lieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manifestation.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesType =
        selectedType === "all" ||
        manifestation.type_manifestation === selectedType;
      const matchesStatut =
        selectedStatut === "all" || manifestation.statut === selectedStatut;

      return matchesSearch && matchesType && matchesStatut;
    });
  }, [manifestations, searchTerm, selectedType, selectedStatut]);

  const stats = {
    total: manifestations.length,
    planifiees: manifestations.filter((m) => m.statut === "planifiee").length,
    terminees: manifestations.filter((m) => m.statut === "terminee").length,
    cette_semaine: manifestations.filter((m) => {
      const now = new Date();
      const weekFromNow = new Date();
      weekFromNow.setDate(now.getDate() + 7);
      return m.date_manifestation >= now && m.date_manifestation <= weekFromNow;
    }).length,
    pour_tous: manifestations.filter((m) => m.pour_tous_praesidia).length,
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "reunion":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "activite_spirituelle":
        return <Heart className="h-4 w-4 text-purple-500" />;
      case "formation":
        return <BookOpen className="h-4 w-4 text-green-500" />;
      case "service_social":
        return <Handshake className="h-4 w-4 text-orange-500" />;
      case "pelerinage":
        return <Church className="h-4 w-4 text-indigo-500" />;
      default:
        return <MoreHorizontal className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "reunion":
        return "Réunion";
      case "activite_spirituelle":
        return "Activité Spirituelle";
      case "formation":
        return "Formation";
      case "service_social":
        return "Service Social";
      case "pelerinage":
        return "Pèlerinage";
      default:
        return "Autre";
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "planifiee":
        return "default";
      case "en_cours":
        return "secondary";
      case "terminee":
        return "outline";
      case "annulee":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "planifiee":
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case "en_cours":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "terminee":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "annulee":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPraesidiaNames = (manifestation: Manifestation) => {
    if (manifestation.pour_tous_praesidia) {
      return "Tous les Praesidia";
    }

    if (
      !manifestation.praesidia_concernes ||
      manifestation.praesidia_concernes.length === 0
    ) {
      return "Aucun praesidium sélectionné";
    }

    const names = manifestation.praesidia_concernes
      .map(
        (id) =>
          mockPraesidia.find((p) => p.id_praesidium === id)?.nom_praesidium,
      )
      .filter(Boolean);

    return names.length > 2
      ? `${names.slice(0, 2).join(", ")} et ${names.length - 2} autres`
      : names.join(", ");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingManifestation) {
      setManifestations(
        manifestations.map((m) =>
          m.id_manifestation === editingManifestation.id_manifestation
            ? {
                ...m,
                ...formData,
                statut: "planifiee" as const,
                rappel_envoye: { une_semaine: false, trois_jours: false },
              }
            : m,
        ),
      );
    } else {
      const newManifestation: Manifestation = {
        id_manifestation: (manifestations.length + 1).toString(),
        ...formData,
        statut: "planifiee",
        rappel_envoye: { une_semaine: false, trois_jours: false },
        date_creation: new Date(),
      };
      setManifestations([...manifestations, newManifestation]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      titre: "",
      description: "",
      date_manifestation: new Date(),
      heure_debut: "",
      heure_fin: "",
      lieu: "",
      type_manifestation: "reunion",
      pour_tous_praesidia: true,
      praesidia_concernes: [],
      organisateur_contact: "",
      participants_attendus: 0,
    });
    setEditingManifestation(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (manifestation: Manifestation) => {
    setEditingManifestation(manifestation);
    setFormData({
      titre: manifestation.titre,
      description: manifestation.description || "",
      date_manifestation: manifestation.date_manifestation,
      heure_debut: manifestation.heure_debut,
      heure_fin: manifestation.heure_fin,
      lieu: manifestation.lieu,
      type_manifestation: manifestation.type_manifestation,
      pour_tous_praesidia: manifestation.pour_tous_praesidia,
      praesidia_concernes: manifestation.praesidia_concernes || [],
      organisateur_contact: manifestation.organisateur_contact || "",
      participants_attendus: manifestation.participants_attendus,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (manifestationId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette manifestation ?")) {
      setManifestations(
        manifestations.filter((m) => m.id_manifestation !== manifestationId),
      );
    }
  };

  const handlePraesidiumToggle = (praesidiumId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        praesidia_concernes: [...formData.praesidia_concernes, praesidiumId],
      });
    } else {
      setFormData({
        ...formData,
        praesidia_concernes: formData.praesidia_concernes.filter(
          (id) => id !== praesidiumId,
        ),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des Manifestations
          </h1>
          <p className="text-muted-foreground">
            Planification et suivi des manifestations de la Légion de Marie
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Manifestation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingManifestation
                  ? "Modifier la Manifestation"
                  : "Nouvelle Manifestation"}
              </DialogTitle>
              <DialogDescription>
                {editingManifestation
                  ? "Modifiez les informations de la manifestation."
                  : "Planifiez une nouvelle manifestation pour la Légion de Marie."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titre">Titre de la manifestation</Label>
                  <Input
                    id="titre"
                    value={formData.titre}
                    onChange={(e) =>
                      setFormData({ ...formData, titre: e.target.value })
                    }
                    placeholder="ex: Réunion Mensuelle du Conseil"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type_manifestation">Type</Label>
                  <Select
                    value={formData.type_manifestation}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        type_manifestation:
                          value as Manifestation["type_manifestation"],
                      })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reunion">Réunion</SelectItem>
                      <SelectItem value="activite_spirituelle">
                        Activité Spirituelle
                      </SelectItem>
                      <SelectItem value="formation">Formation</SelectItem>
                      <SelectItem value="service_social">
                        Service Social
                      </SelectItem>
                      <SelectItem value="pelerinage">Pèlerinage</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Description détaillée de la manifestation..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_manifestation">Date</Label>
                  <Input
                    id="date_manifestation"
                    type="date"
                    value={
                      formData.date_manifestation.toISOString().split("T")[0]
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_manifestation: new Date(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heure_debut">Heure début</Label>
                  <Input
                    id="heure_debut"
                    type="time"
                    value={formData.heure_debut}
                    onChange={(e) =>
                      setFormData({ ...formData, heure_debut: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heure_fin">Heure fin</Label>
                  <Input
                    id="heure_fin"
                    type="time"
                    value={formData.heure_fin}
                    onChange={(e) =>
                      setFormData({ ...formData, heure_fin: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, lieu: e.target.value })
                    }
                    placeholder="ex: Salle paroissiale Notre-Dame"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="participants_attendus">
                    Participants attendus
                  </Label>
                  <Input
                    id="participants_attendus"
                    type="number"
                    min="1"
                    value={formData.participants_attendus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        participants_attendus: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organisateur_contact">
                  Contact organisateur
                </Label>
                <Input
                  id="organisateur_contact"
                  type="email"
                  value={formData.organisateur_contact}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      organisateur_contact: e.target.value,
                    })
                  }
                  placeholder="email@exemple.com"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="pour_tous_praesidia"
                    checked={formData.pour_tous_praesidia}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        pour_tous_praesidia: checked,
                        praesidia_concernes: checked
                          ? []
                          : formData.praesidia_concernes,
                      })
                    }
                  />
                  <Label htmlFor="pour_tous_praesidia">
                    Pour tous les praesidia
                  </Label>
                </div>

                {!formData.pour_tous_praesidia && (
                  <div className="space-y-2">
                    <Label>Praesidia concernés</Label>
                    <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto border p-3 rounded-md">
                      {mockPraesidia
                        .filter((p) => p.actif)
                        .map((praesidium) => (
                          <div
                            key={praesidium.id_praesidium}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`praesidium-${praesidium.id_praesidium}`}
                              checked={formData.praesidia_concernes.includes(
                                praesidium.id_praesidium,
                              )}
                              onCheckedChange={(checked) =>
                                handlePraesidiumToggle(
                                  praesidium.id_praesidium,
                                  checked as boolean,
                                )
                              }
                            />
                            <Label
                              htmlFor={`praesidium-${praesidium.id_praesidium}`}
                              className="text-sm"
                            >
                              {praesidium.nom_praesidium}
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
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
                  {editingManifestation ? "Modifier" : "Planifier"}
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tous Praesidia
            </CardTitle>
            <Shield className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pour_tous}</div>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Manifestations</CardTitle>
          <CardDescription>
            Consultez et gérez toutes les manifestations planifiées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par titre, lieu ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="reunion">Réunion</SelectItem>
                <SelectItem value="activite_spirituelle">
                  Activité Spirituelle
                </SelectItem>
                <SelectItem value="formation">Formation</SelectItem>
                <SelectItem value="service_social">Service Social</SelectItem>
                <SelectItem value="pelerinage">Pèlerinage</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
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
                <SelectItem value="annulee">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Manifestation</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date & Heure</TableHead>
                  <TableHead>Lieu</TableHead>
                  <TableHead>Praesidia</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Rappels</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredManifestations.map((manifestation) => (
                  <TableRow key={manifestation.id_manifestation}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{manifestation.titre}</div>
                        {manifestation.description && (
                          <div className="text-sm text-muted-foreground truncate max-w-48">
                            {manifestation.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(manifestation.type_manifestation)}
                        <span className="text-sm">
                          {getTypeName(manifestation.type_manifestation)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {manifestation.date_manifestation.toLocaleDateString(
                            "fr-FR",
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {manifestation.heure_debut} -{" "}
                          {manifestation.heure_fin}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{manifestation.lieu}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {manifestation.pour_tous_praesidia ? (
                          <Badge variant="secondary">Tous</Badge>
                        ) : (
                          <span className="text-muted-foreground">
                            {getPraesidiaNames(manifestation)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {manifestation.participants_presents
                          ? `${manifestation.participants_presents}/${manifestation.participants_attendus}`
                          : manifestation.participants_attendus}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {manifestation.rappel_envoye?.une_semaine && (
                          <Badge variant="outline" className="text-xs">
                            <Bell className="h-3 w-3 mr-1" />
                            7j
                          </Badge>
                        )}
                        {manifestation.rappel_envoye?.trois_jours && (
                          <Badge variant="outline" className="text-xs">
                            <Bell className="h-3 w-3 mr-1" />
                            3j
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatutIcon(manifestation.statut)}
                        <Badge
                          variant={getStatutColor(manifestation.statut) as any}
                        >
                          {manifestation.statut === "planifiee"
                            ? "Planifiée"
                            : manifestation.statut === "en_cours"
                              ? "En cours"
                              : manifestation.statut === "terminee"
                                ? "Terminée"
                                : "Annulée"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(manifestation)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleDelete(manifestation.id_manifestation)
                          }
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
