-- ProtoStack Supabase Schema Setup
-- Run this entire file in Supabase SQL Editor

-- 1. CREATE TABLES

-- Profiles table (extends wallet addresses with social data)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT,
  bio TEXT,
  avatar_url TEXT,
  
  -- Social links
  warpcast_handle TEXT,
  twitter_handle TEXT,
  github_handle TEXT,
  
  -- Reputation
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  projects_launched INTEGER DEFAULT 0,
  contracts_deployed INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ideas table
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Content
  title TEXT NOT NULL CHECK (char_length(title) <= 100),
  description TEXT NOT NULL CHECK (char_length(description) <= 500),
  problem TEXT NOT NULL CHECK (char_length(problem) <= 500),
  target_users TEXT NOT NULL CHECK (char_length(target_users) <= 300),
  
  -- Creator
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  creator_address TEXT NOT NULL,
  
  -- Metadata
  category TEXT NOT NULL CHECK (category IN (
    'defi', 'nft', 'dao', 'gaming', 'social', 'infrastructure', 'other'
  )),
  tags TEXT[] DEFAULT '{}',
  
  -- Engagement (cached counts)
  upvotes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'published' CHECK (status IN (
    'draft', 'published', 'in_development', 'deployed', 'archived'
  )),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Idea upvotes (many-to-many)
CREATE TABLE idea_upvotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate upvotes
  UNIQUE(idea_id, user_id)
);

-- Idea comments (future enhancement)
CREATE TABLE idea_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_address TEXT NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 1000),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREATE INDEXES

-- Profiles indexes
CREATE INDEX idx_profiles_wallet ON profiles(wallet_address);
CREATE INDEX idx_profiles_username ON profiles(username);

-- Ideas indexes
CREATE INDEX idx_ideas_creator ON ideas(creator_id);
CREATE INDEX idx_ideas_category ON ideas(category);
CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);
CREATE INDEX idx_ideas_upvotes ON ideas(upvotes DESC);

-- Upvotes indexes
CREATE INDEX idx_upvotes_idea ON idea_upvotes(idea_id);
CREATE INDEX idx_upvotes_user ON idea_upvotes(user_id);

-- Comments indexes
CREATE INDEX idx_comments_idea ON idea_comments(idea_id);
CREATE INDEX idx_comments_user ON idea_comments(user_id);

-- 3. CREATE FUNCTIONS

-- Update upvote count when upvote is added/removed
CREATE OR REPLACE FUNCTION update_idea_upvotes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE ideas SET upvotes = upvotes + 1 WHERE id = NEW.idea_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE ideas SET upvotes = upvotes - 1 WHERE id = OLD.idea_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER idea_upvotes_trigger
AFTER INSERT OR DELETE ON idea_upvotes
FOR EACH ROW EXECUTE FUNCTION update_idea_upvotes();

-- Update comments count
CREATE OR REPLACE FUNCTION update_idea_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE ideas SET comments_count = comments_count + 1 WHERE id = NEW.idea_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE ideas SET comments_count = comments_count - 1 WHERE id = OLD.idea_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER idea_comments_trigger
AFTER INSERT OR DELETE ON idea_comments
FOR EACH ROW EXECUTE FUNCTION update_idea_comments_count();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER ideas_updated_at
BEFORE UPDATE ON ideas
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER comments_updated_at
BEFORE UPDATE ON idea_comments
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 5. PROJECT WORKSPACES TABLES

-- Project workspaces table (upgraded ideas)
CREATE TABLE project_workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'mvp_planning' CHECK (status IN (
    'idea', 'mvp_planning', 'mvp_building', 'mvp_deployed', 'mainnet_deployed'
  )),
  
  -- Templates
  contract_template_id TEXT,
  frontend_template_id TEXT,
  
  -- Custom code
  contract_code TEXT,
  frontend_files JSONB,
  
  -- Deployment info
  testnet_address TEXT,
  testnet_tx_hash TEXT,
  mainnet_address TEXT,
  mainnet_tx_hash TEXT,
  
  -- Creator
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deployed_at TIMESTAMPTZ
);

-- Workspace indexes
CREATE INDEX idx_workspaces_idea ON project_workspaces(idea_id);
CREATE INDEX idx_workspaces_creator ON project_workspaces(creator_id);
CREATE INDEX idx_workspaces_status ON project_workspaces(status);

-- Workspace RLS
ALTER TABLE project_workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspaces are viewable by creator"
  ON project_workspaces FOR SELECT
  USING (creator_id = (SELECT id FROM profiles WHERE wallet_address = auth.jwt() ->> 'wallet_address'));

CREATE POLICY "Users can insert own workspaces"
  ON project_workspaces FOR INSERT
  WITH CHECK (creator_id = (SELECT id FROM profiles WHERE wallet_address = auth.jwt() ->> 'wallet_address'));

CREATE POLICY "Users can update own workspaces"
  ON project_workspaces FOR UPDATE
  USING (creator_id = (SELECT id FROM profiles WHERE wallet_address = auth.jwt() ->> 'wallet_address'));

CREATE TRIGGER workspaces_updated_at
BEFORE UPDATE ON project_workspaces
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 4. ROW LEVEL SECURITY (RLS)

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_comments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (wallet_address = auth.jwt() ->> 'wallet_address');

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (wallet_address = auth.jwt() ->> 'wallet_address');

-- Ideas policies
CREATE POLICY "Published ideas are viewable by everyone"
  ON ideas FOR SELECT
  USING (status = 'published' OR creator_address = auth.jwt() ->> 'wallet_address');

CREATE POLICY "Users can insert own ideas"
  ON ideas FOR INSERT
  WITH CHECK (creator_address = auth.jwt() ->> 'wallet_address');

CREATE POLICY "Users can update own ideas"
  ON ideas FOR UPDATE
  USING (creator_address = auth.jwt() ->> 'wallet_address');

CREATE POLICY "Users can delete own ideas"
  ON ideas FOR DELETE
  USING (creator_address = auth.jwt() ->> 'wallet_address');

-- Upvotes policies
CREATE POLICY "Upvotes are viewable by everyone"
  ON idea_upvotes FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own upvotes"
  ON idea_upvotes FOR INSERT
  WITH CHECK (user_address = auth.jwt() ->> 'wallet_address');

CREATE POLICY "Users can delete own upvotes"
  ON idea_upvotes FOR DELETE
  USING (user_address = auth.jwt() ->> 'wallet_address');

-- Comments policies
CREATE POLICY "Comments are viewable by everyone"
  ON idea_comments FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own comments"
  ON idea_comments FOR INSERT
  WITH CHECK (user_address = auth.jwt() ->> 'wallet_address');

CREATE POLICY "Users can update own comments"
  ON idea_comments FOR UPDATE
  USING (user_address = auth.jwt() ->> 'wallet_address');

CREATE POLICY "Users can delete own comments"
  ON idea_comments FOR DELETE
  USING (user_address = auth.jwt() ->> 'wallet_address');
