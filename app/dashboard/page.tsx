"use client";

import { ProtectedRoute } from "@app/protected-route";
import Layout from "@components/Layout";
import { Card, CardHeader, CardTitle, CardDescription } from "@components/ui/card";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Tableau de Bord</h1>
            <p className="text-gray-600 mt-2">
              Bienvenue sur votre tableau de bord personnalisé
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Contenu du Tableau de Bord</CardTitle>
              <CardDescription>
                Cette page affichera les statistiques et données principales
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
