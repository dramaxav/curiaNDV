"use client";

import { useEffect, useState } from "react";
import { supabase } from "@app/lib/supabase";
import type { Zone } from "@app/lib/supabase";

export function useZones() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchZones();
    const subscription = supabase
      .channel("zones")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "zones",
        },
        (payload) => {
          // Refetch data on changes
          fetchZones();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchZones() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("zones")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setZones(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  async function createZone(
    zone: Omit<Zone, "id" | "created_at" | "updated_at">,
  ) {
    try {
      const { data, error } = await supabase
        .from("zones")
        .insert([zone])
        .select();

      if (error) throw error;
      setZones([...(data || []), ...zones]);
      return data?.[0];
    } catch (err) {
      throw err instanceof Error
        ? err
        : new Error("Erreur lors de la création");
    }
  }

  async function updateZone(id: string, updates: Partial<Zone>) {
    try {
      const { data, error } = await supabase
        .from("zones")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;
      setZones(zones.map((z) => (z.id === id ? { ...z, ...updates } : z)));
      return data?.[0];
    } catch (err) {
      throw err instanceof Error
        ? err
        : new Error("Erreur lors de la mise à jour");
    }
  }

  async function deleteZone(id: string) {
    try {
      const { error } = await supabase.from("zones").delete().eq("id", id);

      if (error) throw error;
      setZones(zones.filter((z) => z.id !== id));
    } catch (err) {
      throw err instanceof Error
        ? err
        : new Error("Erreur lors de la suppression");
    }
  }

  return {
    zones,
    loading,
    error,
    createZone,
    updateZone,
    deleteZone,
    refetch: fetchZones,
  };
}
