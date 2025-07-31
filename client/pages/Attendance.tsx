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
import { Calendar as CalendarIcon } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar,
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  UserCheck,
  UserX,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type { Presence, Membre, Praesidium, Officier } from "@shared/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
    nom_prenom: "Marie Dubois",
    poste: "Président",
    date_debut_mandat: new Date(),
    date_fin_mandat: new Date(),
    actif: true,
  },
  {
    id_officier: "2",
    id_praesidium: "1",
    nom_prenom: "Jean Martin",
    poste: "Secrétaire",
    date_debut_mandat: new Date(),
    date_fin_mandat: new Date(),
    actif: true,
  },
  {
    id_officier: "3",
    id_praesidium: "2",
    nom_prenom: "Sophie Laurent",
    poste: "Président",
    date_debut_mandat: new Date(),
    date_fin_mandat: new Date(),
    actif: true,
  },
  // Praesidium 3 n'a que le président, les autres postes sont vacants
  {
    id_officier: "4",
    id_praesidium: "3",
    nom_prenom: "Pierre Moreau",
    poste: "Président",
    date_debut_mandat: new Date(),
    date_fin_mandat: new Date(),
    actif: true,
  },
];

const mockMembres: Membre[] = [
  {
    id_membre: "1",
    id_praesidium: "1",
    nom_prenom: "Marie Dubois",
    statut: "actif",
    date_adhesion: new Date(),
    actif: true,
  },
  {
    id_membre: "2",
    id_praesidium: "1",
    nom_prenom: "Jean Dupont",
    statut: "probationnaire",
    date_adhesion: new Date(),
    actif: true,
  },
  {
    id_membre: "3",
    id_praesidium: "2",
    nom_prenom: "Sophie Martin",
    statut: "actif",
    date_adhesion: new Date(),
    actif: true,
  },
  {
    id_membre: "4",
    id_praesidium: "2",
    nom_prenom: "Pierre Laurent",
    statut: "auxiliaire",
    date_adhesion: new Date(),
    actif: true,
  },
  {
    id_membre: "5",
    id_praesidium: "3",
    nom_prenom: "Anne Moreau",
    statut: "actif",
    date_adhesion: new Date(),
    actif: true,
  },
];

const mockPresences: Presence[] = [
  {
    id_presence: "1",
    id_officier: "1",
    date_reunion: new Date("2024-01-15"),
    statut_presence: "Présent",
  },
  {
    id_presence: "2",
    id_officier: "2",
    date_reunion: new Date("2024-01-15"),
    statut_presence: "Absent",
    notes: "Voyage professionnel",
  },
  {
    id_presence: "3",
    id_officier: "3",
    date_reunion: new Date("2024-01-15"),
    statut_presence: "Excusé",
    notes: "Maladie",
  },
  {
    id_presence: "4",
    id_officier: "1",
    date_reunion: new Date("2024-01-22"),
    statut_presence: "Présent",
  },
  {
    id_presence: "5",
    id_officier: "2",
    date_reunion: new Date("2024-01-22"),
    statut_presence: "Présent",
  },
];

