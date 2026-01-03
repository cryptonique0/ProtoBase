# ProtoStack Idea Validation - Setup Guide

## Prerequisites

1. **Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Environment Setup**
   - Node.js 18+ installed
   - npm or yarn package manager
   - Git for version control

## Step 1: Configure Environment Variables

Add to `.env.local` in project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**To find your credentials:**
1. Go to Supabase Dashboard → Project Settings → API
2. Copy "Project URL" and "anon public" key
3. Paste into `.env.local`

## Step 2: Create Database Tables

Go to Supabase Dashboard → SQL Editor and run this SQL:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT,
  bio TEXT,
  avatar_url TEXT,
  warpcast_handle TEXT,
  twitter_handle TEXT,
  github_handle TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  projects_launched INTEGER DEFAULT 0,
  contracts_deployed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ideas table
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL CHECK (char_length(title) <= 100),
  description TEXT NOT NULL CHECK (char_length(description) <= 500),
  problem TEXT NOT NULL CHECK (char_length(problem) <= 500),
  target_users TEXT NOT NULL CHECK (char_length(target_users) <= 300),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  creator_address TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'defi', 'nft', 'dao', 'gaming', 'social', 'infrastructure', 'other'
  )),
  tags TEXT[] DEFAULT '{}',
  upvotes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN (
    'draft', 'published', 'in_development', 'deployed', 'archived'
  )),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create idea_upvotes table
CREATE TABLE idea_upvotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(idea_id, user_id)
);

