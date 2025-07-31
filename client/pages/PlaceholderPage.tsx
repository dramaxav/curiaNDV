import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function PlaceholderPage({
  title,
  description,
  icon,
}: PlaceholderPageProps) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {icon || (
              <Construction className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-center">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Cette section est en cours de développement. Elle sera bientôt
            disponible avec toutes les fonctionnalités nécessaires pour la
            gestion de la Légion de Marie.
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard">Tableau de bord</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
