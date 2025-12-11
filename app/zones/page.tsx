"use client";

import { useState } from "react";
import { ProtectedRoute } from "@app/protected-route";
import Layout from "@components/Layout";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { useZones } from "@app/lib/hooks";
import { Trash2, Edit, Plus, Loader } from "lucide-react";
import { toast } from "sonner";

export default function ZonesPage() {
  const { zones, loading, createZone, updateZone, deleteZone } = useZones();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nom_zone: "",
    paroisse: "",
    directeur_spirituel: "",
    contact_directeur: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        await updateZone(editingId, {
          ...formData,
          updated_at: new Date().toISOString(),
        });
        toast.success("Zone mise à jour avec succès");
        setIsEditOpen(false);
      } else {
        await createZone({
          ...formData,
          actif: true,
          date_creation: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        toast.success("Zone créée avec succès");
        setIsOpen(false);
      }
      setFormData({
        nom_zone: "",
        paroisse: "",
        directeur_spirituel: "",
        contact_directeur: "",
      });
      setEditingId(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de l'opération",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (zone: any) => {
    setFormData({
      nom_zone: zone.nom_zone,
      paroisse: zone.paroisse,
      directeur_spirituel: zone.directeur_spirituel,
      contact_directeur: zone.contact_directeur,
    });
    setEditingId(zone.id);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette zone ?")) {
      try {
        await deleteZone(id);
        toast.success("Zone supprimée avec succès");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Erreur lors de la suppression",
        );
      }
    }
  };

  return (
    <ProtectedRoute requiredPermission="view_all_praesidia">
      <Layout>
        <div className="space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">Gestion des Zones</h1>
              <p className="text-gray-600 mt-2">
                Administrer les zones géographiques et paroisses
              </p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle Zone
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle zone</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations pour créer une zone
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nom_zone">Nom de la Zone</Label>
                    <Input
                      id="nom_zone"
                      value={formData.nom_zone}
                      onChange={(e) =>
                        setFormData({ ...formData, nom_zone: e.target.value })
                      }
                      placeholder="Ex: Zone Centre"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="paroisse">Paroisse</Label>
                    <Input
                      id="paroisse"
                      value={formData.paroisse}
                      onChange={(e) =>
                        setFormData({ ...formData, paroisse: e.target.value })
                      }
                      placeholder="Ex: Paroisse Saint-Jean"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="directeur_spirituel">
                      Directeur Spirituel
                    </Label>
                    <Input
                      id="directeur_spirituel"
                      value={formData.directeur_spirituel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          directeur_spirituel: e.target.value,
                        })
                      }
                      placeholder="Nom du directeur"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_directeur">Contact</Label>
                    <Input
                      id="contact_directeur"
                      value={formData.contact_directeur}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact_directeur: e.target.value,
                        })
                      }
                      placeholder="Email ou téléphone"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Création...
                      </>
                    ) : (
                      "Créer la Zone"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier la zone</DialogTitle>
                <DialogDescription>
                  Mettez à jour les informations de la zone
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="edit_nom_zone">Nom de la Zone</Label>
                  <Input
                    id="edit_nom_zone"
                    value={formData.nom_zone}
                    onChange={(e) =>
                      setFormData({ ...formData, nom_zone: e.target.value })
                    }
                    placeholder="Ex: Zone Centre"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_paroisse">Paroisse</Label>
                  <Input
                    id="edit_paroisse"
                    value={formData.paroisse}
                    onChange={(e) =>
                      setFormData({ ...formData, paroisse: e.target.value })
                    }
                    placeholder="Ex: Paroisse Saint-Jean"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_directeur_spirituel">
                    Directeur Spirituel
                  </Label>
                  <Input
                    id="edit_directeur_spirituel"
                    value={formData.directeur_spirituel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        directeur_spirituel: e.target.value,
                      })
                    }
                    placeholder="Nom du directeur"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_contact_directeur">Contact</Label>
                  <Input
                    id="edit_contact_directeur"
                    value={formData.contact_directeur}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact_directeur: e.target.value,
                      })
                    }
                    placeholder="Email ou téléphone"
                    required
                  />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Mise à jour...
                    </>
                  ) : (
                    "Mettre à Jour"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Zones List */}
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-8">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          ) : zones.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">
                  Aucune zone créée. Cliquez sur "Nouvelle Zone" pour commencer.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {zones.map((zone) => (
                <Card key={zone.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{zone.nom_zone}</CardTitle>
                        <CardDescription>{zone.paroisse}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(zone)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(zone.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Directeur Spirituel
                        </p>
                        <p className="text-sm">{zone.directeur_spirituel}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Contact
                        </p>
                        <p className="text-sm">{zone.contact_directeur}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Date de création
                        </p>
                        <p className="text-sm">
                          {new Date(zone.date_creation).toLocaleDateString(
                            "fr-FR",
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Statut
                        </p>
                        <p className="text-sm">
                          {zone.actif ? (
                            <span className="text-green-600">Actif</span>
                          ) : (
                            <span className="text-red-600">Inactif</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
