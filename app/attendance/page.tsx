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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { supabase, isSupabaseConfigured } from "@app/lib/supabase";
import { Trash2, Edit, Plus, Loader, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AttendancePage() {
  const [presences, setPresences] = useState<any[]>([]);
  const [officers, setOfficers] = useState<any[]>([]);
  const [praesidia, setPraesidia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    officier_id: "",
    praesidium_id: "",
    date_reunion: "",
    statut_presence: "Présent" as const,
    notes: "",
  });

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    fetchAllData();
    const subscription = supabase
      .channel("presences")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "presences" },
        () => {
          fetchPresences();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchAllData() {
    try {
      setLoading(true);
      const [presencesData, officersData, praesidiaData] = await Promise.all([
        supabase
          .from("presences")
          .select("*")
          .order("date_reunion", { ascending: false }),
        supabase.from("officiers").select("*"),
        supabase.from("praesidia").select("*"),
      ]);

      if (presencesData.error) throw presencesData.error;
      if (officersData.error) throw officersData.error;
      if (praesidiaData.error) throw praesidiaData.error;

      setPresences(presencesData.data || []);
      setOfficers(officersData.data || []);
      setPraesidia(praesidiaData.data || []);
    } catch (err) {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }

  async function fetchPresences() {
    try {
      const { data, error } = await supabase
        .from("presences")
        .select("*")
        .order("date_reunion", { ascending: false });
      if (error) throw error;
      setPresences(data || []);
    } catch (err) {
      toast.error("Erreur");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from("presences")
          .update({
            ...formData,
            date_reunion: new Date(formData.date_reunion).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Présence mise à jour");
        setIsEditOpen(false);
      } else {
        const { error } = await supabase.from("presences").insert([
          {
            ...formData,
            date_reunion: new Date(formData.date_reunion).toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

        if (error) throw error;
        toast.success("Présence enregistrée");
        setIsOpen(false);
      }

      setFormData({
        officier_id: "",
        praesidium_id: "",
        date_reunion: "",
        statut_presence: "Présent",
        notes: "",
      });
      setEditingId(null);
      fetchPresences();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (presence: any) => {
    setFormData({
      officier_id: presence.officier_id,
      praesidium_id: presence.praesidium_id,
      date_reunion: presence.date_reunion.split("T")[0],
      statut_presence: presence.statut_presence,
      notes: presence.notes || "",
    });
    setEditingId(presence.id);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr ?")) {
      try {
        const { error } = await supabase
          .from("presences")
          .delete()
          .eq("id", id);
        if (error) throw error;
        toast.success("Supprimé");
        fetchPresences();
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
              <h1 className="text-3xl font-bold">Suivi des Présences</h1>
              <p className="text-gray-600 mt-2">
                Enregistrement et gestion des présences
              </p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Enregistrer Présence
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enregistrer une présence</DialogTitle>
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
                        <SelectValue placeholder="Sélectionnez" />
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
                    <Label htmlFor="officier_id">Officier</Label>
                    <Select
                      value={formData.officier_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, officier_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        {officers
                          .filter(
                            (o) => o.praesidium_id === formData.praesidium_id,
                          )
                          .map((o) => (
                            <SelectItem key={o.id} value={o.id}>
                              {o.nom_prenom}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date_reunion">Date Réunion</Label>
                    <Input
                      id="date_reunion"
                      type="datetime-local"
                      value={formData.date_reunion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          date_reunion: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="statut_presence">Statut</Label>
                    <Select
                      value={formData.statut_presence}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, statut_presence: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Présent">Présent</SelectItem>
                        <SelectItem value="Absent">Absent</SelectItem>
                        <SelectItem value="Excusé">Excusé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Remarques optionnelles"
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    Enregistrer
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
          ) : presences.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">
                  Aucun enregistrement.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {presences.map((presence) => (
                <Card key={presence.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle>
                          {
                            officers.find((o) => o.id === presence.officier_id)
                              ?.nom_prenom
                          }
                        </CardTitle>
                        <CardDescription>
                          {new Date(presence.date_reunion).toLocaleDateString(
                            "fr-FR",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(presence)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(presence.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Statut:</span>{" "}
                      <span
                        className={
                          presence.statut_presence === "Présent"
                            ? "text-green-600"
                            : presence.statut_presence === "Absent"
                              ? "text-red-600"
                              : "text-yellow-600"
                        }
                      >
                        {presence.statut_presence}
                      </span>
                    </p>
                    {presence.notes && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Notes:</span>{" "}
                        {presence.notes}
                      </p>
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
