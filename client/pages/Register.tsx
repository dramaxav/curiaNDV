import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Mail, User, FileText, Building, ArrowLeft, CheckCircle } from 'lucide-react';
import type { DemandeCompte, Praesidium } from '@shared/types';

// Mock data
const mockPraesidia: Praesidium[] = [
  { id_praesidium: '1', id_zone: '1', nom_praesidium: 'Notre-Dame du Rosaire', date_creation: new Date(), directeur_spirituel: 'Père Jean', type_praesidium: 'adulte', actif: true },
  { id_praesidium: '2', id_zone: '1', nom_praesidium: 'Saint-Jean-Baptiste', date_creation: new Date(), directeur_spirituel: 'Père Jean', type_praesidium: 'adulte', actif: true },
  { id_praesidium: '3', id_zone: '2', nom_praesidium: 'Sainte-Thérèse', date_creation: new Date(), directeur_spirituel: 'Père Michel', type_praesidium: 'junior', actif: true }
];

const postesPraesidium = [
  'Président',
  'Vice-Président', 
  'Secrétaire',
  'Trésorier'
];

const postesConseil = [
  'Président du Conseil',
  'Vice-Président du Conseil',
  'Secrétaire du Conseil',
  'Trésorier du Conseil',
  'Directeur Spirituel',
  'Responsable Formation'
];

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    nom_prenom: '',
    type_demande: '' as 'officier_praesidium' | 'officier_conseil' | '',
    id_praesidium: '',
    poste_souhaite: '',
    justification: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.nom_prenom || !formData.type_demande || !formData.poste_souhaite || !formData.justification) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.type_demande === 'officier_praesidium' && !formData.id_praesidium) {
      setError('Veuillez sélectionner un praesidium');
      return;
    }

    setIsLoading(true);

    try {
      // Simulation d'envoi de demande
      await new Promise(resolve => setTimeout(resolve, 1500));

      const nouvelleDemande: DemandeCompte = {
        id_demande: Date.now().toString(),
        email: formData.email,
        nom_prenom: formData.nom_prenom,
        type_demande: formData.type_demande,
        id_praesidium: formData.id_praesidium || undefined,
        poste_souhaite: formData.poste_souhaite,
        justification: formData.justification,
        statut: 'en_attente',
        date_demande: new Date()
      };

      // Ici, on enverrait la demande au serveur
      console.log('Nouvelle demande de compte:', nouvelleDemande);

      setSuccess(true);
    } catch (err) {
      setError('Erreur lors de l\'envoi de la demande. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-green-700">Demande envoyée !</CardTitle>
            <CardDescription>
              Votre demande de compte a été transmise aux officiers du conseil
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Alert>
              <AlertDescription>
                Vous recevrez un email de confirmation une fois votre demande approuvée par les officiers du conseil.
                Ce processus peut prendre 2-3 jours ouvrables.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/login')} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la connexion
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Légion de Marie</h1>
          <p className="text-gray-600 mt-2">Demande d'accès au système</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Demande de Compte</CardTitle>
            <CardDescription>
              Remplissez ce formulaire pour demander l'accès. Votre demande sera examinée par les officiers du conseil.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nom_prenom">Nom et Prénom *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nom_prenom"
                    placeholder="Jean Dupont"
                    value={formData.nom_prenom}
                    onChange={(e) => setFormData({...formData, nom_prenom: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="jean.dupont@exemple.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type_demande">Type de compte *</Label>
                <Select 
                  value={formData.type_demande} 
                  onValueChange={(value) => setFormData({
                    ...formData, 
                    type_demande: value as 'officier_praesidium' | 'officier_conseil',
                    id_praesidium: '',
                    poste_souhaite: ''
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="officier_praesidium">Officier de Praesidium</SelectItem>
                    <SelectItem value="officier_conseil">Officier du Conseil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type_demande === 'officier_praesidium' && (
                <div className="space-y-2">
                  <Label htmlFor="id_praesidium">Praesidium *</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Select 
                      value={formData.id_praesidium} 
                      onValueChange={(value) => setFormData({...formData, id_praesidium: value})}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Sélectionner votre praesidium" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPraesidia.filter(p => p.actif).map((praesidium) => (
                          <SelectItem key={praesidium.id_praesidium} value={praesidium.id_praesidium}>
                            {praesidium.nom_praesidium}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="poste_souhaite">Poste souhaité *</Label>
                <Select 
                  value={formData.poste_souhaite} 
                  onValueChange={(value) => setFormData({...formData, poste_souhaite: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le poste" />
                  </SelectTrigger>
                  <SelectContent>
                    {(formData.type_demande === 'officier_praesidium' ? postesPraesidium : postesConseil).map((poste) => (
                      <SelectItem key={poste} value={poste}>
                        {poste}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="justification">Justification *</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="justification"
                    placeholder="Expliquez pourquoi vous souhaitez occuper ce poste et votre expérience au sein de la Légion de Marie..."
                    value={formData.justification}
                    onChange={(e) => setFormData({...formData, justification: e.target.value})}
                    className="pl-10 min-h-24"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Envoi en cours...' : 'Envoyer la demande'}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-center w-full">
              <span className="text-muted-foreground">Déjà un compte ? </span>
              <Link to="/login" className="text-primary hover:underline">
                Se connecter
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
