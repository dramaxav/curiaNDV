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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  UserPlus,
  CheckCircle,
  XCircle,
  Search,
  Clock,
  Users,
  DollarSign,
  Calendar,
  AlertTriangle,
  Shield,
  Mail,
  FileText,
  Building,
} from "lucide-react";
import { useAuth, usePermission } from "@/contexts/AuthContext";
import type {
  DemandeCompte,
  ApprobationPresence,
  ApprobationFinance,
  Praesidium,
} from "@shared/types";

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

const mockDemandesCompte: DemandeCompte[] = [
  {
    id_demande: "1",
    email: "marie.nkomo@email.com",
    nom_prenom: "Marie Nkomo",
    type_demande: "officier_praesidium",
    id_praesidium: "1",
    poste_souhaite: "Secrétaire",
    justification:
      "Je suis membre active de Notre-Dame du Rosaire depuis 3 ans et souhaite servir davantage la communauté en tant que secrétaire.",
    statut: "en_attente",
    date_demande: new Date("2024-02-10"),
  },
  {
    id_demande: "2",
    email: "pierre.mvondo@email.com",
    nom_prenom: "Pierre Mvondo",
    type_demande: "officier_conseil",
    poste_souhaite: "Responsable Formation",
    justification:
      "Fort de 10 ans d'expérience dans la Légion de Marie et d'une formation en théologie, je souhaite contribuer à la formation des membres.",
    statut: "en_attente",
    date_demande: new Date("2024-02-08"),
  },
];

const mockApprobationsPresence: ApprobationPresence[] = [
  {
    id_approbation: "1",
    id_praesidium: "1",
    mois_annee: "2024-02",
    soumis_par: "president.rosaire@legiondemarie.org",
    date_soumission: new Date("2024-02-28"),
    statut: "en_attente",
    presences_ids: ["1", "2", "3", "4"],
  },
  {
    id_approbation: "2",
    id_praesidium: "2",
    mois_annee: "2024-02",
    soumis_par: "secretaire.stjean@legiondemarie.org",
    date_soumission: new Date("2024-02-27"),
    statut: "en_attente",
    presences_ids: ["5", "6", "7"],
  },
];

const mockApprobationsFinance: ApprobationFinance[] = [
  {
    id_approbation: "1",
    id_praesidium: "1",
    id_transaction: "TXN001",
    soumis_par: "tresorier.rosaire@legiondemarie.org",
    date_soumission: new Date("2024-02-25"),
    statut: "en_attente",
  },
];

