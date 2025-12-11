-- Enable UUID and timestamp extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "moddatetime";

-- Zones Table
CREATE TABLE zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom_zone VARCHAR(255) NOT NULL,
  paroisse VARCHAR(255) NOT NULL,
  directeur_spirituel VARCHAR(255) NOT NULL,
  contact_directeur VARCHAR(255) NOT NULL,
  date_creation TIMESTAMP DEFAULT NOW(),
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Praesidia Table
CREATE TABLE praesidia (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id UUID NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
  nom_praesidium VARCHAR(255) NOT NULL,
  date_creation TIMESTAMP DEFAULT NOW(),
  directeur_spirituel VARCHAR(255) NOT NULL,
  type_praesidium VARCHAR(50) NOT NULL CHECK (type_praesidium IN ('adulte', 'junior')),
  actif BOOLEAN DEFAULT true,
  lieu_reunion VARCHAR(255),
  horaire_reunion VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Membres Table
CREATE TABLE membres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  praesidium_id UUID NOT NULL REFERENCES praesidia(id) ON DELETE CASCADE,
  nom_prenom VARCHAR(255) NOT NULL,
  statut VARCHAR(50) NOT NULL CHECK (statut IN ('actif', 'probationnaire', 'auxiliaire', 'inactif')),
  date_adhesion TIMESTAMP NOT NULL,
  date_promesse TIMESTAMP,
  telephone VARCHAR(20),
  email VARCHAR(255),
  adresse TEXT,
  date_naissance DATE,
  photo VARCHAR(500),
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Officiers Table
CREATE TABLE officiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  praesidium_id UUID REFERENCES praesidia(id) ON DELETE CASCADE,
  nom_prenom VARCHAR(255) NOT NULL,
  poste VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('conseil', 'praesidium')),
  date_debut_mandat TIMESTAMP NOT NULL,
  date_fin_mandat TIMESTAMP NOT NULL,
  photo VARCHAR(500),
  telephone VARCHAR(20),
  email VARCHAR(255),
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Finances Table
CREATE TABLE finances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  praesidium_id UUID NOT NULL REFERENCES praesidia(id) ON DELETE CASCADE,
  mois VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  solde_initial DECIMAL(10, 2) DEFAULT 0,
  contributions DECIMAL(10, 2) DEFAULT 0,
  depenses DECIMAL(10, 2) DEFAULT 0,
  solde_final DECIMAL(10, 2) DEFAULT 0,
  description_depenses TEXT,
  date_maj TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(praesidium_id, mois)
);

-- Presences Table
CREATE TABLE presences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  officier_id UUID NOT NULL REFERENCES officiers(id) ON DELETE CASCADE,
  praesidium_id UUID NOT NULL REFERENCES praesidia(id) ON DELETE CASCADE,
  date_reunion TIMESTAMP NOT NULL,
  statut_presence VARCHAR(50) NOT NULL CHECK (statut_presence IN ('Présent', 'Absent', 'Excusé')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Manifestations Table
CREATE TABLE manifestations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  date_manifestation TIMESTAMP NOT NULL,
  heure_debut VARCHAR(5) NOT NULL, -- HH:MM
  heure_fin VARCHAR(5) NOT NULL, -- HH:MM
  lieu VARCHAR(255) NOT NULL,
  type_manifestation VARCHAR(50) NOT NULL CHECK (type_manifestation IN ('reunion', 'activite_spirituelle', 'formation', 'service_social', 'pelerinage', 'autre')),
  pour_tous_praesidia BOOLEAN DEFAULT false,
  praesidia_concernes TEXT[], -- Array of UUIDs as text
  organisateur_contact VARCHAR(255),
  statut VARCHAR(50) NOT NULL CHECK (statut IN ('planifiee', 'en_cours', 'terminee', 'annulee')),
  participants_attendus INTEGER DEFAULT 0,
  participants_presents INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_praesidia_zone_id ON praesidia(zone_id);
CREATE INDEX idx_membres_praesidium_id ON membres(praesidium_id);
CREATE INDEX idx_officiers_praesidium_id ON officiers(praesidium_id);
CREATE INDEX idx_finances_praesidium_id ON finances(praesidium_id);
CREATE INDEX idx_presences_officier_id ON presences(officier_id);
CREATE INDEX idx_presences_praesidium_id ON presences(praesidium_id);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE praesidia ENABLE ROW LEVEL SECURITY;
ALTER TABLE membres ENABLE ROW LEVEL SECURITY;
ALTER TABLE officiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE presences ENABLE ROW LEVEL SECURITY;
ALTER TABLE manifestations ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies (allow all for now, restrict later based on auth)
CREATE POLICY "Enable read access for all users" ON zones FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON zones FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON zones FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON zones FOR DELETE USING (true);

-- Apply same policies to other tables
CREATE POLICY "Enable read access for all users" ON praesidia FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON praesidia FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON praesidia FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON praesidia FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON membres FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON membres FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON membres FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON membres FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON officiers FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON officiers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON officiers FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON officiers FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON finances FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON finances FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON finances FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON finances FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON presences FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON presences FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON presences FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON presences FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON manifestations FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON manifestations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON manifestations FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON manifestations FOR DELETE USING (true);