-- Create indexes
CREATE INDEX idx_profiles_wallet ON profiles(wallet_address);
CREATE INDEX idx_ideas_creator ON ideas(creator_id);
CREATE INDEX idx_ideas_category ON ideas(category);
CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);
CREATE INDEX idx_ideas_upvotes ON ideas(upvotes DESC);
CREATE INDEX idx_upvotes_idea ON idea_upvotes(idea_id);
CREATE INDEX idx_upvotes_user ON idea_upvotes(user_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_upvotes ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (true);

-- Ideas RLS Policies
CREATE POLICY "Published ideas are viewable by everyone"
  ON ideas FOR SELECT USING (status = 'published' OR true);

CREATE POLICY "Users can insert own ideas"
  ON ideas FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own ideas"
  ON ideas FOR UPDATE USING (true);

CREATE POLICY "Users can delete own ideas"
  ON ideas FOR DELETE USING (true);

-- Upvotes RLS Policies
CREATE POLICY "Upvotes are viewable by everyone"
  ON idea_upvotes FOR SELECT USING (true);

CREATE POLICY "Users can insert upvotes"
  ON idea_upvotes FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete their upvotes"
  ON idea_upvotes FOR DELETE USING (true);
```

## Step 3: Create Update Functions (Optional but Recommended)

For automatic timestamp and counter updates:

```sql
-- Function to update upvote count
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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
BEFORE UPDATE ON profiles FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER ideas_updated_at
BEFORE UPDATE ON ideas FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

## Step 4: Verify Installation

### Check Dependencies
```bash
npm list zustand @supabase/supabase-js zod react-hook-form @hookform/resolvers
```

Should show:
- zustand ^4.x
- @supabase/supabase-js ^2.x
- zod ^3.x
- react-hook-form ^7.x
- @hookform/resolvers ^3.x

### Test Supabase Connection
In browser console, test the connection:

```javascript
import { supabase } from './src/lib/supabase';

// Test connection
const { data, error } = await supabase
  .from('profiles')
  .select('count(*)');

if (error) console.error('Connection failed:', error);
else console.log('Connected to Supabase!', data);
```

## Step 5: Test the Implementation

### Manual Testing

1. **Open app and connect wallet**
   - Click "Connect Wallet" button
   - Select wallet (MetaMask, etc.)
   - Approve connection

2. **Verify profile creation**
   - Check Supabase → Profiles table
   - Should see new row with your wallet address

3. **Submit an idea**
   - Click "Ideas" in navigation
   - Click "+ Submit Idea"
   - Fill form and click "Submit Idea"
   - Should see success toast

4. **Check database**
   - Supabase → Ideas table
   - Should see your idea
   - Check creator_address matches wallet

5. **Test upvoting**
   - Click idea card
   - Click upvote button
   - Should see count increase
   - Check idea_upvotes table

## Step 6: Production Deployment (Optional)

### Enable Authentication (Recommended)

For production, enable Supabase Auth:

1. Supabase Dashboard → Authentication → Providers
2. Enable any providers (Email, OAuth, etc.)
3. Update RLS policies to use `auth.uid()`

```sql
-- Updated RLS policy example
ALTER POLICY "Users can insert own profile"
  ON profiles USING (id = auth.uid());
```

### Configure CORS

If deploying frontend separately:
1. Supabase Dashboard → Project Settings → API
2. Add your frontend domain to CORS allowed origins

### Monitor Performance

1. Go to Supabase → Database → Disk Usage
2. Monitor: API requests, Storage, Realtime subscriptions
3. Optimize queries if needed

## Troubleshooting

### "Supabase credentials not configured"

**Issue:** Warning appears in console
**Solution:** 
- Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local
- Restart dev server: `npm run dev`

### Ideas not saving

**Issue:** Form submission fails silently
**Solution:**
1. Check browser console for errors
2. Verify RLS policies allow INSERT
3. Check profiles table has matching user
4. Verify table columns match TypeScript types

### Upvote button not working

**Issue:** Upvote fails when clicked
**Solution:**
1. Ensure user is connected (wallet shows in header)
2. Check idea_upvotes RLS policies
3. Verify idea_id exists in ideas table
4. Check for duplicate upvotes (UNIQUE constraint)

### Profile not created

**Issue:** Error when submitting ideas
**Solution:**
1. Verify profiles table exists
2. Check RLS policies allow INSERT
3. Connect wallet and try again
4. Check network tab for errors

### Slow queries

**Issue:** Ideas list takes long to load
**Solution:**
1. Verify indexes are created
2. Limit query size (add pagination)
3. Select only needed columns
4. Use `.select()` to specify fields

## Backup & Recovery

### Backup Database

```bash
# Using Supabase CLI
supabase db pull  # Pull schema
supabase db dump  # Export data
```

### Restore from Backup

```bash
# Using Supabase CLI
supabase db push  # Push schema
supabase db restore  # Restore data
```

## Next Steps

1. **Add Comments System**
   - Create idea_comments table
   - Build comment form component
   - Add comment display

2. **Implement Search**
   - Full-text search on titles
   - Filter by tags and category
   - Sort by popularity

3. **Build Creator Dashboard**
   - View your ideas
   - See upvote stats
   - Manage ideas

4. **Add Notifications**
   - Email on upvote
   - New comments alert
   - Milestone badges

## Support

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/web3joker/protobase/issues)

## Quick Reference

### Common Queries

```typescript
// Get all ideas
const { data } = await supabase.from('ideas').select();

// Get idea with creator
const { data } = await supabase
  .from('ideas')
  .select('*, creator:profiles(username, avatar_url)');

// Get user's upvoted ideas
const { data } = await supabase
  .from('idea_upvotes')
  .select('idea_id')
  .eq('user_id', userId);

// Check if user upvoted
const { data } = await supabase
  .from('idea_upvotes')
  .select('id')
  .match({ idea_id, user_id })
  .single();
```

### Common RLS Policies

```sql
-- View for everyone
CREATE POLICY "view_all" ON ideas FOR SELECT USING (true);

-- View only own
CREATE POLICY "view_own" ON ideas FOR SELECT 
  USING (creator_id = auth.uid());

-- Edit only own
CREATE POLICY "edit_own" ON ideas FOR UPDATE 
  USING (creator_id = auth.uid());

-- Delete only own
CREATE POLICY "delete_own" ON ideas FOR DELETE 
  USING (creator_id = auth.uid());
```
