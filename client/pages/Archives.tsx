import { useState } from "react";
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
  Archive,
  Calendar,
  FileText,
  Upload,
  Download,
  Search,
  Eye,
  Trash2,
  Plus,
  FolderOpen,
  Clock,
  User,
  File,
} from "lucide-react";

interface Document {
  id_document: string;
  titre: string;
  type:
    | "agenda_mensuel"
    | "proces_verbal"
    | "planning_annuel"
    | "rapport_activite"
    | "autres";
  description?: string;
  fichier_url: string;
  taille_fichier: string;
  mois_annee: string; // Format: YYYY-MM
  date_upload: Date;
  uploaded_by: string;
  statut: "actif" | "archive";
}

const mockDocuments: Document[] = [
  {
    id_document: "1",
    titre: "Agenda Janvier 2024",
    type: "agenda_mensuel",
    description: "Agenda mensuel des activités de janvier 2024",
    fichier_url: "/documents/agenda-janvier-2024.pdf",
    taille_fichier: "1.2 MB",
    mois_annee: "2024-01",
    date_upload: new Date("2024-01-05"),
    uploaded_by: "Marie-Claire Atangana",
    statut: "actif",
  },
  {
    id_document: "2",
    titre: "Procès-verbal Décembre 2023",
    type: "proces_verbal",
    description: "Procès-verbal de la réunion mensuelle de décembre 2023",
    fichier_url: "/documents/pv-decembre-2023.pdf",
    taille_fichier: "856 KB",
    mois_annee: "2023-12",
    date_upload: new Date("2024-01-03"),
    uploaded_by: "Françoise Eyenga",
    statut: "actif",
  },
  {
    id_document: "3",
    titre: "Planning Annuel 2024",
    type: "planning_annuel",
    description: "Planning des activités pour l'année 2024",
    fichier_url: "/documents/planning-2024.pdf",
    taille_fichier: "2.1 MB",
    mois_annee: "2024-01",
    date_upload: new Date("2024-01-15"),
    uploaded_by: "Jean-Baptiste Mballa",
    statut: "actif",
  },
  {
    id_document: "4",
    titre: "Rapport d'activité Q4 2023",
    type: "rapport_activite",
    description: "Rapport trimestriel des activités du 4ème trimestre 2023",
    fichier_url: "/documents/rapport-q4-2023.pdf",
    taille_fichier: "3.4 MB",
    mois_annee: "2023-12",
    date_upload: new Date("2024-01-10"),
    uploaded_by: "Marie-Claire Atangana",
    statut: "actif",
  },
  {
    id_document: "5",
    titre: "Règlement Intérieur 2024",
    type: "autres",
    description: "Règlement intérieur mis à jour pour 2024",
    fichier_url: "/documents/reglement-2024.pdf",
    taille_fichier: "987 KB",
    mois_annee: "2024-01",
    date_upload: new Date("2024-01-20"),
    uploaded_by: "Monseigneur Paul Nkomo",
    statut: "actif",
  },
];

