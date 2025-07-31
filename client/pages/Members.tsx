import PlaceholderPage from './PlaceholderPage';
import { Users } from 'lucide-react';

export default function Members() {
  return (
    <PlaceholderPage
      title="Registre des Membres"
      description="Gestion des adhésions, statuts et promesses"
      icon={<Users className="h-12 w-12 text-orange-500" />}
    />
  );
}
