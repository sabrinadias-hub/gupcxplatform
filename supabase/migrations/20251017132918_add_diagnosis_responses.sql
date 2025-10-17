/*
  # Add Diagnosis Responses Table

  ## Overview
  This migration adds support for storing detailed diagnosis responses with findings.

  ## New Tables

  ### `diagnosis_responses`
  Stores individual question responses for each axis during diagnosis
  - `id` (uuid, primary key) - Unique response identifier
  - `mentee_id` (uuid, foreign key) - Reference to mentees table
  - `axis_id` (text) - Axis identifier (e.g., 'socios', 'financas')
  - `axis_name` (text) - Human-readable axis name
  - `question_id` (text) - Question identifier
  - `question_text` (text) - The question that was asked
  - `response` (text) - Mentee's answer/response
  - `score` (numeric) - Score assigned to this response (0-5)
  - `created_at` (timestamptz) - Response creation timestamp

  ## Changes to Existing Tables

  ### `pillars`
  Add new columns to store diagnosis findings:
  - `findings` (text) - Detailed findings from diagnosis
  - `opportunities` (text) - Identified opportunities for improvement

  ## Security
  - Enable Row Level Security on diagnosis_responses table
  - Create policies for authenticated users to manage diagnosis data

  ## Important Notes
  1. Diagnosis responses are linked to mentees for complete audit trail
  2. Findings and opportunities help mentors create targeted sprints
  3. All diagnosis data is preserved for historical tracking
*/

-- Create diagnosis_responses table
CREATE TABLE IF NOT EXISTS diagnosis_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentee_id uuid NOT NULL REFERENCES mentees(id) ON DELETE CASCADE,
  axis_id text NOT NULL,
  axis_name text NOT NULL,
  question_id text NOT NULL,
  question_text text NOT NULL,
  response text NOT NULL,
  score numeric(3,1) DEFAULT 0.0 CHECK (score >= 0 AND score <= 5),
  created_at timestamptz DEFAULT now()
);

-- Add findings and opportunities columns to pillars
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pillars' AND column_name = 'findings'
  ) THEN
    ALTER TABLE pillars ADD COLUMN findings text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pillars' AND column_name = 'opportunities'
  ) THEN
    ALTER TABLE pillars ADD COLUMN opportunities text DEFAULT '';
  END IF;
END $$;

-- Enable RLS on diagnosis_responses
ALTER TABLE diagnosis_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for diagnosis_responses table
CREATE POLICY "Users can view all diagnosis responses"
  ON diagnosis_responses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert diagnosis responses"
  ON diagnosis_responses FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update diagnosis responses"
  ON diagnosis_responses FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete diagnosis responses"
  ON diagnosis_responses FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_diagnosis_responses_mentee_id ON diagnosis_responses(mentee_id);
CREATE INDEX IF NOT EXISTS idx_diagnosis_responses_axis_id ON diagnosis_responses(axis_id);
