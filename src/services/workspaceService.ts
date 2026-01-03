import { createClient } from '@supabase/supabase-js';
import { ProjectWorkspace, ProjectStatus } from '../../types';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface CreateWorkspaceData {
  ideaId: string;
  name: string;
  creatorId: string;
}

/**
 * Create a new project workspace from an idea
 */
export async function createProjectWorkspace(
  data: CreateWorkspaceData
): Promise<{ workspace: ProjectWorkspace | null; error: string | null }> {
  try {
    const { data: workspace, error } = await supabase
      .from('project_workspaces')
      .insert({
        idea_id: data.ideaId,
        name: data.name,
        creator_id: data.creatorId,
        status: ProjectStatus.MVP_PLANNING,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      workspace: workspace ? mapWorkspaceFromDb(workspace) : null,
      error: null,
    };
  } catch (error: any) {
    console.error('Error creating workspace:', error);
    return { workspace: null, error: error.message };
  }
}

/**
 * Get all workspaces for a user
 */
export async function getUserWorkspaces(
  creatorId: string
): Promise<{ workspaces: ProjectWorkspace[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('project_workspaces')
      .select('*')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      workspaces: data ? data.map(mapWorkspaceFromDb) : [],
      error: null,
    };
  } catch (error: any) {
    console.error('Error fetching workspaces:', error);
    return { workspaces: [], error: error.message };
  }
}

/**
 * Update workspace
 */
export async function updateWorkspace(
  id: string,
  updates: Partial<ProjectWorkspace>
): Promise<{ success: boolean; error: string | null }> {
  try {
    const dbUpdates: any = {};

    if (updates.contractTemplateId !== undefined)
      dbUpdates.contract_template_id = updates.contractTemplateId;
    if (updates.frontendTemplateId !== undefined)
      dbUpdates.frontend_template_id = updates.frontendTemplateId;
    if (updates.contractCode !== undefined)
      dbUpdates.contract_code = updates.contractCode;
    if (updates.frontendFiles !== undefined)
      dbUpdates.frontend_files = updates.frontendFiles;
    if (updates.testnetAddress !== undefined)
      dbUpdates.testnet_address = updates.testnetAddress;
    if (updates.testnetTxHash !== undefined)
      dbUpdates.testnet_tx_hash = updates.testnetTxHash;
    if (updates.mainnetAddress !== undefined)
      dbUpdates.mainnet_address = updates.mainnetAddress;
    if (updates.mainnetTxHash !== undefined)
      dbUpdates.mainnet_tx_hash = updates.mainnetTxHash;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.deployedAt !== undefined)
      dbUpdates.deployed_at = updates.deployedAt;

    const { error } = await supabase
      .from('project_workspaces')
      .update(dbUpdates)
      .eq('id', id);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error updating workspace:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Map database record to ProjectWorkspace type
 */
function mapWorkspaceFromDb(record: any): ProjectWorkspace {
  return {
    id: record.id,
    ideaId: record.idea_id,
    name: record.name,
    status: record.status as ProjectStatus,
    contractTemplateId: record.contract_template_id,
    frontendTemplateId: record.frontend_template_id,
    contractCode: record.contract_code,
    frontendFiles: record.frontend_files,
    testnetAddress: record.testnet_address,
    testnetTxHash: record.testnet_tx_hash,
    mainnetAddress: record.mainnet_address,
    mainnetTxHash: record.mainnet_tx_hash,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    deployedAt: record.deployed_at,
  };
}
