"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@app/lib/supabase";
import type { Praesidium } from "@app/lib/supabase";

export function usePraesidia(zoneId?: string) {
  const [praesidia, setPraesidia] = useState<Praesidium[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setError("Supabase non configuré");
      return;
    }

    fetchPraesidia();
    const subscription = supabase
      .channel("praesidia")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "praesidia",
        },
        () => {
          fetchPraesidia();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [zoneId]);

  async function fetchPraesidia() {
    try {
      setLoading(true);
      let query = supabase.from("praesidia").select("*");

      if (zoneId) {
        query = query.eq("zone_id", zoneId);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;
      setPraesidia(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  async function createPraesidium(
    praesidium: Omit<Praesidium, "id" | "created_at" | "updated_at">,
  ) {
    try {
      const { data, error } = await supabase
        .from("praesidia")
        .insert([praesidium])
        .select();

      if (error) throw error;
      setPraesidia([...(data || []), ...praesidia]);
      return data?.[0];
    } catch (err) {
      throw err instanceof Error
        ? err
        : new Error("Erreur lors de la création");
    }
  }

  async function updatePraesidium(id: string, updates: Partial<Praesidium>) {
    try {
      const { data, error } = await supabase
        .from("praesidia")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;
      setPraesidia(
        praesidia.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      );
      return data?.[0];
    } catch (err) {
      throw err instanceof Error
        ? err
        : new Error("Erreur lors de la mise à jour");
    }
  }

  async function deletePraesidium(id: string) {
    try {
      const { error } = await supabase.from("praesidia").delete().eq("id", id);

      if (error) throw error;
      setPraesidia(praesidia.filter((p) => p.id !== id));
    } catch (err) {
      throw err instanceof Error
        ? err
        : new Error("Erreur lors de la suppression");
    }
  }

  return {
    praesidia,
    loading,
    error,
    createPraesidium,
    updatePraesidium,
    deletePraesidium,
    refetch: fetchPraesidia,
  };
}
