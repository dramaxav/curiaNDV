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
  type_praesidium: "adulte" | "junior";
  actif: boolean;
  lieu_reunion?: string;
  horaire_reunion?: string;
}

export interface Officier {
  id_officier: string;
  id_praesidium: string;
  nom_prenom: string;
  poste: "Président" | "Vice-Président" | "Secrétaire" | "Trésorier";
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
  statut: "actif" | "probationnaire" | "auxiliaire" | "inactif";
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
  id_officier: string;
  date_reunion: Date;
  statut_presence: "Présent" | "Absent" | "Excusé";
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
  type: "contribution" | "depense";
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
  type_praesidium: "adulte" | "junior";
  lieu_reunion?: string;
  horaire_reunion?: string;
}

export interface OfficierFormData {
  id_praesidium: string;
  nom_prenom: string;
  poste: "Président" | "Vice-Président" | "Secrétaire" | "Trésorier";
  date_debut_mandat: Date;
  date_fin_mandat: Date;
  telephone?: string;
  email?: string;
  photo?: string;
}

export interface MembreFormData {
  id_praesidium: string;
  nom_prenom: string;
  statut: "actif" | "probationnaire" | "auxiliaire";
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
  type_manifestation:
    | "reunion"
    | "activite_spirituelle"
    | "formation"
    | "service_social"
    | "pelerinage"
    | "autre";
  pour_tous_praesidia: boolean;
  praesidia_concernes?: string[]; // IDs des praesidia si pour_tous_praesidia = false
  organisateur_contact?: string;
  statut: "planifiee" | "en_cours" | "terminee" | "annulee";
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
  type_rappel: "une_semaine" | "trois_jours";
  date_envoi: Date;
  statut: "programme" | "envoye" | "echec";
}

// Types d'authentification et d'utilisateurs
export interface Utilisateur {
  id_utilisateur: string;
  email: string;
  nom_prenom: string;
  type_utilisateur: "officier_praesidium" | "officier_conseil";
  statut_compte: "en_attente" | "actif" | "suspendu" | "inactif";
  id_praesidium?: string; // Pour les officiers de praesidium
  poste?: string; // Poste de l'officier
  date_creation: Date;
  derniere_connexion?: Date;
  approuve_par?: string; // ID de l'officier du conseil qui a approuvé
  date_approbation?: Date;
}

export interface DemandeCompte {
  id_demande: string;
  email: string;
  nom_prenom: string;
  type_demande: "officier_praesidium" | "officier_conseil";
  id_praesidium?: string;
  poste_souhaite: string;
  justification: string;
  statut: "en_attente" | "approuvee" | "refusee";
  date_demande: Date;
  traite_par?: string; // ID de l'officier du conseil qui a traité
  date_traitement?: Date;
  commentaire_traitement?: string;
}

export interface ApprobationPresence {
  id_approbation: string;
  id_praesidium: string;
  mois_annee: string; // Format: YYYY-MM
  soumis_par: string; // ID officier praesidium
  date_soumission: Date;
  statut: "en_attente" | "approuvee" | "refusee";
  approuve_par?: string; // ID vice-président conseil
  date_approbation?: Date;
  commentaire?: string;
  presences_ids: string[]; // IDs des présences concernées
}

export interface ApprobationFinance {
  id_approbation: string;
  id_praesidium: string;
  id_transaction: string;
  soumis_par: string; // ID officier praesidium
  date_soumission: Date;
  statut: "en_attente" | "approuvee" | "refusee";
  approuve_par?: string; // ID trésorier conseil
  date_approbation?: Date;
  commentaire?: string;
}

export interface AlerteProbation {
  id_alerte: string;
  id_membre: string;
  nom_membre: string;
  id_praesidium: string;
  nom_praesidium: string;
  date_debut_probation: Date;
  duree_probation_mois: number;
  statut: "active" | "traitee" | "ignoree";
  date_creation: Date;
  traite_par?: string;
  date_traitement?: Date;
}

export interface AlerteAnniversaire {
  id_alerte: string;
  type_anniversaire:
    | "naissance"
    | "bapteme"
    | "confirmation"
    | "creation_praesidium"
    | "creation_conseil";
  id_concerne: string; // ID de la personne ou entité concernée
  nom_concerne: string;
  date_anniversaire: Date;
  age_ou_annees?: number; // Âge pour naissance, années depuis création pour entités
  id_praesidium?: string; // Si c'est lié à un praesidium
  destinataires: string[]; // IDs des personnes à alerter
  statut: "active" | "envoyee" | "ignoree";
  date_creation: Date;
  date_envoi?: Date;
}

