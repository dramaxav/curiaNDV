"use client";

import { ProtectedRoute } from "@app/protected-route";
import Layout from "@components/Layout";
import { Card, CardHeader, CardTitle, CardDescription } from "@components/ui/card";

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Paramètres</h1>
            <p className="text-gray-600 mt-2">
              Configuration et préférences
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
              <CardDescription>
                Gestion des paramètres - À implémenter
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
