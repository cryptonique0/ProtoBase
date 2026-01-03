# ProtoStack Idea Validation System - Week 2 Implementation

## Overview

This document details the implementation of the idea validation and submission system for ProtoStack. This system enables builders to submit their Web3 ideas, validate them with the community, and track engagement through upvotes and comments.

## Architecture

### Module Structure

```
src/modules/ideas/
├── IdeaSubmissionForm.tsx    # Form component with Zod validation
├── IdeaDetailPage.tsx         # Single idea view with upvotes
├── IdeaCard.tsx              # Reusable idea card component
└── IdeasListPage.tsx         # Grid view of all ideas with filters

src/services/
├── ideasService.ts           # Supabase queries for ideas
└── profileService.ts         # Profile management

src/store/
└── index.ts                  # Zustand stores (UserStore, IdeasStore, UIStore)

src/components/
├── LoadingSpinner.tsx        # Loading states
├── ErrorMessage.tsx          # Error boundaries and messages
└── Toast.tsx                 # Toast notifications

src/lib/
├── supabase.ts              # Supabase client initialization
└── validation.ts            # Zod schemas for form validation

src/types/
└── idea.types.ts            # TypeScript interfaces for ideas
```

## Key Features

### 1. Idea Submission

**Form Fields:**
- **Title** (5-100 chars) - What's your idea called?
- **Description** (20-500 chars) - Describe your idea in detail
- **Problem** (20-500 chars) - What problem does it solve?
- **Target Users** (10-300 chars) - Who will use this?
- **Category** - DeFi, NFT, DAO, Gaming, Social, Infrastructure, Other
- **Tags** (0-5) - Optional tags for discoverability

**Validation:**
- Client-side validation with Zod schemas
- Real-time error feedback
- Server-side validation on insert

**Features:**
- Connected wallet required
- Auto-saves user profile on first submission
- Optimistic UI updates
- Toast notifications for success/error

### 2. Idea Discovery

**Listing Features:**
- Grid view of all ideas (3 columns on desktop, 1 on mobile)
- Filter by category
- Sort by newest first
- Load more pagination (built-in)
- Search bar (coming soon)

**Idea Cards:**
- Title, description preview, category badge
- Upvote count with visual feedback
- Tags (first 3, +N more indicator)
- Creator address and created date
- Comments count

### 3. Engagement System

**Upvoting:**
- 1-click upvote/downvote with optimistic UI
- Prevents duplicate upvotes (database constraint)
- Updates idea stats in real-time
- Requires wallet connection

**Metrics Tracked:**
- Upvotes per idea
- Comments count (for future use)
- Engagement rate
- Creation date and activity timestamp

### 4. Profile Integration

**User Store:**
```typescript
interface UserState {
  userId: string | null;           // Supabase profile ID
  walletAddress: string | null;    // Wallet address
  profile: any | null;             // Full profile object
  isLoading: boolean;
}
```

**Auto-Profile Creation:**
- Creates profile on wallet connection
- Stores wallet address and default username
- Links ideas to creator profile
- Supports profile editing (coming soon)

## Database Schema

### Ideas Table
```sql
CREATE TABLE ideas (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  problem TEXT NOT NULL,
  target_users TEXT NOT NULL,
  creator_id UUID REFERENCES profiles(id),
  creator_address TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  upvotes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Idea Upvotes Table
```sql
CREATE TABLE idea_upvotes (
  id UUID PRIMARY KEY,
  idea_id UUID REFERENCES ideas(id),
  user_id UUID REFERENCES profiles(id),
  user_address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(idea_id, user_id)  -- Prevent duplicate upvotes
);
```

## State Management (Zustand)

### UserStore
Manages authenticated user state:
- Current user ID and wallet address
- Profile data
- Loading state

### IdeasStore
Manages ideas list and filters:
- All ideas list
- Selected category filter
- Search query
- Methods: setIdeas, addIdea, updateIdea, removeIdea

### UIStore
Manages global UI state:
- Idea form modal (open/close)
- Toast notifications
- Auto-dismiss after 5 seconds

## Integration Points

### App.tsx
- Added `PROJECT_STEP.IDEAS` and `PROJECT_STEP.IDEA_DETAIL` routes
- Initializes user profile on wallet connection
- Passes `onSelectIdea` callback to IdeasListPage
- Renders Toast component globally

### Header Navigation
- Added "Ideas" link to main navigation
- Links to idea validation system

### Wallet Connection
- Auto-creates profile when wallet connects
- Populates UserStore with profile data
- Required for idea submissions and upvotes

## Component Usage

### Using the Idea Submission Form

```tsx
<IdeaSubmissionForm />
```

Features:
- Validates input with Zod
- Shows loading state during submission
- Displays success/error toast
- Auto-closes modal on success
- Requires user to be connected

### Displaying Ideas List

```tsx
<IdeasListPage onSelectIdea={(ideaId) => {
  setSelectedIdeaId(ideaId);
  navigateTo(ProjectStep.IDEA_DETAIL);
}} />
```

### Showing Single Idea

```tsx
<IdeaDetailPage 
  ideaId={selectedIdeaId} 
  onBack={() => navigateTo(ProjectStep.IDEAS)} 
