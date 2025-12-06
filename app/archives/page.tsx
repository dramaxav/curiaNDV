"use client";

import { ProtectedRoute } from "@app/protected-route";
import Layout from "@components/Layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@components/ui/card";

export default function ArchivesPage() {
  return (
    <ProtectedRoute requiredPermission="view_all_reports">
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Archives</h1>
            <p className="text-gray-600 mt-2">
              Consultation des rapports et archives
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Archives</CardTitle>
              <CardDescription>
                Gestion des archives - À implémenter
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
