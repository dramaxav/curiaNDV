import PlaceholderPage from './PlaceholderPage';
import { Calculator } from 'lucide-react';

export default function Finances() {
  return (
    <PlaceholderPage
      title="Gestion Financière"
      description="Suivi des contributions, dépenses et soldes"
      icon={<Calculator className="h-12 w-12 text-yellow-500" />}
    />
  );
}
