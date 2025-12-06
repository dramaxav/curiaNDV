"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { AuthContextType, Utilisateur, PermissionType } from "@shared/types";
import { ROLES_PERMISSIONS } from "@shared/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for users
const mockUtilisateurs: Utilisateur[] = [
  {
    id_utilisateur: "1",
    email: "president@legiondemarie.org",
    nom_prenom: "Jean-Baptiste Mvondo",
    type_utilisateur: "officier_conseil",
    statut_compte: "actif",
    poste: "Président du Conseil",
    date_creation: new Date("2023-01-01"),
    derniere_connexion: new Date(),
  },
  {
    id_utilisateur: "2",
    email: "vicepresident@legiondemarie.org",
    nom_prenom: "Marie-Claire Nga",
    type_utilisateur: "officier_conseil",
    statut_compte: "actif",
    poste: "Vice-Président du Conseil",
    date_creation: new Date("2023-01-01"),
    derniere_connexion: new Date(),
  },
  {
    id_utilisateur: "3",
    email: "tresorier@legiondemarie.org",
    nom_prenom: "Paul Nguema",
    type_utilisateur: "officier_conseil",
    statut_compte: "actif",
    poste: "Trésorier du Conseil",
    date_creation: new Date("2023-01-01"),
    derniere_connexion: new Date(),
  },
  {
    id_utilisateur: "4",
    email: "president.rosaire@legiondemarie.org",
    nom_prenom: "Catherine Ebolo",
    type_utilisateur: "officier_praesidium",
    statut_compte: "actif",
    id_praesidium: "1",
    poste: "Président",
    date_creation: new Date("2023-02-01"),
    derniere_connexion: new Date(),
    approuve_par: "1",
    date_approbation: new Date("2023-02-01"),
  },
  {
    id_utilisateur: "5",
    email: "secretaire.stjean@legiondemarie.org",
    nom_prenom: "Thomas Mbarga",
    type_utilisateur: "officier_praesidium",
    statut_compte: "actif",
    id_praesidium: "2",
    poste: "Secrétaire",
    date_creation: new Date("2023-03-01"),
    derniere_connexion: new Date(),
    approuve_par: "1",
    date_approbation: new Date("2023-03-01"),
  },
];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (localStorage)
    const savedUser = localStorage.getItem("legiondemarie_user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUtilisateur(userData);
      } catch (error) {
        console.error("Error loading user data:", error);
        localStorage.removeItem("legiondemarie_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);

    try {
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check credentials
      const user = mockUtilisateurs.find((u) => u.email === email);

      if (!user) {
        throw new Error("Email ou mot de passe incorrect");
      }

      if (user.statut_compte !== "actif") {
        throw new Error("Votre compte n'est pas encore activé ou a été suspendu");
      }

      // Update last login
      const updatedUser = { ...user, derniere_connexion: new Date() };

      setUtilisateur(updatedUser);
      localStorage.setItem("legiondemarie_user", JSON.stringify(updatedUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUtilisateur(null);
    localStorage.removeItem("legiondemarie_user");
  };

  const hasPermission = (permission: PermissionType, praesidiumId?: string): boolean => {
    if (!utilisateur) return false;

    // Get permissions based on role
    const userPermissions = ROLES_PERMISSIONS[utilisateur.poste || ""] || [];

    // Check if user has this permission
    if (!userPermissions.includes(permission)) return false;

    // If it's a praesidium officer and a praesidiumId is specified,
    // check that it's their praesidium
    if (utilisateur.type_utilisateur === "officier_praesidium" && praesidiumId) {
      return utilisateur.id_praesidium === praesidiumId;
    }

    return true;
  };

  const contextValue: AuthContextType = {
    utilisateur,
    isAuthenticated: !!utilisateur,
    isLoading,
    login,
    logout,
    hasPermission,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook to check permissions
export function usePermission(permission: PermissionType, praesidiumId?: string) {
  const { hasPermission } = useAuth();
  return hasPermission(permission, praesidiumId);
}

// Hook to check if user is a council officer
export function useIsCouncilOfficer() {
  const { utilisateur } = useAuth();
  return utilisateur?.type_utilisateur === "officier_conseil";
}

// Hook to check if user is a praesidium officer
export function useIsPraesidiumOfficer() {
  const { utilisateur } = useAuth();
  return utilisateur?.type_utilisateur === "officier_praesidium";
}

// Hook to check access to a specific praesidium
export function useCanAccessPraesidium(praesidiumId?: string) {
  const { utilisateur } = useAuth();

  if (!utilisateur || !praesidiumId) return false;

  // Council officers can access all praesidia
  if (utilisateur.type_utilisateur === "officier_conseil") {
    return true;
  }

  // Praesidium officers can only access their praesidium
  if (utilisateur.type_utilisateur === "officier_praesidium") {
    return utilisateur.id_praesidium === praesidiumId;
  }

  return false;
}
