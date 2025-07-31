import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Database,
  Palette,
  Download,
  Upload,
  Save,
} from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState({
    // Paramètres généraux
    nom_organisation: "Légion de Marie",
    lieu_organisation: "Yaoundé, Cameroun",
    contact_principal: "+237 6 XX XX XX XX",
    email_organisation: "contact@legiondemarie.cm",

    // Paramètres de notification
    notifications_email: true,
    notifications_fins_mandat: true,
    notifications_contributions: false,
    delai_alerte_mandat: "30", // jours

    // Paramètres d'affichage
    theme: "system",
    langue: "fr",
    format_date: "DD/MM/YYYY",

    // Paramètres financiers
    devise: "F CFA",
    precision_decimale: "0",

    // Paramètres de sauvegarde
    sauvegarde_auto: true,
    frequence_sauvegarde: "quotidienne",
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    // Ici on sauvegarderait les paramètres
    alert("Paramètres sauvegardés avec succès !");
  };

  const handleExport = () => {
    // Ici on exporterait les données
    alert("Export des données initié...");
  };

  const handleImport = () => {
    // Ici on importerait les données
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        alert("Import des données initié...");
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Configuration et préférences de la plateforme
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Sauvegarder
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Paramètres Généraux */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Paramètres Généraux
            </CardTitle>
            <CardDescription>
              Informations de base de l'organisation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom_organisation">Nom de l'organisation</Label>
                <Input
                  id="nom_organisation"
                  value={settings.nom_organisation}
                  onChange={(e) =>
                    handleSettingChange("nom_organisation", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lieu_organisation">Lieu</Label>
                <Input
                  id="lieu_organisation"
                  value={settings.lieu_organisation}
                  onChange={(e) =>
                    handleSettingChange("lieu_organisation", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_principal">Contact principal</Label>
                <Input
                  id="contact_principal"
                  value={settings.contact_principal}
                  onChange={(e) =>
                    handleSettingChange("contact_principal", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email_organisation">
                  Email de l'organisation
                </Label>
                <Input
                  id="email_organisation"
                  type="email"
                  value={settings.email_organisation}
                  onChange={(e) =>
                    handleSettingChange("email_organisation", e.target.value)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paramètres de Notification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configuration des alertes et notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications par email</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir les alertes par email
                </p>
              </div>
              <Switch
                checked={settings.notifications_email}
                onCheckedChange={(checked) =>
                  handleSettingChange("notifications_email", checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Alertes fins de mandat</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications automatiques pour les fins de mandat
                </p>
              </div>
              <Switch
                checked={settings.notifications_fins_mandat}
                onCheckedChange={(checked) =>
                  handleSettingChange("notifications_fins_mandat", checked)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delai_alerte_mandat">
                Délai d'alerte (jours avant la fin)
              </Label>
              <Select
                value={settings.delai_alerte_mandat}
                onValueChange={(value) =>
                  handleSettingChange("delai_alerte_mandat", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 jours</SelectItem>
                  <SelectItem value="30">30 jours</SelectItem>
                  <SelectItem value="60">60 jours</SelectItem>
                  <SelectItem value="90">90 jours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Paramètres d'Affichage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Affichage
            </CardTitle>
            <CardDescription>
              Préférences d'interface et d'affichage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Thème</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value) => handleSettingChange("theme", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">Système</SelectItem>
                    <SelectItem value="light">Clair</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="langue">Langue</Label>
                <Select
                  value={settings.langue}
                  onValueChange={(value) =>
                    handleSettingChange("langue", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="format_date">Format de date</Label>
                <Select
                  value={settings.format_date}
                  onValueChange={(value) =>
                    handleSettingChange("format_date", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paramètres Financiers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Paramètres Financiers
            </CardTitle>
            <CardDescription>
              Configuration des devises et formats financiers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="devise">Devise</Label>
                <Select
                  value={settings.devise}
                  onValueChange={(value) =>
                    handleSettingChange("devise", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="F CFA">Franc CFA (F CFA)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="USD">Dollar US ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="precision_decimale">Précision décimale</Label>
                <Select
                  value={settings.precision_decimale}
                  onValueChange={(value) =>
                    handleSettingChange("precision_decimale", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 décimale</SelectItem>
                    <SelectItem value="2">2 décimales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sauvegarde et Import/Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Données et Sauvegarde
            </CardTitle>
            <CardDescription>
              Gestion des données et sauvegardes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Sauvegarde automatique</Label>
                <p className="text-sm text-muted-foreground">
                  Sauvegarde automatique des données
                </p>
              </div>
              <Switch
                checked={settings.sauvegarde_auto}
                onCheckedChange={(checked) =>
                  handleSettingChange("sauvegarde_auto", checked)
                }
              />
            </div>
            {settings.sauvegarde_auto && (
              <div className="space-y-2">
                <Label htmlFor="frequence_sauvegarde">
                  Fréquence de sauvegarde
                </Label>
                <Select
                  value={settings.frequence_sauvegarde}
                  onValueChange={(value) =>
                    handleSettingChange("frequence_sauvegarde", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quotidienne">Quotidienne</SelectItem>
                    <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
                    <SelectItem value="mensuelle">Mensuelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <Separator />
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Exporter les données
              </Button>
              <Button variant="outline" onClick={handleImport}>
                <Upload className="mr-2 h-4 w-4" />
                Importer des données
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
