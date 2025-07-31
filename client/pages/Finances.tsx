import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calculator,
  Building,
  Crown,
  TrendingUp,
  TrendingDown,
  Euro,
  PieChart,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Calendar,
} from "lucide-react";
import { useAuth, usePermission } from "@/contexts/AuthContext";
import type { Finance, Praesidium, RapportConseil } from "@shared/types";

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

const mockFinances: Finance[] = [
  {
    id_finance: "1",
    id_praesidium: "1",
    mois: "2024-01",
    solde_initial: 500000,
    contributions: 350000,
    depenses: 120000,
    solde_final: 730000,
    description_depenses: "Missions et matériel liturgique",
    date_maj: new Date("2024-01-31"),
  },
  {
    id_finance: "2",
    id_praesidium: "2",
    mois: "2024-01",
    solde_initial: 300000,
    contributions: 250000,
    depenses: 85000,
    solde_final: 465000,
    description_depenses: "Formation et missions",
    date_maj: new Date("2024-01-31"),
  },
  {
    id_finance: "3",
    id_praesidium: "3",
    mois: "2024-01",
    solde_initial: 200000,
    contributions: 150000,
    depenses: 45000,
    solde_final: 305000,
    description_depenses: "Activités jeunes",
    date_maj: new Date("2024-01-31"),
  },
];

