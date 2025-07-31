import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AuthContextType, Utilisateur, PermissionType, ROLES_PERMISSIONS } from '@shared/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data pour les utilisateurs
const mockUtilisateurs: Utilisateur[] = [
  {
    id_utilisateur: '1',
    email: 'president@legiondemarie.org',
    nom_prenom: 'Jean-Baptiste Mvondo',
    type_utilisateur: 'officier_conseil',
    statut_compte: 'actif',
    poste: 'Président du Conseil',
    date_creation: new Date('2023-01-01'),
    derniere_connexion: new Date()
  },
  {
    id_utilisateur: '2',
    email: 'vicepresident@legiondemarie.org',
    nom_prenom: 'Marie-Claire Nga',
    type_utilisateur: 'officier_conseil',
    statut_compte: 'actif',
    poste: 'Vice-Président du Conseil',
    date_creation: new Date('2023-01-01'),
    derniere_connexion: new Date()
  },
  {
    id_utilisateur: '3',
    email: 'tresorier@legiondemarie.org',
    nom_prenom: 'Paul Nguema',
    type_utilisateur: 'officier_conseil',
    statut_compte: 'actif',
    poste: 'Trésorier du Conseil',
    date_creation: new Date('2023-01-01'),
    derniere_connexion: new Date()
  },
  {
    id_utilisateur: '4',
    email: 'president.rosaire@legiondemarie.org',
    nom_prenom: 'Catherine Ebolo',
    type_utilisateur: 'officier_praesidium',
    statut_compte: 'actif',
    id_praesidium: '1',
    poste: 'Président',
    date_creation: new Date('2023-02-01'),
    derniere_connexion: new Date(),
    approuve_par: '1',
    date_approbation: new Date('2023-02-01')
  },
  {
    id_utilisateur: '5',
    email: 'secretaire.stjean@legiondemarie.org',
    nom_prenom: 'Thomas Mbarga',
    type_utilisateur: 'officier_praesidium',
    statut_compte: 'actif',
    id_praesidium: '2',
    poste: 'Secrétaire',
    date_creation: new Date('2023-03-01'),
    derniere_connexion: new Date(),
    approuve_par: '1',
    date_approbation: new Date('2023-03-01')
  }
];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté (localStorage)
    const savedUser = localStorage.getItem('legiondemarie_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUtilisateur(userData);
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
        localStorage.removeItem('legiondemarie_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vérifier les identifiants
      const user = mockUtilisateurs.find(u => u.email === email);
      
      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }
      
      if (user.statut_compte !== 'actif') {
        throw new Error('Votre compte n\'est pas encore activé ou a été suspendu');
      }
      
      // Mettre à jour la dernière connexion
      const updatedUser = { ...user, derniere_connexion: new Date() };
      
      setUtilisateur(updatedUser);
      localStorage.setItem('legiondemarie_user', JSON.stringify(updatedUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUtilisateur(null);
    localStorage.removeItem('legiondemarie_user');
  };

  const hasPermission = (permission: PermissionType, praesidiumId?: string): boolean => {
    if (!utilisateur) return false;
    
    // Obtenir les permissions basées sur le poste
    const userPermissions = ROLES_PERMISSIONS[utilisateur.poste || ''] || [];
    
    // Vérifier si l'utilisateur a cette permission
    if (!userPermissions.includes(permission)) return false;
    
    // Si c'est un officier de praesidium et qu'un praesidiumId est spécifié,
    // vérifier qu'il s'agit de son praesidium
    if (utilisateur.type_utilisateur === 'officier_praesidium' && praesidiumId) {
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
    hasPermission
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook pour vérifier les permissions
export function usePermission(permission: PermissionType, praesidiumId?: string) {
  const { hasPermission } = useAuth();
  return hasPermission(permission, praesidiumId);
}

// Hook pour vérifier si l'utilisateur est un officier du conseil
export function useIsCouncilOfficer() {
  const { utilisateur } = useAuth();
  return utilisateur?.type_utilisateur === 'officier_conseil';
}

// Hook pour vérifier si l'utilisateur est un officier de praesidium
export function useIsPraesidiumOfficer() {
  const { utilisateur } = useAuth();
  return utilisateur?.type_utilisateur === 'officier_praesidium';
}
