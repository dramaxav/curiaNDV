"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { supabase, isSupabaseConfigured } from "@app/lib/supabase";
import {
  Trash2,
  Edit,
  Plus,
  Loader,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function MeetingsPage() {
  const [manifestations, setManifestations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    date_manifestation: "",
    heure_debut: "",
    heure_fin: "",
    lieu: "",
    type_manifestation: "reunion" as const,
    pour_tous_praesidia: true,
    organisateur_contact: "",
    statut: "planifiee" as const,
    participants_attendus: "0",
  });

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    fetchManifestations();
    const subscription = supabase
      .channel("manifestations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "manifestations" },
        () => {
          fetchManifestations();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchManifestations() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("manifestations")
        .select("*")
        .order("date_manifestation", { ascending: true });
      if (error) throw error;
      setManifestations(data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors du chargement";
      toast.error(errorMessage);
      setManifestations([]);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToInsert = {
        ...formData,
        participants_attendus: parseInt(formData.participants_attendus),
        date_manifestation: new Date(
          `${formData.date_manifestation}T${formData.heure_debut}`,
        ).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { error } = await supabase
          .from("manifestations")
          .update({ ...dataToInsert, updated_at: new Date().toISOString() })
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Manifestation mise à jour");
        setIsEditOpen(false);
      } else {
        const { error } = await supabase
          .from("manifestations")
          .insert([dataToInsert]);
        if (error) throw error;
        toast.success("Manifestation créée");
        setIsOpen(false);
      }

      setFormData({
        titre: "",
        description: "",
        date_manifestation: "",
        heure_debut: "",
        heure_fin: "",
        lieu: "",
        type_manifestation: "reunion",
        pour_tous_praesidia: true,
        organisateur_contact: "",
        statut: "planifiee",
        participants_attendus: "0",
      });
      setEditingId(null);
      fetchManifestations();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (manifestation: any) => {
    const dateObj = new Date(manifestation.date_manifestation);
    const dateStr = dateObj.toISOString().split("T")[0];
    const timeStr = dateObj.toTimeString().slice(0, 5);

    setFormData({
      titre: manifestation.titre,
      description: manifestation.description || "",
      date_manifestation: dateStr,
      heure_debut: timeStr,
      heure_fin: manifestation.heure_fin,
      lieu: manifestation.lieu,
      type_manifestation: manifestation.type_manifestation,
      pour_tous_praesidia: manifestation.pour_tous_praesidia,
      organisateur_contact: manifestation.organisateur_contact || "",
      statut: manifestation.statut,
      participants_attendus: manifestation.participants_attendus.toString(),
    });
    setEditingId(manifestation.id);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr ?")) {
      try {
        const { error } = await supabase
          .from("manifestations")
          .delete()
          .eq("id", id);
        if (error) throw error;
        toast.success("Supprimé");
        fetchManifestations();
      } catch (error) {
        toast.error("Erreur");
      }
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
          {!isSupabaseConfigured && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-yellow-900">
                      Configuration manquante
                    </p>
                    <p className="text-sm text-yellow-800">
                      Les identifiants Supabase ne sont pas configurés. Veuillez
                      connecter Supabase via le panneau MCP ou ajouter les
                      variables d'environnement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">Réunions et Manifestations</h1>
              <p className="text-gray-600 mt-2">
                Gestion des réunions et manifestations
              </p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle Manifestation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle manifestation</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="titre">Titre</Label>
                    <Input
                      id="titre"
                      value={formData.titre}
                      onChange={(e) =>
                        setFormData({ ...formData, titre: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type_manifestation">Type</Label>
                    <Select
                      value={formData.type_manifestation}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, type_manifestation: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reunion">Réunion</SelectItem>
                        <SelectItem value="activite_spirituelle">
                          Activité Spirituelle
                        </SelectItem>
                        <SelectItem value="formation">Formation</SelectItem>
                        <SelectItem value="service_social">
                          Service Social
                        </SelectItem>
                        <SelectItem value="pelerinage">Pèlerinage</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="date_manifestation">Date</Label>
                    <Input
                      id="date_manifestation"
                      type="date"
                      value={formData.date_manifestation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          date_manifestation: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="heure_debut">Début</Label>
                      <Input
                        id="heure_debut"
                        type="time"
                        value={formData.heure_debut}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            heure_debut: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="heure_fin">Fin</Label>
                      <Input
                        id="heure_fin"
                        type="time"
                        value={formData.heure_fin}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            heure_fin: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="lieu">Lieu</Label>
                    <Input
                      id="lieu"
                      value={formData.lieu}
                      onChange={(e) =>
                        setFormData({ ...formData, lieu: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="participants_attendus">
                      Participants Attendus
                    </Label>
                    <Input
                      id="participants_attendus"
                      type="number"
                      value={formData.participants_attendus}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          participants_attendus: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="organisateur_contact">
                      Contact Organisateur
                    </Label>
                    <Input
                      id="organisateur_contact"
                      value={formData.organisateur_contact}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organisateur_contact: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    Créer
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-8">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          ) : manifestations.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">
                  Aucune manifestation.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {manifestations.map((manifestation) => (
                <Card key={manifestation.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          {manifestation.titre}
                        </CardTitle>
                        <CardDescription>
                          {manifestation.type_manifestation}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(manifestation)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(manifestation.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {manifestation.description && (
                      <p className="text-sm">{manifestation.description}</p>
                    )}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p>
                          {new Date(
                            manifestation.date_manifestation,
                          ).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Horaire</p>
                        <p>
                          {manifestation.heure_debut} -{" "}
                          {manifestation.heure_fin}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Lieu</p>
                        <p>{manifestation.lieu}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Participants</p>
                        <p>{manifestation.participants_attendus}</p>
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
