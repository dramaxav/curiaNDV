"use client";

import { ProtectedRoute } from "@app/protected-route";
import Layout from "@components/Layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@components/ui/card";

export default function FinancesPage() {
  return (
    <ProtectedRoute requiredPermission="view_finances">
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Gestion Financière</h1>
            <p className="text-gray-600 mt-2">
              Suivi des contributions et dépenses
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Finances</CardTitle>
              <CardDescription>
                Gestion financière - À implémenter
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
