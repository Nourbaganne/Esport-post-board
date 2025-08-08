/*
  # Esports LFG Post Board Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - matches auth.users id
      - `username` (text, unique) - display name for posts
      - `created_at` (timestamp) - account creation date
    
    - `posts` 
      - `id` (uuid, primary key) - unique post identifier
      - `user_id` (uuid, foreign key) - references profiles.id
      - `game` (text) - game title (indexed for filtering)
      - `role` (text) - player role (indexed for filtering)  
      - `rank` (text, nullable) - player rank (indexed for filtering)
      - `region` (text) - server region (indexed for filtering)
      - `description` (text) - post description (max 200 chars)
      - `created_at` (timestamp) - post creation time

  2. Security
    - Enable RLS on both tables
    - Users can read all profiles and posts
    - Users can only insert/update/delete their own data
    - Posts are linked to profiles via foreign key

  3. Indexes
    - Added indexes on filterable columns for fast queries
    - Composite index on posts for common filter combinations
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create posts table  
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game text NOT NULL,
  role text NOT NULL,
  rank text,
  region text NOT NULL,
  description text NOT NULL CHECK (char_length(description) <= 200),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Posts policies
CREATE POLICY "Anyone can view posts"
  ON posts
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_game ON posts(game);
CREATE INDEX IF NOT EXISTS idx_posts_region ON posts(region);
CREATE INDEX IF NOT EXISTS idx_posts_rank ON posts(rank);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);

-- Composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_posts_game_region ON posts(game, region);