export default function Finances() {
  const { utilisateur } = useAuth();
  const canViewAllReports = usePermission("view_all_reports");
  const canApproveFinances = usePermission("approve_finances");

  const [activeTab, setActiveTab] = useState("praesidia");
  const [finances] = useState<Finance[]>(mockFinances);
  const [selectedPeriode, setSelectedPeriode] = useState("2024-01");
  const [selectedTypeRapport, setSelectedTypeRapport] = useState<
    "mensuel" | "annuel"
  >("mensuel");

  // ��tats pour les formulaires
  const [contributionForm, setContributionForm] = useState({
    id_praesidium: "",
    montant: "",
    mois: new Date().toISOString().slice(0, 7), // Format YYYY-MM
    description: "",
  });

  const [depenseForm, setDepenseForm] = useState({
    categorie: "",
    montant: "",
    description: "",
    date_depense: new Date().toISOString().slice(0, 10), // Format YYYY-MM-DD
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("XOF", "F CFA");
  };

  const getPraesidiumName = (praesidiumId: string) => {
    const praesidium = mockPraesidia.find(
      (p) => p.id_praesidium === praesidiumId,
    );
    return praesidium ? praesidium.nom_praesidium : "Praesidium inconnu";
  };

  const stats = useMemo(() => {
    const totalContributions = finances.reduce(
      (sum, f) => sum + f.contributions,
      0,
    );
    const totalDepenses = finances.reduce((sum, f) => sum + f.depenses, 0);
    const totalSolde = finances.reduce((sum, f) => sum + f.solde_final, 0);

    return {
      totalContributions,
      totalDepenses,
      totalSolde,
      benefice: totalContributions - totalDepenses,
    };
  }, [finances]);

  const generateRapportConseil = (
    periode: string,
    type: "mensuel" | "annuel",
  ): RapportConseil => {
    // Simulation du solde initial basé sur la période précédente
    const getSoldeInitial = (periode: string) => {
      // En pratique, ceci viendrait de la base de données
      const periodesPrecedentes: Record<string, number> = {
        "2024-01": 1200000,
        "2024-02": 1375000,
        "2024-03": 1550000,
        "2024": 1200000,
      };
      return periodesPrecedentes[periode] || 1000000;
    };

    const soldeInitial = getSoldeInitial(periode);
    const totalContributions = stats.totalContributions;
    const totalDepenses = 185000; // Dépenses du conseil (différentes des dépenses praesidia)
    const soldeFinale = soldeInitial + totalContributions - totalDepenses;

    return {
      id_rapport: `rpt_${periode}_${type}`,
      periode: periode,
      type_rapport: type,
      solde_initial: soldeInitial,
      total_contributions: totalContributions,
      total_depenses: totalDepenses,
      solde_final: soldeFinale,
      nombre_praesidia_actifs: mockPraesidia.filter((p) => p.actif).length,
      contributions_par_praesidium: [
        {
          id_praesidium: "1",
          nom_praesidium: "Notre-Dame du Rosaire",
          montant: 350000,
          statut: "paye",
          date_paiement: new Date("2024-01-15"),
        },
        {
          id_praesidium: "2",
          nom_praesidium: "Saint-Jean-Baptiste",
          montant: 250000,
          statut: "paye",
          date_paiement: new Date("2024-01-20"),
        },
        {
          id_praesidium: "3",
          nom_praesidium: "Sainte-Thérèse",
          montant: 150000,
          statut: "en_retard",
        },
      ],
      depenses_principales: [
        {
          categorie: "Missions et évangélisation",
          montant: 120000,
          description: "Financement des missions territoriales",
          date_depense: new Date("2024-01-10"),
        },
        {
          categorie: "Formation spirituelle",
          montant: 35000,
          description: "Séminaires et matériel de formation",
          date_depense: new Date("2024-01-15"),
        },
        {
          categorie: "Frais administratifs",
          montant: 30000,
          description: "Communication, papeterie, transport",
          date_depense: new Date("2024-01-25"),
        },
      ],
      analyse_comparative: {
        periode_precedente: type === "mensuel" ? "2023-12" : "2023",
        evolution_contributions: +12.5, // +12.5%
        evolution_depenses: -5.2, // -5.2%
        evolution_solde: +8.3, // +8.3%
      },
      observations: `Rapport ${type} pour la période ${periode}. Excellente performance financière avec une augmentation significative des contributions. Les dépenses sont bien maîtrisées. ${
        type === "mensuel"
          ? "Le praesidium Sainte-Thérèse nécessite un suivi pour régulariser sa contribution."
          : "Bilan annuel très positif pour l'ensemble des activités."
      }`,
      cree_par: utilisateur?.id_utilisateur || "1",
      date_creation: new Date(),
      approuve_par: undefined,
      date_approbation: undefined,
      statut: "brouillon",
    };
  };

  // Générer le rapport conseil basé sur la période sélectionnée
  const rapportConseil = useMemo(() => {
    return generateRapportConseil(selectedPeriode, selectedTypeRapport);
  }, [selectedPeriode, selectedTypeRapport, stats]);

  const handleGenererRapport = () => {
    // Ici on pourrait sauvegarder le rapport en base
    console.log("Génération du rapport:", rapportConseil);
  };

  const handleApprouverRapport = () => {
    // Mettre à jour le statut du rapport
    console.log("Approbation du rapport:", rapportConseil.id_rapport);
  };

  const handleAjouterContribution = () => {
    if (!contributionForm.id_praesidium || !contributionForm.montant) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Ici on sauvegarderait la contribution en base
    console.log("Nouvelle contribution:", {
      ...contributionForm,
      montant: parseFloat(contributionForm.montant),
    });

    // Reset du formulaire
    setContributionForm({
      id_praesidium: "",
      montant: "",
      mois: new Date().toISOString().slice(0, 7),
      description: "",
    });

    alert("Contribution enregistrée avec succès");
  };

  const handleAjouterDepense = () => {
    if (!depenseForm.categorie || !depenseForm.montant) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Ici on sauvegarderait la dépense en base
    console.log("Nouvelle dépense:", {
      ...depenseForm,
      montant: parseFloat(depenseForm.montant),
    });

    // Reset du formulaire
    setDepenseForm({
      categorie: "",
      montant: "",
      description: "",
      date_depense: new Date().toISOString().slice(0, 10),
    });

    alert("Dépense enregistrée avec succès");
  };

  const getPeriodesDisponibles = () => {
    if (selectedTypeRapport === "mensuel") {
      return [
        { value: "2024-01", label: "Janvier 2024" },
        { value: "2024-02", label: "Février 2024" },
        { value: "2024-03", label: "Mars 2024" },
        { value: "2023-12", label: "Décembre 2023" },
        { value: "2023-11", label: "Novembre 2023" },
      ];
    } else {
      return [
        { value: "2024", label: "Année 2024" },
        { value: "2023", label: "Année 2023" },
        { value: "2022", label: "Année 2022" },
      ];
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "paye":
        return "default";
      case "en_retard":
        return "destructive";
      case "non_paye":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion Financière
          </h1>
          <p className="text-muted-foreground">
            Suivi des contributions, dépenses et rapport consolidé du conseil
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="praesidia" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="contributions" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Contributions
          </TabsTrigger>
          <TabsTrigger value="depenses" className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Dépenses Conseil
          </TabsTrigger>
          {canViewAllReports && (
            <TabsTrigger
              value="rapport-conseil"
              className="flex items-center gap-2"
            >
              <Crown className="h-4 w-4" />
              Rapports
            </TabsTrigger>
          )}
        </TabsList>

        {/* Onglet Gestion Praesidia */}
        <TabsContent value="praesidia" className="space-y-6">
          {/* Statistics des praesidia */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Contributions
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.totalContributions)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dépenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.totalDepenses)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Solde Total
                </CardTitle>
                <Euro className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.totalSolde)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bénéfice</CardTitle>
                <PieChart className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.benefice)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table des finances par praesidium */}
          <Card>
            <CardHeader>
              <CardTitle>Finances par Praesidium</CardTitle>
              <CardDescription>
                État financier mensuel des praesidia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Praesidium</TableHead>
                    <TableHead>Mois</TableHead>
                    <TableHead>Contributions</TableHead>
                    <TableHead>Dépenses</TableHead>
                    <TableHead>Solde Final</TableHead>
                    <TableHead>Dernière MAJ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finances.map((finance) => (
                    <TableRow key={finance.id_finance}>
                      <TableCell className="font-medium">
                        {getPraesidiumName(finance.id_praesidium)}
                      </TableCell>
                      <TableCell>{finance.mois}</TableCell>
                      <TableCell className="text-green-600">
                        {formatCurrency(finance.contributions)}
                      </TableCell>
                      <TableCell className="text-red-600">
                        {formatCurrency(finance.depenses)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(finance.solde_final)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {finance.date_maj.toLocaleDateString("fr-FR")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Contributions */}
        <TabsContent value="contributions" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Contribution par Praesidium */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  Contribution par Praesidium
                </CardTitle>
                <CardDescription>
                  Enregistrer une contribution mensuelle d'un praesidium
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contrib_praesidium">Praesidium</Label>
                      <Select
                        value={contributionForm.id_praesidium}
                        onValueChange={(value) =>
                          setContributionForm({
                            ...contributionForm,
                            id_praesidium: value,
                          })
                        }
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
                      <Label htmlFor="contrib_mois">Mois</Label>
                      <Input
                        id="contrib_mois"
                        type="month"
                        value={contributionForm.mois}
                        onChange={(e) =>
                          setContributionForm({
                            ...contributionForm,
                            mois: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contrib_montant">Montant (F CFA)</Label>
                    <Input
                      id="contrib_montant"
                      type="number"
                      placeholder="Ex: 50000"
                      value={contributionForm.montant}
                      onChange={(e) =>
                        setContributionForm({
                          ...contributionForm,
                          montant: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contrib_description">
                      Description (optionnel)
                    </Label>
                    <Textarea
                      id="contrib_description"
                      placeholder="Notes sur cette contribution..."
                      value={contributionForm.description}
                      onChange={(e) =>
                        setContributionForm({
                          ...contributionForm,
                          description: e.target.value,
                        })
                      }
                      rows={2}
                    />
                  </div>
                  <Button onClick={handleAjouterContribution} className="w-full">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Enregistrer la Contribution
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Autres Recettes du Conseil */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Euro className="h-5 w-5 text-green-600" />
                  Autres Recettes du Conseil
                </CardTitle>
                <CardDescription>
                  Enregistrer d'autres sources de recettes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recette_categorie">Catégorie</Label>
                      <Select
                        value={depenseForm.categorie}
                        onValueChange={(value) =>
                          setDepenseForm({
                            ...depenseForm,
                            categorie: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Type de recette" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dons">Dons</SelectItem>
                          <SelectItem value="collectes">Collectes spéciales</SelectItem>
                          <SelectItem value="ventes">Ventes</SelectItem>
                          <SelectItem value="subventions">Subventions</SelectItem>
                          <SelectItem value="autres">Autres</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recette_montant">Montant (F CFA)</Label>
                      <Input
                        id="recette_montant"
                        type="number"
                        placeholder="Ex: 25000"
                        value={depenseForm.montant}
                        onChange={(e) =>
                          setDepenseForm({
                            ...depenseForm,
                            montant: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recette_date">Date</Label>
                    <Input
                      id="recette_date"
                      type="date"
                      value={depenseForm.date_depense}
                      onChange={(e) =>
                        setDepenseForm({
                          ...depenseForm,
                          date_depense: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recette_description">Description</Label>
                    <Textarea
                      id="recette_description"
                      placeholder="Détails sur cette recette..."
                      value={depenseForm.description}
                      onChange={(e) =>
                        setDepenseForm({
                          ...depenseForm,
                          description: e.target.value,
                        })
                      }
                      rows={2}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      console.log("Ajout recette:", depenseForm);
                      alert("Recette enregistrée avec succès");
                    }}
                    className="w-full"
                    variant="outline"
                  >
                    <Euro className="mr-2 h-4 w-4" />
                    Enregistrer la Recette
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Dépenses Conseil */}
        <TabsContent value="depenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                Dépenses du Conseil
              </CardTitle>
              <CardDescription>
                Enregistrer les dépenses effectuées par le conseil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-md space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="depense_categorie">Catégorie</Label>
                    <Select
                      value={depenseForm.categorie}
                      onValueChange={(value) =>
                        setDepenseForm({
                          ...depenseForm,
                          categorie: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Type de dépense" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="missions">Missions et évangélisation</SelectItem>
                        <SelectItem value="formation">Formation spirituelle</SelectItem>
                        <SelectItem value="administratif">Frais administratifs</SelectItem>
                        <SelectItem value="materiel">Matériel liturgique</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="communication">Communication</SelectItem>
                        <SelectItem value="autres">Autres</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="depense_montant">Montant (F CFA)</Label>
                    <Input
                      id="depense_montant"
                      type="number"
                      placeholder="Ex: 15000"
                      value={depenseForm.montant}
                      onChange={(e) =>
                        setDepenseForm({
                          ...depenseForm,
                          montant: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depense_date">Date de la dépense</Label>
                  <Input
                    id="depense_date"
                    type="date"
                    value={depenseForm.date_depense}
                    onChange={(e) =>
                      setDepenseForm({
                        ...depenseForm,
                        date_depense: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depense_description">Description</Label>
                  <Textarea
                    id="depense_description"
                    placeholder="Détails sur cette dépense..."
                    value={depenseForm.description}
                    onChange={(e) =>
                      setDepenseForm({
                        ...depenseForm,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <Button onClick={handleAjouterDepense} className="w-full">
                  <TrendingDown className="mr-2 h-4 w-4" />
                  Enregistrer la Dépense
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Rapport du Conseil */}
        {canViewAllReports && (
          <TabsContent value="rapport-conseil" className="space-y-6">
            {/* Contrôles de génération de rapport */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  Générateur de Rapports Financiers
                </CardTitle>
                <CardDescription>
                  Sélectionnez la période et le type de rapport à générer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Type de rapport
                    </label>
                    <Select
                      value={selectedTypeRapport}
                      onValueChange={(value: "mensuel" | "annuel") => {
                        setSelectedTypeRapport(value);
                        // Réinitialiser la période selon le type
                        if (value === "mensuel") {
                          setSelectedPeriode("2024-01");
                        } else {
                          setSelectedPeriode("2024");
                        }
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mensuel">Mensuel</SelectItem>
                        <SelectItem value="annuel">Annuel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Période</label>
                    <Select
                      value={selectedPeriode}
                      onValueChange={setSelectedPeriode}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getPeriodesDisponibles().map((periode) => (
                          <SelectItem key={periode.value} value={periode.value}>
                            {periode.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleGenererRapport} className="mt-8">
                    Générer le Rapport
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Header du rapport généré */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-primary" />
                      Rapport Financier{" "}
                      {rapportConseil.type_rapport.charAt(0).toUpperCase() +
                        rapportConseil.type_rapport.slice(1)}
                    </CardTitle>
                    <CardDescription>
                      Période: {rapportConseil.periode} • Statut:{" "}
                      {rapportConseil.statut}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {rapportConseil.statut === "approuve" ? (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Approuvé
                      </Badge>
                    ) : rapportConseil.statut === "soumis" ? (
                      <Badge variant="secondary" className="gap-1">
                        <Calendar className="h-3 w-3" />
                        En attente d'approbation
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Calendar className="h-3 w-3" />
                        Brouillon
                      </Badge>
                    )}
                    {canApproveFinances &&
                      rapportConseil.statut !== "approuve" && (
                        <Button size="sm" onClick={handleApprouverRapport}>
                          Approuver
                        </Button>
                      )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Résumé financier global */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Solde Initial
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(rapportConseil.solde_initial)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Début de période
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Contributions Reçues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(rapportConseil.total_contributions)}
                  </div>
                  {rapportConseil.analyse_comparative && (
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-xs text-green-600">
                        +
                        {
                          rapportConseil.analyse_comparative
                            .evolution_contributions
                        }
                        %
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Dépenses du Conseil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(rapportConseil.total_depenses)}
                  </div>
                  {rapportConseil.analyse_comparative && (
                    <div className="flex items-center mt-1">
                      <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-xs text-green-600">
                        {rapportConseil.analyse_comparative.evolution_depenses}%
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Solde Final
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(rapportConseil.solde_final)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Fin de période
                  </p>
                  {rapportConseil.analyse_comparative && (
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-xs text-green-600">
                        +{rapportConseil.analyse_comparative.evolution_solde}%
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Analyse comparative */}
            {rapportConseil.analyse_comparative && (
              <Card>
                <CardHeader>
                  <CardTitle>Analyse Comparative</CardTitle>
                  <CardDescription>
                    Évolution par rapport à la période précédente (
                    {rapportConseil.analyse_comparative.periode_precedente})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Contributions
                        </span>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-green-600 font-medium">
                            +
                            {
                              rapportConseil.analyse_comparative
                                .evolution_contributions
                            }
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Dépenses</span>
                        <div className="flex items-center gap-1">
                          <TrendingDown className="h-4 w-4 text-green-500" />
                          <span className="text-green-600 font-medium">
                            {
                              rapportConseil.analyse_comparative
                                .evolution_depenses
                            }
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Solde Final</span>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-green-600 font-medium">
                            +
                            {rapportConseil.analyse_comparative.evolution_solde}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contributions par praesidium */}
            <Card>
              <CardHeader>
                <CardTitle>Contributions par Praesidium</CardTitle>
                <CardDescription>
                  Détail des contributions de chaque praesidium
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Praesidium</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Date Paiement</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rapportConseil.contributions_par_praesidium.map(
                      (contrib) => (
                        <TableRow key={contrib.id_praesidium}>
                          <TableCell className="font-medium">
                            {contrib.nom_praesidium}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(contrib.montant)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {contrib.date_paiement
                              ? contrib.date_paiement.toLocaleDateString(
                                  "fr-FR",
                                )
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatutColor(contrib.statut) as any}
                            >
                              {contrib.statut === "paye"
                                ? "Payé"
                                : contrib.statut === "en_retard"
                                  ? "En retard"
                                  : "Non payé"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Principales dépenses */}
            <Card>
              <CardHeader>
                <CardTitle>Principales Dépenses</CardTitle>
                <CardDescription>
                  Répartition des dépenses par catégorie
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rapportConseil.depenses_principales.map(
                      (depense, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {depense.categorie}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(depense.montant)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {depense.date_depense.toLocaleDateString("fr-FR")}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {depense.description}
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Observations */}
            {rapportConseil.observations && (
              <Card>
                <CardHeader>
                  <CardTitle>Observations</CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {rapportConseil.observations}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}

            {/* Informations de création */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    Rapport créé le{" "}
                    {rapportConseil.date_creation.toLocaleDateString("fr-FR")}
                  </p>
                  {rapportConseil.approuve_par &&
                    rapportConseil.date_approbation && (
                      <p>
                        Approuvé le{" "}
                        {rapportConseil.date_approbation.toLocaleDateString(
                          "fr-FR",
                        )}
                      </p>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
