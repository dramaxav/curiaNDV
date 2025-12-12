import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials not configured. Please connect Supabase via the MCP integration or add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local",
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
);

// Types for database
export interface Zone {
  id: string;
  nom_zone: string;
  paroisse: string;
  directeur_spirituel: string;
  contact_directeur: string;
  date_creation: string;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

export interface Praesidium {
  id: string;
  zone_id: string;
  nom_praesidium: string;
  date_creation: string;
  directeur_spirituel: string;
  type_praesidium: "adulte" | "junior";
  actif: boolean;
  lieu_reunion?: string;
  horaire_reunion?: string;
  created_at: string;
  updated_at: string;
}

export interface Membre {
  id: string;
  praesidium_id: string;
  nom_prenom: string;
  statut: "actif" | "probationnaire" | "auxiliaire" | "inactif";
  date_adhesion: string;
  date_promesse?: string;
  telephone?: string;
  email?: string;
  adresse?: string;
  date_naissance?: string;
  photo?: string;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

export interface Officier {
  id: string;
  praesidium_id?: string;
  nom_prenom: string;
  poste: string;
  type: "conseil" | "praesidium";
  date_debut_mandat: string;
  date_fin_mandat: string;
  photo?: string;
  telephone?: string;
  email?: string;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

export interface Finance {
  id: string;
  praesidium_id: string;
  mois: string;
  solde_initial: number;
  contributions: number;
  depenses: number;
  solde_final: number;
  description_depenses?: string;
  date_maj: string;
  created_at: string;
  updated_at: string;
}

export interface Presence {
  id: string;
  officier_id: string;
  praesidium_id: string;
  date_reunion: string;
  statut_presence: "Présent" | "Absent" | "Excusé";
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Manifestation {
  id: string;
  titre: string;
  description?: string;
  date_manifestation: string;
  heure_debut: string;
  heure_fin: string;
  lieu: string;
  type_manifestation:
    | "reunion"
    | "activite_spirituelle"
    | "formation"
    | "service_social"
    | "pelerinage"
    | "autre";
  pour_tous_praesidia: boolean;
  praesidia_concernes?: string[];
  organisateur_contact?: string;
  statut: "planifiee" | "en_cours" | "terminee" | "annulee";
  participants_attendus: number;
  participants_presents?: number;
  created_at: string;
  updated_at: string;
}
