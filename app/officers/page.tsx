"use client";

import { ProtectedRoute } from "@app/protected-route";
import Layout from "@components/Layout";
import { Card, CardHeader, CardTitle, CardDescription } from "@components/ui/card";

export default function OfficersPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Officiers</h1>
            <p className="text-gray-600 mt-2">
              Gestion des officiers et mandats
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Liste des Officiers</CardTitle>
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
