# 🚀 ProtoStack - Quick Reference

## Project Structure

```
src/
├── modules/
│   ├── profiles/              # ProtoVM Profiles (Week 1 ✓)
│   │   ├── ProfileHeader.tsx
│   │   ├── ProjectsList.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── EmptyProjectsState.tsx
│   │   └── index.ts
│   ├── projects/              # TODO: Week 2
│   └── contracts/             # TODO: Week 2
├── components/
│   ├── ProtoStackLanding.tsx  # Main landing page
│   └── index.ts
└── types/
    ├── profile.types.ts       # Profile & project types
    └── index.ts
```

---

## Key Types

```typescript
// Builder Profile
interface BuilderProfile {
  id: string;
  address: `0x${string}`;
  username?: string;
  displayName?: string;
  reputation: BuilderReputation;
}

// Builder Project
interface BuilderProject {
  id: string;
  name: string;
  ownerId: string;
  contractAddress?: `0x${string}`;
  status: ProjectStatus;
}

// Enums
enum ProjectStatus {
  DRAFT, DEPLOYING, DEPLOYED, VERIFIED, ARCHIVED
}
```

---

## Component Usage

```typescript
import { ProfileHeader, ProjectsList } from '@/modules/profiles';
import type { BuilderProfile, BuilderProject } from '@/types';

// Profile Header
<ProfileHeader 
  profile={profile}
  isOwnProfile={true}
  onEdit={() => {}}
/>

// Projects List
<ProjectsList
  projects={projects}
  isOwnProfile={true}
  onCreateProject={() => {}}
/>
```

---

## Week 1 Deliverables

✅ Clean folder structure  
✅ TypeScript type system  
✅ 4 profile components  
✅ ProtoStack landing page  
✅ Comprehensive documentation  

---

## Week 2 Roadmap

- [ ] ProtoGen AI module
- [ ] Gemini integration
- [ ] useBuilderProfile hook
- [ ] Supabase setup
- [ ] CRUD operations

---

## Commands

```bash
# Development
npm run dev

# Build
npm run build

# Type check
npm run type-check

# Preview production
npm run preview
```

---

## Documentation

- **README.md** - Vision, setup, full roadmap
- **ARCHITECTURE.md** - Technical deep dive
- **WEEK1_SUMMARY.md** - Week 1 completion report
- **QUICK_REFERENCE.md** - This file

---

## Extension Points (TODOs)

### Profile Types
```typescript
// TODO: Add badges system
badges?: Badge[];

// TODO: Add analytics
analytics?: ProjectAnalytics;
```

### Components
```typescript
// ProfileHeader.tsx
// TODO: Profile editing modal

// ProjectsList.tsx
// TODO: Filtering and sorting

// ProjectCard.tsx
// TODO: Analytics display
```

### Hooks (Week 2)
```typescript
// TODO: Create these
useBuilderProfile(address)
useUpdateProfile()
useBuilderProjects(ownerId)
useCreateProject()
```

---

## Next Steps

1. **Set up Supabase** - Profiles table
2. **Create hooks** - CRUD operations
3. **Add ProtoGen** - AI module
4. **Build tests** - Vitest setup

---

**Status**: Week 1 Complete ✅  
**Next**: Week 2 - AI Module  
**Version**: 1.0  