export default function Archives() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const [uploadForm, setUploadForm] = useState({
    titre: "",
    type: "agenda_mensuel" as Document["type"],
    description: "",
    mois_annee: new Date().toISOString().slice(0, 7),
    fichier: null as File | null,
  });

  const documentTypes = [
    {
      value: "agenda_mensuel",
      label: "Agenda Mensuel",
      icon: Calendar,
      color: "text-blue-500",
    },
    {
      value: "proces_verbal",
      label: "Procès-verbal Mensuel",
      icon: FileText,
      color: "text-green-500",
    },
    {
      value: "planning_annuel",
      label: "Planning Annuel",
      icon: Clock,
      color: "text-purple-500",
    },
    {
      value: "rapport_activite",
      label: "Rapport d'Activité",
      icon: File,
      color: "text-orange-500",
    },
    {
      value: "autres",
      label: "Autres Documents",
      icon: FolderOpen,
      color: "text-gray-500",
    },
  ];

  const filteredDocuments = documents.filter((doc) => {
    const matchesType = selectedType === "all" || doc.type === selectedType;
    const matchesYear =
      selectedYear === "all" || doc.mois_annee.startsWith(selectedYear);
    const matchesSearch =
      doc.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description &&
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesType && matchesYear && matchesSearch;
  });

  const getTypeInfo = (type: string) => {
    return documentTypes.find((t) => t.value === type) || documentTypes[4];
  };

  const getYearOptions = () => {
    const years = Array.from(
      new Set(documents.map((doc) => doc.mois_annee.substring(0, 4))),
    );
    return years.sort().reverse();
  };

  const stats = {
    total: documents.length,
    ce_mois: documents.filter((doc) => {
      const currentMonth = new Date().toISOString().slice(0, 7);
      return doc.mois_annee === currentMonth;
    }).length,
    par_type: documentTypes.map((type) => ({
      ...type,
      count: documents.filter((doc) => doc.type === type.value).length,
    })),
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm({ ...uploadForm, fichier: file });
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadForm.fichier) {
      alert("Veuillez sélectionner un fichier");
      return;
    }

    const newDocument: Document = {
      id_document: (documents.length + 1).toString(),
      titre: uploadForm.titre,
      type: uploadForm.type,
      description: uploadForm.description,
      fichier_url: `/documents/${uploadForm.fichier.name}`,
      taille_fichier: `${(uploadForm.fichier.size / 1024 / 1024).toFixed(1)} MB`,
      mois_annee: uploadForm.mois_annee,
      date_upload: new Date(),
      uploaded_by: "Utilisateur Actuel", // À remplacer par l'utilisateur connecté
      statut: "actif",
    };

    setDocuments([newDocument, ...documents]);

    // Reset form
    setUploadForm({
      titre: "",
      type: "agenda_mensuel",
      description: "",
      mois_annee: new Date().toISOString().slice(0, 7),
      fichier: null,
    });
    setIsUploadDialogOpen(false);

    alert("Document uploadé avec succès !");
  };

  const handleDownload = (document: Document) => {
    // Simuler le téléchargement
    alert(`Téléchargement de: ${document.titre}`);
  };

  const handleDelete = (documentId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      setDocuments(documents.filter((doc) => doc.id_document !== documentId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Archives</h1>
          <p className="text-muted-foreground">
            Gestion des documents et archives de la Légion de Marie
          </p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Uploader un Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Uploader un Nouveau Document</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau document aux archives
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titre">Titre du document</Label>
                <Input
                  id="titre"
                  value={uploadForm.titre}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, titre: e.target.value })
                  }
                  placeholder="ex: Agenda Février 2024"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type de document</Label>
                  <Select
                    value={uploadForm.type}
                    onValueChange={(value: any) =>
                      setUploadForm({ ...uploadForm, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mois_annee">Mois/Année</Label>
                  <Input
                    id="mois_annee"
                    type="month"
                    value={uploadForm.mois_annee}
                    onChange={(e) =>
                      setUploadForm({
                        ...uploadForm,
                        mois_annee: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optionnel)</Label>
                <Textarea
                  id="description"
                  value={uploadForm.description}
                  onChange={(e) =>
                    setUploadForm({
                      ...uploadForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Description du contenu du document"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fichier">Fichier</Label>
                <Input
                  id="fichier"
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileUpload}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Formats acceptés: PDF, Word, Excel (max 10MB)
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUploadDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  <Upload className="mr-2 h-4 w-4" />
                  Uploader
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
            <CardTitle className="text-sm font-medium">
              Total Documents
            </CardTitle>
            <Archive className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ce Mois</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ce_mois}</div>
          </CardContent>
        </Card>
        {stats.par_type.slice(0, 4).map((type) => {
          const Icon = type.icon;
          return (
            <Card key={type.value}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium">
                  {type.label}
                </CardTitle>
                <Icon className={`h-4 w-4 ${type.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{type.count}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Type Categories */}
      <div className="grid gap-4 md:grid-cols-5">
        {documentTypes.map((type) => {
          const Icon = type.icon;
          const typeDocuments = documents.filter(
            (doc) => doc.type === type.value,
          );
          return (
            <Card
              key={type.value}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardHeader className="text-center">
                <Icon className={`h-8 w-8 mx-auto ${type.color}`} />
                <CardTitle className="text-lg">{type.label}</CardTitle>
                <CardDescription>
                  {typeDocuments.length} document(s)
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Document List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Documents</CardTitle>
          <CardDescription>
            Consultez et gérez tous les documents archivés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Type de document" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {documentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {getYearOptions().map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Taille</TableHead>
                  <TableHead>Uploadé par</TableHead>
                  <TableHead>Date Upload</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((document) => {
                  const typeInfo = getTypeInfo(document.type);
                  const Icon = typeInfo.icon;
                  return (
                    <TableRow key={document.id_document}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${typeInfo.color}`} />
                          <div>
                            <div className="font-medium">{document.titre}</div>
                            {document.description && (
                              <div className="text-sm text-muted-foreground truncate max-w-64">
                                {document.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{typeInfo.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(
                            document.mois_annee + "-01",
                          ).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                          })}
                        </div>
                      </TableCell>
                      <TableCell>{document.taille_fichier}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {document.uploaded_by}
                        </div>
                      </TableCell>
                      <TableCell>
                        {document.date_upload.toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownload(document)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              window.open(document.fichier_url, "_blank")
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(document.id_document)}
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