/>
```

## API Endpoints (Supabase Queries)

### Get Ideas
```typescript
const response = await getIdeas({
  category?: string,
  creatorId?: string,
  status?: string,
}, {
  page?: number,
  pageSize?: number
});
// Returns: { ideas, total, page, pageSize }
```

### Get Single Idea
```typescript
const idea = await getIdeaById(ideaId, userId);
// Returns: Idea with hasUserUpvoted flag
```

### Create Idea
```typescript
const newIdea = await createIdea(
  input: CreateIdeaInput,
  creatorId: string,
  creatorAddress: string
);
```

### Upvote Idea
```typescript
await upvoteIdea(ideaId, userId, userAddress);
```

### Remove Upvote
```typescript
await removeUpvote(ideaId, userId);
```

## Validation

### Form Validation (Zod)
- Integrated with react-hook-form
- Real-time error messages
- Field-level validation
- Custom error messages

```typescript
const ideaSubmissionSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(500),
  // ... etc
});
```

### Database Constraints
- Check constraints for field lengths
- NOT NULL constraints on required fields
- UNIQUE constraint on idea_upvotes (idea_id, user_id)
- Foreign key constraints for referential integrity

## UI/UX Features

### Loading States
- Skeleton loaders for lists
- Spinner during submissions
- Loading cards with animation

### Error Handling
- Error boundaries for React errors
- User-friendly error messages
- Retry buttons on failure
- Error logging to console

### Toast Notifications
- Success: Green background, ✓ icon
- Error: Red background, ✕ icon
- Info: Blue background, ℹ icon
- Auto-dismiss after 5 seconds
- Stackable (one at a time)

### Responsive Design
- Mobile: 1 column, full width
- Tablet: 2 columns
- Desktop: 3 columns
- Touch-friendly buttons (min 44px)

## Security Considerations

### Row Level Security (RLS)
- Published ideas viewable by everyone
- Draft ideas only visible to creator
- Users can only upvote/comment on their own ideas
- Wallet address verified via JWT

### Input Sanitization
- Zod schemas validate all inputs
- Character limits enforced
- No raw HTML allowed
- Tags validated as plain text

### Rate Limiting
- To be implemented: Idea submissions per user per day
- To be implemented: Upvote rate limiting

## Performance Optimization

### Query Optimization
- Indexed on: creator_id, category, status, created_at, upvotes
- Pagination with limit/offset
- Cached idea lists in Zustand
- Lazy loading of creator profiles

### Frontend Optimization
- Code splitting for idea modules
- Lazy component loading
- Optimistic UI updates
- Debounced search (coming soon)

## Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Next Steps (Week 3 Roadmap)

1. **Comments System**
   - Add comment form to idea detail page
   - Comment threads and replies
   - Comment notifications (coming soon)

2. **Search & Discovery**
   - Full-text search on titles and descriptions
   - Trending ideas based on upvotes
   - Recent ideas section
   - Advanced filters (date range, creator)

3. **Idea Analytics**
   - View count tracking
   - Engagement metrics
   - Creator dashboard
   - Idea statistics

4. **Notifications**
   - Email when idea gets upvoted
   - New comments on ideas
   - Idea milestone badges

5. **Mobile App**
   - React Native implementation
   - Native notification support
   - Offline support with sync

## Testing

### Unit Tests (To Add)
- Zod schema validation
- Service functions
- Zustand stores
- Component rendering

### Integration Tests (To Add)
- Form submission flow
- Upvote flow
- Profile creation on wallet connect
- Error handling

### E2E Tests (To Add)
- Full idea submission flow
- Idea discovery and filtering
- Upvoting and engagement

## Troubleshooting

### Common Issues

**Supabase Connection Error**
- Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Ensure Supabase project is active
- Check Row Level Security policies

**Form Submission Fails**
- Verify wallet is connected
- Check browser console for error details
- Ensure user profile exists
- Check Supabase quota

**Upvote Not Updating**
- Verify user is logged in
- Check network tab for API errors
- Clear browser cache and retry
- Check RLS policies in Supabase

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Zod Documentation](https://zod.dev)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Hook Form](https://react-hook-form.com)
- [Base Network Docs](https://docs.base.org)
