import PlaceholderPage from './PlaceholderPage';
import { UserCheck } from 'lucide-react';

export default function Officers() {
  return (
    <PlaceholderPage
      title="Gestion des Officiers"
      description="Suivi des mandats et responsabilités des officiers"
      icon={<UserCheck className="h-12 w-12 text-purple-500" />}
    />
  );
}
