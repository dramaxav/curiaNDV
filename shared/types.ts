// Types for Legion of Mary Management Platform

export interface Zone {
  id_zone: string;
  nom_zone: string;
  paroisse: string;
  directeur_spirituel: string;
  contact_directeur: string;
  date_creation?: Date;
  actif: boolean;
}

export interface Praesidium {
  id_praesidium: string;
  id_zone: string;
  nom_praesidium: string;
  date_creation: Date;
  directeur_spirituel: string;
  type_praesidium: 'adulte' | 'junior';
  actif: boolean;
  lieu_reunion?: string;
  horaire_reunion?: string;
}

export interface Officier {
  id_officier: string;
  id_praesidium: string;
  nom_prenom: string;
  poste: 'Président' | 'Vice-Président' | 'Secrétaire' | 'Trésorier';
  date_debut_mandat: Date;
  date_fin_mandat: Date;
  photo?: string;
  telephone?: string;
  email?: string;
  actif: boolean;
}

export interface Membre {
  id_membre: string;
  id_praesidium: string;
  nom_prenom: string;
  statut: 'actif' | 'probationnaire' | 'auxiliaire' | 'inactif';
  date_adhesion: Date;
  date_promesse?: Date;
  telephone?: string;
  email?: string;
  adresse?: string;
  date_naissance?: Date;
  photo?: string;
  actif: boolean;
}

export interface Presence {
  id_presence: string;
  id_membre: string;
  date_reunion: Date;
  statut_presence: 'Présent' | 'Absent' | 'Excusé';
  notes?: string;
}

export interface Finance {
  id_finance: string;
  id_praesidium: string;
  mois: string; // Format: YYYY-MM
  solde_initial: number;
  contributions: number;
  depenses: number;
  solde_final: number;
  description_depenses?: string;
  date_maj: Date;
}

export interface TransactionFinanciere {
  id_transaction: string;
  id_praesidium: string;
  type: 'contribution' | 'depense';
  montant: number;
  description: string;
  date_transaction: Date;
  categorie?: string;
}

// Types for API responses
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form types
export interface ZoneFormData {
  nom_zone: string;
  paroisse: string;
  directeur_spirituel: string;
  contact_directeur: string;
}

export interface PraesidiumFormData {
  id_zone: string;
  nom_praesidium: string;
  date_creation: Date;
  directeur_spirituel: string;
  type_praesidium: 'adulte' | 'junior';
  lieu_reunion?: string;
  horaire_reunion?: string;
}

export interface OfficierFormData {
  id_praesidium: string;
  nom_prenom: string;
  poste: 'Président' | 'Vice-Président' | 'Secrétaire' | 'Trésorier';
  date_debut_mandat: Date;
  date_fin_mandat: Date;
  telephone?: string;
  email?: string;
  photo?: string;
}

export interface MembreFormData {
  id_praesidium: string;
  nom_prenom: string;
  statut: 'actif' | 'probationnaire' | 'auxiliaire';
  date_adhesion: Date;
  date_promesse?: Date;
  telephone?: string;
  email?: string;
  adresse?: string;
  date_naissance?: Date;
  photo?: string;
}

// Statistics and dashboard types
export interface DashboardStats {
  zones_actives: number;
  praesidia_total: number;
  membres_actifs: number;
  taux_presence: number;
  officiers_total: number;
  contributions_mois: number;
}

export interface AlerteMandat {
  id_officier: string;
  nom_prenom: string;
  poste: string;
  praesidium: string;
  date_fin_mandat: Date;
  jours_restants: number;
}

// Filter and search types
export interface ZoneFilters {
  search?: string;
  paroisse?: string;
  actif?: boolean;
}

export interface PraesidiumFilters {
  search?: string;
  id_zone?: string;
  type_praesidium?: string;
  actif?: boolean;
}

export interface MembreFilters {
  search?: string;
  id_praesidium?: string;
  statut?: string;
  actif?: boolean;
}

export interface OfficierFilters {
  search?: string;
  id_praesidium?: string;
  poste?: string;
  fin_mandat_proche?: boolean;
}

export interface Manifestation {
  id_manifestation: string;
  titre: string;
  description?: string;
  date_manifestation: Date;
  heure_debut: string;
  heure_fin: string;
  lieu: string;
  type_manifestation: 'reunion' | 'activite_spirituelle' | 'formation' | 'service_social' | 'pelerinage' | 'autre';
  pour_tous_praesidia: boolean;
  praesidia_concernes?: string[]; // IDs des praesidia si pour_tous_praesidia = false
  organisateur_contact?: string;
  statut: 'planifiee' | 'en_cours' | 'terminee' | 'annulee';
  participants_attendus: number;
  participants_presents?: number;
  rappel_envoye?: {
    une_semaine: boolean;
    trois_jours: boolean;
  };
  date_creation: Date;
}

export interface RappelManifestation {
  id_rappel: string;
  id_manifestation: string;
  type_rappel: 'une_semaine' | 'trois_jours';
  date_envoi: Date;
  statut: 'programme' | 'envoye' | 'echec';
}
