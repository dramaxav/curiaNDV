import PlaceholderPage from './PlaceholderPage';
import { Bell } from 'lucide-react';

export default function Alerts() {
  return (
    <PlaceholderPage
      title="Alertes et Notifications"
      description="Système d'alertes pour les fins de mandat et événements"
      icon={<Bell className="h-12 w-12 text-blue-500" />}
    />
  );
}