export interface AlerteFinMandat {
  id_alerte: string;
  id_officier: string;
  nom_officier: string;
  poste: string;
  id_praesidium?: string; // null si officier du conseil
  nom_praesidium?: string;
  date_fin_mandat: Date;
  jours_restants: number;
  destinataires: string[]; // IDs des personnes à alerter + vice-président conseil
  statut: "active" | "envoyee" | "traitee";
  date_creation: Date;
}

export interface AlerteNonContribution {
  id_alerte: string;
  id_praesidium: string;
  nom_praesidium: string;
  mois_manque: string; // Format YYYY-MM
  montant_attendu?: number;
  officiers_praesidium: string[]; // IDs des officiers du praesidium
  tresoriere_conseil: string; // ID de la trésorière du conseil
  statut: "active" | "envoyee" | "resolue";
  date_creation: Date;
  date_limite: Date; // Date limite pour la contribution
}

export interface RapportConseil {
  id_rapport: string;
  periode: string; // Format YYYY-MM ou YYYY pour annuel
  type_rapport: "mensuel" | "trimestriel" | "annuel";
  solde_initial: number; // Solde au début de la période
  total_contributions: number; // Total des contributions reçues des praesidia
  total_depenses: number; // Total des dépenses du conseil durant la période
  solde_final: number; // Solde final = solde_initial + contributions - dépenses
  nombre_praesidia_actifs: number;
  contributions_par_praesidium: {
    id_praesidium: string;
    nom_praesidium: string;
    montant: number;
    statut: "paye" | "en_retard" | "non_paye";
    date_paiement?: Date;
  }[];
  depenses_principales: {
    categorie: string;
    montant: number;
    description?: string;
    date_depense: Date;
  }[];
  analyse_comparative?: {
    periode_precedente: string;
    evolution_contributions: number; // % d'évolution
    evolution_depenses: number; // % d'évolution
    evolution_solde: number; // % d'évolution
  };
  observations: string;
  cree_par: string; // ID du trésorier conseil
  date_creation: Date;
  approuve_par?: string; // ID du président conseil
  date_approbation?: Date;
  statut: "brouillon" | "soumis" | "approuve" | "rejete";
}

// Types pour l'authentification
export interface AuthContextType {
  utilisateur: Utilisateur | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string, praesidiumId?: string) => boolean;
}

export type PermissionType =
  | "view_all_praesidia"
  | "manage_praesidium"
  | "approve_accounts"
  | "approve_presences"
  | "approve_finances"
  | "view_finances"
  | "manage_manifestations"
  | "view_all_reports";

// Types pour les rôles et permissions
export interface Role {
  type: "officier_praesidium" | "officier_conseil";
  poste: string;
  permissions: PermissionType[];
}

export const ROLES_PERMISSIONS: Record<string, PermissionType[]> = {
  // Officiers du Conseil
  "Président du Conseil": [
    "view_all_praesidia",
    "approve_accounts",
    "approve_presences",
    "approve_finances",
    "view_finances",
    "manage_manifestations",
    "view_all_reports",
  ],
  "Vice-Président du Conseil": [
    "view_all_praesidia",
    "approve_presences",
    "view_finances",
    "manage_manifestations",
    "view_all_reports",
  ],
  "Secrétaire du Conseil": [
    "view_all_praesidia",
    "manage_manifestations",
    "view_all_reports",
  ],
  "Trésorier du Conseil": [
    "view_all_praesidia",
    "approve_finances",
    "view_finances",
    "view_all_reports",
  ],
  "Directeur Spirituel": [
    "view_all_praesidia",
    "approve_accounts",
    "view_all_reports",
  ],
  "Responsable Formation": [
    "view_all_praesidia",
    "manage_manifestations",
    "view_all_reports",
  ],

  // Officiers de Praesidium
  Président: ["manage_praesidium", "view_finances"],
  "Vice-Président": ["manage_praesidium", "view_finances"],
  Secrétaire: ["manage_praesidium"],
  Trésorier: ["manage_praesidium", "view_finances"],
};
