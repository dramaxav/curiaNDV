"use client";

import { useState } from "react";
import { ProtectedRoute } from "@app/protected-route";
import Layout from "@components/Layout";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { usePraesidia, useZones } from "@app/lib/hooks";
import { Trash2, Edit, Plus, Loader } from "lucide-react";
import { toast } from "sonner";

export default function PraesidiaPage() {
  const { praesidia, loading, createPraesidium, updatePraesidium, deletePraesidium } = usePraesidia();
  const { zones } = useZones();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    zone_id: "",
    nom_praesidium: "",
    directeur_spirituel: "",
    type_praesidium: "adulte" as const,
    lieu_reunion: "",
    horaire_reunion: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        await updatePraesidium(editingId, {
          ...formData,
          updated_at: new Date().toISOString(),
        });
        toast.success("Praesidium mis à jour avec succès");
        setIsEditOpen(false);
      } else {
        await createPraesidium({
          ...formData,
          actif: true,
          date_creation: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        toast.success("Praesidium créé avec succès");
        setIsOpen(false);
      }
      setFormData({
        zone_id: "",
        nom_praesidium: "",
        directeur_spirituel: "",
        type_praesidium: "adulte",
        lieu_reunion: "",
        horaire_reunion: "",
      });
      setEditingId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'opération");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (praesidium: any) => {
    setFormData({
      zone_id: praesidium.zone_id,
      nom_praesidium: praesidium.nom_praesidium,
      directeur_spirituel: praesidium.directeur_spirituel,
      type_praesidium: praesidium.type_praesidium,
      lieu_reunion: praesidium.lieu_reunion || "",
      horaire_reunion: praesidium.horaire_reunion || "",
    });
    setEditingId(praesidium.id);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce praesidium ?")) {
      try {
        await deletePraesidium(id);
        toast.success("Praesidium supprimé avec succès");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression");
      }
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">Praesidia</h1>
              <p className="text-gray-600 mt-2">Consulter et gérer les praesidia</p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau Praesidium
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer un nouveau praesidium</DialogTitle>
                  <DialogDescription>Remplissez les informations pour créer un praesidium</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="zone_id">Zone</Label>
                    <Select value={formData.zone_id} onValueChange={(value) => setFormData({ ...formData, zone_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.map((zone) => (
                          <SelectItem key={zone.id} value={zone.id}>
                            {zone.nom_zone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="nom_praesidium">Nom du Praesidium</Label>
                    <Input
                      id="nom_praesidium"
                      value={formData.nom_praesidium}
                      onChange={(e) => setFormData({ ...formData, nom_praesidium: e.target.value })}
                      placeholder="Ex: Praesidium Notre-Dame"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type_praesidium">Type</Label>
                    <Select value={formData.type_praesidium} onValueChange={(value: any) => setFormData({ ...formData, type_praesidium: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adulte">Adulte</SelectItem>
                        <SelectItem value="junior">Junior</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="directeur_spirituel">Directeur Spirituel</Label>
                    <Input
                      id="directeur_spirituel"
                      value={formData.directeur_spirituel}
                      onChange={(e) => setFormData({ ...formData, directeur_spirituel: e.target.value })}
                      placeholder="Nom du directeur"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lieu_reunion">Lieu de Réunion</Label>
                    <Input
                      id="lieu_reunion"
                      value={formData.lieu_reunion}
                      onChange={(e) => setFormData({ ...formData, lieu_reunion: e.target.value })}
                      placeholder="Ex: Église Saint-Jean"
                    />
                  </div>
                  <div>
                    <Label htmlFor="horaire_reunion">Horaire de Réunion</Label>
                    <Input
                      id="horaire_reunion"
                      value={formData.horaire_reunion}
                      onChange={(e) => setFormData({ ...formData, horaire_reunion: e.target.value })}
                      placeholder="Ex: Lundi 19h00"
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Création...
                      </>
                    ) : (
                      "Créer le Praesidium"
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
                <DialogTitle>Modifier le praesidium</DialogTitle>
                <DialogDescription>Mettez à jour les informations</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="edit_zone_id">Zone</Label>
                  <Select value={formData.zone_id} onValueChange={(value) => setFormData({ ...formData, zone_id: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id}>
                          {zone.nom_zone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit_nom_praesidium">Nom du Praesidium</Label>
                  <Input
                    id="edit_nom_praesidium"
                    value={formData.nom_praesidium}
                    onChange={(e) => setFormData({ ...formData, nom_praesidium: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_type_praesidium">Type</Label>
                  <Select value={formData.type_praesidium} onValueChange={(value: any) => setFormData({ ...formData, type_praesidium: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adulte">Adulte</SelectItem>
                      <SelectItem value="junior">Junior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit_directeur_spirituel">Directeur Spirituel</Label>
                  <Input
                    id="edit_directeur_spirituel"
                    value={formData.directeur_spirituel}
                    onChange={(e) => setFormData({ ...formData, directeur_spirituel: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_lieu_reunion">Lieu de Réunion</Label>
                  <Input
                    id="edit_lieu_reunion"
                    value={formData.lieu_reunion}
                    onChange={(e) => setFormData({ ...formData, lieu_reunion: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_horaire_reunion">Horaire de Réunion</Label>
                  <Input
                    id="edit_horaire_reunion"
                    value={formData.horaire_reunion}
                    onChange={(e) => setFormData({ ...formData, horaire_reunion: e.target.value })}
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

          {/* Praesidia List */}
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-8">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          ) : praesidia.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">Aucun praesidium créé.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {praesidia.map((praesidium) => (
                <Card key={praesidium.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle>{praesidium.nom_praesidium}</CardTitle>
                        <CardDescription>{praesidium.type_praesidium === "adulte" ? "Adulte" : "Junior"}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(praesidium)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(praesidium.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Directeur Spirituel</p>
                      <p className="text-sm">{praesidium.directeur_spirituel}</p>
                    </div>
                    {praesidium.lieu_reunion && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Lieu</p>
                        <p className="text-sm">{praesidium.lieu_reunion}</p>
                      </div>
                    )}
                    {praesidium.horaire_reunion && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Horaire</p>
                        <p className="text-sm">{praesidium.horaire_reunion}</p>
                      </div>
                    )}
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
