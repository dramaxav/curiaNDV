import PlaceholderPage from './PlaceholderPage';
import { Calendar } from 'lucide-react';

export default function Attendance() {
  return (
    <PlaceholderPage
      title="Suivi des Présences"
      description="Enregistrement des présences aux réunions"
      icon={<Calendar className="h-12 w-12 text-red-500" />}
    />
  );
}
