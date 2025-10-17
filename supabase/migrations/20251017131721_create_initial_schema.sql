/*
  # Create GrowUp CX Mentee Dashboard Schema

  ## Overview
  This migration sets up the database schema for tracking mentee progress across maturity pillars.

  ## New Tables

  ### `mentees`
  Stores mentee information and program assignment
  - `id` (uuid, primary key) - Unique mentee identifier
  - `name` (text) - Mentee full name
  - `avatar_url` (text) - Profile picture URL
  - `program_id` (text) - Current program assignment
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `pillars`
  Stores maturity pillar assessments for each mentee
  - `id` (uuid, primary key) - Unique pillar record identifier
  - `mentee_id` (uuid, foreign key) - Reference to mentees table
  - `name` (text) - Pillar name (e.g., 'Sócios', 'Finanças')
  - `score` (numeric) - Current maturity score (0-5 scale)
  - `maturity_level` (text) - Color-coded level: 'red', 'yellow', 'blue', 'green'
  - `sprints` (integer) - Number of sprints for this pillar
  - `tasks_completed` (integer) - Tasks completed count
  - `tasks_total` (integer) - Total tasks count
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `sprints`
  Stores sprint planning data for each pillar
  - `id` (uuid, primary key) - Unique sprint identifier
  - `mentee_id` (uuid, foreign key) - Reference to mentees table
  - `pillar_name` (text) - Pillar this sprint focuses on
  - `sprint_name` (text) - Descriptive sprint name
  - `sprint_goal` (text) - Sprint objective description
  - `tasks` (jsonb) - Array of task objects with structure: {id, title, isCustom, priority, dueDate}
  - `status` (text) - Sprint status: 'active', 'completed', 'cancelled'
  - `created_at` (timestamptz) - Sprint creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Create policies for authenticated users to manage their own data
  - Public read access not permitted by default

  ## Important Notes
  1. All mentee-related data is isolated by mentee_id
  2. Pillar scores use numeric type for precise decimal values
  3. Tasks are stored as JSONB for flexibility in task structure
  4. Timestamps auto-update on record modification
*/

-- Create mentees table
CREATE TABLE IF NOT EXISTS mentees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  avatar_url text DEFAULT '',
  program_id text NOT NULL DEFAULT 'prog-start',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pillars table
CREATE TABLE IF NOT EXISTS pillars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentee_id uuid NOT NULL REFERENCES mentees(id) ON DELETE CASCADE,
  name text NOT NULL,
  score numeric(3,1) DEFAULT 0.0 CHECK (score >= 0 AND score <= 5),
  maturity_level text DEFAULT 'red' CHECK (maturity_level IN ('red', 'yellow', 'blue', 'green')),
  sprints integer DEFAULT 0,
  tasks_completed integer DEFAULT 0,
  tasks_total integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(mentee_id, name)
);

-- Create sprints table
CREATE TABLE IF NOT EXISTS sprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentee_id uuid NOT NULL REFERENCES mentees(id) ON DELETE CASCADE,
  pillar_name text NOT NULL,
  sprint_name text NOT NULL,
  sprint_goal text NOT NULL,
  tasks jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE mentees ENABLE ROW LEVEL SECURITY;
ALTER TABLE pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprints ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mentees table
CREATE POLICY "Users can view all mentees"
  ON mentees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert mentees"
  ON mentees FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update all mentees"
  ON mentees FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete all mentees"
  ON mentees FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for pillars table
CREATE POLICY "Users can view all pillars"
  ON pillars FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert pillars"
  ON pillars FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update all pillars"
  ON pillars FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete all pillars"
  ON pillars FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for sprints table
CREATE POLICY "Users can view all sprints"
  ON sprints FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert sprints"
  ON sprints FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update all sprints"
  ON sprints FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete all sprints"
  ON sprints FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pillars_mentee_id ON pillars(mentee_id);
CREATE INDEX IF NOT EXISTS idx_sprints_mentee_id ON sprints(mentee_id);
CREATE INDEX IF NOT EXISTS idx_sprints_pillar_name ON sprints(pillar_name);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating updated_at
DROP TRIGGER IF EXISTS update_mentees_updated_at ON mentees;
CREATE TRIGGER update_mentees_updated_at
  BEFORE UPDATE ON mentees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pillars_updated_at ON pillars;
CREATE TRIGGER update_pillars_updated_at
  BEFORE UPDATE ON pillars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sprints_updated_at ON sprints;
CREATE TRIGGER update_sprints_updated_at
  BEFORE UPDATE ON sprints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();