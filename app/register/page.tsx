"use client";

import { PublicOnlyRoute } from "@app/protected-route";
import { Card, CardHeader, CardTitle, CardDescription } from "@components/ui/card";

export default function RegisterPage() {
  return (
    <PublicOnlyRoute>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Demande de Compte</CardTitle>
            <CardDescription>
              Page d'enregistrement - À implémenter
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </PublicOnlyRoute>
  );
}
