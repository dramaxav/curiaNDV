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
  const [selectedTypeRapport, setSelectedTypeRapport] = useState<"mensuel" | "annuel">("mensuel");

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

  // Mock data pour rapport conseil
  const rapportConseil: RapportConseil = {
    id_rapport: "1",
    periode: "2024-01",
    type_rapport: "mensuel",
    total_contributions: stats.totalContributions,
    total_depenses: stats.totalDepenses,
    solde_global: stats.totalSolde,
    nombre_praesidia_actifs: mockPraesidia.filter((p) => p.actif).length,
    contributions_par_praesidium: [
      {
        id_praesidium: "1",
        nom_praesidium: "Notre-Dame du Rosaire",
        montant: 350000,
        statut: "paye",
      },
      {
        id_praesidium: "2",
        nom_praesidium: "Saint-Jean-Baptiste",
        montant: 250000,
        statut: "paye",
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
        categorie: "Missions et evangelisation",
        montant: 120000,
        description: "Financement des missions",
      },
      {
        categorie: "Formation des membres",
        montant: 35000,
        description: "Séminaires et livres",
      },
      {
        categorie: "Frais administratifs",
        montant: 25000,
        description: "Papeterie et communications",
      },
    ],
    observations:
      "Excellente performance ce mois-ci. Le praesidium Sainte-Thérèse nécessite un suivi pour les retards de contribution.",
    cree_par: utilisateur?.id_utilisateur || "1",
    date_creation: new Date(),
    approuve_par: undefined,
    date_approbation: undefined,
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="praesidia" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Gestion Praesidia
          </TabsTrigger>
          {canViewAllReports && (
            <TabsTrigger
              value="rapport-conseil"
              className="flex items-center gap-2"
            >
              <Crown className="h-4 w-4" />
              Rapport du Conseil
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

        {/* Onglet Rapport du Conseil */}
        {canViewAllReports && (
          <TabsContent value="rapport-conseil" className="space-y-6">
            {/* Header du rapport */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-primary" />
                      Rapport Financier du Conseil
                    </CardTitle>
                    <CardDescription>
                      Période: {rapportConseil.periode} • Type:{" "}
                      {rapportConseil.type_rapport}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {rapportConseil.approuve_par ? (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Approuvé
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <Calendar className="h-3 w-3" />
                        En attente
                      </Badge>
                    )}
                    {canApproveFinances && !rapportConseil.approuve_par && (
                      <Button size="sm">Approuver</Button>
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
                    Total Contributions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(rapportConseil.total_contributions)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Total Dépenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(rapportConseil.total_depenses)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Solde Global
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(rapportConseil.solde_global)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Praesidia Actifs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {rapportConseil.nombre_praesidia_actifs}
                  </div>
                </CardContent>
              </Card>
            </div>

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
