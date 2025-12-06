"use client";

import { ProtectedRoute } from "@app/protected-route";
import Layout from "@components/Layout";
import { Card, CardHeader, CardTitle, CardDescription } from "@components/ui/card";

export default function ZonesPage() {
  return (
    <ProtectedRoute requiredPermission="view_all_praesidia">
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Zones</h1>
            <p className="text-gray-600 mt-2">
              Administrer les zones géographiques et paroisses
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Zones</CardTitle>
              <CardDescription>
                Liste et gestion des zones - À implémenter
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
