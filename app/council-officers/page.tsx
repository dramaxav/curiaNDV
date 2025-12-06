"use client";

import { ProtectedRoute } from "@/app/protected-route";
import Layout from "@/app/components/Layout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";

export default function CouncilOfficersPage() {
  return (
    <ProtectedRoute requiredPermission="view_all_praesidia">
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Officiers du Conseil</h1>
            <p className="text-gray-600 mt-2">
              Gestion des officiers du conseil
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Officiers du Conseil</CardTitle>
              <CardDescription>
                Gestion des officiers - À implémenter
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
