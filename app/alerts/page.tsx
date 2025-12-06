"use client";

import { ProtectedRoute } from "@app/protected-route";
import Layout from "@components/Layout";
import { Card, CardHeader, CardTitle, CardDescription } from "@components/ui/card";

export default function AlertsPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Alertes</h1>
            <p className="text-gray-600 mt-2">
              Gestion des alertes et notifications
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Alertes</CardTitle>
              <CardDescription>
                Liste des alertes - À implémenter
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
