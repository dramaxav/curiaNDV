"use client";

import { ProtectedRoute } from "@app/protected-route";
import Layout from "@components/Layout";
import { Card, CardHeader, CardTitle, CardDescription } from "@components/ui/card";

export default function AttendancePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Suivi des Présences</h1>
            <p className="text-gray-600 mt-2">
              Enregistrement et gestion des présences
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Présences</CardTitle>
              <CardDescription>
                Gestion des présences aux réunions - À implémenter
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
