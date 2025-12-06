"use client";

import { ProtectedRoute } from "@app/protected-route";
import Layout from "@components/Layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@components/ui/card";

export default function MembersPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Registre des Membres</h1>
            <p className="text-gray-600 mt-2">
              Gestion des adhésions et statuts
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Liste des Membres</CardTitle>
              <CardDescription>
                Gestion des membres - À implémenter
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
