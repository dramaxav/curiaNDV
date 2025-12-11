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
import { usePraesidia } from "@app/lib/hooks";
import { supabase } from "@app/lib/supabase";
import { Trash2, Edit, Plus, Loader } from "lucide-react";
import { toast } from "sonner";

export default function OfficersPage() {
  const { praesidia } = usePraesidia();
  const [officers, setOfficers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    praesidium_id: "",
    nom_prenom: "",
    poste: "",
    type: "praesidium" as const,
    date_debut_mandat: "",
    date_fin_mandat: "",
    email: "",
    telephone: "",
  });

  // Fetch officers on mount
  React.useEffect(() => {
    fetchOfficers();
    const subscription = supabase
      .channel("officiers")
      .on("postgres_changes", { event: "*", schema: "public", table: "officiers" }, () => {
        fetchOfficers();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchOfficers() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("officiers").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setOfficers(data || []);
    } catch (err) {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from("officiers")
          .update({
            ...formData,
            date_debut_mandat: new Date(formData.date_debut_mandat).toISOString(),
            date_fin_mandat: new Date(formData.date_fin_mandat).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Officier mis à jour");
        setIsEditOpen(false);
      } else {
        const { error } = await supabase.from("officiers").insert([
          {
            ...formData,
            date_debut_mandat: new Date(formData.date_debut_mandat).toISOString(),
            date_fin_mandat: new Date(formData.date_fin_mandat).toISOString(),
            actif: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

        if (error) throw error;
        toast.success("Officier créé");
        setIsOpen(false);
      }

      setFormData({
        praesidium_id: "",
        nom_prenom: "",
        poste: "",
        type: "praesidium",
        date_debut_mandat: "",
        date_fin_mandat: "",
        email: "",
        telephone: "",
      });
      setEditingId(null);
      fetchOfficers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (officer: any) => {
    setFormData({
      praesidium_id: officer.praesidium_id || "",
      nom_prenom: officer.nom_prenom,
      poste: officer.poste,
      type: officer.type,
      date_debut_mandat: officer.date_debut_mandat.split("T")[0],
      date_fin_mandat: officer.date_fin_mandat.split("T")[0],
      email: officer.email || "",
      telephone: officer.telephone || "",
    });
    setEditingId(officer.id);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr ?")) {
      try {
        const { error } = await supabase.from("officiers").delete().eq("id", id);
        if (error) throw error;
        toast.success("Officier supprimé");
        fetchOfficers();
      } catch (error) {
        toast.error("Erreur");
      }
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">Officiers</h1>
              <p className="text-gray-600 mt-2">Gestion des officiers et mandats</p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvel Officier
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouvel officier</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conseil">Conseil</SelectItem>
                        <SelectItem value="praesidium">Praesidium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.type === "praesidium" && (
                    <div>
                      <Label htmlFor="praesidium_id">Praesidium</Label>
                      <Select value={formData.praesidium_id} onValueChange={(value) => setFormData({ ...formData, praesidium_id: value })}>
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
                  )}
                  <div>
                    <Label htmlFor="nom_prenom">Nom</Label>
                    <Input
                      id="nom_prenom"
                      value={formData.nom_prenom}
                      onChange={(e) => setFormData({ ...formData, nom_prenom: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="poste">Poste</Label>
                    <Input
                      id="poste"
                      value={formData.poste}
                      onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="date_debut_mandat">Début du Mandat</Label>
                    <Input
                      id="date_debut_mandat"
                      type="date"
                      value={formData.date_debut_mandat}
                      onChange={(e) => setFormData({ ...formData, date_debut_mandat: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="date_fin_mandat">Fin du Mandat</Label>
                    <Input
                      id="date_fin_mandat"
                      type="date"
                      value={formData.date_fin_mandat}
                      onChange={(e) => setFormData({ ...formData, date_fin_mandat: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input
                      id="telephone"
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    Créer
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Modifier l'officier</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="edit_nom_prenom">Nom</Label>
                  <Input
                    id="edit_nom_prenom"
                    value={formData.nom_prenom}
                    onChange={(e) => setFormData({ ...formData, nom_prenom: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_poste">Poste</Label>
                  <Input
                    id="edit_poste"
                    value={formData.poste}
                    onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_date_fin_mandat">Fin du Mandat</Label>
                  <Input
                    id="edit_date_fin_mandat"
                    type="date"
                    value={formData.date_fin_mandat}
                    onChange={(e) => setFormData({ ...formData, date_fin_mandat: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  Mettre à Jour
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Officers List */}
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-8">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          ) : officers.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">Aucun officier.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {officers.map((officer) => (
                <Card key={officer.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle>{officer.nom_prenom}</CardTitle>
                        <CardDescription>{officer.poste}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(officer)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(officer.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm"><span className="text-muted-foreground">Type:</span> {officer.type === "conseil" ? "Conseil" : "Praesidium"}</p>
                    <p className="text-sm"><span className="text-muted-foreground">Début:</span> {new Date(officer.date_debut_mandat).toLocaleDateString("fr-FR")}</p>
                    <p className="text-sm"><span className="text-muted-foreground">Fin:</span> {new Date(officer.date_fin_mandat).toLocaleDateString("fr-FR")}</p>
                    {officer.email && <p className="text-sm"><span className="text-muted-foreground">Email:</span> {officer.email}</p>}
                    {officer.telephone && <p className="text-sm"><span className="text-muted-foreground">Téléphone:</span> {officer.telephone}</p>}
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
