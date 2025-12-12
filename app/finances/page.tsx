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
import { usePraesidia } from "@app/lib/hooks";
import { supabase, isSupabaseConfigured } from "@app/lib/supabase";
import {
  Trash2,
  Edit,
  Plus,
  Loader,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function FinancesPage() {
  const { praesidia } = usePraesidia();
  const [finances, setFinances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    praesidium_id: "",
    mois: "",
    solde_initial: "0",
    contributions: "0",
    depenses: "0",
  });

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    fetchFinances();
    const subscription = supabase
      .channel("finances")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "finances" },
        () => {
          fetchFinances();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchFinances() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("finances")
        .select("*")
        .order("mois", { ascending: false });
      if (error) throw error;
      setFinances(data || []);
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
      const solde_initial = parseFloat(formData.solde_initial || "0");
      const contributions = parseFloat(formData.contributions || "0");
      const depenses = parseFloat(formData.depenses || "0");
      const solde_final = solde_initial + contributions - depenses;

      if (editingId) {
        const { error } = await supabase
          .from("finances")
          .update({
            solde_initial,
            contributions,
            depenses,
            solde_final,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Finances mises à jour");
        setIsEditOpen(false);
      } else {
        const { error } = await supabase.from("finances").insert([
          {
            praesidium_id: formData.praesidium_id,
            mois: formData.mois,
            solde_initial,
            contributions,
            depenses,
            solde_final,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

        if (error) throw error;
        toast.success("Entrée créée");
        setIsOpen(false);
      }

      setFormData({
        praesidium_id: "",
        mois: "",
        solde_initial: "0",
        contributions: "0",
        depenses: "0",
      });
      setEditingId(null);
      fetchFinances();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (finance: any) => {
    setFormData({
      praesidium_id: finance.praesidium_id,
      mois: finance.mois,
      solde_initial: finance.solde_initial.toString(),
      contributions: finance.contributions.toString(),
      depenses: finance.depenses.toString(),
    });
    setEditingId(finance.id);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr ?")) {
      try {
        const { error } = await supabase.from("finances").delete().eq("id", id);
        if (error) throw error;
        toast.success("Supprimé");
        fetchFinances();
      } catch (error) {
        toast.error("Erreur");
      }
    }
  };

  return (
    <ProtectedRoute requiredPermission="view_finances">
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
              <h1 className="text-3xl font-bold">Gestion Financière</h1>
              <p className="text-gray-600 mt-2">
                Suivi des contributions et dépenses
              </p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle Entrée
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une entrée financière</DialogTitle>
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
                    <Label htmlFor="mois">Mois (YYYY-MM)</Label>
                    <Input
                      id="mois"
                      type="month"
                      value={formData.mois}
                      onChange={(e) =>
                        setFormData({ ...formData, mois: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="solde_initial">Solde Initial €</Label>
                    <Input
                      id="solde_initial"
                      type="number"
                      step="0.01"
                      value={formData.solde_initial}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          solde_initial: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="contributions">Contributions €</Label>
                    <Input
                      id="contributions"
                      type="number"
                      step="0.01"
                      value={formData.contributions}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contributions: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="depenses">Dépenses €</Label>
                    <Input
                      id="depenses"
                      type="number"
                      step="0.01"
                      value={formData.depenses}
                      onChange={(e) =>
                        setFormData({ ...formData, depenses: e.target.value })
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

          {/* Edit Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier l'entrée</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="edit_solde_initial">Solde Initial €</Label>
                  <Input
                    id="edit_solde_initial"
                    type="number"
                    step="0.01"
                    value={formData.solde_initial}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        solde_initial: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit_contributions">Contributions €</Label>
                  <Input
                    id="edit_contributions"
                    type="number"
                    step="0.01"
                    value={formData.contributions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contributions: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit_depenses">Dépenses €</Label>
                  <Input
                    id="edit_depenses"
                    type="number"
                    step="0.01"
                    value={formData.depenses}
                    onChange={(e) =>
                      setFormData({ ...formData, depenses: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  Mettre à Jour
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Finances List */}
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-8">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          ) : finances.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">
                  Aucune entrée.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {finances.map((finance) => (
                <Card key={finance.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {finance.mois}
                        </CardTitle>
                        <CardDescription>
                          {
                            praesidia.find(
                              (p) => p.id === finance.praesidium_id,
                            )?.nom_praesidium
                          }
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(finance)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(finance.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Initial</p>
                        <p className="font-medium">
                          {finance.solde_initial.toFixed(2)}€
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Contributions</p>
                        <p className="font-medium text-green-600">
                          +{finance.contributions.toFixed(2)}€
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Dépenses</p>
                        <p className="font-medium text-red-600">
                          -{finance.depenses.toFixed(2)}€
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Solde Final</p>
                        <p className="font-medium text-lg">
                          {finance.solde_final.toFixed(2)}€
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
