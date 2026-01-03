import { supabase } from '../lib/supabase';
import { 
  Idea, 
  CreateIdeaInput, 
  UpdateIdeaInput, 
  IdeaWithUpvoteStatus,
  IdeasResponse 
} from '../types/idea.types';

/**
 * Ideas Service
 * Handles all idea-related API operations
 */

export interface IdeaFilters {
  category?: string;
  creatorId?: string;
  status?: string;
}

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

/**
 * Fetch all ideas with optional filters and pagination
 */
export async function getIdeas(
  filters: IdeaFilters = {},
  options: PaginationOptions = {}
): Promise<IdeasResponse> {
  const { page = 1, pageSize = 20 } = options;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  let query = supabase
    .from('ideas')
    .select(`
      *,
      creator:profiles!creator_id(
        wallet_address,
        username,
        avatar_url
      )
    `, { count: 'exact' })
    .eq('status', filters.status || 'published')
    .order('created_at', { ascending: false })
    .range(start, end);

  if (filters.category) {
    query = query.eq('category', filters.category);
  }

  if (filters.creatorId) {
    query = query.eq('creator_id', filters.creatorId);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching ideas:', error);
    throw new Error(error.message);
  }

  return {
    ideas: (data || []) as unknown as Idea[],
    total: count || 0,
    page,
    pageSize,
  };
}

/**
 * Get a single idea by ID
 */
export async function getIdeaById(id: string, userId?: string): Promise<IdeaWithUpvoteStatus | null> {
  const { data, error } = await supabase
    .from('ideas')
    .select(`
      *,
      creator:profiles!creator_id(
        wallet_address,
        username,
        avatar_url
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching idea:', error);
    return null;
  }

  let hasUserUpvoted = false;
  if (userId) {
    const { data: upvoteData } = await supabase
      .from('idea_upvotes')
      .select('id')
      .match({ idea_id: id, user_id: userId })
      .single();
    
    hasUserUpvoted = !!upvoteData;
  }

  return {
    ...(data as unknown as Idea),
    hasUserUpvoted,
  };
}

/**
 * Create a new idea
 */
export async function createIdea(
  input: CreateIdeaInput,
  creatorId: string,
  creatorAddress: string
): Promise<Idea> {
  const { data, error } = await supabase
    .from('ideas')
    .insert({
      title: input.title,
      description: input.description,
      problem: input.problem,
      target_users: input.targetUsers,
      category: input.category,
      tags: input.tags || [],
      creator_id: creatorId,
      creator_address: creatorAddress,
      status: 'published',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating idea:', error);
    throw new Error(error.message);
  }

  return data as unknown as Idea;
}

/**
 * Update an existing idea
 */
export async function updateIdea(
  id: string,
  input: UpdateIdeaInput
): Promise<Idea> {
  const updateData: any = {};
  
  if (input.title !== undefined) updateData.title = input.title;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.problem !== undefined) updateData.problem = input.problem;
  if (input.targetUsers !== undefined) updateData.target_users = input.targetUsers;
  if (input.category !== undefined) updateData.category = input.category;
  if (input.tags !== undefined) updateData.tags = input.tags;
  if (input.status !== undefined) updateData.status = input.status;

  const { data, error } = await supabase
    .from('ideas')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating idea:', error);
    throw new Error(error.message);
  }

  return data as unknown as Idea;
}

/**
 * Delete an idea
 */
export async function deleteIdea(id: string): Promise<void> {
  const { error } = await supabase
    .from('ideas')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting idea:', error);
    throw new Error(error.message);
  }
}

/**
 * Upvote an idea
 */
export async function upvoteIdea(
  ideaId: string,
  userId: string,
  userAddress: string
): Promise<void> {
  const { error } = await supabase
    .from('idea_upvotes')
    .insert({
      idea_id: ideaId,
      user_id: userId,
      user_address: userAddress,
    });

  if (error) {
    // Check if it's a duplicate upvote error
    if (error.code === '23505') {
      throw new Error('You have already upvoted this idea');
    }
    console.error('Error upvoting idea:', error);
    throw new Error(error.message);
  }
}

/**
 * Remove upvote from an idea
 */
export async function removeUpvote(
  ideaId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from('idea_upvotes')
    .delete()
    .match({ idea_id: ideaId, user_id: userId });

  if (error) {
    console.error('Error removing upvote:', error);
    throw new Error(error.message);
  }
}

/**
 * Get user's upvoted ideas
 */
export async function getUserUpvotedIdeas(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('idea_upvotes')
    .select('idea_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching upvoted ideas:', error);
    return [];
  }

  return (data || []).map(upvote => upvote.idea_id);
}
