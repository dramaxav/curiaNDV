"use client";

import { ProtectedRoute } from "@app/protected-route";
import Layout from "@components/Layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@components/ui/card";

export default function AccountManagementPage() {
  return (
    <ProtectedRoute requiredPermission="approve_accounts">
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Comptes</h1>
            <p className="text-gray-600 mt-2">
              Administration des comptes utilisateur
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Gestion des Comptes</CardTitle>
              <CardDescription>
                Gestion des comptes - À implémenter
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
