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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Calculator,
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  TrendingUp,
  TrendingDown,
  Euro,
  Calendar,
  FileText,
  PieChart,
  Building,
  Crown,
  CheckCircle,
  XCircle,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { useAuth, usePermission } from "@/contexts/AuthContext";
import type { Finance, TransactionFinanciere, Praesidium, RapportConseil } from "@shared/types";

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
    solde_initial: 320000,
    contributions: 450000,
    depenses: 280000,
    solde_final: 490000,
    description_depenses: "Matériel liturgique, transport missionnaire",
    date_maj: new Date("2024-01-31"),
  },
  {
    id_finance: "2",
    id_praesidium: "2",
    mois: "2024-01",
    solde_initial: 250000,
    contributions: 380000,
    depenses: 320000,
    solde_final: 310000,
    description_depenses: "Aumône, frais réunion",
    date_maj: new Date("2024-01-31"),
  },
  {
    id_finance: "3",
    id_praesidium: "3",
    mois: "2024-01",
    solde_initial: 180000,
    contributions: 290000,
    depenses: 150000,
    solde_final: 320000,
    description_depenses: "Formation membres, documentation",
    date_maj: new Date("2024-01-31"),
  },
];

const mockTransactions: TransactionFinanciere[] = [
  {
    id_transaction: "1",
    id_praesidium: "1",
    type: "contribution",
    montant: 50000,
    description: "Collecte mensuelle - Marie Dubois",
    date_transaction: new Date("2024-01-15"),
    categorie: "Cotisation",
  },
  {
    id_transaction: "2",
    id_praesidium: "1",
    type: "depense",
    montant: 25000,
    description: "Achat de chapelets",
    date_transaction: new Date("2024-01-20"),
    categorie: "Matériel religieux",
  },
  {
    id_transaction: "3",
    id_praesidium: "2",
    type: "contribution",
    montant: 75000,
    description: "Don pour les missions",
    date_transaction: new Date("2024-01-10"),
    categorie: "Don mission",
  },
];

