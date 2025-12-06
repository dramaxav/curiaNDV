"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { PublicOnlyRoute } from "@/app/protected-route";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Shield, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    }
  };

  const demoAccounts = [
    {
      label: "Président du Conseil",
      email: "president@legiondemarie.org",
      password: "demo123",
    },
    {
      label: "Vice-Président du Conseil",
      email: "vicepresident@legiondemarie.org",
      password: "demo123",
    },
    {
      label: "Officier de Praesidium",
      email: "president.rosaire@legiondemarie.org",
      password: "demo123",
    },
  ];

  const handleDemoLogin = async (demoEmail: string) => {
    setError("");
    try {
      await login(demoEmail, "demo123");
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    }
  };

  return (
    <PublicOnlyRoute>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Légion de Marie</h1>
            <p className="text-gray-600 mt-2">
              Plateforme de gestion organisationnelle
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Connexion</CardTitle>
              <CardDescription>
                Entrez vos identifiants pour accéder à la plateforme
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="exemple@legiondemarie.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Comptes de démonstration:
                </p>
                <div className="space-y-2">
                  {demoAccounts.map((account) => (
                    <button
                      key={account.email}
                      onClick={() => handleDemoLogin(account.email)}
                      className="w-full text-left text-sm p-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 transition"
                    >
                      <span className="font-medium">{account.label}</span>
                      <br />
                      <span className="text-xs text-blue-700">{account.email}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-2">
              <Link href="/forgot-password">
                <Button variant="ghost" className="w-full">
                  Mot de passe oublié?
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <p className="text-center text-sm text-gray-600 mt-6">
            Pas encore inscrit?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </PublicOnlyRoute>
  );
}
