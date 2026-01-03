import React, { useState } from 'react';
import { useProjectsStore } from '../src/store';
import { ProjectWorkspace, ProjectStatus } from '../types';
import { contractTemplates } from '../src/templates/contracts';
import { frontendTemplates } from '../src/templates/frontend';
import { deployToBaseSepolia } from '../src/services/deploymentService';

export function ProjectWorkspacePage() {
  const { workspaces, activeWorkspaceId, setActiveWorkspace, updateWorkspace, updateStatus } = useProjectsStore();
  const activeWorkspace = workspaces.find((ws) => ws.id === activeWorkspaceId);

  const [selectedTab, setSelectedTab] = useState<'overview' | 'contract' | 'frontend' | 'deploy'>('overview');

  if (!activeWorkspace) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No Active Project</h1>
          <p className="text-gray-600">Select a project or create one from an idea.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{activeWorkspace.name}</h1>
          <StatusBadge status={activeWorkspace.status} />
        </div>
        <ProjectStatusFlow currentStatus={activeWorkspace.status} />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          {['overview', 'contract', 'frontend', 'deploy'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as any)}
              className={`py-3 px-4 font-medium capitalize transition-colors ${
                selectedTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {selectedTab === 'overview' && <OverviewTab workspace={activeWorkspace} />}
        {selectedTab === 'contract' && <ContractTab workspace={activeWorkspace} />}
        {selectedTab === 'frontend' && <FrontendTab workspace={activeWorkspace} />}
        {selectedTab === 'deploy' && <DeployTab workspace={activeWorkspace} />}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const statusConfig = {
    [ProjectStatus.IDEA]: { label: 'Idea', color: 'bg-gray-100 text-gray-800' },
    [ProjectStatus.MVP_PLANNING]: { label: 'Planning', color: 'bg-blue-100 text-blue-800' },
    [ProjectStatus.MVP_BUILDING]: { label: 'Building', color: 'bg-yellow-100 text-yellow-800' },
    [ProjectStatus.MVP_DEPLOYED]: { label: 'Deployed (Testnet)', color: 'bg-green-100 text-green-800' },
    [ProjectStatus.MAINNET_DEPLOYED]: { label: 'Live on Mainnet', color: 'bg-purple-100 text-purple-800' },
  };

  const config = statusConfig[status];
  return (
    <span className={`px-4 py-2 rounded-full text-sm font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

function ProjectStatusFlow({ currentStatus }: { currentStatus: ProjectStatus }) {
  const statuses = [
    ProjectStatus.IDEA,
    ProjectStatus.MVP_PLANNING,
    ProjectStatus.MVP_BUILDING,
    ProjectStatus.MVP_DEPLOYED,
    ProjectStatus.MAINNET_DEPLOYED,
  ];

  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-2">
      {statuses.map((status, index) => (
        <React.Fragment key={status}>
          <div
            className={`flex-1 h-2 rounded ${
              index <= currentIndex ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          />
          {index < statuses.length - 1 && (
            <div className={`w-8 h-2 ${index < currentIndex ? 'bg-blue-600' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function OverviewTab({ workspace }: { workspace: ProjectWorkspace }) {
  const { updateStatus } = useProjectsStore();

  const handleAdvanceStatus = () => {
    const statusFlow = [
      ProjectStatus.IDEA,
      ProjectStatus.MVP_PLANNING,
      ProjectStatus.MVP_BUILDING,
      ProjectStatus.MVP_DEPLOYED,
      ProjectStatus.MAINNET_DEPLOYED,
    ];
    const currentIndex = statusFlow.indexOf(workspace.status);
    if (currentIndex < statusFlow.length - 1) {
      updateStatus(workspace.id, statusFlow[currentIndex + 1]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Created</p>
            <p className="font-medium">{new Date(workspace.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Last Updated</p>
            <p className="font-medium">{new Date(workspace.updatedAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Contract Template</p>
            <p className="font-medium">{workspace.contractTemplateId || 'Not selected'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Frontend Template</p>
            <p className="font-medium">{workspace.frontendTemplateId || 'Not selected'}</p>
          </div>
        </div>
      </div>

      {workspace.testnetAddress && (
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">🎉 Deployed on Base Sepolia</h3>
          <p className="text-sm text-gray-700 mb-4">Contract Address:</p>
          <code className="block bg-white p-3 rounded text-sm break-all">{workspace.testnetAddress}</code>
          <a
            href={`https://sepolia.basescan.org/address/${workspace.testnetAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            View on BaseScan →
          </a>
        </div>
      )}

      <button
        onClick={handleAdvanceStatus}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
      >
        Advance to Next Stage
      </button>
    </div>
  );
}

function ContractTab({ workspace }: { workspace: ProjectWorkspace }) {
  const { updateWorkspace } = useProjectsStore();
  const [selectedTemplate, setSelectedTemplate] = useState(workspace.contractTemplateId || '');
  const [customCode, setCustomCode] = useState(workspace.contractCode || '');

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = contractTemplates.find((t) => t.id === templateId);
    if (template) {
      setCustomCode(template.contractCode);
      updateWorkspace(workspace.id, {
        contractTemplateId: templateId,
        contractCode: template.contractCode,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Select Contract Template</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {contractTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleSelectTemplate(template.id)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{template.name}</h3>
                {template.baseOptimized && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Base ⚡</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{template.description}</p>
              <span className="text-xs text-gray-500 capitalize">{template.category}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedTemplate && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Contract Code</h2>
          <textarea
            value={customCode}
            onChange={(e) => {
              setCustomCode(e.target.value);
              updateWorkspace(workspace.id, { contractCode: e.target.value });
            }}
            className="w-full h-96 p-4 font-mono text-sm border rounded bg-gray-50"
          />
        </div>
      )}
    </div>
  );
}

function FrontendTab({ workspace }: { workspace: ProjectWorkspace }) {
  const { updateWorkspace } = useProjectsStore();
  const [selectedTemplate, setSelectedTemplate] = useState(workspace.frontendTemplateId || '');

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = frontendTemplates.find((t) => t.id === templateId);
    if (template) {
      updateWorkspace(workspace.id, {
        frontendTemplateId: templateId,
        frontendFiles: template.code,
      });
    }
  };

  const selectedTemplateData = frontendTemplates.find((t) => t.id === selectedTemplate);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Select Frontend Template</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {frontendTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleSelectTemplate(template.id)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="flex flex-wrap gap-2">
                {template.techStack.map((tech) => (
                  <span key={tech} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedTemplateData && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Template Files</h2>
          <div className="space-y-4">
            {Object.entries(selectedTemplateData.code).map(([filename, code]) => (
              <details key={filename} className="border rounded">
                <summary className="p-3 font-mono text-sm cursor-pointer hover:bg-gray-50">
                  {filename}
                </summary>
                <pre className="p-4 bg-gray-50 text-xs overflow-x-auto">
                  <code>{code}</code>
                </pre>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DeployTab({ workspace }: { workspace: ProjectWorkspace }) {
  const { updateWorkspace, updateStatus } = useProjectsStore();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentError, setDeploymentError] = useState<string | null>(null);

  const handleDeploy = async () => {
    if (!workspace.contractCode) {
      setDeploymentError('No contract code to deploy');
      return;
    }

    setIsDeploying(true);
    setDeploymentError(null);

    try {
      const result = await deployToBaseSepolia({
        contractCode: workspace.contractCode,
        constructorArgs: [], // TODO: Parse from template params
      });

      if (result.success && result.address && result.txHash) {
        updateWorkspace(workspace.id, {
          testnetAddress: result.address,
          testnetTxHash: result.txHash,
          deployedAt: new Date().toISOString(),
        });
        updateStatus(workspace.id, ProjectStatus.MVP_DEPLOYED);
      } else {
        setDeploymentError(result.error || 'Deployment failed');
      }
    } catch (error: any) {
      setDeploymentError(error.message || 'Unknown error');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Deploy to Base Sepolia</h2>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
          <p className="text-sm text-yellow-800">
            ⚠️ Make sure you have Sepolia ETH in your wallet before deploying. Get testnet ETH from the Base Sepolia faucet.
          </p>
        </div>

        {deploymentError && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
            <p className="text-sm text-red-800">❌ {deploymentError}</p>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-sm">Contract Template</span>
            <span className="font-medium">{workspace.contractTemplateId || 'None'}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-sm">Network</span>
            <span className="font-medium">Base Sepolia</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-sm">Estimated Gas</span>
            <span className="font-medium">~0.001 ETH</span>
          </div>
        </div>

        <button
          onClick={handleDeploy}
          disabled={isDeploying || !workspace.contractCode}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {isDeploying ? '🚀 Deploying...' : '🚀 Deploy Contract'}
        </button>
      </div>

      {workspace.testnetAddress && (
        <div className="bg-green-50 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">✅ Deployment Successful</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Contract Address</p>
              <code className="block bg-white p-2 rounded text-sm break-all">
                {workspace.testnetAddress}
              </code>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Transaction Hash</p>
              <code className="block bg-white p-2 rounded text-sm break-all">
                {workspace.testnetTxHash}
              </code>
            </div>
            <a
              href={`https://sepolia.basescan.org/address/${workspace.testnetAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-blue-600 hover:underline"
            >
              View on BaseScan →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
