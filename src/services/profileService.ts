import { supabase } from '../lib/supabase';

/**
 * Profile Service
 * Handles profile creation and management
 */

export interface ProfileData {
  walletAddress: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  warpcastHandle?: string;
  twitterHandle?: string;
  githubHandle?: string;
}

/**
 * Get or create a profile for a wallet address
 */
export async function getOrCreateProfile(walletAddress: string) {
  // First, try to get existing profile
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  if (existingProfile) {
    return existingProfile;
  }

  // If not found and error is not "not found", throw
  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching profile:', fetchError);
    throw new Error(fetchError.message);
  }

  // Create new profile
  const { data: newProfile, error: createError } = await supabase
    .from('profiles')
    .insert({
      wallet_address: walletAddress,
      username: `Builder ${walletAddress.slice(0, 6)}`,
    })
    .select()
    .single();

  if (createError) {
    console.error('Error creating profile:', createError);
    throw new Error(createError.message);
  }

  return newProfile;
}

/**
 * Update profile data
 */
export async function updateProfile(
  walletAddress: string,
  updates: Partial<ProfileData>
) {
  const updateData: any = {};

  if (updates.username !== undefined) updateData.username = updates.username;
  if (updates.bio !== undefined) updateData.bio = updates.bio;
  if (updates.avatarUrl !== undefined) updateData.avatar_url = updates.avatarUrl;
  if (updates.warpcastHandle !== undefined) updateData.warpcast_handle = updates.warpcastHandle;
  if (updates.twitterHandle !== undefined) updateData.twitter_handle = updates.twitterHandle;
  if (updates.githubHandle !== undefined) updateData.github_handle = updates.githubHandle;

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('wallet_address', walletAddress)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Get profile by wallet address
 */
export async function getProfileByAddress(walletAddress: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Profile not found
    }
    console.error('Error fetching profile:', error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Get profile by ID
 */
export async function getProfileById(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}