export default function Attendance() {
  const [presences, setPresences] = useState<Presence[]>(mockPresences);
  const [selectedPraesidium, setSelectedPraesidium] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMonthForStats, setSelectedMonthForStats] = useState<string>(
    new Date().toISOString().slice(0, 7),
  );
  const [selectedYearForStats, setSelectedYearForStats] = useState<string>(
    new Date().getFullYear().toString(),
  );
  const [selectedMember, setSelectedMember] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [editingPresence, setEditingPresence] = useState<Presence | null>(null);

  const [formData, setFormData] = useState({
    id_officier: "",
    date_reunion: new Date(),
    statut_presence: "Présent" as "Présent" | "Absent" | "Excusé",
    notes: "",
  });

  const [bulkFormData, setBulkFormData] = useState({
    id_praesidium: "",
    date_reunion: new Date(),
    presences: [] as {
      id_officier: string;
      statut: "Présent" | "Absent" | "Excusé";
      notes?: string;
    }[],
  });

  const filteredPresences = useMemo(() => {
    return presences.filter((presence) => {
      const membre = mockMembres.find(
        (m) => m.id_membre === presence.id_membre,
      );
      const matchesPraesidium =
        selectedPraesidium === "all" ||
        membre?.id_praesidium === selectedPraesidium;
      const matchesMember =
        selectedMember === "all" || presence.id_membre === selectedMember;
      const matchesDate =
        format(presence.date_reunion, "yyyy-MM") ===
        format(selectedDate, "yyyy-MM");

      return matchesPraesidium && matchesMember && matchesDate;
    });
  }, [presences, selectedPraesidium, selectedMember, selectedDate]);

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const totalPresences = presences.length;
    const presents = presences.filter(
      (p) => p.statut_presence === "Présent",
    ).length;
    const absents = presences.filter(
      (p) => p.statut_presence === "Absent",
    ).length;
    const excuses = presences.filter(
      (p) => p.statut_presence === "Excusé",
    ).length;
    const tauxPresence =
      totalPresences > 0 ? (presents / totalPresences) * 100 : 0;

    // Statistiques pour le mois sélectionné
    const [selectedYear, selectedMonth] = selectedMonthForStats.split("-");
    const presencesMensuel = presences.filter((p) => {
      const date = new Date(p.date_reunion);
      return (
        date.getMonth() === parseInt(selectedMonth) - 1 &&
        date.getFullYear() === parseInt(selectedYear)
      );
    });

    // Calculer les praesidia représentés (qui ont au moins une présence)
    const praesidiaRepresentes = new Set();
    presencesMensuel.forEach((p) => {
      const membre = mockMembres.find((m) => m.id_membre === p.id_membre);
      if (membre) {
        praesidiaRepresentes.add(membre.id_praesidium);
      }
    });

    // Calculer les présents par type de praesidium
    const presentsAdultes = presencesMensuel.filter((p) => {
      const membre = mockMembres.find((m) => m.id_membre === p.id_membre);
      if (!membre) return false;
      const praesidium = mockPraesidia.find(
        (pr) => pr.id_praesidium === membre.id_praesidium,
      );
      return (
        praesidium?.type_praesidium === "adulte" &&
        p.statut_presence === "Présent"
      );
    }).length;

    const presentsJuniors = presencesMensuel.filter((p) => {
      const membre = mockMembres.find((m) => m.id_membre === p.id_membre);
      if (!membre) return false;
      const praesidium = mockPraesidia.find(
        (pr) => pr.id_praesidium === membre.id_praesidium,
      );
      return (
        praesidium?.type_praesidium === "junior" &&
        p.statut_presence === "Présent"
      );
    }).length;

    const absentsTotal = presencesMensuel.filter(
      (p) => p.statut_presence === "Absent",
    ).length;

    // Calculer les postes vacants
    const postesRequis = [
      "Président",
      "Vice-Président",
      "Secrétaire",
      "Trésorier",
    ];
    let postesVacants = 0;
    mockPraesidia.forEach((praesidium) => {
      if (praesidium.actif) {
        postesRequis.forEach((poste) => {
          const officierExiste = mockOfficiers.some(
            (o) =>
              o.id_praesidium === praesidium.id_praesidium &&
              o.poste === poste &&
              o.actif,
          );
          if (!officierExiste) {
            postesVacants++;
          }
        });
      }
    });

    const presentsMensuel = presencesMensuel.filter(
      (p) => p.statut_presence === "Présent",
    ).length;
    const tauxMensuel =
      presencesMensuel.length > 0
        ? (presentsMensuel / presencesMensuel.length) * 100
        : 0;

    // Statistiques annuelles
    const presencesAnnuel = presences.filter((p) => {
      const date = new Date(p.date_reunion);
      return date.getFullYear() === parseInt(selectedYearForStats);
    });
    const presentsAnnuel = presencesAnnuel.filter(
      (p) => p.statut_presence === "Présent",
    ).length;
    const tauxAnnuel =
      presencesAnnuel.length > 0
        ? (presentsAnnuel / presencesAnnuel.length) * 100
        : 0;

    return {
      totalPresences,
      presents,
      absents,
      excuses,
      tauxPresence,
      presencesMensuel: presencesMensuel.length,
      presentsMensuel,
      tauxMensuel,
      presencesAnnuel: presencesAnnuel.length,
      presentsAnnuel,
      tauxAnnuel,
      praesidiaRepresentes: praesidiaRepresentes.size,
      presentsAdultes,
      presentsJuniors,
      absentsTotal,
      postesVacants,
    };
  }, [presences, selectedMonthForStats, selectedYearForStats]);

  const getMemberName = (membreId: string) => {
    const membre = mockMembres.find((m) => m.id_membre === membreId);
    return membre ? membre.nom_prenom : "Membre inconnu";
  };

  const getPraesidiumName = (praesidiumId: string) => {
    const praesidium = mockPraesidia.find(
      (p) => p.id_praesidium === praesidiumId,
    );
    return praesidium ? praesidium.nom_praesidium : "Praesidium inconnu";
  };

  const getMemberPraesidium = (membreId: string) => {
    const membre = mockMembres.find((m) => m.id_membre === membreId);
    return membre ? getPraesidiumName(membre.id_praesidium) : "";
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case "Présent":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Absent":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "Excusé":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "Présent":
        return "default";
      case "Absent":
        return "destructive";
      case "Excusé":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPresence) {
      setPresences(
        presences.map((p) =>
          p.id_presence === editingPresence.id_presence
            ? { ...p, ...formData }
            : p,
        ),
      );
    } else {
      const newPresence: Presence = {
        id_presence: (presences.length + 1).toString(),
        ...formData,
      };
      setPresences([...presences, newPresence]);
    }

    resetForm();
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPresences: Presence[] = bulkFormData.presences.map((p, index) => ({
      id_presence: (presences.length + index + 1).toString(),
      id_membre: p.id_membre,
      date_reunion: bulkFormData.date_reunion,
      statut_presence: p.statut,
      notes: p.notes,
    }));

    setPresences([...presences, ...newPresences]);
    resetBulkForm();
  };

  const resetForm = () => {
    setFormData({
      id_membre: "",
      date_reunion: new Date(),
      statut_presence: "Présent",
      notes: "",
    });
    setEditingPresence(null);
    setIsDialogOpen(false);
  };

  const resetBulkForm = () => {
    setBulkFormData({
      id_praesidium: "",
      date_reunion: new Date(),
      presences: [],
    });
    setIsBulkDialogOpen(false);
  };

  const handleEdit = (presence: Presence) => {
    setEditingPresence(presence);
    setFormData({
      id_membre: presence.id_membre,
      date_reunion: presence.date_reunion,
      statut_presence: presence.statut_presence,
      notes: presence.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (presenceId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette présence ?")) {
      setPresences(presences.filter((p) => p.id_presence !== presenceId));
    }
  };

  const initializeBulkPresences = (praesidiumId: string) => {
    const membres = mockMembres.filter(
      (m) => m.id_praesidium === praesidiumId && m.actif,
    );
    setBulkFormData({
      ...bulkFormData,
      id_praesidium: praesidiumId,
      presences: membres.map((membre) => ({
        id_membre: membre.id_membre,
        statut: "Présent" as const,
        notes: "",
      })),
    });
  };

  const updateBulkPresence = (
    membreId: string,
    field: "statut" | "notes",
    value: string,
  ) => {
    setBulkFormData({
      ...bulkFormData,
      presences: bulkFormData.presences.map((p) =>
        p.id_membre === membreId ? { ...p, [field]: value } : p,
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Suivi des Présences
          </h1>
          <p className="text-muted-foreground">
            Enregistrement et suivi des présences aux réunions
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => resetBulkForm()}>
                <Users className="mr-2 h-4 w-4" />
                Saisie Groupe
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Saisie de Présences en Groupe</DialogTitle>
                <DialogDescription>
                  Enregistrer les présences pour tous les membres d'un
                  praesidium
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleBulkSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="praesidium_bulk">Praesidium</Label>
                    <Select
                      value={bulkFormData.id_praesidium}
                      onValueChange={initializeBulkPresences}
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
                  <div className="space-y-2">
                    <Label htmlFor="date_reunion_bulk">Date de réunion</Label>
                    <Input
                      id="date_reunion_bulk"
                      type="date"
                      value={
                        bulkFormData.date_reunion.toISOString().split("T")[0]
                      }
                      onChange={(e) =>
                        setBulkFormData({
                          ...bulkFormData,
                          date_reunion: new Date(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                </div>

                {bulkFormData.presences.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Présences des membres :</h4>
                    <div className="max-h-60 overflow-y-auto border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Membre</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Notes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bulkFormData.presences.map((presence) => {
                            const membre = mockMembres.find(
                              (m) => m.id_membre === presence.id_membre,
                            );
                            return (
                              <TableRow key={presence.id_membre}>
                                <TableCell className="font-medium">
                                  {membre?.nom_prenom}
                                </TableCell>
                                <TableCell>
                                  <Select
                                    value={presence.statut}
                                    onValueChange={(
                                      value: "Présent" | "Absent" | "Excusé",
                                    ) =>
                                      updateBulkPresence(
                                        presence.id_membre,
                                        "statut",
                                        value,
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Présent">
                                        Présent
                                      </SelectItem>
                                      <SelectItem value="Absent">
                                        Absent
                                      </SelectItem>
                                      <SelectItem value="Excusé">
                                        Excusé
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  <Input
                                    placeholder="Notes (optionnel)"
                                    value={presence.notes || ""}
                                    onChange={(e) =>
                                      updateBulkPresence(
                                        presence.id_membre,
                                        "notes",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full"
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsBulkDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={bulkFormData.presences.length === 0}
                  >
                    Enregistrer Toutes
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Présence
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingPresence
                    ? "Modifier la Présence"
                    : "Nouvelle Présence"}
                </DialogTitle>
                <DialogDescription>
                  {editingPresence
                    ? "Modifiez les informations de présence."
                    : "Enregistrez la présence d'un membre à une réunion."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="membre">Membre</Label>
                  <Select
                    value={formData.id_membre}
                    onValueChange={(value) =>
                      setFormData({ ...formData, id_membre: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un membre" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMembres
                        .filter((m) => m.actif)
                        .map((membre) => (
                          <SelectItem
                            key={membre.id_membre}
                            value={membre.id_membre}
                          >
                            {membre.nom_prenom} -{" "}
                            {getPraesidiumName(membre.id_praesidium)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date_reunion">Date de réunion</Label>
                    <Input
                      id="date_reunion"
                      type="date"
                      value={formData.date_reunion.toISOString().split("T")[0]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          date_reunion: new Date(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="statut_presence">Statut</Label>
                    <Select
                      value={formData.statut_presence}
                      onValueChange={(value: "Présent" | "Absent" | "Excusé") =>
                        setFormData({ ...formData, statut_presence: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Présent">Présent</SelectItem>
                        <SelectItem value="Absent">Absent</SelectItem>
                        <SelectItem value="Excusé">Excusé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optionnel)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Motif d'absence, remarques..."
                    rows={2}
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
                    {editingPresence ? "Modifier" : "Enregistrer"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Globales */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Enregistrements
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPresences}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Présents</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.presents}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absents</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.absents}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Excusés</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.excuses}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de Présence
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.tauxPresence.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques Avancées avec Sélecteurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Statistiques Détaillées par Période
          </CardTitle>
          <CardDescription>
            Choisissez le mois et l'année pour des statistiques détaillées
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sélecteurs de période */}
          <div className="flex gap-4 items-center">
            <div className="space-y-2">
              <Label htmlFor="mois-stats">Mois pour les statistiques</Label>
              <Input
                id="mois-stats"
                type="month"
                value={selectedMonthForStats}
                onChange={(e) => setSelectedMonthForStats(e.target.value)}
                className="w-48"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="annee-stats">Année pour les statistiques</Label>
              <Select
                value={selectedYearForStats}
                onValueChange={setSelectedYearForStats}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Statistiques mensuelles détaillées */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Praesidia Représentés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.praesidiaRepresentes}
                </div>
                <p className="text-xs text-muted-foreground">
                  sur {mockPraesidia.filter((p) => p.actif).length} actifs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Membres Adultes Présents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.presentsAdultes}
                </div>
                <p className="text-xs text-muted-foreground">
                  praesidia adultes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Membres Juniors Présents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.presentsJuniors}
                </div>
                <p className="text-xs text-muted-foreground">
                  praesidia juniors
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Absents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {stats.absentsTotal}
                </div>
                <p className="text-xs text-muted-foreground">tous praesidia</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Postes Vacants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.postesVacants}
                </div>
                <p className="text-xs text-muted-foreground">
                  postes non pourvus
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Statistiques annuelles */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Résumé Annuel {selectedYearForStats}
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.presencesAnnuel}
                </div>
                <p className="text-sm text-muted-foreground">
                  Réunions totales
                </p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.presentsAnnuel}
                </div>
                <p className="text-sm text-muted-foreground">Présents totaux</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.tauxAnnuel.toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground">Taux annuel</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and List */}
      <Card>
        <CardHeader>
          <CardTitle>Registre des Présences</CardTitle>
          <CardDescription>
            Consultation et gestion des présences aux réunions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
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
            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Tous les membres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les membres</SelectItem>
                {mockMembres
                  .filter((m) => m.actif)
                  .map((membre) => (
                    <SelectItem key={membre.id_membre} value={membre.id_membre}>
                      {membre.nom_prenom}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Input
              type="month"
              value={format(selectedDate, "yyyy-MM")}
              onChange={(e) =>
                setSelectedDate(new Date(e.target.value + "-01"))
              }
              className="w-48"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membre</TableHead>
                  <TableHead>Praesidium</TableHead>
                  <TableHead>Date Réunion</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPresences.map((presence) => (
                  <TableRow key={presence.id_presence}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                        {getMemberName(presence.id_membre)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        {getMemberPraesidium(presence.id_membre)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(presence.date_reunion, "dd/MM/yyyy", {
                          locale: fr,
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(presence.statut_presence)}
                        <Badge
                          variant={
                            getStatusColor(presence.statut_presence) as any
                          }
                        >
                          {presence.statut_presence}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {presence.notes || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(presence)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(presence.id_presence)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPresences.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Aucune présence enregistrée pour les critères sélectionnés
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
