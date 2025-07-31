import PlaceholderPage from './PlaceholderPage';
import { MapPin } from 'lucide-react';

export default function Zones() {
  return (
    <PlaceholderPage
      title="Gestion des Zones"
      description="Administration des zones géographiques et paroisses"
      icon={<MapPin className="h-12 w-12 text-blue-500" />}
    />
  );
}
