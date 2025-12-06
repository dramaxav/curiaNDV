"use client";

import { ProtectedRoute } from "@/app/protected-route";
import Layout from "@/app/components/Layout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";

export default function PraesidiumFinancePage() {
  return (
    <ProtectedRoute requiredPermission="manage_praesidium">
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Finances du Praesidium</h1>
            <p className="text-gray-600 mt-2">
              Gestion financière du praesidium
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Finances du Praesidium</CardTitle>
              <CardDescription>
                Gestion financière du praesidium - À implémenter
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
