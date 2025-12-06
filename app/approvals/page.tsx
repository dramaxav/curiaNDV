"use client";

import { ProtectedRoute } from "@app/protected-route";
import Layout from "@components/Layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@components/ui/card";

export default function ApprovalsPage() {
  return (
    <ProtectedRoute requiredPermission="approve_accounts">
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Approbations</h1>
            <p className="text-gray-600 mt-2">
              Gestion des approbations de comptes
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Approbations</CardTitle>
              <CardDescription>
                Gestion des approbations - À implémenter
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