export default function Finances() {
  const { utilisateur } = useAuth();
  const canViewAllReports = usePermission('view_all_reports');
  const canApproveFinances = usePermission('approve_finances');

  const [finances, setFinances] = useState<Finance[]>(mockFinances);
  const [transactions, setTransactions] =
    useState<TransactionFinanciere[]>(mockTransactions);
  const [selectedPraesidium, setSelectedPraesidium] = useState<string>("all");
  const [selectedMois, setSelectedMois] = useState<string>("2024-01");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [editingFinance, setEditingFinance] = useState<Finance | null>(null);
  const [activeTab, setActiveTab] = useState('praesidia');

  // Mock data pour rapport conseil
  const rapportConseil: RapportConseil = {
    id_rapport: '1',
    periode: '2024-01',
    type_rapport: 'mensuel',
    total_contributions: 750000,
    total_depenses: 180000,
    solde_global: 570000,
    nombre_praesidia_actifs: 3,
    contributions_par_praesidium: [
      { id_praesidium: '1', nom_praesidium: 'Notre-Dame du Rosaire', montant: 350000, statut: 'paye' },
      { id_praesidium: '2', nom_praesidium: 'Saint-Jean-Baptiste', montant: 250000, statut: 'paye' },
      { id_praesidium: '3', nom_praesidium: 'Sainte-Thérèse', montant: 150000, statut: 'en_retard' }
    ],
    depenses_principales: [
      { categorie: 'Missions et evangelisation', montant: 120000, description: 'Financement des missions' },
      { categorie: 'Formation des membres', montant: 35000, description: 'Séminaires et livres' },
      { categorie: 'Frais administratifs', montant: 25000, description: 'Papeterie et communications' }
    ],
    observations: 'Excellente performance ce mois-ci. Le praesidium Sainte-Thérèse nécessite un suivi.',
    cree_par: utilisateur?.id_utilisateur || '1',
    date_creation: new Date(),
    approuve_par: undefined,
    date_approbation: undefined
  };

  const [financeFormData, setFinanceFormData] = useState({
    id_praesidium: "",
    mois: "",
    solde_initial: 0,
    contributions: 0,
    depenses: 0,
    description_depenses: "",
  });

  const [transactionFormData, setTransactionFormData] = useState({
    id_praesidium: "",
    type: "contribution" as "contribution" | "depense",
    montant: 0,
    description: "",
    categorie: "",
    date_transaction: new Date(),
  });

  const filteredFinances = useMemo(() => {
    return finances.filter((finance) => {
      const matchesPraesidium =
        selectedPraesidium === "all" ||
        finance.id_praesidium === selectedPraesidium;
      const matchesMois =
        selectedMois === "all" || finance.mois === selectedMois;
      return matchesPraesidium && matchesMois;
    });
  }, [finances, selectedPraesidium, selectedMois]);

  const stats = useMemo(() => {
    const totalContributions = finances.reduce(
      (sum, f) => sum + f.contributions,
      0,
    );
    const totalDepenses = finances.reduce((sum, f) => sum + f.depenses, 0);
    const totalSolde = finances.reduce((sum, f) => sum + f.solde_final, 0);
    const avgContributions =
      finances.length > 0 ? totalContributions / finances.length : 0;

    return {
      totalContributions,
      totalDepenses,
      totalSolde,
      avgContributions,
      benefice: totalContributions - totalDepenses,
    };
  }, [finances]);

  const getPraesidiumName = (praesidiumId: string) => {
    const praesidium = mockPraesidia.find(
      (p) => p.id_praesidium === praesidiumId,
    );
    return praesidium ? praesidium.nom_praesidium : "Praesidium inconnu";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("XOF", "F CFA");
  };

  const getMoisOptions = () => {
    const mois = ["2024-01", "2023-12", "2023-11", "2023-10"];
    return mois;
  };

  const handleFinanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const solde_final =
      financeFormData.solde_initial +
      financeFormData.contributions -
      financeFormData.depenses;

    if (editingFinance) {
      setFinances(
        finances.map((f) =>
          f.id_finance === editingFinance.id_finance
            ? { ...f, ...financeFormData, solde_final, date_maj: new Date() }
            : f,
        ),
      );
    } else {
      const newFinance: Finance = {
        id_finance: (finances.length + 1).toString(),
        ...financeFormData,
        solde_final,
        date_maj: new Date(),
      };
      setFinances([...finances, newFinance]);
    }

    resetFinanceForm();
  };

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTransaction: TransactionFinanciere = {
      id_transaction: (transactions.length + 1).toString(),
      ...transactionFormData,
    };

    setTransactions([...transactions, newTransaction]);
    resetTransactionForm();
  };

  const resetFinanceForm = () => {
    setFinanceFormData({
      id_praesidium: "",
      mois: "",
      solde_initial: 0,
      contributions: 0,
      depenses: 0,
      description_depenses: "",
    });
    setEditingFinance(null);
    setIsDialogOpen(false);
  };

  const resetTransactionForm = () => {
    setTransactionFormData({
      id_praesidium: "",
      type: "contribution",
      montant: 0,
      description: "",
      categorie: "",
      date_transaction: new Date(),
    });
    setIsTransactionDialogOpen(false);
  };

  const handleEdit = (finance: Finance) => {
    setEditingFinance(finance);
    setFinanceFormData({
      id_praesidium: finance.id_praesidium,
      mois: finance.mois,
      solde_initial: finance.solde_initial,
      contributions: finance.contributions,
      depenses: finance.depenses,
      description_depenses: finance.description_depenses || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (financeId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce rapport financier ?")) {
      setFinances(finances.filter((f) => f.id_finance !== financeId));
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
            Suivi des contributions, dépenses et soldes par praesidium
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog
            open={isTransactionDialogOpen}
            onOpenChange={setIsTransactionDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => resetTransactionForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Nouvelle Transaction</DialogTitle>
                <DialogDescription>
                  Enregistrer une nouvelle contribution ou dépense
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleTransactionSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="praesidium_transaction">Praesidium</Label>
                    <Select
                      value={transactionFormData.id_praesidium}
                      onValueChange={(value) =>
                        setTransactionFormData({
                          ...transactionFormData,
                          id_praesidium: value,
                        })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
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
                    <Label htmlFor="type_transaction">Type</Label>
                    <Select
                      value={transactionFormData.type}
                      onValueChange={(value: "contribution" | "depense") =>
                        setTransactionFormData({
                          ...transactionFormData,
                          type: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contribution">
                          Contribution
                        </SelectItem>
                        <SelectItem value="depense">Dépense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="montant_transaction">Montant (F CFA)</Label>
                    <Input
                      id="montant_transaction"
                      type="number"
                      step="0.01"
                      value={transactionFormData.montant}
                      onChange={(e) =>
                        setTransactionFormData({
                          ...transactionFormData,
                          montant: parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date_transaction">Date</Label>
                    <Input
                      id="date_transaction"
                      type="date"
                      value={
                        transactionFormData.date_transaction
                          .toISOString()
                          .split("T")[0]
                      }
                      onChange={(e) =>
                        setTransactionFormData({
                          ...transactionFormData,
                          date_transaction: new Date(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categorie_transaction">Catégorie</Label>
                  <Input
                    id="categorie_transaction"
                    value={transactionFormData.categorie}
                    onChange={(e) =>
                      setTransactionFormData({
                        ...transactionFormData,
                        categorie: e.target.value,
                      })
                    }
                    placeholder="ex: Cotisation, Matériel religieux..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_transaction">Description</Label>
                  <Textarea
                    id="description_transaction"
                    value={transactionFormData.description}
                    onChange={(e) =>
                      setTransactionFormData({
                        ...transactionFormData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Description détaillée de la transaction"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsTransactionDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">Enregistrer</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetFinanceForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Rapport Mensuel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingFinance
                    ? "Modifier le Rapport"
                    : "Nouveau Rapport Mensuel"}
                </DialogTitle>
                <DialogDescription>
                  {editingFinance
                    ? "Modifiez les informations financières."
                    : "Créez un nouveau rapport financier mensuel."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFinanceSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="praesidium_finance">Praesidium</Label>
                    <Select
                      value={financeFormData.id_praesidium}
                      onValueChange={(value) =>
                        setFinanceFormData({
                          ...financeFormData,
                          id_praesidium: value,
                        })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
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
                    <Label htmlFor="mois_finance">Mois</Label>
                    <Input
                      id="mois_finance"
                      type="month"
                      value={financeFormData.mois}
                      onChange={(e) =>
                        setFinanceFormData({
                          ...financeFormData,
                          mois: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="solde_initial">Solde Initial (F CFA)</Label>
                    <Input
                      id="solde_initial"
                      type="number"
                      step="0.01"
                      value={financeFormData.solde_initial}
                      onChange={(e) =>
                        setFinanceFormData({
                          ...financeFormData,
                          solde_initial: parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contributions">Contributions (F CFA)</Label>
                    <Input
                      id="contributions"
                      type="number"
                      step="0.01"
                      value={financeFormData.contributions}
                      onChange={(e) =>
                        setFinanceFormData({
                          ...financeFormData,
                          contributions: parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="depenses">Dépenses (F CFA)</Label>
                    <Input
                      id="depenses"
                      type="number"
                      step="0.01"
                      value={financeFormData.depenses}
                      onChange={(e) =>
                        setFinanceFormData({
                          ...financeFormData,
                          depenses: parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_depenses">
                    Description des dépenses
                  </Label>
                  <Textarea
                    id="description_depenses"
                    value={financeFormData.description_depenses}
                    onChange={(e) =>
                      setFinanceFormData({
                        ...financeFormData,
                        description_depenses: e.target.value,
                      })
                    }
                    placeholder="Détail des dépenses effectuées"
                    rows={3}
                  />
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    Solde final calculé:
                  </div>
                  <div className="text-lg font-bold">
                    {formatCurrency(
                      financeFormData.solde_initial +
                        financeFormData.contributions -
                        financeFormData.depenses,
                    )}
                  </div>
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
                    {editingFinance ? "Modifier" : "Créer"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contributions</CardTitle>
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
            <CardTitle className="text-sm font-medium">Solde Total</CardTitle>
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
            <div
              className={`text-2xl font-bold ${stats.benefice >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatCurrency(stats.benefice)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne</CardTitle>
            <Calculator className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.avgContributions)}
            </div>
            <p className="text-xs text-muted-foreground">par praesidium</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and List */}
      <Card>
        <CardHeader>
          <CardTitle>Rapports Financiers</CardTitle>
          <CardDescription>
            Suivi détaillé des finances par praesidium et par mois
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
            <Select value={selectedMois} onValueChange={setSelectedMois}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tous les mois" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les mois</SelectItem>
                {getMoisOptions().map((mois) => (
                  <SelectItem key={mois} value={mois}>
                    {new Date(mois + "-01").toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Praesidium</TableHead>
                  <TableHead>Mois</TableHead>
                  <TableHead>Solde Initial</TableHead>
                  <TableHead>Contributions</TableHead>
                  <TableHead>Dépenses</TableHead>
                  <TableHead>Solde Final</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFinances.map((finance) => {
                  const performance =
                    ((finance.contributions - finance.depenses) /
                      finance.contributions) *
                    100;
                  return (
                    <TableRow key={finance.id_finance}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          {getPraesidiumName(finance.id_praesidium)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(finance.mois + "-01").toLocaleDateString(
                            "fr-FR",
                            { year: "numeric", month: "long" },
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(finance.solde_initial)}
                      </TableCell>
                      <TableCell>
                        <span className="text-green-600 font-medium">
                          +{formatCurrency(finance.contributions)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-red-600 font-medium">
                          -{formatCurrency(finance.depenses)}
                        </span>
                      </TableCell>
                      <TableCell className="font-bold">
                        {formatCurrency(finance.solde_final)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress
                            value={Math.max(0, Math.min(100, performance))}
                            className="h-2"
                          />
                          <div className="text-xs text-muted-foreground">
                            {performance.toFixed(1)}% efficacité
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(finance)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(finance.id_finance)}
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

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Transactions Récentes
          </CardTitle>
          <CardDescription>
            Dernières opérations financières enregistrées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions
              .slice(-5)
              .reverse()
              .map((transaction) => (
                <div
                  key={transaction.id_transaction}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === "contribution"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {transaction.type === "contribution" ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="h-3 w-3" />
                        {getPraesidiumName(transaction.id_praesidium)}
                        <span>•</span>
                        <Calendar className="h-3 w-3" />
                        {transaction.date_transaction.toLocaleDateString(
                          "fr-FR",
                        )}
                        {transaction.categorie && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {transaction.categorie}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      transaction.type === "contribution"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "contribution" ? "+" : "-"}
                    {formatCurrency(transaction.montant)}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
