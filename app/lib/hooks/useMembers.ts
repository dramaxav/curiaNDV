"use client";

import { useEffect, useState } from "react";
import { supabase } from "@app/lib/supabase";
import type { Membre } from "@app/lib/supabase";

export function useMembers(praesidiumId?: string) {
  const [members, setMembers] = useState<Membre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
    const subscription = supabase
      .channel("membres")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "membres",
        },
        () => {
          fetchMembers();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [praesidiumId]);

  async function fetchMembers() {
    try {
      setLoading(true);
      let query = supabase.from("membres").select("*");

      if (praesidiumId) {
        query = query.eq("praesidium_id", praesidiumId);
      }

      const { data, error } = await query.order("date_adhesion", {
        ascending: false,
      });

      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  async function createMember(member: Omit<Membre, "id" | "created_at" | "updated_at">) {
    try {
      const { data, error } = await supabase
        .from("membres")
        .insert([member])
        .select();

      if (error) throw error;
      setMembers([...(data || []), ...members]);
      return data?.[0];
    } catch (err) {
      throw err instanceof Error ? err : new Error("Erreur lors de la création");
    }
  }

  async function updateMember(id: string, updates: Partial<Membre>) {
    try {
      const { data, error } = await supabase
        .from("membres")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;
      setMembers(members.map((m) => (m.id === id ? { ...m, ...updates } : m)));
      return data?.[0];
    } catch (err) {
      throw err instanceof Error ? err : new Error("Erreur lors de la mise à jour");
    }
  }

  async function deleteMember(id: string) {
    try {
      const { error } = await supabase.from("membres").delete().eq("id", id);

      if (error) throw error;
      setMembers(members.filter((m) => m.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error("Erreur lors de la suppression");
    }
  }

  return {
    members,
    loading,
    error,
    createMember,
    updateMember,
    deleteMember,
    refetch: fetchMembers,
  };
}