export default function Approvals() {
  const { utilisateur } = useAuth();
  const canApproveAccounts = usePermission("approve_accounts");
  const canApprovePresences = usePermission("approve_presences");
  const canApproveFinances = usePermission("approve_finances");

  const [demandesCompte, setDemandesCompte] =
    useState<DemandeCompte[]>(mockDemandesCompte);
  const [approbationsPresence, setApprobationsPresence] = useState<
    ApprobationPresence[]
  >(mockApprobationsPresence);
  const [approbationsFinance, setApprobationsFinance] = useState<
    ApprobationFinance[]
  >(mockApprobationsFinance);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("comptes");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<{
    type: "compte" | "presence" | "finance";
    id: string;
    action: "approve" | "reject";
  } | null>(null);
  const [commentaire, setCommentaire] = useState("");

  const getPraesidiumName = (praesidiumId: string) => {
    const praesidium = mockPraesidia.find(
      (p) => p.id_praesidium === praesidiumId,
    );
    return praesidium ? praesidium.nom_praesidium : "Praesidium inconnu";
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        );
      case "approuvee":
        return (
          <Badge variant="default">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approuvée
          </Badge>
        );
      case "refusee":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Refusée
          </Badge>
        );
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const stats = {
    comptes_en_attente: demandesCompte.filter((d) => d.statut === "en_attente")
      .length,
    presences_en_attente: approbationsPresence.filter(
      (a) => a.statut === "en_attente",
    ).length,
    finances_en_attente: approbationsFinance.filter(
      (a) => a.statut === "en_attente",
    ).length,
    total_en_attente:
      demandesCompte.filter((d) => d.statut === "en_attente").length +
      approbationsPresence.filter((a) => a.statut === "en_attente").length +
      approbationsFinance.filter((a) => a.statut === "en_attente").length,
  };

  const handleApproval = (
    type: "compte" | "presence" | "finance",
    id: string,
    action: "approve" | "reject",
  ) => {
    setCurrentAction({ type, id, action });
    setCommentaire("");
    setIsDialogOpen(true);
  };

  const confirmApproval = () => {
    if (!currentAction) return;

    const { type, id, action } = currentAction;
    const now = new Date();
    const newStatut = action === "approve" ? "approuvee" : "refusee";

    if (type === "compte") {
      setDemandesCompte((prev) =>
        prev.map((demande) =>
          demande.id_demande === id
            ? {
                ...demande,
                statut: newStatut as any,
                traite_par: utilisateur?.id_utilisateur,
                date_traitement: now,
                commentaire_traitement: commentaire,
              }
            : demande,
        ),
      );
    } else if (type === "presence") {
      setApprobationsPresence((prev) =>
        prev.map((approbation) =>
          approbation.id_approbation === id
            ? {
                ...approbation,
                statut: newStatut as any,
                approuve_par: utilisateur?.id_utilisateur,
                date_approbation: now,
                commentaire: commentaire,
              }
            : approbation,
        ),
      );
    } else if (type === "finance") {
      setApprobationsFinance((prev) =>
        prev.map((approbation) =>
          approbation.id_approbation === id
            ? {
                ...approbation,
                statut: newStatut as any,
                approuve_par: utilisateur?.id_utilisateur,
                date_approbation: now,
                commentaire: commentaire,
              }
            : approbation,
        ),
      );
    }

    setIsDialogOpen(false);
    setCurrentAction(null);
    setCommentaire("");
  };

  const filteredDemandesCompte = useMemo(() => {
    return demandesCompte.filter(
      (demande) =>
        demande.nom_prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.poste_souhaite.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [demandesCompte, searchTerm]);

  if (!canApproveAccounts && !canApprovePresences && !canApproveFinances) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-destructive">
              Accès non autorisé
            </CardTitle>
            <CardDescription>
              Vous n'avez pas les permissions nécessaires pour accéder aux
              approbations
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Système d'Approbations
          </h1>
          <p className="text-muted-foreground">
            Gestion des demandes d'approbation pour les officiers du conseil
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total en Attente
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_en_attente}</div>
          </CardContent>
        </Card>
        {canApproveAccounts && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comptes</CardTitle>
              <UserPlus className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.comptes_en_attente}
              </div>
            </CardContent>
          </Card>
        )}
        {canApprovePresences && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Présences</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.presences_en_attente}
              </div>
            </CardContent>
          </Card>
        )}
        {canApproveFinances && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Finances</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.finances_en_attente}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          {canApproveAccounts && (
            <TabsTrigger value="comptes">
              <UserPlus className="h-4 w-4 mr-2" />
              Demandes de Compte
            </TabsTrigger>
          )}
          {canApprovePresences && (
            <TabsTrigger value="presences">
              <Users className="h-4 w-4 mr-2" />
              Présences
            </TabsTrigger>
          )}
          {canApproveFinances && (
            <TabsTrigger value="finances">
              <DollarSign className="h-4 w-4 mr-2" />
              Finances
            </TabsTrigger>
          )}
        </TabsList>

        {/* Search */}
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Demandes de Compte */}
        {canApproveAccounts && (
          <TabsContent value="comptes">
            <Card>
              <CardHeader>
                <CardTitle>Demandes de Compte en Attente</CardTitle>
                <CardDescription>
                  Approuvez ou refusez les demandes de création de compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Demandeur</TableHead>
                        <TableHead>Type & Poste</TableHead>
                        <TableHead>Praesidium</TableHead>
                        <TableHead>Date Demande</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDemandesCompte.map((demande) => (
                        <TableRow key={demande.id_demande}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {demande.nom_prenom}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {demande.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {demande.poste_souhaite}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {demande.type_demande === "officier_conseil"
                                  ? "Officier du Conseil"
                                  : "Officier de Praesidium"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {demande.id_praesidium ? (
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                {getPraesidiumName(demande.id_praesidium)}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {demande.date_demande.toLocaleDateString("fr-FR")}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatutBadge(demande.statut)}
                          </TableCell>
                          <TableCell className="text-right">
                            {demande.statut === "en_attente" && (
                              <div className="flex items-center justify-end gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <FileText className="h-4 w-4 mr-1" />
                                      Voir
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Détails de la Demande
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Justification</Label>
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {demande.justification}
                                        </p>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleApproval(
                                      "compte",
                                      demande.id_demande,
                                      "approve",
                                    )
                                  }
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approuver
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleApproval(
                                      "compte",
                                      demande.id_demande,
                                      "reject",
                                    )
                                  }
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Refuser
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Approbations Présences */}
        {canApprovePresences && (
          <TabsContent value="presences">
            <Card>
              <CardHeader>
                <CardTitle>Approbations de Présences</CardTitle>
                <CardDescription>
                  Validez les listes de présence soumises par les praesidia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Praesidium</TableHead>
                        <TableHead>Période</TableHead>
                        <TableHead>Soumis par</TableHead>
                        <TableHead>Date Soumission</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approbationsPresence.map((approbation) => (
                        <TableRow key={approbation.id_approbation}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              {getPraesidiumName(approbation.id_praesidium)}
                            </div>
                          </TableCell>
                          <TableCell>{approbation.mois_annee}</TableCell>
                          <TableCell>{approbation.soumis_par}</TableCell>
                          <TableCell>
                            {approbation.date_soumission.toLocaleDateString(
                              "fr-FR",
                            )}
                          </TableCell>
                          <TableCell>
                            {getStatutBadge(approbation.statut)}
                          </TableCell>
                          <TableCell className="text-right">
                            {approbation.statut === "en_attente" && (
                              <div className="flex items-center justify-end gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <FileText className="h-4 w-4 mr-1" />
                                      Voir
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Détails des Présences
                                      </DialogTitle>
                                      <DialogDescription>
                                        {getPraesidiumName(approbation.id_praesidium)} - {approbation.mois_annee}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Présences soumises</Label>
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {approbation.presences_ids.length} présences enregistrées
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          Soumis par: {approbation.soumis_par}
                                        </p>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleApproval(
                                      "presence",
                                      approbation.id_approbation,
                                      "approve",
                                    )
                                  }
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approuver
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleApproval(
                                      "presence",
                                      approbation.id_approbation,
                                      "reject",
                                    )
                                  }
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Refuser
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Approbations Finances */}
        {canApproveFinances && (
          <TabsContent value="finances">
            <Card>
              <CardHeader>
                <CardTitle>Approbations Financières</CardTitle>
                <CardDescription>
                  Validez les transactions financières des praesidia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Praesidium</TableHead>
                        <TableHead>Transaction</TableHead>
                        <TableHead>Soumis par</TableHead>
                        <TableHead>Date Soumission</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approbationsFinance.map((approbation) => (
                        <TableRow key={approbation.id_approbation}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              {getPraesidiumName(approbation.id_praesidium)}
                            </div>
                          </TableCell>
                          <TableCell>{approbation.id_transaction}</TableCell>
                          <TableCell>{approbation.soumis_par}</TableCell>
                          <TableCell>
                            {approbation.date_soumission.toLocaleDateString(
                              "fr-FR",
                            )}
                          </TableCell>
                          <TableCell>
                            {getStatutBadge(approbation.statut)}
                          </TableCell>
                          <TableCell className="text-right">
                            {approbation.statut === "en_attente" && (
                              <div className="flex items-center justify-end gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <FileText className="h-4 w-4 mr-1" />
                                      Voir
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Détails de la Transaction
                                      </DialogTitle>
                                      <DialogDescription>
                                        {getPraesidiumName(approbation.id_praesidium)} - {approbation.id_transaction}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Transaction financière</Label>
                                        <p className="text-sm text-muted-foreground mt-1">
                                          ID: {approbation.id_transaction}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          Soumis par: {approbation.soumis_par}
                                        </p>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleApproval(
                                      "finance",
                                      approbation.id_approbation,
                                      "approve",
                                    )
                                  }
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approuver
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleApproval(
                                      "finance",
                                      approbation.id_approbation,
                                      "reject",
                                    )
                                  }
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Refuser
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Dialog d'approbation */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentAction?.action === "approve" ? "Approuver" : "Refuser"} la
              demande
            </DialogTitle>
            <DialogDescription>
              {currentAction?.action === "approve"
                ? "Confirmez l'approbation de cette demande."
                : "Indiquez la raison du refus."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="commentaire">
                {currentAction?.action === "approve"
                  ? "Commentaire (optionnel)"
                  : "Raison du refus *"}
              </Label>
              <Textarea
                id="commentaire"
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                placeholder={
                  currentAction?.action === "approve"
                    ? "Commentaire sur l'approbation..."
                    : "Expliquez pourquoi cette demande est refusée..."
                }
                required={currentAction?.action === "reject"}
              />
            </div>
            {currentAction?.action === "reject" && !commentaire && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Un commentaire expliquant le refus est obligatoire.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={confirmApproval}
              variant={
                currentAction?.action === "approve" ? "default" : "destructive"
              }
              disabled={currentAction?.action === "reject" && !commentaire}
            >
              {currentAction?.action === "approve" ? "Approuver" : "Refuser"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
