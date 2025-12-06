"use client";

import { PublicOnlyRoute } from "@/app/protected-route";
import { Card, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <PublicOnlyRoute>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Réinitialiser le Mot de Passe</CardTitle>
            <CardDescription>
              Page de réinitialisation - À implémenter
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </PublicOnlyRoute>
  );
}
