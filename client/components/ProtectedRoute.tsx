import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldX, LogIn, AlertCircle } from "lucide-react";
import type { PermissionType } from "@shared/types";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: PermissionType;
  praesidiumId?: string;
  fallback?: ReactNode;
}

export default function ProtectedRoute({
  children,
  requiredPermission,
  praesidiumId,
  fallback,
}: ProtectedRouteProps) {
  let authContext;

  try {
    authContext = useAuth();
  } catch (error) {
    // Si le contexte n'est pas disponible, rediriger vers login
    return <Navigate to="/login" replace />;
  }

  const { isAuthenticated, isLoading, hasPermission, utilisateur } = authContext;
  const location = useLocation();

  // Affichage pendant le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Vérification de l'authentification...
          </p>
        </div>
      </div>
    );
  }

  // Redirection vers login si pas connecté
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérification des permissions si requises
  if (requiredPermission && !hasPermission(requiredPermission, praesidiumId)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <ShieldX className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-destructive">Accès refusé</CardTitle>
            <CardDescription>
              Vous n'avez pas les permissions nécessaires pour accéder à cette
              page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Utilisateur :</strong> {utilisateur?.nom_prenom}
                <br />
                <strong>Poste :</strong> {utilisateur?.poste}
                <br />
                <strong>Permission requise :</strong> {requiredPermission}
                {praesidiumId && (
                  <>
                    <br />
                    <strong>Praesidium requis :</strong> {praesidiumId}
                    {utilisateur?.id_praesidium && (
                      <>
                        <br />
                        <strong>Votre praesidium :</strong>{" "}
                        {utilisateur.id_praesidium}
                      </>
                    )}
                  </>
                )}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

// Composant pour protéger les routes publiques (login, register) quand déjà connecté
interface PublicOnlyRouteProps {
  children: ReactNode;
}

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  let authContext;

  try {
    authContext = useAuth();
  } catch (error) {
    // Si le contexte n'est pas disponible, afficher le contenu public
    return <>{children}</>;
  }

  const { isAuthenticated, isLoading } = authContext;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Hook pour créer des composants protégés facilement
export function useProtectedComponent(
  requiredPermission: PermissionType,
  praesidiumId?: string,
) {
  let authContext;

  try {
    authContext = useAuth();
  } catch (error) {
    // Si le contexte n'est pas disponible, retourner un composant qui ne rend rien
    return function ProtectedComponent({ fallback }: { children: ReactNode; fallback?: ReactNode }) {
      return <>{fallback || null}</>;
    };
  }

  const { hasPermission } = authContext;

  return function ProtectedComponent({
    children,
    fallback,
  }: {
    children: ReactNode;
    fallback?: ReactNode;
  }) {
    if (!hasPermission(requiredPermission, praesidiumId)) {
      return <>{fallback || null}</>;
    }
    return <>{children}</>;
  };
}
