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
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Search,
  RefreshCw,
  Lock,
  UserCheck,
  UserX,
  AlertTriangle,
} from "lucide-react";
import type { Utilisateur, Praesidium } from "@shared/types";
import { useAuth, usePermission } from "@/contexts/AuthContext";

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
];

const mockUtilisateurs: Utilisateur[] = [
  {
    id_utilisateur: "1",
    email: "president@legiondemarie.org",
    nom_prenom: "Jean Dupont",
    type_utilisateur: "officier_conseil",
    statut_compte: "actif",
    poste: "Président du Conseil",
    date_creation: new Date("2024-01-15"),
    derniere_connexion: new Date("2024-01-20"),
  },
  {
    id_utilisateur: "2",
    email: "president.rosaire@legiondemarie.org",
    nom_prenom: "Marie Martin",
    type_utilisateur: "officier_praesidium",
    statut_compte: "actif",
    id_praesidium: "1",
    poste: "Président",
    date_creation: new Date("2024-01-10"),
    derniere_connexion: new Date("2024-01-19"),
  },
  {
    id_utilisateur: "3",
    email: "secretaire.stjean@legiondemarie.org",
    nom_prenom: "Pierre Laurent",
    type_utilisateur: "officier_praesidium",
    statut_compte: "suspendu",
    id_praesidium: "2",
    poste: "Secrétaire",
    date_creation: new Date("2024-01-12"),
    derniere_connexion: new Date("2024-01-18"),
  },
  {
    id_utilisateur: "4",
    email: "nouveau@legiondemarie.org",
    nom_prenom: "Sophie Moreau",
    type_utilisateur: "officier_praesidium",
    statut_compte: "en_attente",
    id_praesidium: "1",
    poste: "Trésorier",
    date_creation: new Date("2024-01-20"),
  },
];

export default function AccountManagement() {
  const { utilisateur } = useAuth();
  const canManageAccounts = usePermission("approve_accounts");
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>(mockUtilisateurs);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<Utilisateur | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    return utilisateurs.filter((user) => {
      const matchesSearch =
        user.nom_prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || user.statut_compte === statusFilter;
      const matchesType = typeFilter === "all" || user.type_utilisateur === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [utilisateurs, searchTerm, statusFilter, typeFilter]);

  const handleResetPassword = (user: Utilisateur) => {
    setSelectedUser(user);
    setIsResetDialogOpen(true);
  };

  const confirmResetPassword = () => {
    if (!selectedUser) return;

    console.log("Réinitialisation du mot de passe pour:", selectedUser.email);
    
    setIsResetDialogOpen(false);
    setSelectedUser(null);
    
    alert(`Mot de passe réinitialisé pour ${selectedUser.nom_prenom}.\nUn email a été envoyé avec les nouvelles instructions.`);
  };

  const handleStatusChange = (userId: string, newStatus: "actif" | "suspendu" | "inactif") => {
    setUtilisateurs(prev =>
      prev.map(user =>
        user.id_utilisateur === userId
          ? { ...user, statut_compte: newStatus }
          : user
      )
    );
  };

  const getPraesidiumName = (praesidiumId?: string) => {
    if (!praesidiumId) return "-";
    const praesidium = mockPraesidia.find(p => p.id_praesidium === praesidiumId);
    return praesidium ? praesidium.nom_praesidium : "Praesidium inconnu";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "actif":
        return <Badge variant="default">Actif</Badge>;
      case "suspendu":
        return <Badge variant="destructive">Suspendu</Badge>;
      case "en_attente":
        return <Badge variant="secondary">En attente</Badge>;
      case "inactif":
        return <Badge variant="outline">Inactif</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "officier_conseil":
        return "Officier du Conseil";
      case "officier_praesidium":
        return "Officier de Praesidium";
      default:
        return type;
    }
  };

  if (!canManageAccounts) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <Users className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Accès restreint</h3>
          <p className="text-muted-foreground">
            Vous n'avez pas les permissions nécessaires pour gérer les comptes utilisateurs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Comptes</h1>
          <p className="text-muted-foreground">
            Administration des comptes utilisateurs et réinitialisation des mots de passe
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comptes</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{utilisateurs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comptes Actifs</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {utilisateurs.filter(u => u.statut_compte === "actif").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {utilisateurs.filter(u => u.statut_compte === "en_attente").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspendus</CardTitle>
            <UserX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {utilisateurs.filter(u => u.statut_compte === "suspendu").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Comptes Utilisateurs</CardTitle>
          <CardDescription>
            Gérez les comptes et réinitialisez les mots de passe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="actif">Actifs</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="suspendu">Suspendus</SelectItem>
                <SelectItem value="inactif">Inactifs</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="officier_conseil">Officiers du Conseil</SelectItem>
                <SelectItem value="officier_praesidium">Officiers de Praesidium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead>Praesidium</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id_utilisateur}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.nom_prenom}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeLabel(user.type_utilisateur)}</TableCell>
                    <TableCell>{user.poste || "-"}</TableCell>
                    <TableCell>{getPraesidiumName(user.id_praesidium)}</TableCell>
                    <TableCell>{getStatusBadge(user.statut_compte)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.derniere_connexion 
                        ? user.derniere_connexion.toLocaleDateString("fr-FR")
                        : "Jamais"
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Select
                          value={user.statut_compte}
                          onValueChange={(value: "actif" | "suspendu" | "inactif") =>
                            handleStatusChange(user.id_utilisateur, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="actif">Actif</SelectItem>
                            <SelectItem value="suspendu">Suspendu</SelectItem>
                            <SelectItem value="inactif">Inactif</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResetPassword(user)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de confirmation pour la réinitialisation */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
            <DialogDescription>
              Confirmez-vous vouloir réinitialiser le mot de passe pour{" "}
              <span className="font-medium">{selectedUser?.nom_prenom}</span> ?
            </DialogDescription>
          </DialogHeader>
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Un nouveau mot de passe temporaire sera généré et envoyé par email à{" "}
              <span className="font-medium">{selectedUser?.email}</span>.
              L'utilisateur devra le changer lors de sa prochaine connexion.
            </AlertDescription>
          </Alert>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={confirmResetPassword}>
              Confirmer la réinitialisation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
