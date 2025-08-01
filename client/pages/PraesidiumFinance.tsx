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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Calculator,
  TrendingUp,
  TrendingDown,
  Euro,
  PieChart,
  Calendar,
  Plus,
  Building,
} from "lucide-react";
import { useAuth, useIsPraesidiumOfficer } from "@/contexts/AuthContext";
import type { Finance, TransactionFinanciere } from "@shared/types";

interface ContributionForm {
  montant: string;
  mois: string;
  description: string;
}

export default function PraesidiumFinance() {
  const { utilisateur } = useAuth();
  const isPraesidiumOfficer = useIsPraesidiumOfficer();
  
  const [activeTab, setActiveTab] = useState("vue-ensemble");
  const [contributionForm, setContributionForm] = useState<ContributionForm>({
    montant: "",
    mois: new Date().toISOString().slice(0, 7),
    description: "",
  });

  // Mock data pour le praesidium de l'utilisateur
  const mockFinances: Finance[] = [
    {
      id_finance: "1",
      id_praesidium: utilisateur?.id_praesidium || "1",
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
      id_praesidium: utilisateur?.id_praesidium || "1",
      mois: "2024-02",
      solde_initial: 730000,
      contributions: 400000,
      depenses: 85000,
      solde_final: 1045000,
      description_depenses: "Formation et missions",
      date_maj: new Date("2024-02-29"),
    },
    {
      id_finance: "3",
      id_praesidium: utilisateur?.id_praesidium || "1", 
      mois: "2024-03",
      solde_initial: 1045000,
      contributions: 380000,
      depenses: 95000,
      solde_final: 1330000,
      description_depenses: "Activités spirituelles",
      date_maj: new Date("2024-03-31"),
    },
  ];

  const [finances] = useState<Finance[]>(mockFinances);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("XOF", "F CFA");
  };

  const stats = useMemo(() => {
    const totalContributions = finances.reduce((sum, f) => sum + f.contributions, 0);
    const totalDepenses = finances.reduce((sum, f) => sum + f.depenses, 0);
    const soldeActuel = finances[finances.length - 1]?.solde_final || 0;
    const benefice = totalContributions - totalDepenses;

    return {
      totalContributions,
      totalDepenses,
      soldeActuel,
      benefice,
    };
  }, [finances]);

  const handleAjouterContribution = () => {
    if (!contributionForm.montant) {
      alert("Veuillez saisir un montant");
      return;
    }

    console.log("Nouvelle contribution:", {
      ...contributionForm,
      montant: parseFloat(contributionForm.montant),
      id_praesidium: utilisateur?.id_praesidium,
    });

    setContributionForm({
      montant: "",
      mois: new Date().toISOString().slice(0, 7),
      description: "",
    });

    alert("Contribution enregistrée avec succès");
  };

  // Données pour les graphiques par année
  const getAnnualData = () => {
    const annees = ["2022", "2023", "2024"];
    return annees.map(annee => {
      const financesAnnee = finances.filter(f => f.mois.startsWith(annee));
      return {
        annee,
        contributions: financesAnnee.reduce((sum, f) => sum + f.contributions, 0),
        depenses: financesAnnee.reduce((sum, f) => sum + f.depenses, 0),
        solde: financesAnnee[financesAnnee.length - 1]?.solde_final || 0,
      };
    });
  };

  const annualData = getAnnualData();

  if (!isPraesidiumOfficer) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <Building className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Accès restreint</h3>
          <p className="text-muted-foreground">
            Cette page est réservée aux officiers de praesidium.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-legion-blue">
            Finance du Praesidium
          </h1>
          <p className="text-muted-foreground">
            Gestion financière de votre praesidium
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vue-ensemble" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="contributions" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Contributions
          </TabsTrigger>
          <TabsTrigger value="annuel" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Vue annuelle
          </TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="vue-ensemble" className="space-y-6">
          {/* Statistiques principales */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="card-colorful hover-colorful border-success/30 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-success">
                  Total Contributions
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {formatCurrency(stats.totalContributions)}
                </div>
              </CardContent>
            </Card>

            <Card className="card-colorful hover-colorful border-destructive/30 bg-gradient-to-br from-red-50 to-pink-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-destructive">
                  Total Dépenses
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {formatCurrency(stats.totalDepenses)}
                </div>
              </CardContent>
            </Card>

            <Card className="card-colorful hover-colorful border-legion-blue/30 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-legion-blue">
                  Solde Actuel
                </CardTitle>
                <Euro className="h-4 w-4 text-legion-blue" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-legion-blue">
                  {formatCurrency(stats.soldeActuel)}
                </div>
              </CardContent>
            </Card>

            <Card className="card-colorful hover-colorful border-legion-gold/30 bg-gradient-to-br from-yellow-50 to-amber-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-legion-gold">
                  Bénéfice Net
                </CardTitle>
                <PieChart className="h-4 w-4 text-legion-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-legion-gold">
                  {formatCurrency(stats.benefice)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Historique mensuel */}
          <Card>
            <CardHeader>
              <CardTitle>Historique Financier Mensuel</CardTitle>
              <CardDescription>
                Évolution des finances de votre praesidium par mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mois</TableHead>
                    <TableHead>Solde Initial</TableHead>
                    <TableHead>Contributions</TableHead>
                    <TableHead>Dépenses</TableHead>
                    <TableHead>Solde Final</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finances.map((finance) => (
                    <TableRow key={finance.id_finance}>
                      <TableCell className="font-medium">
                        {new Date(finance.mois + "-01").toLocaleDateString("fr-FR", {
                          month: "long",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(finance.solde_initial)}
                      </TableCell>
                      <TableCell className="text-success font-medium">
                        {formatCurrency(finance.contributions)}
                      </TableCell>
                      <TableCell className="text-destructive font-medium">
                        {formatCurrency(finance.depenses)}
                      </TableCell>
                      <TableCell className="font-bold">
                        {formatCurrency(finance.solde_final)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {finance.description_depenses || "-"}
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Ajouter une Contribution Mensuelle
              </CardTitle>
              <CardDescription>
                Enregistrez les contributions de votre praesidium
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-md space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contrib_montant">Montant (F CFA)</Label>
                    <Input
                      id="contrib_montant"
                      type="number"
                      placeholder="Ex: 350000"
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
                    rows={3}
                  />
                </div>
                <Button onClick={handleAjouterContribution} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Enregistrer la Contribution
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vue annuelle */}
        <TabsContent value="annuel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Situation Financière Annuelle</CardTitle>
              <CardDescription>
                Évolution des finances par année
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Année</TableHead>
                    <TableHead>Contributions Totales</TableHead>
                    <TableHead>Dépenses Totales</TableHead>
                    <TableHead>Solde Final</TableHead>
                    <TableHead>Évolution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {annualData.map((data, index) => {
                    const previousYear = index > 0 ? annualData[index - 1] : null;
                    const evolution = previousYear 
                      ? ((data.solde - previousYear.solde) / previousYear.solde * 100)
                      : 0;
                    
                    return (
                      <TableRow key={data.annee}>
                        <TableCell className="font-medium text-legion-blue">
                          {data.annee}
                        </TableCell>
                        <TableCell className="text-success font-medium">
                          {formatCurrency(data.contributions)}
                        </TableCell>
                        <TableCell className="text-destructive font-medium">
                          {formatCurrency(data.depenses)}
                        </TableCell>
                        <TableCell className="font-bold">
                          {formatCurrency(data.solde)}
                        </TableCell>
                        <TableCell>
                          {previousYear && (
                            <div className={`flex items-center gap-1 ${
                              evolution >= 0 ? "text-success" : "text-destructive"
                            }`}>
                              {evolution >= 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              <span className="text-xs font-medium">
                                {evolution.toFixed(1)}%
                              </span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
