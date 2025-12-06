"use client";

import { ProtectedRoute } from "@/app/protected-route";
import Layout from "@/app/components/Layout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";

export default function MeetingsPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Réunions et Manifestations</h1>
            <p className="text-gray-600 mt-2">
              Gestion des réunions et manifestations
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Réunions</CardTitle>
              <CardDescription>
                Gestion des réunions - À implémenter
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
