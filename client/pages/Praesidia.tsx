import PlaceholderPage from './PlaceholderPage';
import { Shield } from 'lucide-react';

export default function Praesidia() {
  return (
    <PlaceholderPage
      title="Gestion des Praesidia"
      description="Administration des praesidia et leur structure"
      icon={<Shield className="h-12 w-12 text-green-500" />}
    />
  );
}
