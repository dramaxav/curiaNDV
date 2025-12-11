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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { useMembers, usePraesidia } from "@app/lib/hooks";
import { Trash2, Edit, Plus, Loader } from "lucide-react";
import { toast } from "sonner";

export default function MembersPage() {
  const { members, loading, createMember, updateMember, deleteMember } =
    useMembers();
  const { praesidia } = usePraesidia();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    praesidium_id: "",
    nom_prenom: "",
    statut: "actif" as const,
    date_adhesion: "",
    telephone: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        await updateMember(editingId, {
          ...formData,
          date_adhesion: new Date(formData.date_adhesion).toISOString(),
          updated_at: new Date().toISOString(),
        });
        toast.success("Membre mis à jour");
        setIsEditOpen(false);
      } else {
        await createMember({
          ...formData,
          date_adhesion: new Date(formData.date_adhesion).toISOString(),
          actif: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        toast.success("Membre créé avec succès");
        setIsOpen(false);
      }
      setFormData({
        praesidium_id: "",
        nom_prenom: "",
        statut: "actif",
        date_adhesion: "",
        telephone: "",
        email: "",
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

  const handleEdit = (member: any) => {
    setFormData({
      praesidium_id: member.praesidium_id,
      nom_prenom: member.nom_prenom,
      statut: member.statut,
      date_adhesion: member.date_adhesion.split("T")[0],
      telephone: member.telephone || "",
      email: member.email || "",
    });
    setEditingId(member.id);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr ?")) {
      try {
        await deleteMember(id);
        toast.success("Membre supprimé");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erreur");
      }
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">Registre des Membres</h1>
              <p className="text-gray-600 mt-2">
                Gestion des adhésions et statuts
              </p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau Membre
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau membre</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="praesidium_id">Praesidium</Label>
                    <Select
                      value={formData.praesidium_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, praesidium_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un praesidium" />
                      </SelectTrigger>
                      <SelectContent>
                        {praesidia.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.nom_praesidium}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="nom_prenom">Nom Complet</Label>
                    <Input
                      id="nom_prenom"
                      value={formData.nom_prenom}
                      onChange={(e) =>
                        setFormData({ ...formData, nom_prenom: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="statut">Statut</Label>
                    <Select
                      value={formData.statut}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, statut: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actif">Actif</SelectItem>
                        <SelectItem value="probationnaire">
                          Probationnaire
                        </SelectItem>
                        <SelectItem value="auxiliaire">Auxiliaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date_adhesion">Date d'Adhésion</Label>
                    <Input
                      id="date_adhesion"
                      type="date"
                      value={formData.date_adhesion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          date_adhesion: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input
                      id="telephone"
                      value={formData.telephone}
                      onChange={(e) =>
                        setFormData({ ...formData, telephone: e.target.value })
                      }
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Créer le Membre
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier le membre</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="edit_nom_prenom">Nom Complet</Label>
                  <Input
                    id="edit_nom_prenom"
                    value={formData.nom_prenom}
                    onChange={(e) =>
                      setFormData({ ...formData, nom_prenom: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_statut">Statut</Label>
                  <Select
                    value={formData.statut}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, statut: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="probationnaire">
                        Probationnaire
                      </SelectItem>
                      <SelectItem value="auxiliaire">Auxiliaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit_email">Email</Label>
                  <Input
                    id="edit_email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit_telephone">Téléphone</Label>
                  <Input
                    id="edit_telephone"
                    value={formData.telephone}
                    onChange={(e) =>
                      setFormData({ ...formData, telephone: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  Mettre à Jour
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Members List */}
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-8">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          ) : members.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">
                  Aucun membre.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {members.map((member) => (
                <Card key={member.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle>{member.nom_prenom}</CardTitle>
                        <CardDescription>{member.statut}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    {member.email && (
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="text-sm">{member.email}</p>
                      </div>
                    )}
                    {member.telephone && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Téléphone
                        </p>
                        <p className="text-sm">{member.telephone}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Adhésion</p>
                      <p className="text-sm">
                        {new Date(member.date_adhesion).toLocaleDateString(
                          "fr-FR",
                        )}
                      </p>
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
